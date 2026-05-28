# Roadmap

A living, lightweight list of things planned. No firm dates — this is a personal site.

## Now (this quarter)

- [ ] Lighthouse CI workflow with route budgets.
- [ ] Per-route OpenGraph image generator (currently one shared image).
- [ ] Distributed rate-limit backend (Upstash / KV) for the contact API.
- [ ] Replace the raw `<img>` fallback chain in `company-logo.tsx` with `next/image`
      loaders.

## Next (medium-term)

- [ ] MDX content for the `/lab` concepts section (currently flat TS).
- [ ] Visitor-language analytics (privacy-safe, server-side aggregate) so we can prioritise
      which locales to keep polishing.
- [ ] Crowd-translate workflow for Sanskrit (`sa`) and Russian (`ru`) message gaps.
- [ ] Translate the technical diagram captions (currently English-only SVG `<text>`).

## Later (someday-maybe)

- [ ] Live RSS reader on `/feeds` (currently surfaces three feeds).
- [ ] Public uptime status page.
- [ ] Additional theme variants beyond `dark` / `light` / `phoenix`.

## Done

- [x] Switch to Next.js 16 App Router + Tailwind 4 + React 19.
- [x] Multilingual content via next-intl with `localePrefix: "never"` — URLs are
      identical across all six locales.
- [x] Cinematic Phoenix theme as the default surface.
- [x] Command palette (⌘K / Ctrl+K) with project, action, and locale-aware navigation.
- [x] Contact form via Resend + Zod 4 + rate limit + honeypot, with localized error
      messages.
- [x] Playwright e2e for navigation, contact, a11y, and i18n.
- [x] Vitest unit tests for `src/lib/*` (lines 98%, branches 85%, funcs 93%).
- [x] CSP, HSTS preload, COOP/CORP and `Permissions-Policy` shipped in `next.config.mjs`.
- [x] Pause off-screen animations, GPU-promote marquee, gate all demo timers on
      `prefers-reduced-motion`.
- [x] AI/LLM adapter files (`AGENTS.md`, `llms.txt`, `.cursor/rules/`, copilot-instructions).

> Open an [issue](../../issues) if you'd like to discuss anything on this list.
