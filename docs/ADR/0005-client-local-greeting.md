---
id: 0005
title: Use client-local time buckets for header greeting
date: 2026-05-30
status: Accepted
owners:
  - "@blackphoenix42"
tags:
  - privacy
  - personalization
  - i18n
---

# 0005 — Use client-local time buckets for header greeting

## Context

The portfolio needs a warmer first impression in the header: a small greeting that adapts to the
visitor's local moment and works across all supported locales. The feature must preserve the site's
privacy posture: no new cookies, no analytics-style personalization, no IP geolocation, and no server
collection of timezone data.

## Decision

Compute a coarse time-of-day bucket (`morning`, `afternoon`, `evening`, `night`) entirely in the
browser from `Date#getHours()`. Render the greeting as a client component next to the brand name,
translate all visible copy through `messages/*.json`, and store only a `sessionStorage` flag so the
popover auto-opens once per browser session.

The UI will not display the visitor's exact local time. It will show a friendly greeting, a short
welcome/explore line, and a CTA to the portfolio work page.

## Consequences

### Positive

- Keeps personalization private and local to the browser.
- Avoids IP geolocation services, timezone transmission, and new cookies.
- Preserves `localePrefix: "never"` because navigation uses the existing next-intl `Link`.
- Gives every locale the same greeting behavior through shared message keys.

### Negative

- The greeting appears only after hydration because the browser clock is required.
- The time-of-day bucket can be wrong if the visitor's device clock is wrong.

### Neutral

- `sessionStorage` is used only to avoid repeated auto-open behavior during one browser session.
- The greeting chip remains manually accessible even after the auto-open flag is set.

## Alternatives considered

- **IP geolocation / timezone lookup** — rejected because it would add privacy risk and external
  service dependency for a cosmetic feature.
- **Server-rendered greeting from request headers** — rejected because headers do not reliably carry
  local time and would complicate static rendering.
- **Exact clock in the greeting UI** — rejected because the desired experience is a warm welcome, not
  a time display.

## References

- `src/components/layout/greeting-chip.tsx`
- `src/lib/greeting.ts`
- `messages/*.json`
