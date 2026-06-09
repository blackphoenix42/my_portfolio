# Agent guide

This file is the single source of truth for any AI coding agent (Cursor, Claude
Code, Codex, Aider, OpenHands, Devin, etc.) that opens this repository. Other
agent-specific files (`.cursor/rules/`, `.github/copilot-instructions.md`,
`CLAUDE.md`) intentionally defer to this document.

## TL;DR — read first, edit second

1. This is a personal portfolio. **Do not** invent professional history, employers,
   awards, or metrics. The only authoritative source for those facts is
   `src/content/*.ts`. If a number isn't in there, don't ship it.
2. **License is proprietary** (`LICENSE`). Don't rewrite large swathes of the
   codebase or copy non-trivial blocks into external repositories.
3. The site is **multilingual via `localePrefix: "never"`** — every page lives at
   the same URL across all six locales (`en`, `hi`, `ja`, `sa`, `zh`, `ru`). The
   active locale comes from the `NEXT_LOCALE` cookie + `Accept-Language` header.
   Never reintroduce locale prefixes in URLs.
4. The canonical URL is **`https://binaryphoenix.vercel.app`**. Vercel Web
   Analytics + Speed Insights are wired in the root layout (cookie-less,
   GDPR-exempt). The only cookie the app sets is `NEXT_LOCALE`.

## How to run things

```sh
npm install          # uses package-lock; .node-version pins Node 22.18.0
npm run dev          # Next.js dev server
npm run lint         # ESLint (flat config), --max-warnings=0
npm run lint:md      # markdownlint
npm run typecheck    # tsc --noEmit, strict + noUncheckedIndexedAccess
npm run format:check # prettier --check
npm test -- --run    # vitest, single run
npm run test:coverage    # vitest + v8 coverage (90/80/90/90 thresholds on lib + email-field)
npm run test:e2e     # Playwright (requires `npm run build` first or use test:e2e:build)
npm run build        # production build (Turbopack)
```

The CI gate (`/.github/workflows/`) runs `lint`, `typecheck`, `test`, `build`,
`e2e`, `CodeQL`, `dependency-review`, `npm audit`. The `pre-push` Husky hook
mirrors the bottom half of that locally.

## Directory cheat-sheet

