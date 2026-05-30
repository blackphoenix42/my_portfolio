---
id: 0007
title: Remove weather and geolocation from the greeting
date: 2026-05-30
status: Accepted
owners:
  - "@blackphoenix42"
tags:
  - privacy
  - personalization
  - csp
  - security
---

# 0007 — Remove weather and geolocation from the greeting

## Context

The header greeting started as a local-clock-only feature. A later experiment explored weather-aware
greeting ambience through browser geolocation and Open-Meteo. Even with rounded coordinates and no
storage, that experiment introduced a permission prompt, a third-party browser fetch, extra CSP
surface area, and additional privacy copy for a decorative feature.

The desired experience is now simpler: greet visitors by local time only, without asking for
location.

## Decision

Remove the weather feature from the greeting chip. The component no longer calls
`navigator.geolocation`, no longer fetches Open-Meteo, and no longer renders weather ambience or
weather text.

Remove the weather utility and its tests, remove Open-Meteo from the third-party privacy table,
remove `https://api.open-meteo.com` from `connect-src`, and restore `Permissions-Policy` to deny
geolocation with `geolocation=()`.

## Consequences

### Positive

- No browser location prompt appears when visiting the portfolio.
- The security policy returns to a smaller client-side network surface.
- Privacy copy stays focused on the real data flows: locale cookie, Vercel analytics, server logs,
  and contact form delivery.
- The greeting remains lightweight, localized, and fully functional without external weather data.

### Negative

- The greeting card no longer reflects local weather conditions.

### Neutral

- The local time-of-day greeting still computes in the browser and does not send timezone data to the
  server.
- Quote rotation and the greeting auto-open behavior are unchanged.

## Alternatives considered

- **Keep permission-gated weather ambience** — rejected because the user explicitly requested removal
  of weather and permission prompts.
- **Keep weather code disabled behind a flag** — rejected because dead privacy-sensitive code is easy
  to accidentally re-enable and still requires documentation.
- **Static decorative ambience with no weather API** — deferred; it could be added later without
  geolocation if the design needs more motion.

## References

- `src/components/layout/greeting-chip.tsx`
- `next.config.mjs`
- `docs/PRIVACY.md`
- `messages/*.json`
