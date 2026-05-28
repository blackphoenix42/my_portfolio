# Asset Attribution

This portfolio mixes **original SVG diagrams** with a small set of monochrome tech icons
and bundled employer/community logos. Each category is listed below with its source and
license.

## Custom-built (all original)

- Hero diagram (`src/components/hero/hero-visualization.tsx`) — animated profiler → RAG/MCP → agent → RTL graph.
- Case-study thumbnails (`src/components/diagrams/case-study-thumbs.tsx`) — pipeline, flamegraph, sorting bars, bracket.
- XMAI conceptual architecture (`src/components/diagrams/xmai-architecture.tsx`).
- Roadmap diagram (`src/components/diagrams/roadmap-diagram.tsx`).
- AlgoLens micro-demo (`src/components/projects/algolens-demo.tsx`) and all other
  project demos under `src/components/projects/*-demo.tsx`.
- Open Graph image (`src/app/opengraph-image.tsx`).
- Brand-mark icons (`src/components/icons/brand.tsx`) — GitHub, LinkedIn, YouTube
  glyphs re-drawn in the lucide style after `lucide-react` dropped third-party marks.

## Tech glyphs

`src/components/logos/tech-icons.tsx` contains monochrome single-path SVGs for common
technologies (C++, Python, TypeScript, Go, React, AWS, GCP, Docker, GitHub, …). Paths
are adapted from [Simple Icons](https://simpleicons.org/) (CC0 1.0 Public Domain) and
re-rendered in `currentColor` so they inherit the active theme. Verify each brand's own
trademark guidance before reusing this file in another project.

## Bundled logos

`public/assets/logos/` ships PNG/JPG/SVG logos for the schools, internships, and
contest platforms referenced in the experience and competitive-programming sections.
These are displayed for **identification only** and remain the property of their
respective owners.

## Fonts

- **Inter** — Rasmus Andersson, OFL.
- **JetBrains Mono** — JetBrains, OFL.

Loaded via `next/font/google`.

## Customer brand references

Customer brand references (Apple, Google, Samsung, NVIDIA) appear as **typographic text
only** — no customer logos are bundled — to stay clearly trademark-safe.

## Cadence Design Systems

Cadence is the author's current employer. `public/assets/logos/cadence.svg` is included
for the experience section header; no other Cadence brand assets are bundled.