| Path                                                                              | What lives there                                                                                                                        |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                                                              | Root layout; sets `<html lang>` and global fonts.                                                                                       |
| `src/app/[locale]/layout.tsx`                                                     | Locale layout; wires next-intl provider, theme, recruiter mode, command menu.                                                           |
| `src/app/[locale]/**/page.tsx`                                                    | One page per route. Every page must `await params` and call `setRequestLocale`.                                                         |
| `src/app/api/contact/route.ts`                                                    | POST endpoint — Zod + rate-limit + Resend.                                                                                              |
| `src/app/icon.jpg`, `apple-icon.jpg`                                              | Phoenix favicon (auto-served by Next).                                                                                                  |
| `src/app/opengraph-image.tsx`                                                     | Edge-runtime OG image generator.                                                                                                        |
| `src/app/sitemap.ts`, `robots.txt/route.ts`, `humans.txt/route.ts`, `manifest.ts` | SEO surfaces + PWA manifest. `humans.txt` content-negotiates (text for bots, HTML+egg for browsers); `robots.txt` is always plain text. |
| `src/app/[locale]/privacy/page.tsx`                                               | Privacy policy page (content lives in `messages/*.json`).                                                                               |
| `src/components/`                                                                 | All UI. `layout/`, `hero/`, `projects/`, `diagrams/`, `skills/`, `contact/`, etc.                                                       |
| `src/components/layout/settings-menu.tsx`                                         | Consolidated header overflow (language + theme + recruiter + shortcuts).                                                                |
| `src/components/layout/keyboard-shortcuts.tsx`                                    | `?`-triggered help overlay + global keymap.                                                                                             |
| `src/components/layout/cookie-consent.tsx`                                        | Soft, informational cookie banner with privacy link.                                                                                    |
| `src/components/contact/attachment-field.tsx`                                     | Drag-and-drop file picker (5 files, 10 MB) with previews.                                                                               |
| `src/components/projects/demo-slugs.ts`                                           | Server-safe slug list — which projects have an interactive demo.                                                                        |
| `src/components/projects/project-demo.tsx`                                        | Client wrapper that lazy-loads the right demo for a given slug.                                                                         |
| `src/content/*.ts`                                                                | The only source of truth for projects, experience, skills, metrics, profile.                                                            |
| `src/i18n/routing.ts`                                                             | Locale list, default, prefix mode. **`localePrefix: "never"`** — do not change.                                                         |
| `src/i18n/navigation.ts`                                                          | Locale-aware `Link`, `useRouter`, `redirect`. Always prefer over `next/*`.                                                              |
| `src/i18n/request.ts`                                                             | next-intl message loader with English fallback.                                                                                         |
| `src/lib/`                                                                        | Pure utilities: `validation` (Zod), `rate-limit`, `email` (Resend), `feeds`, `github`.                                                  |
| `src/proxy.ts`                                                                    | next-intl proxy (Next 16's `middleware` rename).                                                                                        |
| `messages/{en,hi,ja,sa,zh,ru}.json`                                               | Translated UI strings. `en.json` is the source of truth.                                                                                |
| `tests/`                                                                          | Playwright e2e. Use `tests/i18n.spec.ts` as a template for locale tests.                                                                |
| `src/**/__tests__/*.test.ts(x)`                                                   | Vitest unit/component tests. Co-located with code.                                                                                      |
| `docs/`, `docs/ADR/`                                                              | Project docs and architecture decision records.                                                                                         |
| `public/assets/`                                                                  | Static images, logos, certificates, résumé PDF.                                                                                         |

## Hard rules

1. **TypeScript strict + `noUncheckedIndexedAccess`** are on. `arr[0]` is `T | undefined`.
   Use a non-null assertion only when the index is provably safe.
2. **Server components by default.** Add `"use client"` only when state, effects, or
   browser-only APIs are required.
3. **No raw `<img>`** except `src/components/experience/company-logo.tsx` (documented
   exception — three-stage logo fallback that needs `onError`). Everywhere else use
   `next/image` with explicit `width`/`height` or `sizes`.
4. **No `dangerouslySetInnerHTML`** except for the Person JSON-LD block in
   `src/app/[locale]/layout.tsx`. Adding more requires a security review.
5. **Animations must be gated on `useReducedMotion()`.** Every existing demo and
   diagram already does this; do not regress.
6. **External links** use `target="_blank" rel="noopener noreferrer"`. The
   `@/i18n/navigation` `Link` is for **internal** routes.
7. **i18n discipline:** every user-visible string goes through `messages/en.json`
   first (plus a `t()` call). Hard-coded English in JSX is a defect.
8. **Conventional Commits** (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
   `test`, `build`, `ci`, `chore`, `revert`, `deps`). The `commit-msg` hook enforces.
9. **Coverage gate** (`vitest.config.ts`): `lines >= 90`, `statements >= 90`,
   `functions >= 90`, `branches >= 80` for `src/lib/**` and `email-field.tsx`.
10. **No new env vars** without an entry in `.env.example` and the README env table.
11. **No analytics scripts** beyond the existing Vercel Analytics + Speed Insights
    components in `src/app/layout.tsx`. Both are cookie-less. Adding GA / Plausible /
    PostHog / Hotjar is a product decision — don't.
12. **No new cookies.** The site sets exactly one (`NEXT_LOCALE`). Adding a new
    cookie means the soft consent banner becomes a hard GDPR consent gate.
13. **Lazy-load anything heavy.** Project demos go through `project-demo.tsx`'s
    `next/dynamic` wrapper. Use the same pattern for any new framer-motion / canvas /
    WASM widget.

## Patterns the codebase prefers

- **CSS tokens** live as HSL triplets on `:root` / `.light` / `.dark` / `.phoenix` in
  `src/app/globals.css`. Don't introduce hard-coded hex colors — use
  `hsl(var(--accent-cyan))` or the Tailwind `accent-cyan` shortcut.
- **Component-level animation** uses `framer-motion`. SVG-only animations may use
  the small set of CSS keyframes defined in `globals.css`.
- **Translation lookups** that may be missing should guard with `.has()`:

  ```ts
  const path = `items.${slug}.title` as never;
  return t.has(path) ? t(path) : fallback;
  ```

- **Validation errors** are short codes (e.g. `"nameShort"`); the contact form maps
  them onto `contact.form.errors.*` translation keys at render time.
- **Project demos** live in `src/components/projects/*-demo.tsx` and follow the
  same shell: `<div className="card">` → header strip → body grid → sidebar.

## When making changes

1. Pick the smallest possible scope.
2. Update or add the relevant `messages/en.json` keys for any user-visible text.
3. If you change the public API surface, refresh:
   - `README.md` if it's user-facing.
   - `docs/ARCHITECTURE.md` if it changes shape/routing/data flow.
   - `docs/DESIGN_GUIDE.md` if it changes the visual language.
   - `docs/CHANGELOG.md` under `## [Unreleased]`.
   - A new ADR via `npm run adr -- "Title"` if it's a non-trivial trade-off.
4. Run the local quality gate before claiming done:

   ```sh
   npm run format && npm run lint && npm run lint:md && \
     npm run typecheck && npm test -- --run && npm run build
   ```

5. Leave a one-line summary in the commit body explaining **why** (the diff already
   shows the **what**).

## Things that look wrong but aren't

- `eslint.config.mjs` patches `eslint-config-next` to swap its parser. This is a
  workaround for ESLint v10 + the bundled Babel parser's missing `addGlobals`. Keep it.
- `src/components/experience/company-logo.tsx` uses a raw `<img>`. Documented
  exception (multi-source onError fallback).
- The hero uses SVG `<animateMotion>` (SMIL). Works in every browser we care about
  and is GPU-friendly; framer-motion alternatives are visibly heavier here.
- Coverage thresholds are scoped to `src/lib/**` + one component, not the whole
  repo. Intentional — the UI surface is tested via Playwright instead.

## What you should not do

- Don't add analytics, tracking pixels, or third-party scripts.
- Don't add server-side data fetching that runs on every request without
  `revalidate` set (kills SSG).
- Don't add `dangerouslySetInnerHTML`, `eval`, `new Function(...)`, or load
  scripts from non-whitelisted CDNs (CSP will reject them).
- Don't make up testimonials, customer logos, or impact metrics. The
  "content integrity" rule in the README is non-negotiable.
- Don't change `localePrefix` from `"never"`. The product decision is that
  URLs are stable across all six locales.
