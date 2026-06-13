// Precompute the "Ask my portfolio" retrieval corpus.
//
// Reads the curated knowledge chunks (real, public facts) and writes
// public/chatbot/corpus.json with per-chunk L2-normalized TF–IDF vectors plus
// the global idf map. Fully deterministic, no network, no model download.
//
// IMPORTANT: the tokenizer below must stay in sync with src/lib/chatbot/embed.ts
// (there is a unit test pinning the expected tokens).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "as",
  "at",
  "by",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "from",
  "into",
  "you",
  "your",
  "i",
  "me",
  "my",
  "we",
  "our",
  "do",
  "does",
  "how",
  "what",
  "which",
  "who",
  "when",
  "where",
  "why",
  "can",
  "could",
  "would",
  "should",
  "about",
  "tell",
]);

function tokenize(text) {
  const matches = text.toLowerCase().match(/[a-z0-9+#]+/g);
  if (!matches) return [];
  return matches.filter((tok) => tok.length >= 2 && !STOPWORDS.has(tok));
}

function termFrequencies(tokens) {
  const tf = new Map();
  for (const tok of tokens) tf.set(tok, (tf.get(tok) ?? 0) + 1);
  return tf;
}

function weightAndNormalize(tf, idf) {
  const weighted = {};
  let sumSq = 0;
  for (const [term, count] of tf.entries()) {
    const w = idf[term];
    if (!w) continue;
    const value = (1 + Math.log(count)) * w;
    weighted[term] = value;
    sumSq += value * value;
  }
  if (sumSq === 0) return weighted;
  const norm = Math.sqrt(sumSq);
  for (const term of Object.keys(weighted)) weighted[term] = weighted[term] / norm;
  return weighted;
}

function round(vec) {
  const out = {};
  for (const [k, v] of Object.entries(vec)) out[k] = Math.round(v * 10000) / 10000;
  return out;
}

async function main() {
  const raw = await readFile(join(ROOT, "src/content/chatbot-knowledge.json"), "utf8");
  const { chunks } = JSON.parse(raw);

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
