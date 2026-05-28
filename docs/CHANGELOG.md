# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Phoenix favicon (`src/app/icon.jpg`, `src/app/apple-icon.jpg`).
- Full demo-control localization (algolens, xmai, xcelium, tezos, posture, track-person,
  smart-brain) under a new `demos.*` namespace.
- Translated contact-form validation errors via short Zod codes mapped to
  `contact.form.errors.*` on the client.
- AI/LLM adapter files: `AGENTS.md`, `llms.txt`, `llms-full.txt`, `.cursor/rules/`,
  `.github/copilot-instructions.md`.
- Content-Security-Policy header (`next.config.mjs`).
- `setRequestLocale(locale)` in every page so SSG knows the active locale.

### Changed

- **i18n architecture:** switched `next-intl` from `localePrefix: "as-needed"` to
  `localePrefix: "never"`. Every page renders at one canonical URL across all six locales;
  switching language updates content + cookie + `<html lang>` without changing the URL.
- Sitemap now emits one URL per route (no locale fan-out) since URLs are locale-agnostic.
- `.dark` palette is now a real CSS selector — previously dark mode worked only by
  accident via the `:root` default.
- ConceptLabs intro uses one rich-text translation key instead of three glued sentences.
- Mobile action bar, command menu, recruiter banner, and `/lab` redirect now use
  `@/i18n/navigation` so locale context isn't lost on navigation.
- CI workflows pinned to `.node-version` instead of a hardcoded major.

### Fixed

- CODEOWNERS pattern (`-` → `*`) so PRs auto-request review.
- SmartBrain demo: inference log no longer floods (every-frame push) — uses a stage ref.
- XceliumDemo: removed dead `auto`/`Play/Pause` state that never animated anything.
- All project demos now honour `prefers-reduced-motion` (timers and tickers no-op or
  jump to final state).
- `/lab` redirect preserves the active locale.
- Stray `sr-only` span at the end of `AboutSection`.

### Removed

- `/lab` from the sitemap (it 308-redirects to `/competitive-programming`).
- Unimplemented Upstash env vars from `.env.example`.

### Security

- Content-Security-Policy header added (`default-src 'self'` with explicit allow-list
  for GitHub avatars, Clearbit, Google s2 favicons).
- `npm audit` re-enabled locally so contributors see advisories on install.

### Performance

- `setRequestLocale` enables static generation for content pages.
- Demos jump straight to the final visual when `prefers-reduced-motion` is set, instead
  of running their setInterval ticker.
