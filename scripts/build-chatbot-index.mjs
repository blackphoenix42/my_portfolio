// Precompute the "Ask my portfolio" retrieval corpus.
//
// Combines the curated knowledge chunks with chunks derived automatically from
// src/content/*.ts (projects, experience, skills, /now, system design, honors),
// so the assistant picks up new site content on every build. Writes
// public/chatbot/corpus.json with per-chunk L2-normalized TF–IDF vectors plus
// the global idf map. Fully deterministic, no network, no model download.
//
// Content modules and the tokenizer are imported as TypeScript via Node's
// built-in type stripping (Node >= 22.18), so they must only use erasable
// syntax. Sharing src/lib/chatbot/embed.ts keeps build-time and query-time
// tokenization identical.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tokenize, termFrequencies, weightAndNormalize } from "../src/lib/chatbot/embed.ts";
import { buildSiteChunks } from "../src/lib/chatbot/ingest.ts";
import { SITE } from "../src/content/profile.ts";
import { projects } from "../src/content/projects.ts";
import { experiences, internships, educationHistory } from "../src/content/experience.ts";
import { clusters } from "../src/content/skills.ts";
import { competitive } from "../src/content/achievements.ts";
import { honors, languages } from "../src/content/extras.ts";
import { NOW } from "../src/content/now.ts";
import { systemDesigns } from "../src/content/system-design.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function round(vec) {
  const out = {};
  for (const [k, v] of Object.entries(vec)) out[k] = Math.round(v * 10000) / 10000;
  return out;
}

async function loadSiteChunks() {
  const en = JSON.parse(await readFile(join(ROOT, "messages/en.json"), "utf8"));
  return buildSiteChunks({
    site: SITE,
    projects,
    experiences,
    internships,
    education: educationHistory,
    skills: clusters,
    competitive,
    honors,
    languages,
    now: NOW,
    nowTitles: en.now?.sectionTitles ?? {},
    systemDesigns,
  });
}

async function main() {
  const raw = await readFile(join(ROOT, "src/content/chatbot-knowledge.json"), "utf8");
  const curated = JSON.parse(raw).chunks;
  const chunks = [...curated, ...(await loadSiteChunks())];
  const ids = new Set();
  for (const c of chunks) {
    if (ids.has(c.id)) throw new Error(`duplicate chunk id: ${c.id}`);
    ids.add(c.id);
  }

  const docTokens = chunks.map((c) => tokenize(`${c.title} ${c.text}`));
  const N = chunks.length;

  // Document frequency → idf.
  const df = new Map();
  for (const tokens of docTokens) {
    for (const term of new Set(tokens)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const idf = {};
  for (const [term, freq] of df.entries()) {
    idf[term] = Math.log((N + 1) / (freq + 1)) + 1;
  }

  const outChunks = chunks.map((c, i) => ({
    id: c.id,
    source: c.source,
    title: c.title,
    text: c.text,
    ...(c.href ? { href: c.href } : {}),
    vector: round(weightAndNormalize(termFrequencies(docTokens[i]), idf)),
  }));

  const corpus = { idf: round(idf), chunks: outChunks };
  const outDir = join(ROOT, "public/chatbot");
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "corpus.json"), JSON.stringify(corpus), "utf8");

  console.log(
    `[build-chatbot-index] wrote public/chatbot/corpus.json — ${N} chunks, ${Object.keys(idf).length} terms`,
  );
}

main().catch((err) => {
  console.error("[build-chatbot-index] failed:", err);
  process.exit(1);
});
