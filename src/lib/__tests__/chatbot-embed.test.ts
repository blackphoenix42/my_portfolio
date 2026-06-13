import { describe, it, expect } from "vitest";
import {
  tokenize,
  termFrequencies,
  weightAndNormalize,
  embed,
  type SparseVector,
} from "@/lib/chatbot/embed";

describe("tokenize", () => {
  it("lowercases, drops stopwords and 1-char tokens", () => {
    expect(tokenize("The C++ performance of a System")).toEqual(["c++", "performance", "system"]);
  });

  it("keeps tech tokens with + and #", () => {
    expect(tokenize("c# and c++ go#")).toEqual(["c#", "c++", "go#"]);
  });

  it("returns an empty array when there is nothing to match", () => {
    expect(tokenize("!!! --- ???")).toEqual([]);
    expect(tokenize("")).toEqual([]);
  });
});

describe("termFrequencies", () => {
  it("counts repeated tokens", () => {
    const tf = termFrequencies(["a", "b", "a", "a"]);
    expect(tf.get("a")).toBe(3);
    expect(tf.get("b")).toBe(1);
  });
});

describe("weightAndNormalize", () => {
  const idf: SparseVector = { alpha: 2, beta: 1, gamma: 3 };

  it("drops terms missing from the idf map", () => {
    const v = weightAndNormalize(new Map([["unknown", 5]]), idf);
    expect(v).toEqual({});
  });

  it("produces an L2-normalized vector", () => {
    const v = weightAndNormalize(
      new Map([
        ["alpha", 1],
        ["beta", 1],
      ]),
      idf,
    );
    const norm = Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 10);
    expect(Object.keys(v).sort()).toEqual(["alpha", "beta"]);
  });

  it("accepts a plain object as input", () => {
    const v = weightAndNormalize({ gamma: 2 }, idf);
    expect(Object.keys(v)).toEqual(["gamma"]);
    expect(v.gamma).toBeCloseTo(1, 10);
  });

  it("returns the unnormalized (empty) vector when sumSq is 0", () => {
    expect(weightAndNormalize(new Map(), idf)).toEqual({});
  });
});

describe("embed", () => {
  it("embeds text against a precomputed idf", () => {
    const idf: SparseVector = { performance: 1.5, system: 1.2 };
    const v = embed("performance of the system", idf);
    const norm = Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 10);
    expect(Object.keys(v).sort()).toEqual(["performance", "system"]);
  });

  it("yields an empty vector when no terms are in the idf", () => {
    expect(embed("totally unseen words", { foo: 1 })).toEqual({});
  });
});
