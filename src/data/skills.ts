// Skill radars. Levels are not self-ratings: each one follows the rubric below
// and must be backed by the evidence string next to it.

export const scale = [
  { level: 1, label: "learning" },
  { level: 2, label: "side project" },
  { level: 3, label: "shipped" },
  { level: 4, label: "at work" },
  { level: 5, label: "owned for years" },
] as const;

export interface Axis {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  evidence: string;
}

export interface Radar {
  id: string;
  title: string;
  axes: Axis[];
}

export const radars: Radar[] = [
  {
    id: "hard",
    title: "hard skills",
    axes: [
      { name: "frontend", level: 5, evidence: "Personal's storefront since 2022: React, Remix, Next.js." },
      { name: "backend", level: 4, evidence: "Go sync services at Personal, and a pricing engine in the works." },
      { name: "data & search", level: 4, evidence: "Postgres catalog and Typesense search at Personal." },
      {
        name: "testing",
        level: 4,
        evidence:
          "Unit and e2e tests in TypeScript and Go at Personal; CI with e2e, a11y, and Lighthouse on my products.",
      },
      {
        name: "security",
        level: 1,
        evidence: "Learning with PortSwigger Web Security Academy; 1st place with my team in Personal's internal CTF.",
      },
      {
        name: "smart contracts",
        level: 3,
        evidence: "Solidity at Rotam (RMRK NFTs, Axelar) and AutoPassport; Rust on Vara (vStreet, SPBonding).",
      },
    ],
  },
  {
    id: "soft",
    title: "soft skills",
    axes: [
      {
        name: "product",
        level: 4,
        evidence: "Functional refinements at Personal; vision docs and ADRs for CarsWatch.",
      },
      {
        name: "leadership",
        level: 4,
        evidence: "Co-leading the pricing engine at Personal; led the AutoPassport and vStreet teams.",
      },
      {
        name: "mentoring",
        level: 4,
        evidence:
          "I volunteer to onboard new teammates and help anyone stuck. When I don't know the answer, I know whose door to knock on.",
      },
      {
        name: "collaboration",
        level: 4,
        evidence: "155 merged merge requests in team at Personal; four team hackathons.",
      },
      {
        name: "agile",
        level: 4,
        evidence: "Scrum and ticket refinement at Personal; ran Agile onboarding for vStreet.",
      },
      { name: "writing", level: 3, evidence: "ADRs, READMEs, and product docs for my own projects." },
    ],
  },
];
