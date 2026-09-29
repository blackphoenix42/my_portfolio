"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DIAGRAM_SLUGS } from "./diagram-slugs";

// Slug-keyed architecture whiteboards. New project diagrams register here once
// and become available on the case study + engineer-mode views. Lazy-loaded so
// a route only ships the diagram it needs.
const loader = (factory: () => Promise<{ default: ComponentType }>) =>
  dynamic(factory, {
    loading: () => (
      <div className="text-fg-subtle grid h-48 place-items-center font-mono text-xs" aria-hidden>
        loading diagram…
      </div>
    ),
  });

const DIAGRAMS: Record<(typeof DIAGRAM_SLUGS)[number], ComponentType> = {
  maestro: loader(() =>
    import("@/components/diagrams/maestro-architecture").then((m) => ({
      default: m.MaestroArchitecture,
    })),
  ),
  "xcelium-ai-agents": loader(() =>
    import("@/components/diagrams/xcelium-agents-architecture").then((m) => ({
      default: m.XceliumAgentsArchitecture,
    })),
  ),
  "regression-triage": loader(() =>
    import("@/components/diagrams/regression-triage-architecture").then((m) => ({
      default: m.RegressionTriageArchitecture,
    })),
  ),
  "perforce-replay": loader(() =>
    import("@/components/diagrams/perforce-replay-architecture").then((m) => ({
      default: m.PerforceReplayArchitecture,
    })),
  ),
};

export function ProjectArchitecture({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug as (typeof DIAGRAM_SLUGS)[number]];
  if (!Diagram) return null;
  return <Diagram />;
}
