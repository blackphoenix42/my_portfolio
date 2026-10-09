import {
  DEFAULT_COMMIT_RAIN_WINDOW,
  isOnOrAfter,
  parseCommitRainWindow,
  windowSince,
  type CommitRainWindow,
} from "@/lib/commit-rain-window";

// Lightweight RSS / Atom / GitHub events fetchers.
// All fetches use ISR via next.revalidate. On failure, returns [].

export type FeedItem = {
  title: string;
  url: string;
  date?: string;
  excerpt?: string;
};

const ENTITY_MAP: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&#x27;": "'",
  "&amp;": "&",
};

function decode(s: string) {
  // Strip CDATA wrappers first.
  const withoutCdata = s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1");
  // Single-pass entity replacement so '&amp;' decodes last and cannot
  // re-introduce other entity sequences via chained replacements.
  return withoutCdata
    .replace(/&(?:lt|gt|quot|apos|amp|#39|#x27);/g, (m) => ENTITY_MAP[m] ?? m)
    .trim();
}

function stripHtml(s: string) {
  // Repeatedly strip angle-bracket-bounded tokens until the input is stable so
  // that nested or overlapping sequences (e.g. "<scri<script>pt>") cannot
  // resurface intact after a single pass.
  let prev: string;
  let current = decode(s);
  do {
    prev = current;
    current = current.replace(/<[^>]*>?/g, "");
  } while (current !== prev);
  return current.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

function take<T>(arr: T[], n: number) {
  return arr.slice(0, n);
}

async function safeFetch(url: string, init?: RequestInit) {
  try {
    const res = await fetch(url, {
      ...init,
      // 15-minute ISR window — fresh enough that new posts / pushes surface
      // promptly without hammering the unauthenticated GitHub rate limit.
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Portfolio-RSS/1.0", ...(init?.headers ?? {}) },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Canonical upstream feed URLs (allowlisted for same-origin XML proxies). */
export const FEED_SOURCES = {
  medium: {
    upstream: "https://binaryphoenix01.medium.com/feed",
    contentType: "application/rss+xml; charset=utf-8",
  },
  youtube: {
    upstream: "https://www.youtube.com/feeds/videos.xml?channel_id=UCcINlOM-rC1_8yiRGH_iFBg",
    contentType: "application/atom+xml; charset=utf-8",
  },
  github: {
    upstream: "https://github.com/blackphoenix42.atom",
    contentType: "application/atom+xml; charset=utf-8",
  },
} as const;

export type FeedSourceKey = keyof typeof FEED_SOURCES;

type GhEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
    // GitHub reports the push size here; the `commits` array can be empty or
    // truncated in the public events feed, so `size` is the reliable count.
    size?: number;
    pull_request?: { html_url?: string; title?: string };
    issue?: { html_url?: string; title?: string };
    commits?: { message: string; sha: string }[];
  };
};

/** Fetch raw XML for a known feed source (used by `/feeds/*` proxies). */
export async function fetchRawFeed(source: FeedSourceKey): Promise<string | null> {
  return safeFetch(FEED_SOURCES[source].upstream);
}

export type CommitRainLine = { message: string; sha: string; repo?: string };

export type FetchCommitMessagesOptions = {
  limit?: number;
  /** week | month | year | all — filters by event/commit timestamp. */
  window?: CommitRainWindow | string;
};

/**
 * Public push commit messages for decorative commit rain.
 * Merges Events API + Commit Search (Events alone only covers ~90 days), then
 * Atom. Callers may accumulate results client-side across visits.
 */
export async function fetchRecentCommitMessages(
  user: string,
  limitOrOpts: number | FetchCommitMessagesOptions = 100,
): Promise<CommitRainLine[]> {
  const opts: FetchCommitMessagesOptions =
    typeof limitOrOpts === "number" ? { limit: limitOrOpts } : (limitOrOpts ?? {});
  const limit = opts.limit ?? 100;
  const window = parseCommitRainWindow(opts.window ?? DEFAULT_COMMIT_RAIN_WINDOW);
  const since = windowSince(window);

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Portfolio-RSS/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const fromEvents = await commitMessagesFromEvents(user, limit, since, headers);
  // Always try Search so year/all (and sparse months) fill beyond the Events window.
  const fromSearch = await commitMessagesFromSearch(user, limit, since, headers, window);
  const merged = mergeCommitLines(fromEvents, fromSearch, limit);
  if (merged.length) return merged;
  return commitMessagesFromAtom(user, limit);
}

async function commitMessagesFromEvents(
  user: string,
  limit: number,
  since: Date | null,
  headers: Record<string, string>,
): Promise<CommitRainLine[]> {
  try {
    const pages = since && since < new Date(Date.now() - 40 * 864e5) ? 3 : 1;
    const out: CommitRainLine[] = [];
    const seen = new Set<string>();
    for (let page = 1; page <= pages; page++) {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100&page=${page}`,
        {
          headers,
          next: { revalidate: 900 },
          signal: AbortSignal.timeout(8000),
        },
      );
      if (!res.ok) break;
      const events = (await res.json()) as GhEvent[];
      if (!Array.isArray(events) || events.length === 0) break;
      let pageOlderThanWindow = true;
      for (const ev of events) {
        if (isOnOrAfter(ev.created_at, since)) pageOlderThanWindow = false;
        if (ev.type !== "PushEvent") continue;
        if (!isOnOrAfter(ev.created_at, since)) continue;
        for (const c of ev.payload.commits ?? []) {
          const message = c.message?.split("\n")[0]?.trim().slice(0, 80);
          if (!message || /^(merge|wip)\b/i.test(message)) continue;
          const key = `${c.sha}:${message}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({
            message,
            sha: (c.sha ?? "").slice(0, 7) || fakeShortHash(message),
            repo: ev.repo?.name,
          });
          if (out.length >= limit) return out;
        }
      }
      if (pageOlderThanWindow && since) break;
    }
    return out;
  } catch {
    return [];
  }
}

type GhCommitSearchItem = {
  sha?: string;
  commit?: { message?: string; committer?: { date?: string } };
  repository?: { full_name?: string };
};

async function commitMessagesFromSearch(
  user: string,
  limit: number,
  since: Date | null,
  headers: Record<string, string>,
  window: CommitRainWindow = "month",
): Promise<CommitRainLine[]> {
  try {
    const dateClause = since ? `+committer-date:>=${since.toISOString().slice(0, 10)}` : "";
    const q = `author:${user}${dateClause}`;
    const pages = window === "year" || window === "all" ? 2 : 1;
    const out: CommitRainLine[] = [];
    const seen = new Set<string>();
    for (let page = 1; page <= pages; page++) {
      const res = await fetch(
        `https://api.github.com/search/commits?q=${encodeURIComponent(q)}&sort=committer-date&order=desc&per_page=${Math.min(limit, 100)}&page=${page}`,
        {
          headers: { ...headers, Accept: "application/vnd.github+json" },
          next: { revalidate: 900 },
          signal: AbortSignal.timeout(8000),
        },
      );
      if (!res.ok) break;
      const json = (await res.json()) as { items?: GhCommitSearchItem[] };
      const items = Array.isArray(json.items) ? json.items : [];
      if (items.length === 0) break;
      for (const item of items) {
        const message = item.commit?.message?.split("\n")[0]?.trim().slice(0, 80);
        if (!message || /^(merge|wip)\b/i.test(message)) continue;
        const sha = (item.sha ?? "").slice(0, 7) || fakeShortHash(message);
        const key = `${sha}:${message}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ message, sha, repo: item.repository?.full_name });
        if (out.length >= limit) return out;
      }
    }
    return out;
  } catch {
    return [];
  }
}

function mergeCommitLines(
  a: CommitRainLine[],
  b: CommitRainLine[],
  limit: number,
): CommitRainLine[] {
  const seen = new Set<string>();
  const out: CommitRainLine[] = [];
  for (const line of [...a, ...b]) {
    const key = `${line.sha}:${line.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
    if (out.length >= limit) break;
  }
  return out;
}

function fakeShortHash(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

async function commitMessagesFromAtom(user: string, limit: number): Promise<CommitRainLine[]> {
  const xml = await safeFetch(`https://github.com/${encodeURIComponent(user)}.atom`);
  if (!xml) return [];
  const out: CommitRainLine[] = [];
  for (const entry of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const block = entry[1] ?? "";
    const title = block.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/)?.[1];
    if (!title) continue;
    const text = stripHtml(title).slice(0, 80);
    if (!text) continue;
    // Prefer titles that look like push/commit activity.
    if (!/push|commit/i.test(text) && out.length > 0) continue;
    out.push({ message: text, sha: fakeShortHash(text) });
    if (out.length >= limit) break;
  }
  return out;
}

export async function fetchMediumFeed(handle: string, limit = 3): Promise<FeedItem[]> {
  // Prefer subdomain feed (matches public profile CTA); fall back to medium.com/feed/@handle.
  const xml =
    (await safeFetch("https://binaryphoenix01.medium.com/feed")) ??
    (await safeFetch(`https://medium.com/feed/${handle}`));
  if (!xml) return [];
  const items: FeedItem[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) && items.length < limit) {
    const block = m[1] ?? "";
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1];
    const pub = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
    const desc = block.match(/<description>([\s\S]*?)<\/description>/)?.[1];
    if (title && link) {
      items.push({
        title: decode(title),
        url: decode(link),
        date: pub ? new Date(decode(pub)).toISOString() : undefined,
        excerpt: desc ? stripHtml(desc).slice(0, 140) : undefined,
      });
    }
  }
  return items;
}

export async function fetchYouTubeFeed(channelId: string, limit = 3): Promise<FeedItem[]> {
  const xml = await safeFetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!xml) return [];
  const items: FeedItem[] = [];
  const re = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) && items.length < limit) {
    const block = m[1] ?? "";
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = block.match(/<link[^>]+href="([^"]+)"/)?.[1];
    const pub = block.match(/<published>([\s\S]*?)<\/published>/)?.[1];
    if (title && link) {
      items.push({
        title: decode(title),
        url: link,
        date: pub ? new Date(decode(pub)).toISOString() : undefined,
      });
    }
  }
  return items;
}

