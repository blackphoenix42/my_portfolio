import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first request and decrements remaining", () => {
    const r = rateLimit("ip-1", 3, 60_000);
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(2);
  });

  it("blocks once the limit is reached", () => {
    rateLimit("ip-2", 2, 60_000);
    rateLimit("ip-2", 2, 60_000);
    const third = rateLimit("ip-2", 2, 60_000);
    expect(third.ok).toBe(false);
    expect(third.remaining).toBe(0);
    expect(third.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    rateLimit("ip-3", 1, 60_000);
    const blocked = rateLimit("ip-3", 1, 60_000);
    expect(blocked.ok).toBe(false);
    vi.advanceTimersByTime(61_000);
    const allowed = rateLimit("ip-3", 1, 60_000);
    expect(allowed.ok).toBe(true);
  });

  it("uses defaults when only key is provided", () => {
    const r = rateLimit("ip-defaults");
    expect(r.ok).toBe(true);
    expect(typeof r.remaining).toBe("number");
  });

  it("scopes buckets by key", () => {
    rateLimit("ip-A", 1, 60_000);
    const b1 = rateLimit("ip-A", 1, 60_000);
    expect(b1.ok).toBe(false);
    const b2 = rateLimit("ip-B", 1, 60_000);
    expect(b2.ok).toBe(true);
  });
});
