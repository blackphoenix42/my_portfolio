---
id: 0003
title: Vitest for unit tests, Playwright for E2E
date: 2026-05-27
status: Accepted
owners:
  - "@blackphoenix42"
tags: [testing]
---

# 0003 — Vitest for unit tests, Playwright for E2E

## Context

The project needs two complementary test layers: fast unit tests for pure logic
(`src/lib/*`, schema validators, formatters) and end-to-end browser tests for user-visible flows
(navigation, contact form happy/sad paths).

## Decision

- **Vitest** for unit tests. Pulls in the Vite-compatible transforms required by our TS config,
  has fast watch mode, and integrates with V8 coverage. Tests co-located in `**/__tests__/`.
- **Playwright** for E2E (already in use). Chromium-only in CI; full matrix can be added later.

`tests/` directory is reserved for Playwright; Vitest discovers `src/**/*.test.ts(x)` and
`src/**/__tests__/*.test.ts(x)`.

## Consequences

### Positive

- Two-tier pyramid: lots of cheap unit tests + a small number of integration / E2E tests.
- Vitest runs in the same TS/path-alias setup as the app, so no test-only Babel config.

### Negative

- Two test runners to learn (mitigated — both are well-documented).

## Alternatives considered

- **Jest** — slower to start, ESM/TS story is rougher than Vitest's.
- **Playwright Component Testing** — promising but immature for our component shapes.

## References

- <https://vitest.dev>
- <https://playwright.dev>
