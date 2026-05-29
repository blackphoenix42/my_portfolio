<div align="center">

# Ayush Yadav — Portfolio

A production-grade personal portfolio for **Ayush Yadav**, R&D Software Engineer II at
Cadence Design Systems. Built with **Next.js 16 (App Router)**, **React 19**,
**TypeScript 6 (strict)**, **Tailwind CSS 4**, **next-intl 4**, and a curated
set of lightweight libraries. Engineered for **recruiter conversion**,
**accessibility**, and **fast performance** in six languages — all served from a
single canonical URL.

🌐 **Live:** [binaryphoenix.vercel.app](https://binaryphoenix.vercel.app) ·
📄 [Privacy](https://binaryphoenix.vercel.app/privacy) ·
🛠 [Source](https://github.com/blackphoenix42/portfolio)

[![CI](https://img.shields.io/github/actions/workflow/status/blackphoenix42/portfolio/ci.yml?branch=master&label=CI&logo=github&style=flat-square)](https://github.com/blackphoenix42/portfolio/actions/workflows/ci.yml)
[![E2E](https://img.shields.io/github/actions/workflow/status/blackphoenix42/portfolio/e2e.yml?branch=master&label=E2E&logo=playwright&style=flat-square)](https://github.com/blackphoenix42/portfolio/actions/workflows/e2e.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/blackphoenix42/portfolio/codeql.yml?branch=master&label=CodeQL&logo=github&style=flat-square)](https://github.com/blackphoenix42/portfolio/actions/workflows/codeql.yml)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&style=flat-square)](https://binaryphoenix.vercel.app)
[![License: Proprietary](https://img.shields.io/badge/license-proprietary-red?style=flat-square)](./LICENSE)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=fff&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=fff&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=fff&style=flat-square)](https://tailwindcss.com)
[![next-intl](https://img.shields.io/badge/next--intl-4-blueviolet?style=flat-square)](https://next-intl.dev)
[![Zod](https://img.shields.io/badge/Zod-4-3068b7?style=flat-square)](https://zod.dev)
[![Resend](https://img.shields.io/badge/Resend-email-000?style=flat-square)](https://resend.com)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=fff&style=flat-square)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-e2e%20%2B%20a11y-2EAD33?logo=playwright&logoColor=fff&style=flat-square)](https://playwright.dev)
[![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-success?style=flat-square)](#-accessibility--performance)

</div>

---

## ✨ Highlights

- 🎬 **Cinematic hero** — custom SVG/Framer Motion profiler → RTL → embeddings flow.
- 🌍 **Six locales, one URL** — `localePrefix: "never"` means `/work/xmai` renders
  in English, Hindi (हिन्दी), Japanese (日本語), Sanskrit (संस्कृतम्), Chinese (中文),
  and Russian (Русский) without the URL ever changing.
- 🧑‍💼 **Recruiter Mode** — condensed Impact → Experience → Projects → Skills →
  Contact composition, toggled from the header.
- ⌨️ **Command palette** (⌘K / Ctrl+K) + a full **keyboard-shortcut layer**
  (`?` for help, `g h`/`g w`/`g s`/…, `t` theme, `r` recruiter, `l` language,
  `e` email, `d` résumé, `j/k` jump section).
- 🎨 **Three themes** — Phoenix (default), Dark, Light — with proper CSS-variable
  tokens and `prefers-reduced-motion` everywhere.
- 🧪 **Premium case studies** — XMAI architecture diagram, AlgoLens
  interactive bubble-sort, Xcelium throughput slider, Tezos bracket simulator,
  PostureIQ live rep-quality, Track-Person waypoint route, Smart-Brain vision
  inference — all lazy-loaded and translated.
- 🔧 **GitHub workbench** — live REST-API data with a resilient hand-curated fallback.
- 📨 **Contact form** — Zod 4 validation, drag-and-drop attachments (5 files,
  10 MB, PDF/images/DOCX/TXT/MD), inline email-domain autocomplete, honeypot,
  rate limit with countdown, Resend delivery, full error surfacing.
- 🍪 **Soft cookie banner** — informational only; `NEXT_LOCALE` is the only
  cookie. Vercel Analytics + Speed Insights are cookie-less and GDPR-exempt.
- 🔍 **SEO** — Person + BreadcrumbList + CreativeWork JSON-LD, dynamic OG image,
  sitemap, robots, web app manifest.
- ♿ **WCAG 2.1 AA** — keyboard nav, skip link, focus-visible, `aria-current`,
  reduced-motion gates on every animation, automated axe-core on 7 routes.
- 🔐 **Security headers** — full CSP, HSTS preload (2 years), COOP same-origin,
  CORP same-origin, restrictive Permissions-Policy.
- ⚡ **Performance** — Server Components by default, code-split per-project
  demos via `next/dynamic`, GPU-promoted marquee, pre-connect to image CDNs,
  ISR-aware revalidation.

## 🧰 Tech stack

| Area              | Tools                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **Framework**     | Next.js 16 App Router (Turbopack), React 19, TypeScript 6 (strict)    |
| **Styling**       | Tailwind CSS 4, `tailwindcss-animate`, HSL CSS-variable design tokens |
| **Animation**     | Framer Motion (gated on `prefers-reduced-motion`)                     |
| **UI primitives** | Radix UI, `cmdk`, `lucide-react`                                      |
| **i18n**          | next-intl 4 with `localePrefix: "never"` (URL-stable, cookie-driven)  |
| **Validation**    | Zod 4 (server schemas, client-mapped to translated error codes)       |
| **Email**         | Resend (Node runtime, attachments, soft dev-mode success)             |
| **Telemetry**     | Vercel Web Analytics + Speed Insights (cookie-less)                   |
| **Testing**       | Vitest + Testing Library + jsdom; Playwright + `@axe-core/playwright` |
| **Lint / format** | ESLint 10 (flat config + jsx-a11y), Prettier, markdownlint            |
| **CI / Quality**  | GitHub Actions (lint, typecheck, unit, build, e2e, CodeQL, audit)     |
| **Hooks**         | Husky: pre-commit (format), commit-msg (commitlint), pre-push (full)  |

## 🚀 Getting started

```bash
pnpm install          # or npm install / yarn
cp .env.example .env.local
pnpm dev              # http://localhost:3000
```

> Without `RESEND_API_KEY`, the contact API soft-succeeds in development and logs
> the payload (including attachment metadata) to the server console.

### Environment variables

See [`.env.example`](.env.example):

| Variable                                       | Purpose                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                         | Canonical site URL for SEO + sitemap + OG.                           |
| `RESEND_API_KEY`                               | Resend API key for sending contact emails.                           |
| `CONTACT_TO_EMAIL`                             | Inbox that receives messages (defaults to `aayush.sang@gmail.com`).  |
| `CONTACT_FROM_EMAIL`                           | Verified sender for Resend (or `onboarding@resend.dev` for testing). |
| `GITHUB_TOKEN`                                 | Optional — raises GitHub API rate limits for the workbench.          |
| `NEXT_PUBLIC_SHOW_PHONE` / `NEXT_PUBLIC_PHONE` | Toggle / render a phone number on the contact page.                  |

## 🌍 Internationalization

The site is multilingual via [next-intl](https://next-intl.dev). **Every locale
lives at the same URL** — `/about` renders in English, Hindi, Japanese,
Sanskrit, Chinese, or Russian depending on the active locale; the URL never
changes. Locale is resolved server-side from the `NEXT_LOCALE` cookie →
`Accept-Language` header → default (`en`).

| Code | Language                          |
| ---- | --------------------------------- |
| `en` | English (default)                 |
| `hi` | हिन्दी (Hindi)                    |
| `ja` | 日本語 (Japanese)                 |
| `sa` | संस्कृतम् (Sanskrit, best-effort) |
| `zh` | 中文 (Chinese)                    |
| `ru` | Русский (Russian)                 |

- **Switcher** — gear icon in the header → Language submenu. Writes the cookie
  and `router.refresh()`s server components in place.
- **Fallback** — missing translation keys silently fall back to English
  (production-safe). `messages/en.json` is the source of truth.
- **SEO** — since URLs are locale-agnostic, `sitemap.xml` emits one URL per
  route. Search engines see one canonical URL per page.

Add a new locale in three steps:

1. Add the code to `src/i18n/routing.ts` (`locales` array).
2. Create `messages/{code}.json` (any subset of keys; the rest fall back).
3. Add a display name in `messages/en.json` → `language.names.{code}`.

See [docs/ADR/0004-i18n-next-intl.md](docs/ADR/0004-i18n-next-intl.md).

## ⌨️ Keyboard shortcuts

Press `?` anywhere to see the full list. Highlights:

| Combo           | Action                  |
| --------------- | ----------------------- |
| `⌘K` / `Ctrl+K` | Open command palette    |
| `/`             | Focus search            |
| `?`             | Show shortcut help      |
| `g` then `h`    | Go home                 |
| `g` then `w`    | Go to work              |
| `g` then `s`    | Go to skills            |
| `g` then `c`    | Go to contact           |
| `j` / `k`       | Next / previous section |
| `t`             | Cycle theme             |
| `r`             | Toggle recruiter mode   |
| `l`             | Open language picker    |
| `e`             | Copy email              |
| `d`             | Download résumé         |
| `Esc`           | Close menus / overlays  |

## 📨 Contact form

The contact pipeline does a surprising amount of work for a portfolio:

- **Validation** — Zod 4 schema with short error codes (`nameShort`,
  `emailInvalid`, …) that map to localized strings on the client. Server
  responses include `Retry-After` headers; the form renders a live countdown.
- **Attachments** — drag-and-drop up to **5 files, 10 MB total**. Allowed:
  PDF, PNG, JPG, JPEG, WebP, GIF, DOCX, DOC, TXT, MD. Image attachments get
  inline previews; everything else gets a typed icon.
- **Honeypot** — invisible `website` input; non-empty submissions soft-succeed.
- **Rate limit** — 5 requests / 60 s per IP (in-memory; distributed limiter on
  the roadmap). On hit, returns 429 + `Retry-After` and a friendly countdown.
- **Resend delivery** — explicitly inspects `{ data, error }` and surfaces
  API-level failures (unverified domain, invalid sender, etc.) as structured
  errors instead of silent 200s.
- **Dev soft-success** — without `RESEND_API_KEY`, the API logs the payload +
  attachment metadata to the server console and returns `{ ok: true, dev: true }`
  so local development never blocks.

## 🛡 Rate limiting

`src/lib/rate-limit.ts` is a token-bucket limiter keyed on a string (the IP for
the contact API). The default is **5 requests per 60 seconds**. On hit, the
contact route responds with:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 53
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0

{ "error": "rateLimited", "retryAfterSec": 53 }
```

The form picks this up and shows a translated "Slow down a bit — you've sent
5 messages in the last minute. Please retry in 53 seconds." with a live
countdown on the submit button. The button is disabled until the countdown
expires.

> **Note:** The current limiter is in-memory and per-process. On Vercel each
> serverless instance has its own bucket map, so an attacker can spread requests
> across cold-started instances to bypass it. A distributed backend (Upstash
> Redis / Vercel KV) is on the roadmap.

## ♿ Accessibility & performance

- Skip-to-content link, `:focus-visible` styles, `aria-current` on nav.
- All animations honour `prefers-reduced-motion` (timers and tickers either
  no-op or fast-forward to the final state).
- Color contrast in all three themes tuned to meet WCAG 2.1 AA.
- Hero animation is GPU-light; no Three.js or WebGL.
- Fonts (Inter, JetBrains Mono) loaded via `next/font` with `display: swap`.
- Project demos lazy-loaded via `next/dynamic` (one demo's JS per case study).
- Pre-connect headers for GitHub avatars + logo CDN fallbacks.
- Vercel Speed Insights tracks real-user LCP / CLS / INP / TTFB / FCP.
- E2E axe-core scans on 7 routes; 0 WCAG 2.1 A/AA violations.

## 🔐 Security

- **HTTP headers** in `next.config.mjs`: Content-Security-Policy (own-origin
  default with a tight image allow-list), Strict-Transport-Security
  (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options
SAMEORIGIN`, `X-Content-Type-Options nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.
- **No `dangerouslySetInnerHTML`** except for the Person + BreadcrumbList +
  CreativeWork JSON-LD blocks.
- **Secrets** in `.env.local` only — never committed. `gitleaks` runs on every
  push via GitHub Actions.
- **Dependencies** tracked weekly by Dependabot; CodeQL + `npm audit` on PR.
- Found a vulnerability? Follow [`SECURITY.md`](./SECURITY.md) — please do not
  open a public issue.

## 🤖 Cookies, analytics, privacy

- **`NEXT_LOCALE`** is the only cookie set by this site. It remembers the
  language you picked.
- **Vercel Web Analytics** and **Vercel Speed Insights** are enabled. Both are
  cookie-less and GDPR-exempt — they aggregate page views and Core Web Vitals
  using a short-lived hash that's recomputed daily and never linked back to an
  individual.
- A soft, dismissible banner appears once per visitor describing this. Read the
  full [Privacy policy](https://binaryphoenix.vercel.app/privacy) for the
  third-party services table and your rights.

## 🧱 Content

All copy and data are colocated under `src/content/` as strongly typed modules:

- `profile.ts` — name, role, links, taglines
- `experience.ts` — Cadence role + internships + education
- `projects.ts` — case studies & detail content
- `skills.ts` / `skills-flat.ts` — capability clusters + flat explorer
- `achievements.ts` — competitive programming + awards
- `concepts.ts` — Concept Lab roadmap entries
- `metrics.ts` — homepage impact metrics
- `extras.ts` — honors, languages, volunteering
- `quotes.ts` — footer quote cycler

Update these to refresh the site — no component changes required.

## 📂 Project structure

```text
src/
  app/                # Next.js App Router
    layout.tsx        # Root layout — fonts, Analytics, SpeedInsights
    icon.jpg          # Phoenix favicon (served at /icon.jpg)
    apple-icon.jpg    # Apple touch icon
    [locale]/         # All user-facing routes under here
    api/contact/      # Multipart POST endpoint (Zod + rate-limit + Resend)
    opengraph-image.tsx
    sitemap.ts / robots.ts / manifest.ts
  components/         # Layout, hero, projects, contact, etc.
  content/            # Typed content modules
  i18n/               # routing, navigation, request config (next-intl)
  lib/                # validation, rate-limit, email, github, feeds, utils
  proxy.ts            # Next 16 proxy (next-intl locale resolution)
messages/             # Per-locale UI strings (en.json is the source of truth)
tests/                # Playwright e2e + axe-core a11y suites
public/assets/        # Logos, certificates, profile picture, résumé PDF
docs/                 # Architecture, ADRs, design guide, policy docs
```

## 📦 Replace these assets before launch

- `public/assets/resume/Resume.pdf` — replace placeholder with the real résumé.
- Optional: add brand SVG logos under `public/assets/logos/` (kept light intentionally).

## 🛠 Scripts

| Script                   | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `npm run dev`            | Start local dev server at <http://localhost:3000>           |
| `npm run build`          | Production build                                            |
| `npm run start`          | Serve the production build                                  |
| `npm run typecheck`      | Strict TypeScript check (no emit)                           |
| `npm run lint`           | ESLint + `jsx-a11y` rules                                   |
| `npm run lint:md`        | Markdown linting                                            |
| `npm run format`         | Prettier (with Tailwind plugin) write                       |
| `npm run format:check`   | Prettier check (CI gate)                                    |
| `npm test`               | Vitest in watch mode (unit + component)                     |
| `npm run test:coverage`  | Vitest run with V8 coverage (HTML report under `coverage/`) |
| `npm run test:e2e`       | Playwright tests (auto-starts production server)            |
| `npm run a11y`           | Axe-core accessibility scan (Chromium only)                 |
| `npm run adr -- "Title"` | Scaffold a new ADR under `docs/ADR/`                        |

## 📚 Documentation

All project documentation lives under [`docs/`](./docs):

- [Architecture overview](./docs/ARCHITECTURE.md)
- [Design guide](./docs/DESIGN_GUIDE.md)
- [Contributing guide](./docs/CONTRIBUTING.md)
- [Code of Conduct](./docs/CODE_OF_CONDUCT.md)
- [Roadmap](./docs/ROADMAP.md)
- [Changelog](./docs/CHANGELOG.md)
- [Privacy notice](./docs/PRIVACY.md) (page version: `/privacy` on the site)
- [Terms](./docs/TERMS.md)
- [Architecture Decision Records](./docs/ADR/)
- [Security policy](./SECURITY.md)
- [Agent / LLM guide](./AGENTS.md) (read by Cursor, Claude Code, Codex, …)
- [llms.txt](./llms.txt) / [llms-full.txt](./llms-full.txt) (LLM-friendly index)

## 🚀 Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Set environment variables in the Vercel dashboard (mirror `.env.example`).
4. Enable **Web Analytics** and **Speed Insights** in the dashboard (the
   components are already in the root layout — they begin reporting once
   enabled).
5. Deploy. Vercel auto-detects Next.js — no extra config needed.

## 🤖 AI / LLM adaptability

This repo ships the full set of agent-friendly files so any LLM tool that
opens it gets useful context out of the box:

| File                                                                   | Read by                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`AGENTS.md`](./AGENTS.md)                                             | Cursor, Codex CLI, Aider, OpenHands, Devin (canonical rules)           |
| [`CLAUDE.md`](./CLAUDE.md)                                             | Claude Code & Claude-aware tools (pointer to `AGENTS.md`)              |
| [`.cursor/rules/portfolio.mdc`](./.cursor/rules/portfolio.mdc)         | Cursor agent / chat (always-injected rules)                            |
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | GitHub Copilot Chat / Workspace                                        |
| [`llms.txt`](./llms.txt)                                               | LLM-friendly crawlers ([llmstxt.org](https://llmstxt.org/) convention) |
| [`llms-full.txt`](./llms-full.txt)                                     | Long-form companion to `llms.txt`                                      |

All of them point at `AGENTS.md` as the source of truth, so a rule change in
one place stays consistent across every tool.

## ✅ Content integrity

All employer impact, projects, and metrics shown are based **only** on the
verified information provided. No fabricated testimonials, deployments, or
customer claims. "Concept Lab" entries are explicitly labelled as experiments
— not shipped work.

## 🤝 Contributing

Bug reports, perf fixes, and accessibility improvements are welcome. Start with
the [contributing guide](./docs/CONTRIBUTING.md) — it covers the local setup,
the automated quality gates (Husky pre-commit / commit-msg / pre-push), the
"definition of done" for a new feature (tests, changelog, docs, ADR), and a
one-line reference for every dotfile in the repo. Commits follow
[Conventional Commits](https://www.conventionalcommits.org/); the `commit-msg`
hook enforces them.

## 📜 License

This project is **proprietary** — see [`LICENSE`](./LICENSE) for the full text.

- ✅ Viewing the source for personal study and reference is fine.
- ✅ Pull requests, bug reports, and suggestions are welcome and licensed back
  under the same terms when merged.
- ❌ Copying, forking-and-publishing, redistributing, or using this repository
  as a template / theme / SaaS / portfolio for someone else is **not permitted**.
- ❌ Using the source or content to train ML models without prior written
  permission is **not permitted**.

For licensing inquiries or commercial use, contact **aayush.sang@gmail.com**.

---

<div align="center">

© 2026 [Ayush Yadav](https://binaryphoenix.vercel.app). All rights reserved.

</div>
