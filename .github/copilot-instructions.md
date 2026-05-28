# GitHub Copilot instructions

These instructions apply to every Copilot Chat / Workspace / agent suggestion
made in this repository. Authoritative project rules live in
[`../AGENTS.md`](../AGENTS.md); this file is a Copilot-shaped summary.

## Project facts

- Personal portfolio for **Ayush Yadav**, R&D Software Engineer II at Cadence.
- Stack: Next.js 16 App Router, React 19, TypeScript 6 (strict + `noUncheckedIndexedAccess`),
  Tailwind CSS 4, next-intl 4, Vitest, Playwright, Zod 4, Resend, framer-motion.
- License: **proprietary** (see `LICENSE`). No bulk copying, no template re-use.
- Node version: `.node-version` → `22.18.0`. CI uses this file.

## Coding conventions

- **Server components first.** Add `"use client"` only when needed.
- **TypeScript strict.** No `any`. Prefer `unknown` + narrowing. Honor
  `noUncheckedIndexedAccess` — `arr[0]` is `T | undefined`.
- **i18n discipline.** No hard-coded user-facing strings. Add a key to
  `messages/en.json` first, then call `t('namespace.key')` or
  `getTranslations('namespace')`.
- **Locale-aware navigation.** Always import `Link`, `useRouter`, `redirect`
  from `@/i18n/navigation` — never from `next/link` or `next/navigation` —
  unless the link is to an external `https://` URL (then use a plain `<a>`).
- **`setRequestLocale(locale)` in every server page** after `await params` so
  SSG works.
- **Tailwind 4 tokens.** Use `text-fg`, `bg-bg-elev`, `border-border`,
  `text-accent-cyan`, etc. No raw hex codes; the design tokens are HSL
  variables on `:root` / `.light` / `.dark` / `.phoenix`.
- **Animations gated on `useReducedMotion()`.** Always.
- **External links** use `target="_blank" rel="noopener noreferrer"`.
- **No raw `<img>`** except `src/components/experience/company-logo.tsx`.
- **No new `dangerouslySetInnerHTML`.**

## Testing expectations

- Unit/component tests in `src/**/__tests__/*.test.ts(x)` via Vitest.
- E2E in `tests/*.spec.ts` via Playwright (Chromium-only in CI).
- Coverage thresholds (`src/lib/**` + `email-field.tsx`): lines ≥ 90, statements ≥ 90,
  functions ≥ 90, branches ≥ 80.
- Before opening a PR, run:

  ```sh
  npm run format && npm run lint && npm run lint:md && \
    npm run typecheck && npm test -- --run && npm run build
  ```

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) enforced via
`commitlint`. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`,
`perf`, `test`, `build`, `ci`, `chore`, `revert`, `deps`.

## What never to suggest

- Adding analytics, tracking pixels, or third-party scripts.
- Loading scripts from CDNs not in the CSP allow-list.
- Inventing employer details, customer logos, or impact metrics.
- Changing `localePrefix` in `src/i18n/routing.ts` — URLs are intentionally
  identical across all six locales.
- Adding `dangerouslySetInnerHTML`, `eval`, or `new Function(...)`.
