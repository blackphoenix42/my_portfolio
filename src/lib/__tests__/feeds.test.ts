import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchMediumFeed,
  fetchYouTubeFeed,
  fetchGithubActivity,
  formatRelative,
} from "@/lib/feeds";

function mockFetch(impl: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => impl(url, init)),
  );
}

describe("formatRelative", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty for undefined", () => {
    expect(formatRelative()).toBe("");
  });
  it("formats seconds", () => {
    const iso = new Date(Date.now() - 5_000).toISOString();
    expect(formatRelative(iso)).toMatch(/^\d+s ago$/);
  });
  it("formats minutes", () => {
    expect(formatRelative(new Date(Date.now() - 5 * 60_000).toISOString())).toMatch(/m ago/);
  });
  it("formats hours", () => {
    expect(formatRelative(new Date(Date.now() - 3 * 3600_000).toISOString())).toMatch(/h ago/);
  });
  it("formats days", () => {
    expect(formatRelative(new Date(Date.now() - 3 * 86_400_000).toISOString())).toMatch(/d ago/);
  });
  it("formats months", () => {
    expect(formatRelative(new Date(Date.now() - 60 * 86_400_000).toISOString())).toMatch(/mo ago/);
  });
  it("formats years", () => {
    expect(formatRelative(new Date(Date.now() - 400 * 86_400_000).toISOString())).toMatch(/y ago/);
  });
  it("uses Intl.RelativeTimeFormat when a locale is provided (seconds)", () => {
    const out = formatRelative(new Date(Date.now() - 5_000).toISOString(), "en");
    expect(typeof out).toBe("string");
    expect(out.length).toBeGreaterThan(0);
    expect(out).not.toMatch(/^\d+s ago$/);
  });
  it("localizes minutes/hours/days/months/years branches", () => {
    const now = Date.now();
    const cases = [
      now - 5 * 60_000,
      now - 3 * 3600_000,
      now - 3 * 86_400_000,
      now - 60 * 86_400_000,
      now - 400 * 86_400_000,
    ];
    for (const t of cases) {
      const out = formatRelative(new Date(t).toISOString(), "en");
      expect(typeof out).toBe("string");
      expect(out.length).toBeGreaterThan(0);
    }
  });
  it("falls back to default format on invalid locale tag", () => {
    const out = formatRelative(new Date(Date.now() - 5_000).toISOString(), "not-a-locale!");
    expect(out).toMatch(/^\d+s ago$/);
  });
});

describe("fetchMediumFeed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses items from RSS XML", async () => {
    const xml = `
      <rss><channel>
        <item>
          <title><![CDATA[Hello &amp; world]]></title>
          <link>https://medium.com/@x/post-1</link>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          <description><![CDATA[<p>An &lt;b&gt;intro&lt;/b&gt; to things</p>]]></description>
        </item>
        <item>
          <title>Second</title>
          <link>https://medium.com/@x/post-2</link>
        </item>
      </channel></rss>
    `;
    mockFetch(async () => new Response(xml, { status: 200 }));
    const items = await fetchMediumFeed("@x", 5);
    expect(items.length).toBe(2);
    expect(items[0]!.title).toBe("Hello & world");
    expect(items[0]!.url).toContain("post-1");
    expect(items[0]!.date).toMatch(/2024/);
    expect(items[0]!.excerpt).toContain("intro");
  });

  it("returns [] on non-ok response", async () => {
    mockFetch(async () => new Response("", { status: 500 }));
    expect(await fetchMediumFeed("@x")).toEqual([]);
  });

  it("returns [] on fetch error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("net");
      }),
    );
    expect(await fetchMediumFeed("@x")).toEqual([]);
  });

  it("respects the limit", async () => {
    const items = Array.from(
      { length: 5 },
      (_, i) => `<item><title>T${i}</title><link>u${i}</link></item>`,
    ).join("");
    mockFetch(async () => new Response(`<rss>${items}</rss>`, { status: 200 }));
    const out = await fetchMediumFeed("@x", 2);
    expect(out).toHaveLength(2);
  });
});

