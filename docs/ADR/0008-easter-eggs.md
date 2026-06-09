---
id: 0008
title: Ship a discoverable easter-egg layer
date: 2026-05-31
status: Accepted
owners:
  - "@blackphoenix42"
tags: [ux, i18n, gamification]
---

# 0008 — Ship a discoverable easter-egg layer

## Context

A personal portfolio is read at most once by any given recruiter. Static
content does the heavy lifting on the first pass, but for engineers who keep
the tab open — or come back via the GitHub README — a second, more playful
layer pays off: it signals craft, attention to detail, and a sense of humour
without compromising the formal reading.

The constraints were stiff:

- No new cookies (the site sets exactly one, `NEXT_LOCALE`).
- No analytics. No telemetry. The Easter-egg layer cannot phone home.
- i18n discipline: all user-visible strings flow through `messages/<locale>.json`.
- Performance budget: nothing eager-loads outside the existing bundles.
- Accessibility: every animation gates on `useReducedMotion()`.
- Strict TypeScript with `noUncheckedIndexedAccess`.
- Test coverage thresholds (90/90/90/80 on `src/lib/**`).

## Decision

Ship a 22-egg layer organised into five tiers of escalating obscurity:

1. **Surface** — console banner, HTML comment, `/humans.txt`, the 404
   mini-game (Phoenix Runner + Feather Catch).
2. **Keyboard / interaction** — Konami code, "phoenix"/"matrix"/"terminal"
   typed anywhere, 5× Shift+click on the logo.
3. **Content / locale** — Sanskrit locale visit, polyglot (all 6 locales),
   theme cycler, devtools-open heuristic.
4. **Treasure** — hidden routes `/phoenix` and `/credits`, three-page haiku
   trail, CSS `::selection` reveal, matrix-rain overlay, OG-image QR.
5. **Meta** — trophy-room visit, completionist.

All progress is stored in a single `localStorage` key (`phoenix:eggs:v1`) so
no new cookie is required and GDPR consent remains a soft banner. Progress
can be shared as a base-36 URL fragment that a friend can open to preview
without affecting their own state. The catalogue itself lives in `docs/EGGS.md`.

## Consequences

### Positive

- Adds delight without affecting the resume-grade first impression: every
  egg is opt-in, and none reflows the layout.
- All logic is pure (`src/lib/eggs.ts`) and covered by unit tests.
- Animations respect reduced-motion.
- Localized chrome across all six languages, with English fallback via the
  existing `request.ts` deep-merge.
- Zero new server endpoints, zero new cookies, zero analytics.

### Negative

- Bundle gains a few KB of client code (provider, watchers, route-mounted
  components). All heavy demos (matrix rain, terminal, dino game) are
  client-only components mounted inside the locale layout — acceptable.
- Translations of catalogue copy are partial: only the UI chrome is fully
  localized in non-English locales; egg titles/hints fall back to English
  via the existing deep-merge in `src/i18n/request.ts`. This is acceptable
  for content that is itself a developer culture reference.

### Neutral

- Devtools-open detection uses the classic window-size heuristic; it is
  not exact but it is harmless (false positives just unlock an egg early).
- The OG-QR egg requires that the social-preview render embed a QR pointing
  at `/secret?via=og`. The QR is generated at edge-render time via
  `qrcode-generator` (pure JS, edge-safe).
- **Static-file eggs need content negotiation.** A plain `.txt` file can't
  run JS, and the referrer trick (unlock when the previous page was the txt
  file) almost never fires — the Back button and address-bar navigations
  don't set the referrer. `/humans.txt` is therefore a route handler that
  returns plain text to crawlers/curl and a styled HTML page (with an inline
  `localStorage` unlock) to real browser navigations, keyed on
  `Sec-Fetch-Mode: navigate`. `/robots.txt` was **deliberately left plain
  text for every client** — serving HTML to a crawler would break the
  robots contract — so its egg is reachable only via the console `robots()`
  helper. This is the one egg that a determined hunter can't get purely by
  "visiting", which we accept as the cost of not risking SEO.

## Alternatives considered

- **Server-tracked progress** — rejected. Requires a database, auth, and
  privacy review; conflicts with the no-analytics rule.
- **A single hidden URL with a list of eggs** — rejected. Less playful,
  removes the discovery loop.
- **Cookie-based progress** — rejected. Adds a new cookie and turns the
  soft consent banner into a hard GDPR gate.
- **Analytics-detected eggs** (e.g. fire a `track('konami')` and unlock
  centrally) — rejected. Violates the no-third-party-script rule.

## References

- `src/lib/eggs.ts` — registry, codec, Konami matcher.
- `src/components/eggs/*` — provider, listeners, demos, trophy room.
- `src/app/[locale]/secret/page.tsx` — the trophy room route.
- `docs/EGGS.md` — full catalogue.
