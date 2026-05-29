# Agent handoff — Portfolio1 session

> **Purpose:** Give another AI agent (or human) full context on what was requested,
> what was implemented, what is still uncommitted, known console/build noise, and
> how to continue safely. Generated **2026-05-29** from a Cursor session on
> **Ayush Yadav's** personal portfolio (`LICENSE`: proprietary).

**Prior conversation transcript:**  
`C:\Users\aayus\.cursor\projects\c-Users-aayus-Desktop-Portfolio1\agent-transcripts\620437a8-bb83-4f78-aea8-ae325898d056\620437a8-bb83-4f78-aea8-ae325898d056.jsonl`

**Canonical agent rules:** [`AGENTS.md`](../AGENTS.md) (read before editing).

---

## 1. What the user asked for (original intent)

The work started as a **full-repo code review**, then became “fix everything” with explicit product asks:

| Area            | Request                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Quality         | Zero errors and zero warnings across format, lint, typecheck, unit tests, build                                                                  |
| i18n            | **URL must not change** when switching language; content should translate in place                                                               |
| Performance     | App felt slow — lazy-load demos, caching/SSG where appropriate                                                                                   |
| Contact         | Autocomplete hint, `Collaborator` role, “Other” free-text, drag-and-drop attachments (5 files / 10 MB), autofill blue-bg fix, Resend attachments |
| UX              | Keyboard shortcuts + `?` help, consolidated header settings menu, soft cookie banner, improved 404, clickable project cards                      |
| SEO             | Canonical `https://binaryphoenix.vercel.app`, sitemap, JSON-LD, manifest, privacy page                                                           |
| Analytics       | Vercel Web Analytics + Speed Insights (cookie-less only)                                                                                         |
| AI adaptability | `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `.cursor/rules/`, copilot instructions                                                                     |
| Favicon         | Use phoenix logo (`public/assets/logos/phoenix.jpg` → `src/app/icon.jpg`)                                                                        |
| Bugs            | Resend `{ data, error }` silent failures; rate-limit UX; build font fetch failures                                                               |

**Content integrity (non-negotiable):** Do not invent employers, metrics, or testimonials. Facts live only in `src/content/*.ts`.

---

## 2. Stack (do not “upgrade” casually)

| Layer      | Choice                                                             |
| ---------- | ------------------------------------------------------------------ |
| Framework  | Next.js **16** App Router (Turbopack build)                        |
| UI         | React **19**, TypeScript **6** strict + `noUncheckedIndexedAccess` |
| Styling    | Tailwind CSS **4**, design tokens in `src/app/globals.css`         |
| i18n       | **next-intl 4** with `localePrefix: "never"`                       |
| Validation | Zod **4** (`src/lib/validation.ts`)                                |
| Email      | Resend (`src/lib/email.ts`)                                        |
| Tests      | Vitest (unit) + Playwright (e2e)                                   |
| Motion     | framer-motion — **must** gate on `useReducedMotion()`              |

**Locales:** `en`, `hi`, `ja`, `sa`, `zh`, `ru` — defined in `src/i18n/routing.ts`.

**Canonical site URL:** `https://binaryphoenix.vercel.app` (`src/content/profile.ts` → `SITE.url`).

---

## 3. Load-bearing architecture decisions

### 3.1 URL-stable i18n (`localePrefix: "never"`)

- Every page is served at **one path** for all locales (e.g. `/privacy`, not `/hi/privacy`).
- Active locale: `NEXT_LOCALE` cookie + `Accept-Language` on first visit.
- Language switcher: `router.replace(pathname, { locale })` + `router.refresh()` in `src/components/layout/settings-menu.tsx`.
- **Always** use `@/i18n/navigation` (`Link`, `useRouter`, …) — never raw `next/link` / `next/navigation` for internal routes.
- Every `src/app/[locale]/**/page.tsx` must `await params`, call `setRequestLocale(locale)`, and use `getTranslations`.

**Do not** reintroduce `/hi/...` or `/en/...` URL prefixes.

### 3.2 Cookies and analytics

- **Only cookie the app sets:** `NEXT_LOCALE`.
- **Only analytics:** Vercel Analytics + Speed Insights in `src/app/layout.tsx` (no GA/Plausible/etc.).
- Soft informational cookie banner: `src/components/layout/cookie-consent.tsx` (not a hard GDPR gate).

### 3.3 Server vs client

- Server Components by default; `"use client"` only when needed.
- Project demos: lazy-loaded via `src/components/projects/project-demo.tsx` (`next/dynamic`, `ssr: false`).
- Demo slug list (server-safe): `src/components/projects/demo-slugs.ts`.

### 3.4 Security

- CSP and other headers in `next.config.mjs`.
- No new `dangerouslySetInnerHTML` except Person JSON-LD in `src/app/[locale]/layout.tsx`.

---

## 4. What was implemented (summary)

Detailed changelog: [`docs/CHANGELOG.md`](./CHANGELOG.md) → `## [Unreleased]`.

