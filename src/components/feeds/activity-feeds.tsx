import { Rss, PenTool, Youtube, Github, ArrowUpRight } from "lucide-react";
import {
  fetchMediumFeed,
  fetchYouTubeFeed,
  fetchGithubActivity,
  formatRelative,
  type FeedItem,
} from "@/lib/feeds";

type FeedPanel = {
  key: string;
  label: string;
  icon: typeof PenTool;
  accent: string;
  cta: { label: string; href: string };
  items: FeedItem[];
  empty: string;
};

export async function ActivityFeeds({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [medium, youtube, github] = await Promise.all([
    fetchMediumFeed("@binaryphoenix01", 3),
    fetchYouTubeFeed("UCcINlOM-rC1_8yiRGH_iFBg", 3),
    fetchGithubActivity("blackphoenix42", 4),
  ]);

  const panels: FeedPanel[] = [
    {
      key: "medium",
      label: "Latest blog posts",
      icon: PenTool,
      accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
      cta: { label: "Read on Medium", href: "https://binaryphoenix01.medium.com" },
      items: medium,
      empty: "Visit Medium for the latest articles.",
    },
    {
      key: "youtube",
      label: "Latest YouTube videos",
      icon: Youtube,
      accent: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
      cta: {
        label: "Open channel",
        href: "https://www.youtube.com/channel/UCcINlOM-rC1_8yiRGH_iFBg?sub_confirmation=1",
      },
      items: youtube,
      empty: "Visit YouTube for the latest videos.",
    },
    {
      key: "github",
      label: "Recent GitHub activity",
      icon: Github,
      accent: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
      cta: { label: "github.com/blackphoenix42", href: "https://github.com/blackphoenix42" },
      items: github,
      empty: "Recent activity will appear here when the feed is reachable.",
    },
  ];

  return (
    <section className="section border-t border-border/60" aria-label="Live activity feeds">
      <div className="container-tight">
        {!hideHeader && (
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <Rss className="h-3.5 w-3.5" /> / live feeds
            </p>
            <h2 className="section-title mt-2">Live activity</h2>
            <p className="mt-2 max-w-2xl text-fg-muted">
              Recent posts, videos and commits — pulled live from Medium, YouTube and GitHub and
              cached for an hour at the edge.
            </p>
          </header>
        )}
        <div className="grid gap-4 lg:grid-cols-3">
          {panels.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.key} className="card flex flex-col p-5">
                <div className="flex items-center gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-lg border ${p.accent}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight">{p.label}</h3>
                </div>
                <ul className="mt-4 flex-1 space-y-3">
                  {p.items.length === 0 ? (
                    <li className="text-xs text-fg-subtle">{p.empty}</li>
                  ) : (
                    p.items.map((it, idx) => (
                      <li
                        key={`${p.key}-${idx}`}
                        className="border-l-2 border-border/60 pl-3 transition-colors hover:border-accent-amber/50"
                      >
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <p className="line-clamp-2 text-sm font-medium text-fg group-hover:text-accent-amber">
                            {it.title}
                          </p>
                          {it.excerpt && (
                            <p className="mt-1 line-clamp-2 text-xs text-fg-muted">{it.excerpt}</p>
                          )}
                          {it.date && (
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                              {formatRelative(it.date)}
                            </p>
                          )}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
                <a
                  href={p.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1 text-xs text-accent-cyan hover:text-fg"
                >
                  {p.cta.label} <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
