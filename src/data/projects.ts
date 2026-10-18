// Curated project list. Only repos with real authored work are listed here;
// GitHub metadata (languages) is merged in from src/data/github.json at build time.
import github from "./github.json";

export interface Project {
  slug: string;
  name: string;
  repo: string; // owner/name on GitHub
  tagline: string;
  context: string;
  year: string;
  role: string;
  contributions: string[];
  stack: string[];
  stats: { value: string; label: string }[];
  links: { label: string; url: string; note?: string }[];
  image?: string;
}

const curated: Project[] = [
  {
    slug: "vstreet",
    name: "vStreet",
    repo: "vstreet-defi/vstreet",
    tagline: "Lending platform MVP on Vara Network.",
    context: "Team product · 2024 — 2025",
    year: "2024",
    role: "Product lead & full-stack developer",
    contributions: [
      "Led user story writing, infrastructure planning, and Agile onboarding for the team.",
      "Built deposit/withdraw, liquidity injection, and claim-rewards flows in the frontend.",
      "Worked on the Rust smart programs: APR calculation and the lenders' rewards pool.",
      "Redesigned navbar, footer, and hero, where design was a key differentiator.",
    ],
    stack: ["React", "TypeScript", "Rust", "Gear / Sails", "Vara Network"],
    stats: [
      { value: "42", label: "commits" },
      { value: "13mo", label: "active" },
    ],
    links: [
      { label: "demo", url: "https://vstreet.vercel.app", note: "requires a Polkadot wallet" },
      { label: "code", url: "https://github.com/vstreet-defi/vstreet" },
    ],
  },
  {
    slug: "polkattest",
    name: "Polkattest",
    repo: "PsyLabsWeb3/Polkadot-Attestations",
    tagline: "Attestation hub for the Polkadot ecosystem.",
    context: "Polkadot Hackathon Bangkok 2024",
    year: "2024",
    role: "Frontend & chain integration",
    contributions: [
      "Schema creation and attestation issuing against a custom Substrate pallet.",
      "User dashboard listing schemas and attestations per account.",
      "IPFS storage for attestation payloads and wallet extension detection.",
      "Wrote the project README and pitch documentation.",
    ],
    stack: ["React", "TypeScript", "Vite", "Substrate", "polkadot.js", "IPFS"],
    stats: [
      { value: "30", label: "commits" },
      { value: "5", label: "builders" },
    ],
    links: [{ label: "code", url: "https://github.com/PsyLabsWeb3/Polkadot-Attestations" }],
  },
  {
    slug: "autopassport",
    name: "AutoPassport",
    repo: "lucianog2000/AutoPassport",
    tagline: "Your car's history, as an NFT.",
    context: "Chainlink Spring Hackathon 2023",
    year: "2023",
    role: "Project lead",
    contributions: [
      "Led a team of three and owned the repo, merging the team's pull requests.",
      "Manufacturers mint a vehicle token; authorized workshops append maintenance records.",
      "Next.js frontend, Express API, and Hardhat contracts, with Truflation data feeds.",
    ],
    stack: ["Next.js", "Express", "Solidity", "Hardhat", "Chainlink"],
    stats: [
      { value: "126", label: "of 172 commits" },
      { value: "3", label: "builders" },
    ],
    links: [
      { label: "demo", url: "https://auto-passport.vercel.app" },
      { label: "code", url: "https://github.com/lucianog2000/AutoPassport" },
      { label: "devpost", url: "https://devpost.com/software/autopassport" },
    ],
    image: "/work/autopassport.png",
  },
  {
    slug: "warpify",
    name: "Warpify",
    repo: "TerratekMusic/Warpify",
    tagline: "Buy from a Shopify store without leaving a Farcaster frame.",
    context: "Onchain Summer Buildathon 2024",
    year: "2024",
    role: "Backend integration",
    contributions: [
      "Order creation in Shopify from frame interactions.",
      "Shared user-data function powering checkout, pay, and confirmation steps.",
    ],
    stack: ["TypeScript", "Farcaster Frames", "Shopify API"],
    stats: [{ value: "7", label: "of 9 commits" }],
    links: [
      { label: "code", url: "https://github.com/TerratekMusic/Warpify" },
      { label: "devfolio", url: "https://devfolio.co/projects/warpify-53dd" },
    ],
  },
  {
    slug: "eternalvault",
    name: "EternalVault",
    repo: "lucianog2000/eternalvault",
    tagline: "A digital legacy vault with an AI guardian.",
    context: "Bolt.new hackathon · 2025",
    year: "2025",
    role: "Solo builder",
    contributions: [
      "Built in a single day for a Bolt.new hackathon, pairing with Bolt as an AI coding tool.",
      "Supabase auth, Postgres schema, and SQL migrations for legacy capsules.",
      "Access-key flows for heirs, debugged down to case-sensitivity and FK constraint issues.",
    ],
    stack: ["React", "TypeScript", "Supabase", "Postgres"],
    stats: [{ value: "27", label: "commits" }],
    links: [{ label: "code", url: "https://github.com/lucianog2000/eternalvault" }],
  },
];

type GhRepo = (typeof github.repos)[number];
const ghRepos = new Map<string, GhRepo>(
  [...github.pinned, ...github.repos].map((r) => [r.fullName.toLowerCase(), r as GhRepo]),
);

export const projects = curated.map((p) => {
  const gh = ghRepos.get(p.repo.toLowerCase());
  const total = gh?.languages.reduce((a, l) => a + l.size, 0) ?? 0;
  const languages =
    gh?.languages
      .map((l) => ({ name: l.name, color: l.color ?? "#888", percent: total ? (l.size / total) * 100 : 0 }))
      .filter((l) => l.percent >= 1) ?? [];
  return { ...p, languages };
});
