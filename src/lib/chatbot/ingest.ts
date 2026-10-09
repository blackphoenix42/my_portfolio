import type { Project } from "@/content/projects";
import type { Experience } from "@/content/experience";
import type { SkillCluster } from "@/content/skills";
import type { SystemDesignItem } from "@/content/system-design";

// Self-contained on purpose: scripts/build-chatbot-index.mjs imports this file
// directly through Node's type stripping, so only `import type` is allowed here.

export type KnowledgeChunk = {
  id: string;
  source: string;
  title: string;
  text: string;
  /** Internal route the answer came from, rendered as a source link. */
  href?: string;
};

export type SiteContent = {
  site: {
    name: string;
    role: string;
    company: string;
    location: string;
    tagline: string;
    description: string;
    email: string;
    github: string;
    linkedin: string;
  };
  projects: Project[];
  experiences: Experience[];
  internships: Experience[];
  education: { school: string; degree: string; start: string; end: string; cgpa: string }[];
  skills: SkillCluster[];
  competitive: { platform: string; rank: string; rating?: number; detail?: string }[];
  honors: { title: string; org: string; date: string; detail?: string }[];
  languages: { name: string; level: string }[];
  now: { updated: string; sections: readonly { id: string; items: readonly string[] }[] };
  nowTitles: Record<string, string>;
  systemDesigns: SystemDesignItem[];
};

/** Soft cap per chunk so a handful of chunks fit a small model's context. */
export const MAX_CHUNK_CHARS = 900;

/**
 * Greedily packs text parts into groups whose joined length stays under `max`.
 * A single part longer than `max` becomes its own group rather than being cut.
 */
export function packParts(parts: string[], max = MAX_CHUNK_CHARS): string[] {
  const groups: string[] = [];
  let current = "";
  for (const part of parts) {
    const next = current ? `${current} ${part}` : part;
    if (current && next.length > max) {
      groups.push(current);
      current = part;
    } else {
      current = next;
    }
  }
  if (current) groups.push(current);
  return groups;
}

function sentence(text: string): string {
  const trimmed = text.trim();
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function shortTitle(title: string): string {
  return title.split(" — ")[0] ?? title;
}

function withParts(
  base: Omit<KnowledgeChunk, "text" | "id">,
  id: string,
  header: string,
  parts: string[],
): KnowledgeChunk[] {
  const groups = packParts(parts, MAX_CHUNK_CHARS - header.length);
  return groups.map((group, i) => ({
    ...base,
    id: groups.length > 1 ? `${id}:${i + 1}` : id,
    text: `${header} ${group}`.trim(),
  }));
}

export function profileChunks(c: SiteContent): KnowledgeChunk[] {
  const { site } = c;
  return [
    {
      id: "profile",
      source: "About",
      title: `${site.name} — ${site.role}`,
      href: "/about",
      text: [
        `${site.name} works as ${site.role} at ${site.company}, based in ${site.location}.`,
        sentence(site.description),
        sentence(site.tagline),
        c.languages.length > 0 &&
          `Languages: ${c.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ")}.`,
      ]
        .filter(Boolean)
        .join(" "),
    },
    {
      id: "contact-links",
      source: "Contact",
      title: `How to reach ${site.name}`,
      href: "/contact",
      text: `Email: ${site.email}. LinkedIn: ${site.linkedin}. GitHub: ${site.github}. The contact page has a form for messages and attachments.`,
    },
  ];
}

export function projectChunks(projects: Project[]): KnowledgeChunk[] {
  return projects.flatMap((p) => {
    const base = {
      source: `Projects · ${shortTitle(p.title)}`,
      title: p.title,
      href: `/work/${p.slug}`,
    };
    const overview = [
      sentence(p.tagline),
      `Category: ${p.category}.`,
      sentence(p.summary),
      p.impact.length > 0 && `Impact: ${p.impact.map((i) => `${i.label}: ${i.value}`).join("; ")}.`,
      `Tech stack: ${p.stack.join(", ")}.`,
      p.links &&
        p.links.length > 0 &&
        `Links: ${p.links.map((l) => `${l.label} ${l.href}`).join(", ")}.`,
    ].filter((x): x is string => typeof x === "string");

    const approach = [
      `Problem: ${sentence(p.problem)}`,
      `Challenge: ${sentence(p.challenge)}`,
      ...p.approach.map(sentence),
    ];

    const eng = p.engineering;
    const engineering = eng
      ? [
          ...(eng.algorithms ?? []).map((a) => `${a.name}: ${sentence(a.note)}`),
          ...(eng.performance ?? []).map(sentence),
          ...(eng.writeup ?? []).map(sentence),
        ]
      : [];

    return [
      ...withParts(base, `project:${p.slug}`, `${p.title}.`, overview),
      ...withParts(
        base,
        `project:${p.slug}:approach`,
        `How ${shortTitle(p.title)} was built.`,
        approach,
      ),
      ...(engineering.length > 0
        ? withParts(
            base,
            `project:${p.slug}:engineering`,
            `${shortTitle(p.title)} engineering details.`,
            engineering,
          )
        : []),
    ];
  });
}

export function experienceChunks(experiences: Experience[]): KnowledgeChunk[] {
  return experiences.flatMap((e) => {
    const slug = e.id ?? e.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const header = `${e.role} at ${e.company} (${e.location}), ${e.start} – ${e.end}.`;
    const parts = [
      sentence(e.summary),
      ...e.highlights.map((h) => `${h.title}: ${sentence(h.detail)}`),
    ];
    return withParts(
      {
        source: `Experience · ${e.company}`,
        title: `${e.role} at ${e.company}`,
        href: "/experience",
      },
      `experience:${slug}`,
      header,
      parts,
    );
  });
}

export function backgroundChunks(c: SiteContent): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  if (c.education.length > 0) {
    chunks.push({
      id: "education",
      source: "Education",
      title: "Education",
      href: "/experience",
      text: c.education
        .map((e) => `${e.degree} at ${e.school}, ${e.start} – ${e.end} (score ${e.cgpa}).`)
        .join(" "),
    });
  }
  if (c.competitive.length > 0) {
    chunks.push({
      id: "competitive-ratings",
      source: "Competitive Programming",
      title: "Competitive programming ratings",
      href: "/competitive-programming",
      text: c.competitive
        .map((a) =>
          [a.platform, a.rank, a.rating !== undefined && `rating ${a.rating}`, a.detail]
            .filter(Boolean)
            .join(", "),
        )
        .map((line) => `${line}.`)
        .join(" "),
    });
  }
  chunks.push(
    ...withParts(
      { source: "Honors", title: "Honors and awards", href: "/about" },
      "honors",
      "Honors and awards:",
      c.honors.map(
        (h) => `${h.title} (${h.org}, ${h.date})${h.detail ? `: ${sentence(h.detail)}` : "."}`,
      ),
    ),
  );
  return chunks;
}

