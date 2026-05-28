# Ayush Yadav — Portfolio

A production-grade personal portfolio for **Ayush Yadav**, R&D Software Engineer II at Cadence Design Systems.
Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript (strict)**, **Tailwind CSS**, **Framer Motion** and a curated set
of lightweight libraries. Designed for **recruiter conversion**, **accessibility**, and **fast performance**.

## Highlights

- Cinematic hero with custom SVG/Framer Motion profiler → RTL → embeddings visualization.
- Recruiter Mode toggle (condensed: Impact → Experience → Projects → Skills → Contact).
- Command palette (⌘K / Ctrl+K) with project & action search.
- Premium case-study pages (XMAI architecture diagram, AlgoLens interactive demo, etc.).
- GitHub workbench backed by the GitHub REST API with a resilient hand-curated fallback.
- Fully validated contact form (Zod) with rate limiting, honeypot, and Resend email delivery.
- Dynamic Open Graph image, sitemap, robots, Person JSON-LD.
- WCAG 2.1 AA-aware: keyboard nav, skip link, focus-visible, reduced-motion respected.
- Light + Dark themes via `next-themes` (dark default).
- Playwright tests for navigation and the contact form.

## Tech stack

| Area          | Tools                                                           |
| ------------- | --------------------------------------------------------------- |
| Framework     | Next.js 15 App Router, React 19, TypeScript (strict)            |
| Styling       | Tailwind CSS, `tailwindcss-animate`, design tokens via CSS vars |
| Animation     | Framer Motion                                                   |
| UI primitives | Radix UI, `cmdk`, `lucide-react`                                |
| Validation    | Zod                                                             |
| Email         | Resend                                                          |
| Testing       | Vitest, Testing Library, jsdom, Playwright                      |
| Lint/format   | ESLint (next + jsx-a11y), Prettier with Tailwind plugin         |
| CI / Quality  | GitHub Actions (lint, typecheck, test, build, CodeQL, e2e)      |

## Getting started

```bash
pnpm install          # or npm install / yarn
cp .env.example .env.local
pnpm dev              # http://localhost:3000
```

> Without `RESEND_API_KEY`, the contact API soft-succeeds in development and logs the payload to the server console.

### Environment variables

See [`.env.example`](.env.example):

| Variable                                       | Purpose                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                         | Canonical site URL for SEO + sitemap.                               |
| `RESEND_API_KEY`                               | Resend API key for sending contact emails.                          |
| `CONTACT_TO_EMAIL`                             | Inbox that receives messages (defaults to `aayush.sang@gmail.com`). |
| `CONTACT_FROM_EMAIL`                           | Verified sender for Resend.                                         |
| `GITHUB_TOKEN`                                 | Optional — raises GitHub API rate limits for the workbench.         |
| `NEXT_PUBLIC_SHOW_PHONE` / `NEXT_PUBLIC_PHONE` | Toggle/render phone number in contact page.                         |

## Internationalization

