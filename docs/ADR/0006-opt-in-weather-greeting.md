---
id: 0006
title: Make weather greeting explicitly opt-in
date: 2026-05-30
status: Superseded by ADR-0007
owners:
  - "@blackphoenix42"
tags:
  - privacy
  - personalization
  - csp
  - i18n
---

# 0006 — Make weather greeting explicitly opt-in

> Superseded by [ADR-0007](./0007-remove-weather-greeting.md), which removed weather/geolocation
> from the greeting entirely.

## Context

The header greeting can feel more alive if it reacts not only to local time, but also to the
visitor's weather. Real weather requires location data and an external service, so it changes the
privacy and security posture more than the local-clock greeting in ADR-0005.

The site already has strict defaults: `connect-src 'self'`, `geolocation=()`, one cookie
(`NEXT_LOCALE`), and no tracking scripts beyond Vercel's cookie-less analytics surfaces.

## Decision

Weather in the greeting chip is opt-in. The site asks for browser geolocation only after the visitor
clicks the weather button inside the greeting popover. If permission is granted, the client rounds
coordinates to two decimals, calls Open-Meteo directly, maps WMO weather codes to a small set of
localized copy keys, and renders subtle ambient weather motion.

The site does not store coordinates, does not set weather cookies, does not infer location from IP,
and does not show the exact location or exact coordinates in the UI.

## Consequences

### Positive

- Adds playful, local-feeling personalization without prompting on page load.
- Keeps weather data flow transparent: browser permission, rounded coordinates, Open-Meteo only.
- Avoids API keys and new server-side secrets because Open-Meteo works without authentication.
- Keeps all weather copy in `messages/*.json` and weather mapping in a tested utility.

### Negative

- Requires relaxing `Permissions-Policy` from `geolocation=()` to `geolocation=(self)`.
- Requires adding `https://api.open-meteo.com` to `connect-src`.
- Weather can be unavailable if the browser denies permission, the network fails, or Open-Meteo is down.

### Neutral

- The greeting remains fully useful without weather; denied/unavailable states fall back to the
  time-of-day greeting.
- Coordinates are rounded client-side before being sent, which trades some precision for privacy.

## Alternatives considered

- **IP-based weather** — rejected because IP location is less transparent and less privacy-friendly.
- **Automatic geolocation prompt on page load** — rejected because a portfolio greeting should not
  interrupt first paint or surprise the visitor.
- **Manual city setting** — deferred; it avoids geolocation but adds settings UI and local storage.
- **Weather as decorative-only ambience** — simpler and most private, but it cannot truthfully say
  whether it is raining, chilly, or sunny.

## References

- `src/components/layout/greeting-chip.tsx`
- `src/lib/weather.ts`
- `next.config.mjs`
- `messages/*.json`
- `docs/PRIVACY.md`
