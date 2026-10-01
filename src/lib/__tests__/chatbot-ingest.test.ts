import { describe, it, expect } from "vitest";
import type { Project } from "@/content/projects";
import type { Experience } from "@/content/experience";
import {
  MAX_CHUNK_CHARS,
  buildSiteChunks,
  packParts,
  type SiteContent,
} from "@/lib/chatbot/ingest";

describe("packParts", () => {
  it("groups parts under the limit and never splits a part", () => {
    expect(packParts(["aaaa", "bbbb", "cccc"], 9)).toEqual(["aaaa bbbb", "cccc"]);
    expect(packParts(["x".repeat(20), "y"], 10)).toEqual(["x".repeat(20), "y"]);
    expect(packParts([], 10)).toEqual([]);
  });
});

const project = (over: Partial<Project> = {}): Project => ({
  slug: "demo",
  title: "Demo — A thing",
  tagline: "Does a thing",
  category: "Tools",
  categories: [],
  status: "open-source",
  tags: [],
  summary: "Summary here",
  problem: "Problem here",
  challenge: "Challenge here.",
  approach: ["Step one", "Step two!"],
  impact: [{ label: "Speed", value: "2×" }],
  stack: ["TypeScript"],
  links: [{ label: "GitHub", href: "https://github.com/x/demo" }],
  ...over,
});

const job = (over: Partial<Experience> = {}): Experience => ({
  company: "Acme Corp",
  role: "Engineer",
  location: "Remote",
  start: "Jan 2020",
  end: "Present",
  summary: "Builds things",
  highlights: [{ title: "Win", detail: "Shipped it", tags: [] }],
  ...over,
});

const content = (over: Partial<SiteContent> = {}): SiteContent => ({
  site: {
    name: "Ayush Yadav",
    role: "R&D Software Engineer II",
    company: "Cadence Design Systems",
    location: "India",
    tagline: "Tagline",
    description: "Description",
    email: "a@example.com",
    github: "https://github.com/x",
    linkedin: "https://linkedin.com/in/x",
  },
  projects: [project()],
  experiences: [job()],
  internships: [],
  education: [{ school: "NSUT", degree: "B.Tech", start: "2018", end: "2022", cgpa: "8.32" }],
  skills: [
    {
      id: "perf",
      name: "Performance",
      blurb: "Fast code",
      accent: "amber",
      skills: [{ name: "C++", level: "core" }, { name: "Rust" }],
    },
  ],
  competitive: [
    { platform: "Codeforces", rank: "Master", rating: 2264, detail: "AIR 13" },
    { platform: "HackerRank", rank: "6-Star" },
  ],
  honors: [
    { title: "Grant", org: "Tezos", date: "2021", detail: "For a game" },
    { title: "Podium", org: "NSUT", date: "2020" },
  ],
  languages: [{ name: "Hindi", level: "Native or bilingual" }],
  now: { updated: "2026-09-27", sections: [{ id: "focus", items: ["Xcelium work"] }] },
  nowTitles: { focus: "Current focus" },
  systemDesigns: [
    {
      slug: "url-shortener",
      title: "URL Shortener",
      tagline: "Short links",
      interactive: true,
      requirements: ["Unique codes"],
      components: [{ name: "API", role: "Creates mappings" }],
      tradeoffs: ["Hash vs counter"],
    },
  ],
  ...over,
});

const byId = (chunks: ReturnType<typeof buildSiteChunks>) =>
  Object.fromEntries(chunks.map((c) => [c.id, c]));

describe("buildSiteChunks", () => {
  it("derives linked chunks from every content area", () => {
    const chunks = byId(buildSiteChunks(content()));
    expect(chunks.profile?.text).toContain(
      "Ayush Yadav works as R&D Software Engineer II at Cadence Design Systems",
    );
    expect(chunks.profile?.text).toContain("Hindi (native or bilingual)");
    expect(chunks["contact-links"]?.text).toContain("a@example.com");
    expect(chunks["project:demo"]).toMatchObject({ href: "/work/demo", source: "Projects · Demo" });
    expect(chunks["project:demo"]?.text).toContain("Impact: Speed: 2×.");
    expect(chunks["project:demo"]?.text).toContain("Links: GitHub https://github.com/x/demo.");
    expect(chunks["project:demo:approach"]?.text).toContain("Step one. Step two!");
    expect(chunks["project:demo:engineering"]).toBeUndefined();
    expect(chunks["experience:acme-corp"]?.text).toMatch(/^Engineer at Acme Corp \(Remote\)/);
    expect(chunks["experience:acme-corp"]?.text).toContain("Win: Shipped it.");
    expect(chunks.education?.text).toContain("B.Tech at NSUT");
    expect(chunks["competitive-ratings"]?.text).toBe(
      "Codeforces, Master, rating 2264, AIR 13. HackerRank, 6-Star.",
    );
    expect(chunks.honors?.text).toContain("Grant (Tezos, 2021): For a game.");
    expect(chunks.honors?.text).toContain("Podium (NSUT, 2020).");
    expect(chunks["skills:perf"]?.text).toContain("C++ (core), Rust.");
    expect(chunks["now-page"]?.text).toContain("Current focus: Xcelium work.");
    expect(chunks["system-design:url-shortener"]?.text).toContain("API — Creates mappings");
  });

  it("includes engineering notes and splits long sections into bounded chunks", () => {
    const long = Array.from({ length: 12 }, (_, i) => `Step ${i} ${"detail ".repeat(20)}`);
    const chunks = buildSiteChunks(
      content({
        projects: [
          project({
            approach: long,
            links: undefined,
            impact: [],
            engineering: {
              algorithms: [{ name: "Algo", note: "Clever" }],
              performance: ["Fast"],
              writeup: ["Notes"],
            },
          }),
        ],
      }),
    );
    const ids = chunks.map((c) => c.id);
    expect(ids).toContain("project:demo:approach:1");
    expect(ids).toContain("project:demo:approach:2");
    expect(byId(chunks)["project:demo:engineering"]?.text).toContain("Algo: Clever. Fast. Notes.");
    for (const c of chunks) expect(c.text.length).toBeLessThanOrEqual(MAX_CHUNK_CHARS + 200);
  });

  it("skips optional sections that have no data", () => {
    const ids = buildSiteChunks(
      content({ education: [], competitive: [], honors: [], languages: [], nowTitles: {} }),
    ).map((c) => c.id);
    expect(ids).not.toContain("education");
    expect(ids).not.toContain("competitive-ratings");
    expect(ids).not.toContain("honors");
  });

  it("produces unique ids for the real site content shape", () => {
    const ids = buildSiteChunks(content({ internships: [job({ company: "Beta Labs" })] })).map(
      (c) => c.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
