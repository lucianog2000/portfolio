// Hand-written profile content, sourced from LinkedIn and the Personal (Telecom) GitLab history.
// Keep internal details out of here: no repo names, ticket ids, or internal metrics.

export const profile = {
  name: "luciano garcía",
  fullName: "Luciano Emanuel García",
  role: "Full-stack developer",
  location: "Córdoba, Argentina",
  tldr: "I'm a full-stack developer building e-commerce at scale by day and my own products by night. I care about fast interfaces, clean data flows, tests that catch real bugs, and shipping.",
  today: {
    company: "Personal (Telecom Argentina)",
    text: "At Personal, I build the online store: the Remix storefront, the Go services that keep its catalog and search in shape, and, these days, a pricing engine built test-first.",
  },
  yesterday:
    "Web3 since 2023: a vehicle tokenization protocol at Rotam, then hackathons across Ethereum, Base, Polkadot, and Vara. One of them won Best DApp on Vara Network at ETHGlobal Brussels.",
  links: {
    github: "https://github.com/lucianog2000",
    linkedin: "https://www.linkedin.com/in/lucianog2000/",
    x: "https://x.com/luchexdev",
  },
};

export const experience = [
  {
    company: "Personal · Telecom Argentina",
    url: "https://tienda.personal.com.ar",
    role: "Software Developer",
    period: "Apr 2022 — Present",
    summary:
      "Features end to end for the Personal online store, from consuming APIs to state across cookies, local storage, and React context, balancing SSR and CSR to survive traffic spikes like Hot Sale and Black Friday.",
    stats: [
      { value: "155", label: "merged merge requests" },
      { value: "4.5y", label: "in production" },
      { value: "7", label: "codebases touched" },
    ],
    highlights: [
      {
        area: "storefront",
        text: "Product listing, filters and search UI, cart, product detail, and CMS-driven landing components, first in a micro-frontend and later in the Remix storefront.",
      },
      {
        area: "search",
        text: "Typesense indexing with filtering logic, synonyms, and exclusion rules for a high-relevance catalog search.",
      },
      {
        area: "catalog",
        text: "Go sync services that ingest financial promotions, bundles, and product families from external APIs into Postgres, with migrations and YAML API contracts.",
      },
      {
        area: "pricing",
        text: "Building a Go microservice that centralizes price calculation for a specific client, logic each team solves on its own today. Test-first, with high unit and e2e coverage; stress testing comes before production.",
      },
      {
        area: "analytics",
        text: "Tracking events and A/B experiment metrics, plus personalized recommendations wired into the storefront.",
      },
      {
        area: "backoffice",
        text: "Internal tools for merchandisers: product family creation, secondary categories, and collection settings.",
      },
    ],
    stack: ["Remix", "React", "TypeScript", "Vanilla Extract", "Go", "Postgres", "Typesense", "Next.js", "Playwright"],
  },
  {
    company: "Rotam",
    url: null,
    role: "Technical lead",
    period: "Sep 2023 — Dec 2023",
    summary:
      "Vehicle tokenization protocol, built with a multinational team where I was the engineer with hands-on software experience, working next to UX, business, and legal profiles.",
    stats: [],
    highlights: [
      { area: "contracts", text: "Wrote the Solidity smart contracts, with NFTs on RMRK and metadata on IPFS." },
      { area: "frontend", text: "Connected the contracts to the frontend with Ethers.js." },
      { area: "cross-chain", text: "Integrated Axelar for cross-chain messaging." },
      {
        area: "codebase",
        text: "Took over an early codebase and spent a good part of the project refactoring it and fixing bugs.",
      },
    ],
    stack: ["Solidity", "Hardhat", "Ethers.js", "RMRK", "IPFS", "Axelar"],
  },
];

export const hackathons = [
  {
    name: "Personal internal CTF · Jun 2026",
    project: "Capture The Flag",
    result: "1st place · team of 5",
    text: "Internal security competition with 50+ developers.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7470515322886881281/",
  },
  {
    name: "ETHGlobal Brussels 2024",
    project: "SPBonding",
    featured: true,
    result: "Winner · Best DApp on Vara Network",
    text: "Permissionless bonding protocol on Vara: users buy pTokens at a discount with vesting. I wrote part of the Rust smart contract logic, working remotely.",
    url: "https://ethglobal.com/showcase/spbonding-pcs09",
  },
  {
    name: "Polkadot Hackathon Bangkok 2024",
    project: "Polkattest",
    text: "Attestation hub for the Polkadot ecosystem.",
    url: "https://github.com/PsyLabsWeb3/Polkadot-Attestations",
  },
  {
    name: "Base Onchain Summer Buildathon · Jul 2024",
    project: "Warpify",
    text: "Commerce track, team of four from Psy Labs: Shopify checkout inside a Farcaster frame.",
    url: "https://devfolio.co/projects/warpify-53dd",
  },
  {
    name: "Chainlink Spring Hackathon 2023",
    project: "AutoPassport",
    text: "Vehicle history records as NFTs.",
    url: "https://devpost.com/software/autopassport",
  },
];

export const education = [
  { title: "Biomedical Engineering (incomplete)", place: "Universidad Nacional de Córdoba", period: "2019 — 2021" },
  { title: "Full-stack developer program", place: "Argentina Programa", period: "2021 — 2022" },
  { title: "Electronics Technician", place: "IPET N° 66 José A. Balseiro", period: "2015 — 2018" },
];

export const learning = [
  {
    title: "Web application security",
    place: "PortSwigger Web Security Academy",
    url: "https://portswigger.net/web-security",
    text: "Exploring AppSec, smart contract security, and pentesting.",
  },
];

export const onchain = {
  title: "on-chain since 2015",
  text: "My first bitcoins came from faucets in 2015. Since then I've used DeFi protocols and early cross-chain bridges, mined ETH with my own GPU, and played NFT games, long before building any of it.",
};

export const languages = [
  { name: "Spanish", level: "native" },
  { name: "English", level: "working proficiency, strongest in writing" },
];

export const certifications = [
  { title: "AWS Cloud Practitioner Essentials", place: "Amazon Web Services", period: "2022" },
];
