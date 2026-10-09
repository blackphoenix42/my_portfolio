"use client";

import type { CommitRainWindow } from "@/lib/commit-rain-window";
import {
  COMMIT_RAIN_CACHE_KEY,
  emptyCommitRainCache,
  parseCommitRainCache,
  upsertCommitRainCache,
  type StoredCommitLine,
} from "@/lib/commit-rain-store";

function readRaw() {
  try {
    const raw = localStorage.getItem(COMMIT_RAIN_CACHE_KEY);
    if (!raw) return emptyCommitRainCache();
    const parsed = parseCommitRainCache(JSON.parse(raw) as unknown);
    return parsed ?? emptyCommitRainCache();
  } catch {
    return emptyCommitRainCache();
  }
}

export function readCachedCommits(rainWindow: CommitRainWindow): StoredCommitLine[] {
  return readRaw().byWindow[rainWindow] ?? [];
}

/** Merge freshly fetched lines into the browser cache for this window. */
export function absorbCommits(
  rainWindow: CommitRainWindow,
  lines: StoredCommitLine[],
): StoredCommitLine[] {
  try {
    const next = upsertCommitRainCache(readRaw(), rainWindow, lines);
    localStorage.setItem(COMMIT_RAIN_CACHE_KEY, JSON.stringify(next));
    return next.byWindow[rainWindow] ?? lines;
  } catch {
    return lines;
  }
}
