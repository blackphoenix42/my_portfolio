# Asset Attribution

This portfolio intentionally relies on **original SVG assets** generated in-component rather than third-party
brand logos, in order to:

1. Avoid trademark / licensing issues with employer and customer brands.
2. Keep the page lightweight and theme-aware.
3. Maintain WCAG-compliant contrast and accessible labels.

## Custom-built (all original)

- Hero diagram (`src/components/hero/hero-visualization.tsx`) — animated profiler → RAG/MCP → agent → RTL graph.
- Case-study thumbnails (`src/components/diagrams/case-study-thumbs.tsx`) — pipeline, flamegraph, sorting bars, bracket.
- XMAI conceptual architecture (`src/components/diagrams/xmai-architecture.tsx`).
- AlgoLens micro-demo (`src/components/projects/algolens-demo.tsx`).
- Open Graph image (`src/app/opengraph-image.tsx`).

## Fonts

- **Inter** — Rasmus Andersson, OFL.
- **JetBrains Mono** — JetBrains, OFL.

Loaded via `next/font/google`.

## Optional logos

If you choose to display tech logos under `public/assets/logos/`, please source them from:

- [Simple Icons](https://simpleicons.org/) — CC0 (verify per-brand trademark policy).
- [Devicon](https://devicon.dev/) — MIT.
- Official brand guidelines pages.

When displaying customer brand references (Apple, Google, Samsung, NVIDIA), this portfolio uses
**typographic text labels only** — not logos — to remain trademark-safe.

## Cadence Design Systems

Cadence is referenced **only** as the author's current employer using plain text. No Cadence brand
assets are bundled in this repository.
