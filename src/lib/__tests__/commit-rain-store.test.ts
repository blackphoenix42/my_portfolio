import { describe, expect, it } from "vitest";
import {
  emptyCommitRainCache,
  mergeCommitCacheWindow,
  parseCommitRainCache,
  upsertCommitRainCache,
} from "@/lib/commit-rain-store";

describe("commit-rain-store", () => {
  it("merges and dedupes preferring incoming order", () => {
    const prior = [
      { message: "old", sha: "aaaaaaa" },
      { message: "keep", sha: "bbbbbbb" },
    ];
    const incoming = [
      { message: "new", sha: "ccccccc" },
      { message: "keep", sha: "bbbbbbb" },
    ];
    expect(mergeCommitCacheWindow(prior, incoming, 10)).toEqual([
      { message: "new", sha: "ccccccc" },
      { message: "keep", sha: "bbbbbbb" },
      { message: "old", sha: "aaaaaaa" },
    ]);
  });

  it("caps length", () => {
    const incoming = Array.from({ length: 5 }, (_, i) => ({
      message: `m${i}`,
      sha: `sha${i}`.padEnd(7, "0"),
    }));
    expect(mergeCommitCacheWindow([], incoming, 2)).toHaveLength(2);
  });

  it("upserts a window on the cache", () => {
    const base = emptyCommitRainCache(new Date("2026-01-01T00:00:00Z"));
    const next = upsertCommitRainCache(
      base,
      "week",
      [{ message: "feat: x", sha: "1234567" }],
      new Date("2026-01-02T00:00:00Z"),
    );
    expect(next.byWindow.week).toHaveLength(1);
    expect(next.updatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(parseCommitRainCache(next)).not.toBeNull();
  });

  it("rejects bad cache payloads", () => {
    expect(parseCommitRainCache(null)).toBeNull();
    expect(parseCommitRainCache({ version: 99 })).toBeNull();
  });
});
