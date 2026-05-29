// Single source of truth for which project slugs have an interactive demo.
// Exported as a plain module (no "use client") so server components can
// import `DEMO_SLUGS` / `hasDemo` without crossing the RSC boundary.
export const DEMO_SLUGS = [
  "xmai",
  "algolens",
  "xcelium-optimization",
  "tezos-premier-league",
  "postureiq",
  "track-person-app",
  "smart-brain",
] as const;

export function hasDemo(slug: string): boolean {
  return (DEMO_SLUGS as readonly string[]).includes(slug);
}
