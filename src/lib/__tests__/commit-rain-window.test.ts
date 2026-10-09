import { describe, expect, it } from "vitest";
import {
  DEFAULT_COMMIT_RAIN_WINDOW,
  isCommitRainWindow,
  isOnOrAfter,
  parseCommitRainWindow,
  windowSince,
} from "@/lib/commit-rain-window";

describe("commit-rain-window", () => {
  it("validates and parses windows", () => {
    expect(isCommitRainWindow("week")).toBe(true);
    expect(isCommitRainWindow("decade")).toBe(false);
    expect(parseCommitRainWindow(null)).toBe(DEFAULT_COMMIT_RAIN_WINDOW);
    expect(parseCommitRainWindow("year")).toBe("year");
    expect(parseCommitRainWindow("nope")).toBe(DEFAULT_COMMIT_RAIN_WINDOW);
  });

  it("computes since bounds", () => {
    const now = new Date("2026-10-09T12:00:00.000Z");
    expect(windowSince("all", now)).toBeNull();
    expect(windowSince("week", now)?.toISOString()).toBe("2026-10-02T12:00:00.000Z");
    expect(windowSince("month", now)?.toISOString()).toBe("2026-09-09T12:00:00.000Z");
    expect(windowSince("year", now)?.toISOString()).toBe("2025-10-09T12:00:00.000Z");
  });

  it("filters ISO timestamps", () => {
    const since = new Date("2026-01-01T00:00:00.000Z");
    expect(isOnOrAfter("2026-06-01T00:00:00.000Z", since)).toBe(true);
    expect(isOnOrAfter("2025-12-31T23:59:59.000Z", since)).toBe(false);
    expect(isOnOrAfter(undefined, null)).toBe(true);
    expect(isOnOrAfter(undefined, since)).toBe(false);
  });
});
