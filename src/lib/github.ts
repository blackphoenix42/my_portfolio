export type Repo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export type FeaturedRepo = Repo & {
  category: "AI" | "Systems" | "Frontend" | "Mobile" | "CP" | "Blockchain";
};

const FEATURED: { name: string; category: FeaturedRepo["category"] }[] = [
  { name: "algolens", category: "Frontend" },
  { name: "Track-Person-App", category: "Mobile" },
  { name: "chat-app", category: "Frontend" },
  { name: "Smart-Brain", category: "AI" },
  { name: "Note_Taking_App", category: "Frontend" },
  { name: "Daily-Coding-Problem-Solutions", category: "CP" },
  { name: "Codeforces-Contests", category: "CP" },
  { name: "tpl-frontend", category: "Blockchain" },
];

// Hand-curated resilient fallback so the section never empty/breaks.
const FALLBACK: Record<string, Partial<Repo>> = {
  algolens: {
    description:
      "Interactive algorithm visualizer (60+ algos) with replay, FFmpeg-WASM export, GenAI explanations and WCAG 2.1 AA accessibility.",
    language: "TypeScript",
    topics: ["visualization", "algorithms", "react", "accessibility"],
  },
  "Track-Person-App": {
    description: "React Native app that records movement paths and saves data using MongoDB.",
    language: "JavaScript",
    topics: ["react-native", "mongodb", "maps"],
  },
  "chat-app": {
    description:
      "Full-stack messaging application with authentication, group chat, file sharing and profile features.",
    language: "JavaScript",
    topics: ["chat", "auth", "fullstack"],
  },
  "Smart-Brain": {
    description: "Face detection web application.",
    language: "JavaScript",
    topics: ["face-detection", "react"],
  },
  Note_Taking_App: {
    description: "Notes application with editing, deletion, favorites and Firebase hosting.",
    language: "JavaScript",
    topics: ["firebase", "notes"],
  },
  "Daily-Coding-Problem-Solutions": {
    description: "Daily competitive programming solutions and notes.",
    language: "C++",
    topics: ["competitive-programming"],
  },
  "Codeforces-Contests": {
    description: "Codeforces contest solutions archive.",
    language: "C++",
    topics: ["codeforces", "competitive-programming"],
  },
  "tpl-frontend": {
    description: "Tezos Premier League — blockchain-based gaming frontend on Tezos.",
    language: "TypeScript",
    topics: ["tezos", "web3", "react"],
  },
};

function fallbackFor(name: string, category: FeaturedRepo["category"]): FeaturedRepo {
  const f = FALLBACK[name] ?? {};
  return {
    name,
    full_name: `blackphoenix42/${name}`,
    description: f.description ?? null,
    html_url: `https://github.com/blackphoenix42/${name}`,
    language: f.language ?? null,
    stargazers_count: 0,
    forks_count: 0,
    topics: f.topics ?? [],
    pushed_at: "1970-01-01T00:00:00Z",
    fork: false,
    archived: false,
    category,
  };
}

export async function fetchFeaturedRepos(): Promise<FeaturedRepo[]> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res = await fetch(
      "https://api.github.com/users/blackphoenix42/repos?per_page=100&sort=updated",
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const repos = (await res.json()) as Repo[];
    const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

    return FEATURED.map(({ name, category }) => {
      const match = byName.get(name.toLowerCase());
      if (match) return { ...match, category };
      return fallbackFor(name, category);
    });
  } catch {
    return FEATURED.map(({ name, category }) => fallbackFor(name, category));
  }
}
