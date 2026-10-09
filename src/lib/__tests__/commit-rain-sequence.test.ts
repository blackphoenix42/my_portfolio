import { describe, expect, it } from "vitest";
import {
  commitRainDurationMs,
  COMMIT_RAIN_FALL_MS,
  COMMIT_RAIN_STAGGER_MS,
  sequenceCommitDrops,
} from "@/content/commit-rain";

describe("sequenceCommitDrops", () => {
  it("keeps newest-first order and rains each commit once", () => {
    const lines = [
      { message: "newest", sha: "aaaaaaa" },
      { message: "mid", sha: "bbbbbbb" },
      { message: "oldest", sha: "ccccccc" },
    ];
    expect(sequenceCommitDrops(lines).map((l) => l.message)).toEqual(["newest", "mid", "oldest"]);
  });

  it("falls back to curated pool when empty", () => {
    expect(sequenceCommitDrops([]).length).toBeGreaterThan(0);
  });
});

describe("commitRainDurationMs", () => {
  it("covers last stagger + fall", () => {
    expect(commitRainDurationMs(1)).toBe(COMMIT_RAIN_FALL_MS + 400);
    expect(commitRainDurationMs(3)).toBe(2 * COMMIT_RAIN_STAGGER_MS + COMMIT_RAIN_FALL_MS + 400);
    expect(commitRainDurationMs(0)).toBe(0);
  });
});
