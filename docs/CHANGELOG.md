# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Quote refresh hint** — the rotating motivational / funny quote card now
  includes a subtle localized "wait 30s for a new motivational or funny quote"
  caption and a focused component test for the timer behavior.
- **Weather/geolocation removal** — removed the experimental greeting weather
  path, Open-Meteo client fetch, browser location prompt, weather utility/tests,
  privacy table row, and `geolocation=(self)` permission. ADR-0007 records the
  removal decision.
- **Local-time greeting chip** — small cloud-icon button next to the brand
  name in the header. Pops a localized "Good morning / afternoon / evening /
  night" card that welcomes visitors and invites them to explore the
  portfolio. The time-of-day bucket is computed entirely in the browser, with
  no visible clock, no IP geolocation, and no extra cookie. Auto-opens on visit,
  dismissible with click-outside / `Esc`, fully translated across all six
  locales and gated on `useReducedMotion()`.
- **Vercel Web Analytics + Speed Insights** wired into the root layout. Both
  are cookie-less and GDPR-exempt; they report page views and real-user
  Core Web Vitals from production.
- **Contact form attachments** — drag-and-drop, 5 files / 10 MB total,
  PDF / images / DOCX / TXT / MD, image previews. Multipart `POST /api/contact`,
  forwarded to Resend.
- **"Other" role specify field** — when the role pill picker selects "Other",
  a free-text input appears and is required (min 2, max 80 chars).
- **Email autocomplete inline hint** — subtle copy under the email input
  explains the Tab-to-accept domain autocomplete.
- **Full keyboard-shortcut layer** — `?` opens a help overlay. Shortcuts cover
  navigation (`g h`/`g w`/…), actions (`t`/`r`/`l`/`e`/`d`), section jumps
  (`j`/`k`), search (`/`, `⌘K`), and `Esc` to close overlays.
- **Consolidated header settings menu** — gear icon collapses the old
  Language + Recruiter + Theme + Resume row into a single dropdown with
  inline theme picker and a Language submenu.
- **Soft cookie consent banner** — informational, dismissable, with a
  Privacy link. Language switcher works immediately regardless of consent.
- **`/privacy` route** — full privacy policy page with third-party services
  table, rendered from `messages/*.json` so it's fully translated.
- **Web App Manifest** (`/manifest.webmanifest`) — PWA-friendly install
  metadata with the phoenix icon.
- **BreadcrumbList + CreativeWork JSON-LD** on project case-study pages.
- **Per-project metadata** — proper canonical URL, OG image, twitter card.
- **Rate-limit UX** — server emits `Retry-After` + `X-RateLimit-*` headers;
  the form renders a live countdown on the submit button.
- **Improved 404 page** — phoenix ASCII art, suggested routes, and a
  Back / Home / Command-palette action row.
- **`setRequestLocale(locale)`** in every page so SSG knows the active locale.
- Phoenix favicon (`src/app/icon.jpg`, `src/app/apple-icon.jpg`).
- Full demo-control localization (algolens, xmai, xcelium, tezos, posture,
  track-person, smart-brain) under a new `demos.*` namespace.
- Translated contact-form validation errors via short Zod codes mapped to
  `contact.form.errors.*` on the client.
- AI/LLM adapter files: `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `llms-full.txt`,
  `.cursor/rules/portfolio.mdc`, `.github/copilot-instructions.md`.
- Content-Security-Policy header (`next.config.mjs`).

### Changed

- **`SITE.url` switched to `https://binaryphoenix.vercel.app`** (the live
  deployment). All canonical URLs, OG metadata, sitemap, manifest, and JSON-LD
  follow.
- **i18n architecture:** switched `next-intl` from `localePrefix: "as-needed"`
  to `localePrefix: "never"`. Every page renders at one canonical URL across
  all six locales; switching language updates content + cookie + `<html lang>`
  without changing the URL.
- **Sitemap** now emits one URL per route (no locale fan-out) since URLs are
  locale-agnostic.
- **Project demos lazy-loaded via `next/dynamic` + `ssr: false`** in a
  client-only wrapper (`project-demo.tsx`). One demo's JS per case study,
  instead of all seven bundled together.
- **Contact role enum:** `Collaboration` → `Collaborator` (grammatically a role).
- **Contact API now accepts multipart** in addition to JSON. The route reads
  attachments via `request.formData()`, validates type + size + count, and
  forwards them to Resend with the right buffer.
- **Resend wrapper** now inspects `{ data, error }` and throws on API-level
  failures (silent-error bug fix — see Fixed).
- **`.dark` palette** is now a real CSS selector — previously dark mode worked
  only by accident via the `:root` default.
- **ConceptLabs intro** uses one rich-text translation key instead of three
  glued sentences.
- **Mobile action bar, command menu, recruiter banner, and `/lab` redirect**
  now use `@/i18n/navigation` so locale context isn't lost on navigation.
- **CI workflows** pinned to `.node-version` instead of a hardcoded major.
- **Footer "Built with"** block redesigned as small chips with tech glyphs.

### Fixed

- **Resend silent-error bug** — `resend.emails.send()` returns `{ data, error }`
  and does not throw on API-level errors (unverified domain, invalid sender,
  etc.). The wrapper now surfaces the error so failures don't become silent
  200s in production logs.
- **Browser autofill blue background** — Chromium injects a hard-to-override
  light blue background on autofilled inputs. Killed via a `box-shadow` /
  `-webkit-text-fill-color` reset scoped to `.contact-input` so we don't
  clobber third-party form widgets.
- **CODEOWNERS pattern** (`-` → `*`) so PRs auto-request review.
- **SmartBrain demo:** inference log no longer floods (every-frame push) —
  uses a stage ref.
- **XceliumDemo:** removed dead `auto` / `Play/Pause` state that never animated
  anything.
- **All project demos** now honour `prefers-reduced-motion` (timers and tickers
  no-op or jump to final state).
- **`/lab` redirect** preserves the active locale.
- **Stray `sr-only` span** at the end of `AboutSection`.

### Removed

- `LanguageSwitcher` + `ThemeToggle` deleted (functionality moved into the
  new `SettingsMenu`).
- `/lab` from the sitemap (it 308-redirects to `/competitive-programming`).
- Unimplemented Upstash env vars from `.env.example`.

### Security

- **Content-Security-Policy** header added (`default-src 'self'` with explicit
  allow-list for GitHub avatars, Clearbit, Google s2 favicons).
- `npm audit` re-enabled locally so contributors see advisories on install.

### Performance

- **Lazy-loaded project demos** via `next/dynamic` — only the demo for the
  currently visited project ships JS to the browser.
- **`setRequestLocale`** enables static generation for content pages.
- **Pre-connect** to GitHub avatars + logo CDN fallbacks (saves ~150 ms on
  first repo-card paint).
- **ISR** added to `/privacy` (revalidate weekly — content is essentially static).
- **Demos** jump straight to the final visual when `prefers-reduced-motion` is
  set, instead of running their `setInterval` ticker.
