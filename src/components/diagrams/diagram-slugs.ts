// Server-safe registry of which project slugs have an architecture whiteboard.
// Mirrors src/components/projects/demo-slugs.ts so the case-study page can stay
// a server component and decide whether to render <ProjectArchitecture />.
export const DIAGRAM_SLUGS = ["xmai"] as const;

export type DiagramSlug = (typeof DIAGRAM_SLUGS)[number];

export function hasArchitectureDiagram(slug: string): boolean {
  return (DIAGRAM_SLUGS as readonly string[]).includes(slug);
}