describe("fetchYouTubeFeed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("parses entries", async () => {
    const xml = `
      <feed>
        <entry>
          <title>Vid 1</title>
          <link rel="alternate" href="https://youtube.com/watch?v=1"/>
          <published>2024-05-01T00:00:00Z</published>
        </entry>
      </feed>
    `;
    mockFetch(async () => new Response(xml, { status: 200 }));
    const out = await fetchYouTubeFeed("CHAN");
    expect(out[0]!.title).toBe("Vid 1");
    expect(out[0]!.url).toContain("watch?v=1");
  });
  it("returns [] when fetch fails", async () => {
    mockFetch(async () => new Response("", { status: 404 }));
    expect(await fetchYouTubeFeed("CHAN")).toEqual([]);
  });
});

describe("fetchGithubActivity", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const baseEvt = (extra: Record<string, unknown>) => ({
    created_at: "2024-01-01T00:00:00Z",
    repo: { name: "u/r" },
    payload: {},
    ...extra,
  });

  it("maps push, PR, issue, create, watch and fork events", async () => {
    const events = [
      baseEvt({
        type: "PushEvent",
        payload: { commits: [{ message: "fix: bug\nbody", sha: "a" }] },
      }),
      baseEvt({
        type: "PullRequestEvent",
        payload: { action: "opened", pull_request: { html_url: "x", title: "PR" } },
      }),
      baseEvt({
        type: "IssuesEvent",
        payload: { action: "closed", issue: { html_url: "y", title: "Bug" } },
      }),
      baseEvt({ type: "CreateEvent", payload: { ref_type: "tag", ref: "v1" } }),
      baseEvt({ type: "WatchEvent" }),
      baseEvt({ type: "ForkEvent" }),
      baseEvt({ type: "UnknownEvent" }),
    ];
    mockFetch(async () => new Response(JSON.stringify(events), { status: 200 }));
    const out = await fetchGithubActivity("u", 10);
    expect(out.find((i) => i.title.startsWith("Pushed"))).toBeTruthy();
    expect(out.find((i) => i.title.includes("PR"))).toBeTruthy();
    expect(out.find((i) => i.title.includes("issue"))).toBeTruthy();
    expect(out.find((i) => i.title.startsWith("Created"))).toBeTruthy();
    expect(out.find((i) => i.title.startsWith("Starred"))).toBeTruthy();
    expect(out.find((i) => i.title.startsWith("Forked"))).toBeTruthy();
  });

  it("handles event with no repo", async () => {
    const events = [{ type: "WatchEvent", created_at: "x", payload: {} }];
    mockFetch(async () => new Response(JSON.stringify(events), { status: 200 }));
    expect(await fetchGithubActivity("u")).toEqual([]);
  });

  it("returns [] when JSON is invalid", async () => {
    mockFetch(async () => new Response("<not json>", { status: 200 }));
    expect(await fetchGithubActivity("u")).toEqual([]);
  });

  it("respects the limit", async () => {
    const events = Array.from({ length: 10 }, () => baseEvt({ type: "WatchEvent" }));
    mockFetch(async () => new Response(JSON.stringify(events), { status: 200 }));
    expect(await fetchGithubActivity("u", 3)).toHaveLength(3);
  });

  it("returns [] when fetch fails", async () => {
    mockFetch(async () => new Response("", { status: 500 }));
    expect(await fetchGithubActivity("u")).toEqual([]);
  });

  it("handles single commit phrasing", async () => {
    const events = [
      baseEvt({ type: "PushEvent", payload: { commits: [{ message: "one", sha: "1" }] } }),
    ];
    mockFetch(async () => new Response(JSON.stringify(events), { status: 200 }));
    const out = await fetchGithubActivity("u");
    expect(out[0]!.title).toMatch(/1 commit\b/);
  });
});
