// Curated, decorative commit messages for the "commit rain" overlay. Purely
// cosmetic flavour text (general engineering work, no real repo data, no API).
// Randomized on every run so the rain looks different each time.
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
