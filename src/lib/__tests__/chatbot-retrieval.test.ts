import { describe, it, expect } from "vitest";
import {
  cosineSparse,
  rankChunks,
  retrieve,
  type Chunk,
  type Corpus,
} from "@/lib/chatbot/retrieval";
import { embed, type SparseVector } from "@/lib/chatbot/embed";

describe("cosineSparse", () => {
  it("is 1 for identical normalized vectors", () => {
    const v: SparseVector = { a: 0.6, b: 0.8 };
    expect(cosineSparse(v, v)).toBeCloseTo(1, 10);
  });

  it("is 0 for orthogonal vectors", () => {
    expect(cosineSparse({ a: 1 }, { b: 1 })).toBe(0);
  });

  it("is 0 when either vector is empty", () => {
    expect(cosineSparse({}, { a: 1 })).toBe(0);
    expect(cosineSparse({ a: 1 }, {})).toBe(0);
  });

  it("iterates the smaller side regardless of argument order", () => {
    const small: SparseVector = { a: 1 };
    const large: SparseVector = { a: 1, b: 1, c: 1 };
    const ab = cosineSparse(small, large);
    const ba = cosineSparse(large, small);
    expect(ab).toBeCloseTo(ba, 10);
    expect(ab).toBeGreaterThan(0);
  });
});

const idf: SparseVector = {
  performance: 1.4,
  cadence: 1.6,
  simulator: 1.5,
  contact: 1.7,
  email: 1.3,
};

function makeChunk(id: string, text: string): Chunk {
  return { id, source: id, title: id, text, vector: embed(text, idf) };
}

const chunks: Chunk[] = [
  makeChunk("perf", "performance simulator at cadence"),
  makeChunk("contact", "contact email"),
  makeChunk("empty", "the of a an"), // no in-idf terms -> empty vector
];

describe("rankChunks", () => {
  it("returns only chunks with score > 0, sorted descending", () => {
    const q = embed("cadence performance", idf);
    const ranked = rankChunks(q, chunks);
    expect(ranked[0]?.chunk.id).toBe("perf");
    expect(ranked.every((r) => r.score > 0)).toBe(true);
    expect(ranked.map((r) => r.chunk.id)).not.toContain("empty");
  });

  it("respects topK", () => {
    const q = embed("performance contact", idf);
    expect(rankChunks(q, chunks, 1)).toHaveLength(1);
  });

  it("returns nothing for an unmatched query", () => {
    const q = embed("nonexistent terms only", idf);
    expect(rankChunks(q, chunks)).toEqual([]);
  });
});

describe("retrieve", () => {
  it("embeds the query against the corpus idf and ranks", () => {
    const corpus: Corpus = { idf, chunks };
    const ranked = retrieve("how is performance at cadence", corpus);
    expect(ranked[0]?.chunk.id).toBe("perf");
  });
});
