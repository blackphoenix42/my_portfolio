import { embed, type SparseVector } from "./embed";

export type Chunk = {
  id: string;
  source: string;
  title: string;
  text: string;
  /** Internal route the chunk was derived from, when known. */
  href?: string;
  vector: SparseVector;
};

export type Corpus = {
  idf: SparseVector;
  chunks: Chunk[];
};

export type RankedChunk = { chunk: Chunk; score: number };

/** Cosine similarity between two sparse vectors. */
export function cosineSparse(a: SparseVector, b: SparseVector): number {
  // Iterate the smaller map for speed.
  const [small, large] = Object.keys(a).length <= Object.keys(b).length ? [a, b] : [b, a];
  let dot = 0;
  for (const term of Object.keys(small)) {
    const bv = large[term];
    if (bv) dot += small[term]! * bv;
  }
  let normA = 0;
  for (const v of Object.values(a)) normA += v * v;
  let normB = 0;
  for (const v of Object.values(b)) normB += v * v;
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Rank chunks by similarity to a query vector; returns top-k with score > 0. */
export function rankChunks(queryVector: SparseVector, chunks: Chunk[], topK = 3): RankedChunk[] {
  return chunks
    .map((chunk) => ({ chunk, score: cosineSparse(queryVector, chunk.vector) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** End-to-end: embed the query against the corpus idf and rank its chunks. */
export function retrieve(query: string, corpus: Corpus, topK = 3): RankedChunk[] {
  const queryVector = embed(query, corpus.idf);
  return rankChunks(queryVector, corpus.chunks, topK);
}
