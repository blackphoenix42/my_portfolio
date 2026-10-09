/** Time window for GitHub-backed commit rain. Stored in localStorage (no cookie). */

export const COMMIT_RAIN_WINDOWS = ["week", "month", "year", "all"] as const;
export type CommitRainWindow = (typeof COMMIT_RAIN_WINDOWS)[number];

export const COMMIT_RAIN_WINDOW_KEY = "phoenix:commit-rain:window";
export const DEFAULT_COMMIT_RAIN_WINDOW: CommitRainWindow = "month";

export function isCommitRainWindow(value: unknown): value is CommitRainWindow {
  return typeof value === "string" && (COMMIT_RAIN_WINDOWS as readonly string[]).includes(value);
}

export function parseCommitRainWindow(raw: string | null | undefined): CommitRainWindow {
  return isCommitRainWindow(raw) ? raw : DEFAULT_COMMIT_RAIN_WINDOW;
}

/** Earliest instant inclusive for the window, or `null` for all-time. */
export function windowSince(window: CommitRainWindow, now: Date = new Date()): Date | null {
  if (window === "all") return null;
  const d = new Date(now.getTime());
  if (window === "week") d.setUTCDate(d.getUTCDate() - 7);
  else if (window === "month") d.setUTCMonth(d.getUTCMonth() - 1);
  else d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d;
}

export function isOnOrAfter(iso: string | undefined, since: Date | null): boolean {
  if (!since) return true;
  if (!iso) return false;
  const t = Date.parse(iso);
  return Number.isFinite(t) && t >= since.getTime();
}
