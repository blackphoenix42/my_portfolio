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

- `localePrefix: "as-needed"` — English at root URLs, all other locales prefixed.
- `localeDetection: true` — Accept-Language detection + automatic `NEXT_LOCALE` cookie persistence.
- Proxy (Next 16 rename of middleware) wires locale resolution at the edge.
- `src/i18n/request.ts` deep-merges `messages/en.json` (base) with `messages/{locale}.json` (overlay)
  so partial locales silently fall back to English keys.
- `src/i18n/navigation.ts` exposes a locale-aware `Link`, `useRouter`, `usePathname`.
- A `LanguageSwitcher` (globe icon dropdown) in the site header preserves the current path
  when switching locales.
- All routes live under `src/app/[locale]/`; `/api/contact` stays at the top level.
- `src/app/layout.tsx` reads `getLocale()` to set `<html lang>`; `src/app/[locale]/layout.tsx`
  wraps content in `<NextIntlClientProvider>`.

## Consequences

### Positive

- Server-rendered translations across all 6 locales with full static prerender (102 pages).
- SEO-friendly hreflang via `sitemap.ts` emitting one URL per locale per route.
- Silent English fallback means adding new keys never breaks non-English locales.
- A11y improved: `lang` attribute matches the active locale.
- Native Next 16 ergonomics: typed locale routes, `setRequestLocale` for static rendering.

### Negative

- Adds 19 transitive dependencies.
- Every route file moves from `src/app/...` to `src/app/[locale]/...` (one-time migration).
- Authors must keep `messages/*.json` keys in sync (mitigated by deep-merge fallback).
- Sanskrit (`sa`) translations are best-effort and may need community review.

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
