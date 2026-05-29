"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DEMO_SLUGS } from "./demo-slugs";

// Lazy-load the heavy per-project demos. They use framer-motion + their own
// rAF tickers and live behind a "use client" boundary; SSR is off because the
// demos depend on browser APIs (rAF, IntersectionObserver, performance.now).
// Each entry is a separate dynamic import so the route only ships one demo's
// JS, not all seven.
const loader = (factory: () => Promise<{ default: ComponentType }>) =>
  dynamic(factory, {
    ssr: false,
    loading: () => (
      <div
        className="card text-fg-subtle grid h-64 place-items-center font-mono text-xs"
        aria-hidden
      >
        loading demo…
      </div>
    ),
  });

const DEMOS: Record<(typeof DEMO_SLUGS)[number], ComponentType> = {
  xmai: loader(() =>
    import("@/components/projects/xmai-demo").then((m) => ({ default: m.XmaiPipelineDemo })),
  ),
  algolens: loader(() =>
    import("@/components/projects/algolens-demo").then((m) => ({ default: m.AlgoLensDemo })),
  ),
  "xcelium-optimization": loader(() =>
    import("@/components/projects/xcelium-demo").then((m) => ({ default: m.XceliumDemo })),
  ),
  "tezos-premier-league": loader(() =>
    import("@/components/projects/tezos-bracket-demo").then((m) => ({
      default: m.TezosBracketDemo,
    })),
  ),
  postureiq: loader(() =>
    import("@/components/projects/posture-demo").then((m) => ({ default: m.PostureDemo })),
  ),
  "track-person-app": loader(() =>
    import("@/components/projects/track-person-demo").then((m) => ({ default: m.TrackPersonDemo })),
  ),
  "smart-brain": loader(() =>
    import("@/components/projects/smart-brain-demo").then((m) => ({ default: m.SmartBrainDemo })),
  ),
};

export function ProjectDemo({ slug }: { slug: string }) {
  const Demo = DEMOS[slug as (typeof DEMO_SLUGS)[number]];
  if (!Demo) return null;
  return <Demo />;
}