### Added

- Vercel Analytics + Speed Insights (root layout)
- Contact attachments (multipart API, Resend forwarding, `attachment-field.tsx`)
- “Other” role specify field; email autocomplete hint
- Full keyboard shortcuts + `?` overlay (`keyboard-shortcuts.tsx`)
- Consolidated **Settings** menu (language, theme, shortcuts) — replaced standalone `LanguageSwitcher` + `ThemeToggle`
- Soft cookie consent + `/privacy` page (translations in `messages/*.json`)
- PWA manifest (`src/app/manifest.ts`)
- BreadcrumbList + CreativeWork JSON-LD on project pages
- Rate-limit countdown UX on contact submit
- Improved locale-aware 404 + root `src/app/not-found.tsx`
- Phoenix favicon (`src/app/icon.jpg`, `apple-icon.jpg`)
- AI agent docs: `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `llms-full.txt`, `.cursor/rules/portfolio.mdc`
- Playwright i18n tests: `tests/i18n.spec.ts`
- CSP header

### Changed

- `SITE.url` → `binaryphoenix.vercel.app`
- i18n: `localePrefix: "as-needed"` → **`"never"`**
- Sitemap: one URL per route (no locale fan-out)
- Lazy project demos; `Collaboration` → `Collaborator`
- Contact API: JSON + **multipart**
- Resend wrapper throws on API errors
- System font stack (removed `next/font/google` — fixes offline/CI font fetch failures)
- Footer “Built with” chips
- `package.json`: `"type": "module"` (Node module detection for Tailwind config)
- `.npmrc`: `audit=true`

### Fixed (highlights)

- Resend silent 200s on API errors
- Chromium autofill blue background (`.contact-input` in `globals.css`)
- Demo reduced-motion regressions; SmartBrain log flood; dead Xcelium state
- `CODEOWNERS` pattern
- Project cards fully clickable (`featured-work.tsx`, work listing)

### Removed

- `language-switcher.tsx`, `theme-toggle.tsx` (merged into settings menu)
- Upstash env vars from `.env.example` (in-memory rate limit only)

---

## 5. Key files map (where to look)

| Path                                                 | Role                                                  |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `AGENTS.md`                                          | Single source of truth for agents                     |
| `src/content/*.ts`                                   | Authoritative projects, experience, metrics           |
| `messages/en.json`                                   | Source of truth for UI strings                        |
| `src/i18n/routing.ts`                                | Locales + `localePrefix: "never"`                     |
| `src/i18n/navigation.ts`                             | Locale-aware Link/router                              |
| `src/proxy.ts`                                       | next-intl proxy (Next 16 middleware rename)           |
| `src/app/layout.tsx`                                 | Root `<html lang>`, analytics, `data-scroll-behavior` |
| `src/app/[locale]/layout.tsx`                        | Intl provider, theme, JSON-LD                         |
| `src/app/api/contact/route.ts`                       | POST contact + attachments                            |
| `src/lib/validation.ts`, `email.ts`, `rate-limit.ts` | Backend logic + coverage thresholds                   |
| `src/components/layout/settings-menu.tsx`            | Language/theme/settings                               |
| `src/components/contact/contact-form.tsx`            | Contact UX                                            |
| `docs/CHANGELOG.md`                                  | Unreleased release notes                              |
| `docs/PRIVACY.md`                                    | Privacy policy source (also in messages)              |

---

## 6. Environment variables (`.env.example`)

```env
NEXT_PUBLIC_SITE_URL=https://binaryphoenix.vercel.app
RESEND_API_KEY=
CONTACT_TO_EMAIL=aayush.sang@gmail.com
CONTACT_FROM_EMAIL="Ayush Portfolio <onboarding@resend.dev>"
GITHUB_TOKEN=          # optional, workbench rate limits
NEXT_PUBLIC_SHOW_PHONE=false
NEXT_PUBLIC_PHONE=
```

**Resend note:** Dev sender often uses `onboarding@resend.dev`; production needs verified domain or sends fail (now surfaced as errors, not silent 200s).

---

## 7. Quality gate (must pass before “done”)

```sh
npm run format && npm run lint && npm run lint:md && \
  npm run typecheck && npm test -- --run && npm run build
```

CI also runs Playwright e2e, axe, CodeQL, dependency-review, `npm audit`.  
**Policy:** `--max-warnings=0` everywhere.

E2e (requires build first or `test:e2e:build`):

```sh
npm run test:e2e
```

Coverage thresholds (Vitest): 90/90/90/90 lines/statements/functions, 80% branches on `src/lib/**` + `email-field.tsx`.

---

## 8. Git state at handoff (uncommitted)

Last commits on branch:

```
dfe4305 chore: update .env.example and .npmrc, add AGENTS.md and CLAUDE.md documentation
787e34d test(feeds): cover formatRelative locale branches
c89fe4e chore: relax MD060; silence chrome-extension console noise; initial=false on motion diagrams
4e51b4a fix: enhance error handling in useSilenceMissingMessage
f33003b feat(i18n): implement internationalization support across components
```

**Large uncommitted working tree** (not yet committed as of handoff):

- Modified: `.env.example`, `AGENTS.md`, `README.md`, `docs/CHANGELOG.md`, `docs/PRIVACY.md`, `llms.txt`, `messages/en.json`, `package.json`, many `src/app/**`, `src/components/**`, `src/lib/**`, `tests/i18n.spec.ts`, etc.
- New (untracked): `src/app/[locale]/privacy/`, `src/app/manifest.ts`, `src/app/not-found.tsx`, `settings-menu.tsx`, `cookie-consent.tsx`, `keyboard-shortcuts.tsx`, `attachment-field.tsx`, `project-demo.tsx`, `demo-slugs.ts`, …
- Deleted: `language-switcher.tsx`, `theme-toggle.tsx`
- **Do not commit** `coverage/`, `playwright-report/`, `test-results/` (artifacts)

**User rule:** Only commit when the user explicitly asks.

---

## 9. Known console / dev noise (from terminal logs)

These were observed during `npm run dev` / manual browsing. Treat as triage notes for the next agent.

### 9.1 RSC fetch to locale-prefixed URLs

```
Failed to fetch RSC payload for http://localhost:3000/hi/privacy
Failed to fetch RSC payload for http://localhost:3000/en/privacy
```

- **Context:** Routing is `localePrefix: "never"` — valid URL is `/privacy`, not `/hi/privacy`.
- **Likely cause:** Stale client navigation, cached RSC requests, or next-intl client router still requesting prefixed paths during locale switch before refresh completes.
- **Investigate:** `settings-menu.tsx` `switchLocale`, `@/i18n/navigation` `router.replace` + `refresh`, and any hardcoded `/en/` or `/hi/` links in tests/bookmarks.
- **File implicated in stack:** `src/components/layout/intl-client-provider.tsx` (line ~37 is the patched `console.error` forwarder, not the root cause).

### 9.2 Hydration mismatch on bogus routes (e.g. `/contact1`)

```
A tree hydrated but some attributes of the server rendered HTML didn't match...
  <html lang="en" - data-scroll-behavior="smooth">
  <body - className="bg-bg text-fg min-h-dvh antialiased" + inline styles>
```

- **Cause:** `src/app/not-found.tsx` (`RootNotFound`) renders a **minimal standalone** `<html>/<body>` with inline styles and **without** `data-scroll-behavior` or Tailwind body classes, while the main app layout uses them (`src/app/layout.tsx`).
- **Also:** Stack traces reference `chrome-extension://...` (e.g. MetaMask) — partially filtered in `intl-client-provider.tsx` but extensions can still cause false-positive hydration warnings.
- **Possible fix:** Align root 404 markup with root layout attributes, or accept as dev-only noise for routes outside `[locale]`.

### 9.3 `data-scroll-behavior` Next.js warning

```
Detected scroll-behavior: smooth on <html>. Add data-scroll-behavior="smooth"
```

- Root layout **already sets** `data-scroll-behavior="smooth"` on `<html>` (`src/app/layout.tsx:64`).
- Warning may appear on **root 404** path where that attribute is missing (see 9.2).
- Playwright asserts the attribute on `/` with Hindi Accept-Language: `tests/i18n.spec.ts`.

### 9.4 Browser extension script warnings

```
Encountered a script tag while rendering React component...
chrome-extension://ookjlbkiijinhpmnjffcofjonbfbgaoc/scripts/inpage.js
```

- Filtered in `useSilenceMissingMessage` in `intl-client-provider.tsx` for `chrome-extension://` strings.
- Not an app bug — disable wallet extensions when debugging if noise persists.

### 9.5 Build: `DEP0205` deprecation

```
(node:16620) [DEP0205] DeprecationWarning: module.register() is deprecated.
Use module.registerHooks() instead.
```

- Comes from Node 22 + Next/TypeScript loader chain.
- All npm scripts (`dev`, `build`, `start`, `test`, `test:e2e`, `a11y`) now wrap with `cross-env NODE_OPTIONS=--disable-warning=DEP0205` so the warning is suppressed at the entry point.

### 9.6 Slow first compile of `/_not-found`

```
GET /contact1 404 in 10.3s (next.js: 8.7s compile...)
```

- Dev-only Turbopack compile cost on first 404 hit; not necessarily a production issue.

---

## 10. Session todo list (all marked completed in Cursor)

| ID         | Task                         | Status                                           |
| ---------- | ---------------------------- | ------------------------------------------------ |
| fonts      | Remove `next/font/google`    | Done                                             |
| tip        | Fix email-hint layout        | Done                                             |
| autofill   | Autofill blue-bg fix         | Done                                             |
| dropprompt | Fix `Drag &amp; drop` entity | Done                                             |
| settings   | Settings menu cleanup        | Done                                             |
| 404root    | Root `not-found.tsx`         | Done                                             |
| ogedge     | OG image runtime (kept edge) | Done                                             |
| cards      | Clickable project cards      | Done                                             |
| resend     | Resend dev fallback + errors | Done                                             |
| qa         | Full quality gate green      | Done (at end of session; re-run after new edits) |

---

## 11. Hard rules for the next agent

1. **Never** change `localePrefix` from `"never"`.
2. **Never** invent content not in `src/content/*.ts`.
3. **Never** add analytics scripts or extra cookies.
4. **Never** use raw `<img>` except `company-logo.tsx`.
5. All user-visible strings → `messages/en.json` + `t()`.
6. Animations → `useReducedMotion()`.
7. Internal links → `@/i18n/navigation`.
8. Conventional Commits; subject ≤ 100 chars.
9. New env vars → `.env.example` + README table.
10. Run the full quality gate before claiming done.

---

## 12. Suggested follow-ups (not explicitly requested)

- **Commit** the large uncommitted diff when the user wants a single conventional commit (or split per `split-to-prs` skill).
- **Investigate** RSC failures to `/hi/privacy` and `/en/privacy` under locale switching (section 9.1).
- **Align** root `not-found.tsx` with root layout HTML attributes to kill 404 hydration warnings (section 9.2).
- **Translate** new `messages/en.json` keys into `hi`, `ja`, `sa`, `zh`, `ru` if parity is required (English is source of truth; others may deep-merge/fallback).
- **Re-run** `npm run test:e2e` after build if navigation or i18n tests fail.
- **Silence or fix** `DEP0205` at build time if it becomes CI noise.

---

## 13. Quick commands

```sh
npm install
npm run dev
npm run build
npm test -- --run
npm run test:coverage
npm run test:e2e:build
```

Node version: see `.node-version` (22.18.0).

---

## 14. Contact / rate limiting behavior (for debugging)

- **Rate limit:** In-memory token bucket in `src/lib/rate-limit.ts` (no Upstash).
- **On limit:** API returns 429 with `Retry-After`, `X-RateLimit-*`; contact form shows countdown on submit button.
- **Resend:** `sendContactEmail` checks `{ data, error }` and throws; route should not return 200 on failure.

---

_End of handoff. Update this file if you land substantive follow-up work so the next agent stays in sync._
