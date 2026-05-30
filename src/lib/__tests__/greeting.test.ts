import { describe, expect, it } from "vitest";
import { getGreetingBucket, getGreetingBucketFromDate } from "@/lib/greeting";

describe("getGreetingBucket", () => {
  it.each([
    [5, "morning"],
    [8, "morning"],
    [11, "morning"],
    [12, "afternoon"],
    [15, "afternoon"],
    [16, "afternoon"],
    [17, "evening"],
    [19, "evening"],
    [20, "evening"],
    [21, "night"],
    [23, "night"],
    [0, "night"],
    [3, "night"],
    [4, "night"],
  ] as const)("hour %i -> %s", (hour, expected) => {
    expect(getGreetingBucket(hour)).toBe(expected);
  });

  it("normalises negative and out-of-range hours modulo 24", () => {
    expect(getGreetingBucket(-2)).toBe("night"); // 22:00
    expect(getGreetingBucket(30)).toBe("morning"); // 06:00
  });

  it("falls back to night for non-finite input", () => {
    expect(getGreetingBucket(Number.NaN)).toBe("night");
    expect(getGreetingBucket(Number.POSITIVE_INFINITY)).toBe("night");
  });

  it("floors fractional hours", () => {
    expect(getGreetingBucket(11.9)).toBe("morning");
    expect(getGreetingBucket(12.0001)).toBe("afternoon");
  });
});

describe("getGreetingBucketFromDate", () => {
  it("reads the local hour from a Date", () => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    expect(getGreetingBucketFromDate(d)).toBe("morning");
    d.setHours(22, 0, 0, 0);
    expect(getGreetingBucketFromDate(d)).toBe("night");
  });

  it("defaults to the current time", () => {
    // Smoke test: the returned value must be one of the four buckets.
    expect(["morning", "afternoon", "evening", "night"]).toContain(getGreetingBucketFromDate());
  });
});