export function skillChunks(skills: SkillCluster[]): KnowledgeChunk[] {
  return skills.map((s) => ({
    id: `skills:${s.id}`,
    source: "Skills",
    title: `Skills · ${s.name}`,
    href: "/skills",
    text: `${s.name}: ${sentence(s.blurb)} Skills: ${s.skills
      .map((k) => (k.level ? `${k.name} (${k.level})` : k.name))
      .join(", ")}.`,
  }));
}

export function nowChunks(c: SiteContent): KnowledgeChunk[] {
  const parts = c.now.sections.map(
    (s) => `${c.nowTitles[s.id] ?? s.id}: ${s.items.map(sentence).join(" ")}`,
  );
  return withParts(
    {
      source: "Now",
      title: `What ${c.site.name} is doing now`,
      href: "/now",
    },
    "now-page",
    `Current focus (updated ${c.now.updated}).`,
    parts,
  );
}

export function systemDesignChunks(items: SystemDesignItem[]): KnowledgeChunk[] {
  return items.map((d) => ({
    id: `system-design:${d.slug}`,
    source: "System Design",
    title: `System design · ${d.title}`,
    href: `/system-design/${d.slug}`,
    text: [
      `${d.title}: ${sentence(d.tagline)}`,
      `Requirements: ${d.requirements.map(sentence).join(" ")}`,
      `Components: ${d.components.map((x) => `${x.name} — ${x.role}`).join("; ")}.`,
      `Trade-offs: ${d.tradeoffs.map(sentence).join(" ")}`,
    ].join(" "),
  }));
}

/** Every chunk the site can answer from, derived from src/content on each build. */
export function buildSiteChunks(c: SiteContent): KnowledgeChunk[] {
  return [
    ...profileChunks(c),
    ...projectChunks(c.projects),
    ...experienceChunks([...c.experiences, ...c.internships]),
    ...backgroundChunks(c),
    ...skillChunks(c.skills),
    ...nowChunks(c),
    ...systemDesignChunks(c.systemDesigns),
  ];
}
