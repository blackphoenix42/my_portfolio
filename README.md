# Ayush Yadav — Portfolio

A production-grade personal portfolio for **Ayush Yadav**, R&D Software Engineer II at Cadence Design Systems.
Built with **Next.js 14 (App Router)**, **TypeScript (strict)**, **Tailwind CSS**, **Framer Motion** and a curated set
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
| Framework     | Next.js 14 App Router, React 18, TypeScript (strict)            |
| Styling       | Tailwind CSS, `tailwindcss-animate`, design tokens via CSS vars |
| Animation     | Framer Motion                                                   |
| UI primitives | Radix UI, `cmdk`, `lucide-react`                                |
| Validation    | Zod                                                             |
| Email         | Resend                                                          |
| Testing       | Playwright                                                      |
| Lint/format   | ESLint (next + jsx-a11y), Prettier with Tailwind plugin         |

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
  app/                # Next.js App Router routes (home, work, work/[slug], experience, skills, cp, about, contact, lab, api/contact)
  components/         # layout, hero, metrics, projects, diagrams, skills, github, competitive-programming, contact, concept-labs
  content/            # typed content modules
  lib/                # utils, validation (Zod), rate-limit, email (Resend), github
  app/opengraph-image.tsx  # dynamic OG image
  app/sitemap.ts / robots.ts
tests/                # Playwright tests
public/assets/        # logos, resume PDF, social
```

## Replace these assets before launch

- `public/assets/resume/Ayush-Yadav-Resume.pdf` — replace placeholder with the real résumé PDF.
- Optional: add brand SVG logos under `public/assets/logos/` (kept light intentionally).

## Scripts

```bash
pnpm dev        # local dev
pnpm build      # production build
pnpm start      # serve production
pnpm typecheck  # strict TS check
pnpm lint       # ESLint + jsx-a11y
pnpm test:e2e   # Playwright tests (auto-starts dev server)
```

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

---

© Ayush Yadav. All rights reserved.
