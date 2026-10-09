import { describe, expect, it } from "vitest";
import { mergeServerCommitCache } from "@/lib/commit-rain-server-cache";

describe("mergeServerCommitCache", () => {
  it("accumulates and dedupes per window in process memory", () => {
    const first = mergeServerCommitCache("week", [
      { message: "feat: a", sha: "aaaaaaa" },
      { message: "feat: b", sha: "bbbbbbb" },
    ]);
    expect(first).toHaveLength(2);

    const second = mergeServerCommitCache("week", [
      { message: "feat: c", sha: "ccccccc" },
      { message: "feat: b", sha: "bbbbbbb" },
    ]);
    expect(second.map((line) => line.sha)).toEqual(["ccccccc", "bbbbbbb", "aaaaaaa"]);

    const month = mergeServerCommitCache("month", [{ message: "other", sha: "ddddddd" }]);
    expect(month).toEqual([{ message: "other", sha: "ddddddd" }]);
    expect(mergeServerCommitCache("week", [])).toHaveLength(3);
  });
});
