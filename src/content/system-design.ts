// System Design whiteboards — GENERAL computer-science knowledge (not personal
// facts), so content-integrity rules do not apply. English here is the fallback;
// titles/taglines can be overridden via the `systemDesign` i18n namespace.
export type SystemDesignItem = {
  slug: string;
  title: string;
  tagline: string;
  /** Whether an interactive whiteboard exists (including step-through reference pipelines). */
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
    interactive: true,
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
    interactive: true,
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
    interactive: true,
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

/** Implementation notes for the portfolio reference designs; not deployment claims. */
export const systemDesignNotes: Record<
  string,
  { dataModel: string; api: string; execution: string; failures: string }
> = {
  "url-shortener": {
    dataModel:
      "Link(code PRIMARY KEY, destination, owner_id, created_at, expires_at). A unique index on code arbitrates alias collisions. Cache entries carry a TTL bounded by link expiry.",
    api: "POST /links accepts a destination and optional alias, returning the code. GET /:code resolves it and returns a redirect. Invalid URLs return 400; alias collisions return 409; expired or missing links return 404.",
    execution:
      "Validate HTTP/HTTPS destinations, allocate a Base62 code, insert with a uniqueness constraint and retry collisions. Reads consult the cache, then the durable store, then populate the cache. Emit analytics asynchronously after the redirect decision.",
    failures:
      "Cache loss falls back to the database with bounded concurrency. Expired links never outlive their cache TTL. Rate limits and destination validation constrain abusive writes; asynchronous analytics must not delay redirects.",
  },
  "rate-limiter": {
    dataModel:
      "Bucket(key, tokens, last_refill_ms, capacity, refill_rate). Store expiring keys in Redis. Derive the key from the authenticated principal or a trusted proxy's client address.",
    api: "check(key, cost, now) returns allowed, remaining and retry_after. Middleware returns HTTP 429 and Retry-After when quota is exhausted. Costs and policy are server controlled.",
    execution:
      "Use one atomic Redis operation to refill up to capacity, test request cost, consume tokens and update the timestamp. Use a shared clock policy; clamp negative elapsed time. Expire idle buckets to bound storage.",
    failures:
      "Choose fail-open for availability-sensitive traffic and fail-closed for expensive or security-sensitive endpoints. Account for clock skew, hot keys and retries; per-process counters cannot enforce a global quota across replicas.",
  },
  "job-scheduler": {
    dataModel:
      "Job(id, idempotency_key UNIQUE, payload_ref, run_at, priority, attempts, lease_owner, lease_until, status). Keep large payloads in object storage and transitions in a durable record.",
    api: "POST /jobs enqueues idempotently; GET /jobs/:id reads status; POST /jobs/:id/cancel requests cooperative cancellation. Workers claim a lease, heartbeat it and acknowledge completion with their lease token.",
    execution:
      "The scheduler moves due jobs to a ready queue. A worker atomically leases a job, performs an idempotent side effect, then acknowledges. Retry transient failures with exponential backoff and jitter; exhausted jobs enter a dead-letter queue.",
    failures:
      "Worker crashes release work after lease expiry. Fencing tokens prevent an expired worker from acknowledging a reassigned job. Duplicate deliveries are expected, so business effects need their own idempotency boundary.",
  },
  "log-analytics": {
    dataModel:
      "Event(event_id, tenant_id, timestamp, service, severity, trace_id, body). Partition the ingest stream by tenant and service, and index time-bounded shards. Store compressed originals in object storage.",
    api: "POST /events accepts bounded batches with event IDs. GET /search takes a tenant, time range, query and cursor. GET /aggregations returns bounded time buckets. Every query is scoped to the caller's tenant.",
    execution:
      "Collectors batch and compress events. The broker durably buffers them; consumers validate schemas, redact configured fields and bulk-index documents. Commit offsets only after durable processing; event IDs deduplicate replays.",
    failures:
      "Backpressure slows collectors or spills to bounded local buffers. Poison events go to a quarantine stream. Apply retention policies consistently to indexes and archives; prohibit unbounded wildcard queries that overload the cluster.",
  },
  "sim-regression-dashboard": {
    dataModel:
      "Run(run_id, revision, branch, started_at), Result(run_id, test_id, attempt, status, signature, artifact_ref), and Failure(signature, first_seen, owner, classification). Use stable test IDs across runs.",
    api: "POST /runs creates an idempotent run; PUT /runs/:id/results upserts batches. GET /runs/:id/diff compares a baseline. GET /tests/:id/history returns results and artifact links with pagination.",
    execution:
      "Normalize runner output, group failures by signature, compare against the baseline and retain raw evidence. Keep rule-based classification reproducible; record optional LLM suggestions separately for human review.",
    failures:
      "Incomplete runs remain explicitly incomplete. Retry ingestion without duplicating results. Distinguish flaky tests from new deterministic failures; missing artifacts must not erase recorded test status.",
  },
  "waveform-compression": {
    dataModel:
      "Signal dictionary maps IDs to widths and types. Independently compressed chunks contain a time range, an initial state snapshot, delta timestamps, value changes and a checksum. A sparse index maps time ranges to file offsets.",
    api: "append(signal_id, time, value) records a transition; flush() seals a chunk; read(signals, start, end) seeks to the nearest snapshot and replays deltas. The reader validates format version and checksums.",
    execution:
      "Capture only transitions, encode timestamp deltas, pack repeated values and compress bounded chunks. Publish index entries after chunk durability. Random access loads one starting snapshot and only the necessary subsequent blocks.",
    failures:
      "Recover a partially written file by scanning committed chunks. Preserve all four-state digital values and same-time ordering. Test round-trip equality; compression ratios and seek latency depend on workload and chunk size.",
  },
};
