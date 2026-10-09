import type { CommitRainWindow } from "@/lib/commit-rain-window";
import { mergeCommitCacheWindow, type StoredCommitLine } from "@/lib/commit-rain-store";

/** Process-local merge cache so successive API hits keep growing until cold start. */
const store = new Map<CommitRainWindow, StoredCommitLine[]>();

export function mergeServerCommitCache(
  window: CommitRainWindow,
  incoming: StoredCommitLine[],
): StoredCommitLine[] {
  const next = mergeCommitCacheWindow(store.get(window), incoming);
  store.set(window, next);
  return next;
}
