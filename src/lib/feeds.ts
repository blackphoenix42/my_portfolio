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
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Portfolio-RSS/1.0", ...(init?.headers ?? {}) },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function fetchMediumFeed(handle: string, limit = 3): Promise<FeedItem[]> {
  const xml = await safeFetch(`https://medium.com/feed/${handle}`);
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

type GhEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { html_url?: string; title?: string };
    issue?: { html_url?: string; title?: string };
    commits?: { message: string; sha: string }[];
  };
};

export async function fetchGithubActivity(user: string, limit = 4): Promise<FeedItem[]> {
  const json = await safeFetch(`https://api.github.com/users/${user}/events/public`);
  if (!json) return [];
  let events: GhEvent[] = [];
  try {
    events = JSON.parse(json) as GhEvent[];
  } catch {
    return [];
  }
  const out: FeedItem[] = [];
  for (const ev of events) {
    if (out.length >= limit) break;
    const repo = ev.repo?.name;
    if (!repo) continue;
    const repoUrl = `https://github.com/${repo}`;
    if (ev.type === "PushEvent") {
      const n = ev.payload.commits?.length ?? 0;
      const first = ev.payload.commits?.[0]?.message?.split("\n")[0]?.slice(0, 80);
      out.push({
        title: `Pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`,
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
  return take(out, limit);
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
