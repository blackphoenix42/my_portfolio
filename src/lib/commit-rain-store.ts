import type { CommitRainWindow } from "@/lib/commit-rain-window";

export type StoredCommitLine = {
  message: string;
  sha: string;
  repo?: string;
};

export const COMMIT_RAIN_CACHE_KEY = "phoenix:commit-rain:cache";
export const COMMIT_RAIN_CACHE_VERSION = 1;
/** Soft cap so localStorage stays small while still covering dense rain. */
export const COMMIT_RAIN_CACHE_CAP = 200;

export type CommitRainCache = {
  version: number;
  updatedAt: string;
  byWindow: Partial<Record<CommitRainWindow, StoredCommitLine[]>>;
};

export function emptyCommitRainCache(now: Date = new Date()): CommitRainCache {
  return {
    version: COMMIT_RAIN_CACHE_VERSION,
    updatedAt: now.toISOString(),
    byWindow: {},
  };
}

export function isStoredCommitLine(value: unknown): value is StoredCommitLine {
  if (!value || typeof value !== "object") return false;
  const v = value as StoredCommitLine;
  return typeof v.message === "string" && typeof v.sha === "string" && v.message.trim().length > 0;
}

export function parseCommitRainCache(raw: unknown): CommitRainCache | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as CommitRainCache;
  if (obj.version !== COMMIT_RAIN_CACHE_VERSION) return null;
  if (typeof obj.updatedAt !== "string") return null;
  if (!obj.byWindow || typeof obj.byWindow !== "object") return null;
  return obj;
}

function lineKey(line: StoredCommitLine): string {
  return `${line.sha.slice(0, 7)}:${line.message.trim()}`;
}

/**
 * Merge incoming GitHub lines into an existing window list (newest-first bias:
 * incoming first, then prior). Dedupes by sha+message and caps length.
 */
export function mergeCommitCacheWindow(
  prior: StoredCommitLine[] | undefined,
  incoming: StoredCommitLine[],
  cap: number = COMMIT_RAIN_CACHE_CAP,
): StoredCommitLine[] {
  const seen = new Set<string>();
  const out: StoredCommitLine[] = [];
  for (const line of [...incoming, ...(prior ?? [])]) {
    if (!isStoredCommitLine(line)) continue;
    const key = lineKey(line);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      message: line.message.trim().slice(0, 80),
      sha: line.sha.slice(0, 7),
      ...(line.repo ? { repo: line.repo } : {}),
    });
    if (out.length >= cap) break;
  }
  return out;
}

export function upsertCommitRainCache(
  cache: CommitRainCache,
  window: CommitRainWindow,
  incoming: StoredCommitLine[],
  now: Date = new Date(),
): CommitRainCache {
  return {
    version: COMMIT_RAIN_CACHE_VERSION,
    updatedAt: now.toISOString(),
    byWindow: {
      ...cache.byWindow,
      [window]: mergeCommitCacheWindow(cache.byWindow[window], incoming),
    },
  };
}
