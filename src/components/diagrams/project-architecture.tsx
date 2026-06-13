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
  xmai: loader(() =>
    import("@/components/diagrams/xmai-architecture").then((m) => ({
      default: m.XmaiArchitecture,
    })),
  ),
};

export function ProjectArchitecture({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug as (typeof DIAGRAM_SLUGS)[number]];
  if (!Diagram) return null;
  return <Diagram />;
}
