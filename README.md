# Portfolio

Personal site of Luciano Emanuel García: full-stack developer (Remix, Go, Web3).

Built with [Astro](https://astro.build) and Tailwind CSS v4. Design inspired by [nahiyan.codes](https://nahiyan.codes).

## Data

- `src/data/profile.ts`: bio, experience, hackathons, education (hand-written, from LinkedIn).
- `src/data/projects.ts`: curated projects; only repos with authored work are listed.
- `src/data/github.json`: generated at build time by `scripts/fetch-github.mjs` (profile, pinned repos, language mix). Uses `GITHUB_TOKEN`, or `gh auth token` locally; if neither is available the committed JSON is reused.

## Scripts

```bash
npm run dev           # local dev server at localhost:4321
npm run build         # fetches GitHub data, then builds to ./dist
npm run fetch:github  # refresh src/data/github.json only
```
