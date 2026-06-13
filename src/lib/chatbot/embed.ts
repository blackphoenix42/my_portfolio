// Lightweight, fully-local text embedding for the "Ask my portfolio" assistant.
//
// Instead of shipping a multi-megabyte neural model + WASM runtime to the
// browser, we use a classic TF–IDF sparse vector model. It is deterministic,
// dependency-free, runs identically in Node (the build step) and the browser
// (query time), needs no network and therefore no CSP relaxation. Retrieval is
// extractive — answers are always real content chunks, never generated text.
//
// IMPORTANT: the tokenizer here must stay in sync with the one in
// scripts/build-chatbot-index.mjs (a unit test pins the expected tokens).

export const STOPWORDS = new Set([
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

export type SparseVector = Record<string, number>;

/** Lowercase, split on non-token chars, drop stopwords and 1-char tokens. */
export function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[a-z0-9+#]+/g);
  if (!matches) return [];
  return matches.filter((tok) => tok.length >= 2 && !STOPWORDS.has(tok));
}

/** Raw term frequencies for a list of tokens. */
export function termFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const tok of tokens) {
    tf.set(tok, (tf.get(tok) ?? 0) + 1);
  }
  return tf;
}

/**
 * Build an L2-normalized TF–IDF sparse vector from term frequencies. Terms with
 * no idf entry (unseen in the corpus) are dropped — they can never match a doc.
 */
export function weightAndNormalize(
  tf: Map<string, number> | SparseVector,
  idf: SparseVector,
): SparseVector {
  const entries: [string, number][] = tf instanceof Map ? [...tf.entries()] : Object.entries(tf);
  const weighted: SparseVector = {};
  let sumSq = 0;
  for (const [term, count] of entries) {
    const w = idf[term];
    if (!w) continue;
    const value = (1 + Math.log(count)) * w;
    weighted[term] = value;
    sumSq += value * value;
  }
  if (sumSq === 0) return weighted;
  const norm = Math.sqrt(sumSq);
  for (const term of Object.keys(weighted)) {
    weighted[term] = weighted[term]! / norm;
  }
  return weighted;
}

/** Convenience: text → normalized TF–IDF vector using a precomputed idf map. */
export function embed(text: string, idf: SparseVector): SparseVector {
  return weightAndNormalize(termFrequencies(tokenize(text)), idf);
}
