---
id: "0004"
title: Adopt next-intl for multilingual UI with English fallback
date: 2025-01-13
status: Accepted
owners:
  - "@blackphoenix42"
tags: [i18n, next-intl, routing, accessibility]
---

# 0004 — Adopt next-intl for multilingual UI with English fallback

## Context

The portfolio targets a global audience (engineering recruiters in India, Japan, China,
Russia and beyond). English-only content was a barrier. We needed an i18n solution that:

- Works natively with Next.js 16 App Router and Turbopack.
- Supports server-rendered translations (no client JS hop for first paint).
- Allows URL-prefixed locales for SEO + a hidden default (English at `/`, others at `/{locale}/...`).
- Detects locale from `Accept-Language` on first visit and persists the user's choice in a cookie.
- Falls back silently to English for any missing translation key (production safety).
- Plays well with edge runtime and static prerendering across all locales.

Locales chosen: `en` (default), `hi`, `ja`, `sa` (Sanskrit), `zh`, `ru`.

## Decision

Use **next-intl 4** with:

- `localePrefix: "never"` — **the URL never carries a locale segment**. Every page lives
  at a single canonical path (`/about`, `/work/xmai`, …) and the rendered content swaps
  based on the resolved locale. This avoids duplicate URLs and gives the user a stable
  bookmark/share story regardless of language.
- `localeDetection: true` — `NEXT_LOCALE` cookie wins, then `Accept-Language`, then default.
- Proxy (Next 16 rename of middleware) wires locale resolution at the edge.
- `src/i18n/request.ts` deep-merges `messages/en.json` (base) with `messages/{locale}.json` (overlay)
  so partial locales silently fall back to English keys.
- `src/i18n/navigation.ts` exposes a locale-aware `Link`, `useRouter`, `usePathname`, `redirect`.
- A `LanguageSwitcher` (globe icon dropdown) in the site header calls
  `router.replace(pathname, { locale })` followed by `router.refresh()`: the cookie is
  rewritten and server components re-render with the new translations, all without a
  visible URL change.
- All routes live under `src/app/[locale]/`; `/api/contact` stays at the top level.
- `src/app/layout.tsx` reads `getLocale()` to set `<html lang>`; `src/app/[locale]/layout.tsx`
  wraps content in `<NextIntlClientProvider>`. Every page calls `setRequestLocale(locale)`
  so static generation knows which messages to bake.

## Consequences

### Positive

- Server-rendered translations across all 6 locales.
- Single canonical URL per page → simpler SEO, no duplicate-content concerns, no need to
  maintain hreflang alternates by hand.
- Silent English fallback means adding new keys never breaks non-English locales.
- A11y improved: `lang` attribute matches the active locale.
- Native Next 16 ergonomics: typed locale routes, `setRequestLocale` for static rendering.
- Users can share `/work/xmai` with anyone in the world; the visitor gets it in their
  preferred language without needing to swap the URL.

### Negative

- Adds 19 transitive dependencies.
- Every route file moves from `src/app/...` to `src/app/[locale]/...` (one-time migration).
- Authors must keep `messages/*.json` keys in sync (mitigated by deep-merge fallback).
- Sanskrit (`sa`) translations are best-effort and may need community review.
- Because URLs don't encode locale, pages with `localeDetection: true` cannot be fully
  pre-rendered at one URL — the proxy must run per request to set the cookie. Mitigated
  by `revalidate = 3600` ISR on heavy pages.

### Neutral

- Content data files (`src/content/*.ts`) — project descriptions, experience bullets,
  certification lists — remain in English in this revision. They will be migrated to
  locale-aware data sources in a follow-up; the i18n machinery is ready to absorb them.

## Alternatives considered

- **react-i18next** — Mature but adds client-side bundle weight and lacks first-class
  App Router + RSC support. Rejected.
- **Built-in Next.js `i18n` config (pages router)** — Deprecated in App Router. Rejected.
- **lingui** — Strong tooling but the message-catalog compile step adds CI overhead and
  reduces flexibility for partial overlays. Rejected.
- **DIY locale switcher with simple JSON imports** — No SSR awareness, no automatic
  detection, no cookie persistence. Rejected.

## References

- next-intl docs: https://next-intl.dev/docs/getting-started/app-router
- Next.js 16 proxy convention: https://nextjs.org/docs/messages/middleware-to-proxy
- BCP 47 locale tags: https://www.rfc-editor.org/info/bcp47
