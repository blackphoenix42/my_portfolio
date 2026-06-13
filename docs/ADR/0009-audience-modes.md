---
id: 0009
title: Audience modes (Recruiter & Engineer)
date: 2026-06-13
status: Accepted
owners:
  - "@blackphoenix42"
tags: [ux, content, i18n]
---

# 0009 — Audience modes (Recruiter & Engineer)

## Context

The portfolio serves two very different readers. Recruiters want a fast,
hiring-focused summary — résumé, impact, contact. Engineers want depth —
architecture, algorithms, performance trade-offs, and write-ups. A single
linear page either buries the deep material or overwhelms a time-pressed
reviewer.

Recruiter Mode already existed as a `localStorage`-backed React context that
re-renders server-composed sections client-side. We needed a symmetric
"Engineer Mode" without doubling the content model or introducing new cookies.

## Decision

Add an **Engineer Mode** that mirrors Recruiter Mode: a React context
(`engineer-mode.tsx`), an `<EngineerAware>` gate, a header toggle, a banner, an
`n` keyboard shortcut, and a command-menu entry. The two modes are **mutually
exclusive** — enabling one disables the other in the provider and in every
toggle entry point. Deep technical content is attached to existing project data
via an optional `engineering` field on the `Project` type and revealed only when
Engineer Mode is on. State persists in the existing `localStorage` namespace; no
new cookie is introduced.

## Consequences

### Positive

- Each audience gets a tailored reading of the same content with one click.
- No new cookie, so the soft consent banner stays informational.
- Content stays single-sourced in `src/content/*`; modes only change emphasis.
- Fully translated: a new `engineer.*` namespace across all six locales.

### Negative

- Two audience modes add branching to the home and case-study composition.
- Authors must remember to fill `engineering` fields for new projects (a
  draft-notice is shown until they are refined).

### Neutral

- Mode is client-only state, so the default (no mode) renders for crawlers and
  first paint — good for SEO, and the deep content is still present in the DOM.

## Alternatives considered

- **Separate `/engineer` routes** — rejected: duplicates routing and content,
  and breaks the "stable URL across locales" principle.
- **Query-param driven modes** — rejected: pollutes shareable URLs and
  complicates caching/SSG.

## References

- `src/components/layout/engineer-mode.tsx`, `recruiter-mode.tsx`
- ADR-0004 (i18n), `docs/EGGS.md`
