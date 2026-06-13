// System Design whiteboards — GENERAL computer-science knowledge (not personal
// facts), so content-integrity rules do not apply. English here is the fallback;
// titles/taglines can be overridden via the `systemDesign` i18n namespace.
export type SystemDesignItem = {
  slug: string;
  title: string;
  tagline: string;
  /** Whether an interactive whiteboard exists (vs a static "coming soon" diagram). */
  interactive: boolean;
  requirements: string[];
  components: { name: string; role: string }[];
  tradeoffs: string[];
};

export const systemDesigns: SystemDesignItem[] = [
  {
    slug: "url-shortener",
    title: "URL Shortener",
    tagline: "Map long URLs to short codes and redirect at scale (bit.ly-style).",
    interactive: true,
    requirements: [
      "Generate a unique short code per long URL.",
      "Redirect short → long with very low latency.",
      "Handle a very high read:write ratio (reads ≫ writes).",
      "Optional analytics, expiry and custom aliases.",
    ],
    components: [
      { name: "API service", role: "Validates input, creates or looks up mappings." },
      {
        name: "Key generation",
        role: "Base62 of an auto-increment id or hash, collision-checked.",
      },
      { name: "KV store / DB", role: "code → long-URL mapping, sharded by code." },
      { name: "Cache (Redis)", role: "Hot short-codes for sub-millisecond redirects." },
      { name: "CDN / edge", role: "Caches redirects close to users." },
    ],
    tradeoffs: [
      "301 (permanent, cacheable, loses analytics) vs 302 (temporary, countable).",
      "Hashing (stateless, collisions) vs counter+Base62 (coordination, no collisions).",
      "A read-through cache adds complexity but is essential at this read ratio.",
    ],
  },
  {
    slug: "rate-limiter",
    title: "Rate Limiter",
    tagline: "Protect services by capping request rate per client.",
    interactive: true,
    requirements: [
      "Limit N requests per window per key (user / IP / API key).",
      "Low latency with a clear fail-open or fail-closed policy.",
      "Work across many app servers consistently.",
      "Return 429 with a Retry-After hint.",
    ],
    components: [
      { name: "Limiter middleware", role: "Checks and decrements quota before handling." },
      { name: "Counter store (Redis)", role: "Atomic counters/tokens keyed by client + window." },
      { name: "Algorithm", role: "Token bucket, sliding-window log or fixed window." },
      { name: "Policy", role: "Per-tier limits and burst allowance." },
    ],
    tradeoffs: [
      "Fixed window (cheap, boundary bursts) vs sliding window (accurate, costlier).",
      "Token bucket allows bursts; leaky bucket smooths output.",
      "Local in-memory (fast, per-node) vs centralized (consistent, network hop).",
    ],
  },
  {
    slug: "job-scheduler",
    title: "Job Scheduler",
    tagline: "Run tasks reliably — now, delayed or recurring.",
    interactive: true,
    requirements: [
      "Enqueue jobs with priority and a run-at time.",
      "At-least-once execution with retries and backoff.",
      "Scale workers horizontally.",
      "Visibility into pending, running, failed and done jobs.",
    ],
    components: [
      { name: "Queue / broker", role: "Durable job queue (SQS / Kafka / DB table)." },
      { name: "Scheduler", role: "Moves due delayed/cron jobs into the ready queue." },
      { name: "Workers", role: "Pull jobs, execute, ack or retry." },
      { name: "Dead-letter queue", role: "Captures jobs that exhaust retries." },
      { name: "Store", role: "Job state, idempotency keys and results." },
    ],
    tradeoffs: [
      "At-least-once + idempotency (simple, needs dedupe) vs exactly-once (hard).",
      "Push vs pull worker models.",
      "Priority queues vs FIFO fairness.",
    ],
  },
  {
    slug: "log-analytics",
    title: "Log Analytics System",
    tagline: "Ingest, index and query high-volume logs.",
    interactive: false,
    requirements: [
      "Ingest millions of events per second.",
      "Full-text and structured search.",
      "Time-windowed aggregations and dashboards.",
      "Retention tiers and archival.",
    ],
    components: [
      { name: "Collectors / agents", role: "Ship logs from hosts." },
      { name: "Ingest pipeline (Kafka)", role: "Buffer with back-pressure." },
      { name: "Index (Elasticsearch)", role: "Searchable inverted index." },
      { name: "Object storage", role: "Cheap cold / archival tier." },
      { name: "Query / dashboard", role: "Search and visualize." },
    ],
    tradeoffs: [
      "Index everything (fast queries, costly) vs sample / schema-on-read.",
      "Hot / warm / cold tiering for cost control.",
    ],
  },
  {
    slug: "sim-regression-dashboard",
    title: "Simulation Regression Dashboard",
    tagline: "Track pass/fail trends across nightly simulation runs.",
    interactive: false,
    requirements: [
      "Ingest results from thousands of regression tests.",
      "Separate new failures from flaky and known failures.",
      "Trend pass-rate over time with per-test history.",
      "Drill into logs and artifacts of a failure.",
    ],
    components: [
      { name: "Run ingest", role: "Parse results from CI / sim farm." },
      { name: "Results DB", role: "Per-test, per-run status and metadata." },
      { name: "Flake detector", role: "Classifies intermittent failures." },
      { name: "Dashboard", role: "Trends, diffs and owners." },
      { name: "Artifact store", role: "Logs and waveforms linked per failure." },
    ],
    tradeoffs: [
      "Store all artifacts (debuggable, large) vs fetch on demand.",
      "Real-time vs batch aggregation.",
    ],
  },
  {
    slug: "waveform-compression",
    title: "Waveform Compression System",
    tagline: "Compress digital simulation waveforms for storage and fast replay.",
    interactive: false,
    requirements: [
      "Compress huge value-change dumps (VCD/FSDB-style).",
      "Random-access replay at any time point.",
      "Lossless for digital signals.",
      "Fast writes during simulation.",
    ],
    components: [
      { name: "Value-change capture", role: "Records signal transitions, not samples." },
      { name: "Delta + RLE encoding", role: "Stores changes and run-lengths." },
      { name: "Dictionary / bit-packing", role: "Packs enum / bus values tightly." },
      { name: "Chunked index", role: "Time-indexed blocks for seeking." },
      { name: "Reader", role: "Decompresses windows on demand." },
    ],
    tradeoffs: [
      "Event-based (compact for sparse activity) vs sampled.",
      "Bigger blocks compress better but slow random access.",
    ],
  },
];

export function getSystemDesign(slug: string) {
  return systemDesigns.find((s) => s.slug === slug);
}
