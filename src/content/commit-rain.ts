// Curated, decorative commit messages for the "commit rain" overlay when GitHub
// is unavailable. Real rain uses public commits from `/api/commits` (newest first).
export const COMMIT_MESSAGES = [
  "optimize simulation log parser",
  "fix flaky regression failure",
  "add Dijkstra-based root-cause analysis",
  "reduce hot-path allocations in scheduler",
  "cache embeddings for faster retrieval",
  "refactor agent prompt routing",
  "shave 14% off RTL transform runtime",
  "add Kalman smoothing to pose pipeline",
  "vectorize inner loop, +18% throughput",
  "memoize expensive selector",
  "tighten rate-limiter token bucket",
  "add idempotency keys to job queue",
  "fix off-by-one in base62 encoder",
  "lazy-load the heavy demo bundle",
  "gate animation on reduced-motion",
  "add WCAG AA focus states",
  "dedupe vector store writes",
  "backoff + retry on RPC errors",
  "compress waveform chunks with RLE",
  "profile, then optimize (always)",
  "drop a 23MB dependency, ship lexical search",
  "handle the empty-state, finally",
  "write the test that would've caught it",
  "rename things until they make sense",
  "delete dead code, feel great",
  "add tracing to the slow path",
  "fix the race nobody could reproduce",
  "make the build deterministic",
  "warm the cache on cold start",
  "ship it 🚀",
];

export type CommitDropLine = { message: string; sha: string };

/** Stagger between successive drops (ms). */
export const COMMIT_RAIN_STAGGER_MS = 160;
/** Approximate fall duration (ms). */
export const COMMIT_RAIN_FALL_MS = 5200;

/**
 * Sequence every commit newest-first (API order preserved). Each line rains
 * once — no random resampling / repeats.
 */
export function sequenceCommitDrops(
  lines: CommitDropLine[] = [],
  rng: () => number = Math.random,
): CommitDropLine[] {
  const usable = lines.filter((line) => line.message.trim());
  const source =
    usable.length > 0
      ? usable
      : COMMIT_MESSAGES.map((message) => ({ message, sha: fakeHash(rng) }));
  return source.map((line) => ({
    message: line.message.trim().slice(0, 80),
    sha: line.sha.slice(0, 7) || fakeHash(rng),
  }));
}

/**
 * Pick decorative drops from recent public commits when available, then use the
 * curated pool to keep the overlay populated during GitHub outages.
 * @deprecated Prefer sequenceCommitDrops for full-run rain.
 */
export function pickCommitDrops(
  count: number,
  lines: CommitDropLine[] = [],
  rng: () => number = Math.random,
): CommitDropLine[] {
  const sequenced = sequenceCommitDrops(lines, rng);
  if (sequenced.length === 0) return [];
  const out: CommitDropLine[] = [];
  for (let i = 0; i < count; i++) {
    out.push(sequenced[i % sequenced.length]!);
  }
  return out;
}

/** Return a randomized list of `count` commit messages (with repeats allowed). */
export function pickCommits(count: number, rng: () => number = Math.random): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * COMMIT_MESSAGES.length);
    out.push(COMMIT_MESSAGES[idx] ?? COMMIT_MESSAGES[0]!);
  }
  return out;
}

/** Short fake hex commit hash for flavour. */
export function fakeHash(rng: () => number = Math.random): string {
  return Math.floor(rng() * 0xfffffff)
    .toString(16)
    .padStart(7, "0")
    .slice(0, 7);
}

/** Total overlay lifetime until the last drop finishes falling. */
export function commitRainDurationMs(dropCount: number): number {
  if (dropCount <= 0) return 0;
  return (dropCount - 1) * COMMIT_RAIN_STAGGER_MS + COMMIT_RAIN_FALL_MS + 400;
}
