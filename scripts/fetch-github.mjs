// Fetches GitHub profile data at build time and writes it to src/data/github.json.
// Token: GITHUB_TOKEN env var, or falls back to `gh auth token`.
// If no token is available, the existing JSON is kept so builds never break.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const USER = process.env.GITHUB_USER ?? "lucianog2000";
const OUT = new URL("../src/data/github.json", import.meta.url);

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

const repoFields = `
  name nameWithOwner description url homepageUrl stargazerCount forkCount isFork updatedAt
  owner { login }
  primaryLanguage { name color }
  languages(first: 8, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } }
  repositoryTopics(first: 10) { nodes { topic { name } } }
`;

const query = `
query($login: String!) {
  user(login: $login) {
    name login bio location avatarUrl url twitterUsername websiteUrl createdAt
    followers { totalCount }
    pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { ${repoFields} } } }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: { field: UPDATED_AT, direction: DESC }) {
      totalCount
      nodes { ${repoFields} }
    }
  }
}`;

function normalizeRepo(r) {
  return {
    name: r.name,
    fullName: r.nameWithOwner,
    owner: r.owner.login,
    description: r.description,
    url: r.url,
    homepage: r.homepageUrl || null,
    stars: r.stargazerCount,
    forks: r.forkCount,
    updatedAt: r.updatedAt,
    language: r.primaryLanguage?.name ?? null,
    languages: r.languages.edges.map((e) => ({ name: e.node.name, color: e.node.color, size: e.size })),
    topics: r.repositoryTopics.nodes.map((n) => n.topic.name),
  };
}

const token = getToken();
if (!token) {
  if (existsSync(OUT)) {
    console.warn("[fetch-github] No token found, keeping existing src/data/github.json");
    process.exit(0);
  }
  console.error("[fetch-github] No token and no cached data. Set GITHUB_TOKEN.");
  process.exit(1);
}

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { login: USER } }),
});
const json = await res.json();
if (!res.ok || json.errors) {
  console.error("[fetch-github] GitHub API error:", JSON.stringify(json.errors ?? json));
  process.exit(existsSync(OUT) ? 0 : 1);
}

const u = json.data.user;
const pinned = u.pinnedItems.nodes.map(normalizeRepo);
const repos = u.repositories.nodes.map(normalizeRepo);

// Aggregate language bytes across own repos and pinned (org) repos, deduped by full name.
const langTotals = new Map();
const seen = new Set();
for (const r of [...pinned, ...repos]) {
  if (seen.has(r.fullName)) continue;
  seen.add(r.fullName);
  for (const l of r.languages) {
    const prev = langTotals.get(l.name) ?? { name: l.name, color: l.color, size: 0 };
    prev.size += l.size;
    langTotals.set(l.name, prev);
  }
}
const totalBytes = [...langTotals.values()].reduce((a, l) => a + l.size, 0);
const languages = [...langTotals.values()]
  .sort((a, b) => b.size - a.size)
  .map((l) => ({ ...l, percent: +((l.size / totalBytes) * 100).toFixed(1) }));

const data = {
  fetchedAt: new Date().toISOString(),
  profile: {
    name: u.name,
    login: u.login,
    bio: u.bio,
    location: u.location,
    avatarUrl: u.avatarUrl,
    url: u.url,
    twitter: u.twitterUsername,
    website: u.websiteUrl,
    createdAt: u.createdAt,
    followers: u.followers.totalCount,
    publicRepos: u.repositories.totalCount,
  },
  pinned,
  repos,
  languages,
};

mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`[fetch-github] Saved ${pinned.length} pinned and ${repos.length} repos for ${USER}`);