The site is multilingual via [next-intl](https://next-intl.dev). Six locales are supported:

| Code | Language                          | URL prefix      |
| ---- | --------------------------------- | --------------- |
| `en` | English                           | `/` (no prefix) |
| `hi` | हिन्दी (Hindi)                    | `/hi/...`       |
| `ja` | 日本語 (Japanese)                 | `/ja/...`       |
| `sa` | संस्कृतम् (Sanskrit, best-effort) | `/sa/...`       |
| `zh` | 中文 (Chinese)                    | `/zh/...`       |
| `ru` | Русский (Russian)                 | `/ru/...`       |

- **Detection:** First visit reads `Accept-Language`; the user's choice persists in a `NEXT_LOCALE` cookie.
- **Switcher:** Globe icon in the header — picks a locale and preserves the current path.
- **Fallback:** Missing translation keys silently fall back to English (production safe).
- **SEO:** `sitemap.xml` emits one URL per locale per route.

Add a new locale in three steps:

1. Add the code to `src/i18n/routing.ts` (`locales` array + language name).
2. Create `messages/{code}.json` (any subset of keys; the rest will fall back to English).
3. Add a display name in `messages/en.json` → `language.names.{code}`.

See [docs/ADR/0004-i18n-next-intl.md](docs/ADR/0004-i18n-next-intl.md) for the rationale.

## Content

All copy and data are colocated under `src/content/` as strongly typed modules:

- `profile.ts` — name, role, links, taglines
- `experience.ts` — Cadence role + education
- `projects.ts` — case studies & detail content
- `skills.ts` — capability clusters
- `achievements.ts` — competitive programming + awards
- `concepts.ts` — Concept Lab entries
- `metrics.ts` — homepage impact metrics

Update these to refresh the site — no component changes required.

## Project structure

```
src/
  app/                # Next.js App Router
    layout.tsx        # root layout (locale-aware <html lang>)
    [locale]/         # all user-facing routes under here (home, work, about, ...)
    api/contact/      # locale-agnostic API
    opengraph-image.tsx
    sitemap.ts / robots.ts
  components/         # layout (header/footer/language-switcher/...), hero, metrics, projects, ...
  content/            # typed content modules
  i18n/               # routing, navigation, request config (next-intl)
  lib/                # utils, validation (Zod), rate-limit, email (Resend), github
  proxy.ts            # Next.js 16 proxy (next-intl locale resolution)
messages/             # per-locale UI strings (en.json is the source of truth)
tests/                # Playwright tests
public/assets/        # logos, resume PDF, social
```

## Replace these assets before launch

- `public/assets/resume/Ayush-Yadav-Resume.pdf` — replace placeholder with the real résumé PDF.
- Optional: add brand SVG logos under `public/assets/logos/` (kept light intentionally).

## Scripts

| Script                   | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Start local dev server at http://localhost:3000           |
| `npm run build`          | Production build                                          |
| `npm run start`          | Serve the production build                                |
| `npm run typecheck`      | Strict TypeScript check (no emit)                         |
| `npm run lint`           | ESLint + `jsx-a11y` rules                                 |
| `npm run format`         | Prettier (with Tailwind plugin) write                     |
| `npm test`               | Vitest in watch mode (unit + component)                   |
| `npm run test:coverage`  | Vitest run with V8 coverage (HTML report under coverage/) |
| `npm run test:e2e`       | Playwright tests (auto-starts dev server)                 |
| `npm run adr -- "Title"` | Scaffold a new ADR under `docs/ADR/`                      |

## Documentation

All project documentation lives under [`docs/`](./docs):

- [Architecture overview](./docs/ARCHITECTURE.md)
- [Design guide](./docs/DESIGN_GUIDE.md)
- [Contributing guide](./docs/CONTRIBUTING.md)
- [Code of Conduct](./docs/CODE_OF_CONDUCT.md)
- [Roadmap](./docs/ROADMAP.md)
- [Changelog](./docs/CHANGELOG.md)
- [Privacy notice](./docs/PRIVACY.md)
- [Terms](./docs/TERMS.md)
- [Architecture Decision Records](./docs/ADR/)
- [Security policy](./SECURITY.md)

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Set environment variables in the Vercel dashboard (mirror `.env.example`).
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

## Accessibility & performance

- Skip-to-content link, `:focus-visible` styles, `aria-current` on nav.
- All animations honour `prefers-reduced-motion`.
- Color contrast in both themes is tuned to meet WCAG 2.1 AA.
- Hero animation kept GPU-light; no Three.js or heavy WebGL by default.
- Fonts (Inter, JetBrains Mono) loaded via `next/font` with `display: swap`.

## Content integrity

All employer impact, projects, and metrics shown are based **only** on the verified
information provided. No fabricated testimonials, deployments, or customer claims.
"Concept Lab" entries are explicitly labelled as experiments — not shipped work.

## Contributing

Bug reports, perf fixes, and accessibility improvements are welcome. Start with the
[contributing guide](./docs/CONTRIBUTING.md) — it covers the local setup, the automated
quality gates (Husky pre-commit / commit-msg / pre-push), the "definition of done" for
a new feature (tests, changelog, docs, ADR), and a one-line reference for every dotfile
in the repo. Commits follow [Conventional Commits](https://www.conventionalcommits.org/);
the `commit-msg` hook enforces them.

## Security

Found a vulnerability? Please **do not** open a public issue — follow the disclosure
process in [`SECURITY.md`](./SECURITY.md). The app ships with HSTS (`max-age=2y; preload`),
COOP `same-origin`, CORP `same-origin`, a tightened `Permissions-Policy`, `X-Frame-Options
SAMEORIGIN`, and `X-Content-Type-Options nosniff` (see `next.config.mjs`). Dependencies are
tracked weekly by Dependabot; `gitleaks` runs on every push via GitHub Actions.

## License

This project is **proprietary** — see [`LICENSE`](./LICENSE) for the full text.

- ✅ Viewing the source for personal study and reference is fine.
- ✅ Pull requests, bug reports, and suggestions are welcome and licensed back under
  the same terms when merged.
- ❌ Copying, forking-and-publishing, redistributing, or using this repository as a
  template / theme / SaaS / portfolio for someone else is **not permitted**.
- ❌ Using the source or content to train ML models without prior written permission
  is **not permitted**.

For licensing inquiries or commercial use, contact **aayush.sang@gmail.com**.

---

© 2026 Ayush Yadav. All rights reserved.
