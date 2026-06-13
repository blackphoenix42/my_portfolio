---
id: 0011
title: System-design whiteboards as a dynamic registry
date: 2026-06-13
status: Accepted
owners:
  - "@blackphoenix42"
tags: [ux, performance, content]
---

# 0011 — System-design whiteboards as a dynamic registry

## Context

Engineer-oriented visitors (and interviewers) value seeing how someone reasons
about classic system-design problems. We wanted a `/system-design` section with
a mix of fully interactive whiteboards and lightweight "coming soon" sketches,
without bloating the initial bundle or hard-coding a giant switch statement.

## Decision

Model each topic as data in `src/content/system-design.ts` (requirements,
components, trade-offs, and an `interactive` flag). Render through a **dynamic
registry** (`system-whiteboard.tsx`) that lazy-loads the matching interactive
component via `next/dynamic`, or falls back to a shared `static-whiteboard.tsx`
with a "coming soon" badge. Three boards ship interactive (URL shortener, rate
limiter, job scheduler); three are scaffolded. All animations gate on
`useReducedMotion()`. A new `systemDesign.*` i18n namespace covers every string.

## Consequences

### Positive

- One topic = one content entry; adding a board is data + an optional component.
- Only the visited board's JS loads (code-split), keeping the page light.
- Static fallback lets us publish the section before every board is built.
- Reuses the established demo shell and motion-gating conventions.

### Negative

- A small registry indirection between content and component.
- Interactive boards are bespoke; they don't share a simulation engine.

### Neutral

- Boards are illustrative, not benchmarks — copy is careful not to imply
  production metrics.

## Alternatives considered

- **One monolithic page component** — rejected: ships all board JS up front and
  is hard to extend.
- **MDX per topic** — rejected: interactivity and i18n are clumsier than a typed
  content file plus React components.

## References

- `src/content/system-design.ts`
- `src/components/system-design/*`
- `src/app/[locale]/system-design/page.tsx`
