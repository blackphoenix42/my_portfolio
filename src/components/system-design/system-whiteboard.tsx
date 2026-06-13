"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Lazy-load each whiteboard so a route only ships the diagram it renders.
const loader = (factory: () => Promise<{ default: ComponentType }>) =>
  dynamic(factory, {
    ssr: false,
    loading: () => (
      <div className="text-fg-subtle grid h-40 place-items-center font-mono text-xs" aria-hidden>
        loading whiteboard…
      </div>
    ),
  });

const staticLoader = (slug: string) =>
  dynamic(
    () =>
      import("./static-whiteboard").then((m) => {
        const Comp = () => <m.StaticWhiteboard slug={slug} />;
        Comp.displayName = `StaticWhiteboard(${slug})`;
        return { default: Comp };
      }),
    {
      ssr: false,
      loading: () => (
        <div className="text-fg-subtle grid h-40 place-items-center font-mono text-xs" aria-hidden>
          loading whiteboard…
        </div>
      ),
    },
  );

const WHITEBOARDS: Record<string, ComponentType> = {
  "url-shortener": loader(() =>
    import("./url-shortener").then((m) => ({ default: m.UrlShortenerWhiteboard })),
  ),
  "rate-limiter": loader(() =>
    import("./rate-limiter").then((m) => ({ default: m.RateLimiterWhiteboard })),
  ),
  "job-scheduler": loader(() =>
    import("./job-scheduler").then((m) => ({ default: m.JobSchedulerWhiteboard })),
  ),
  "log-analytics": staticLoader("log-analytics"),
  "sim-regression-dashboard": staticLoader("sim-regression-dashboard"),
  "waveform-compression": staticLoader("waveform-compression"),
};

export function SystemWhiteboard({ slug }: { slug: string }) {
  const Board = WHITEBOARDS[slug];
  if (!Board) return null;
  return <Board />;
}
