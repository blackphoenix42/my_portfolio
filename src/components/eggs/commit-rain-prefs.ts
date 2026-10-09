"use client";

import {
  COMMIT_RAIN_WINDOW_KEY,
  parseCommitRainWindow,
  type CommitRainWindow,
} from "@/lib/commit-rain-window";

export function readCommitRainWindow(): CommitRainWindow {
  try {
    return parseCommitRainWindow(localStorage.getItem(COMMIT_RAIN_WINDOW_KEY));
  } catch {
    return parseCommitRainWindow(null);
  }
}

export function writeCommitRainWindow(next: CommitRainWindow): void {
  try {
    localStorage.setItem(COMMIT_RAIN_WINDOW_KEY, next);
  } catch {
    // private mode / blocked storage
  }
  globalThis.dispatchEvent?.(new CustomEvent("commit-rain-window-change", { detail: next }));
}
