// Lightweight RSS / Atom / GitHub events fetchers.
// All fetches use ISR via next.revalidate. On failure, returns [].

export type FeedItem = {
  title: string;
  url: string;
  date?: string;
  excerpt?: string;
};

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .trim();
}

function stripHtml(s: string) {
  return decode(s)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

export function formatRelative(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const s = Math.floor(diff / 1000);
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
