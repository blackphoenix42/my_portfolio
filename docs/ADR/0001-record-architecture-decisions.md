---
id: 0001
title: Record architecture decisions
date: 2026-05-27
status: Accepted
owners:
  - "@blackphoenix42"
tags: [process]
---

# 0001 — Record architecture decisions

## Context

The codebase has grown beyond a single-developer mental model. Without a paper trail, future
contributors (including future-me) will repeatedly re-litigate already-settled choices.

## Decision

Adopt lightweight Architecture Decision Records (ADRs), stored under `docs/ADR/`, numbered
sequentially, following the [Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

A new ADR is created via `npm run adr "<title>"`.

## Consequences

### Positive

- Decisions are searchable, dated, and attributed.
- Reviewers and newcomers have a single place to learn the "why" behind the stack.

### Negative

- Slight overhead per non-trivial decision.

### Neutral

- Process — not a runtime change.

## Alternatives considered

- **Wiki / Notion** — yields drift from source.
- **Implicit decisions in PR descriptions** — too easy to lose.

## References

- <https://adr.github.io/>