export async function fetchGithubActivity(user: string, limit = 4): Promise<FeedItem[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const json = await safeFetch(
    `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100`,
    { headers },
  );
  if (!json) return fetchGithubAtom(user, limit);
  let events: GhEvent[] = [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return fetchGithubAtom(user, limit);
    events = parsed.filter(
      (e): e is GhEvent =>
        !!e && typeof e === "object" && typeof e.type === "string" && !!e.payload,
    );
  } catch {
    return fetchGithubAtom(user, limit);
  }
  const out: FeedItem[] = [];
  for (const ev of events) {
    if (out.length >= limit) break;
    const repo = ev.repo?.name;
    if (!repo) continue;
    const repoUrl = `https://github.com/${repo}`;
    if (ev.type === "PushEvent") {
      const n = ev.payload.size ?? ev.payload.commits?.length ?? 0;
      const first = ev.payload.commits?.[0]?.message?.split("\n")[0]?.slice(0, 80);
      const branch = ev.payload.ref?.replace(/^refs\/heads\//, "");
      out.push({
        title:
          n > 0
            ? `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`
            : `Pushed to ${repo}${branch ? ` (${branch})` : ""}`,
        url: repoUrl,
        date: ev.created_at,
        excerpt: first,
      });
    } else if (ev.type === "PullRequestEvent") {
      out.push({
        title: `${ev.payload.action ?? "updated"} PR · ${ev.payload.pull_request?.title ?? repo}`,
        url: ev.payload.pull_request?.html_url ?? repoUrl,
        date: ev.created_at,
      });
    } else if (ev.type === "IssuesEvent") {
      out.push({
        title: `${ev.payload.action ?? "updated"} issue · ${ev.payload.issue?.title ?? repo}`,
        url: ev.payload.issue?.html_url ?? repoUrl,
        date: ev.created_at,
      });
    } else if (ev.type === "CreateEvent") {
      out.push({
        title: `Created ${ev.payload.ref_type ?? "ref"} ${ev.payload.ref ?? ""} on ${repo}`,
        url: repoUrl,
        date: ev.created_at,
      });
    } else if (ev.type === "WatchEvent") {
      out.push({
        title: `Starred ${repo}`,
        url: repoUrl,
        date: ev.created_at,
      });
    } else if (ev.type === "ForkEvent") {
      out.push({
        title: `Forked ${repo}`,
        url: repoUrl,
        date: ev.created_at,
      });
    }
  }
  return out.length ? take(out, limit) : fetchGithubAtom(user, limit);
}

/** Public Atom feed keeps the panel useful when the REST API is rate-limited. */
async function fetchGithubAtom(user: string, limit: number): Promise<FeedItem[]> {
  const xml = await safeFetch(`https://github.com/${encodeURIComponent(user)}.atom`);
  if (!xml) return [];
  const items: FeedItem[] = [];
  for (const entry of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const block = entry[1] ?? "";
    const title = block.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/)?.[1];
    const link = block.match(/<link[^>]+href="([^"]+)"/)?.[1];
    const date = block.match(/<updated>([^<]+)<\/updated>/)?.[1];
    const url = link ? decode(link) : "";
    if (title && /^https:\/\/github\.com\//.test(url))
      items.push({ title: stripHtml(title), url, date });
    if (items.length >= limit) break;
  }
  return items;
}

export function formatRelative(iso?: string, locale?: string): string {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const s = Math.floor(diff / 1000);

  // Locale-aware path: use Intl.RelativeTimeFormat for proper i18n + pluralization.
  if (locale) {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
      if (s < 60) return rtf.format(-s, "second");
      const m = Math.floor(s / 60);
      if (m < 60) return rtf.format(-m, "minute");
      const h = Math.floor(m / 60);
      if (h < 24) return rtf.format(-h, "hour");
      const day = Math.floor(h / 24);
      if (day < 30) return rtf.format(-day, "day");
      const mo = Math.floor(day / 30);
      if (mo < 12) return rtf.format(-mo, "month");
      return rtf.format(-Math.floor(mo / 12), "year");
    } catch {
      // Fall through to default formatting on bad locale tag.
    }
  }

  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}
