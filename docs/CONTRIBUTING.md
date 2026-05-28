# Contributing

Thanks for thinking about contributing to **ayushyadav.dev**! This repository is primarily a
personal portfolio, but bug reports, perf fixes, accessibility improvements, and content
suggestions are all welcome.

## Code of conduct

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting started

```sh
# 1. Fork and clone
git clone https://github.com/<you>/portfolio.git
cd portfolio

# 2. Install
npm install

# 3. Set up env (optional — only needed for the contact form to actually send mail)
cp .env.example .env.local
# fill in RESEND_API_KEY etc.

# 4. Dev server
npm run dev          # http://localhost:3000
```

## Useful scripts

| Script                  | What it does                              |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Next.js dev server with HMR.              |
| `npm run build`         | Production build.                         |
| `npm start`             | Run the production build (after `build`). |
| `npm run lint`          | ESLint (Next.js core-web-vitals config).  |
| `npm run typecheck`     | `tsc --noEmit`.                           |
| `npm test`              | Vitest in watch mode.                     |
| `npm test -- --run`     | Vitest single run (used by CI).           |
| `npm run test:coverage` | Vitest with V8 coverage.                  |
| `npm run test:e2e`      | Playwright e2e tests.                     |
| `npm run format`        | Prettier write.                           |
| `npm run adr`           | Create a new ADR from the template.       |

## Branch / PR workflow

1. Open an issue first for non-trivial changes so we can align on scope.
2. Branch from `master`: `git checkout -b feat/<short-name>` (use `feat/`, `fix/`, `perf/`, `docs/`, `chore/`).
3. Commits should follow [Conventional Commits](https://www.conventionalcommits.org/) — e.g.
   `feat(contact): add email domain autocomplete`.
4. Run `npm run lint && npm run typecheck && npm test -- --run` before pushing.
5. Open a PR. Fill in the template. Link the issue it closes.
6. Keep PRs focused and small. One logical change per PR.

## Code style

- TypeScript strict mode. `noUncheckedIndexedAccess` is on — don't ignore it.
- Prefer **server components**; reach for `"use client"` only when interactivity demands it.
- Tailwind first; raw CSS only when Tailwind is genuinely insufficient.
- Animations must respect `prefers-reduced-motion`.
- New images go through `next/image`, never raw `<img>`.
- New env vars must be documented in `.env.example`.

## Accessibility

- All interactive elements must be reachable by keyboard.
- Focus rings must be visible.
- ARIA labels where the visible label is ambiguous.
- Run an axe / Lighthouse pass before requesting review.

## Internationalization

UI strings live in `messages/*.json`. `messages/en.json` is the source of truth — every other
locale overlays English keys; missing keys silently fall back to English. The site uses
`localePrefix: "never"`, so URLs are identical across locales and switching language only
rewrites the `NEXT_LOCALE` cookie + re-renders server components.

When adding or changing UI:

1. Add the key to `messages/en.json` first (under the appropriate namespace).
2. Use `useTranslations("namespace")` (client) or `getTranslations("namespace")` (server).
3. Use `@/i18n/navigation` (`Link`, `useRouter`, `redirect`) — **not** `next/link` or
   `next/navigation` — for anything that should stay inside the locale-aware router.
4. In server pages, call `setRequestLocale(locale)` after `await params` so SSG works.
5. Translate the new key in `messages/{hi,ja,sa,zh,ru}.json` when possible; otherwise English
   will be shown automatically.
6. Do not hardcode user-facing strings inside components.

Add a new locale:

1. Add the code to `routing.locales` in `src/i18n/routing.ts`.
2. Add the display name to `messages/en.json` → `language.names.{code}` (and the other locales).
3. Create `messages/{code}.json` (partial files are OK — keys fall back to English).
4. Run `npm run build` to verify all routes pre-render under the new locale.

## Architecture decisions

Significant decisions live as ADRs in [`docs/ADR/`](./ADR/). Run `npm run adr` to scaffold a new one.

## Automated quality gates (what runs when)

Git hooks are installed by Husky on `npm install` (via the `prepare` script). You don't have
to run them manually — they run for you.

| Hook         | When         | What it does                                                                                                                                                                                       |
| ------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | `git commit` | Runs `lint-staged` (prettier + eslint + markdownlint on staged files only). Blocks committing `it.only` / `describe.skip` / `.skip(`.                                                              |
| `commit-msg` | `git commit` | Validates the message against [Conventional Commits](https://www.conventionalcommits.org/) via `commitlint`. Subject ≤ 100 chars. Body/footer line length is **not** enforced — paste logs freely. |
| `pre-push`   | `git push`   | Runs `npm run typecheck`, `npm run lint`, and `npm test -- --run`. A red bar here means CI will go red too — fix locally before pushing.                                                           |

If a hook genuinely blocks an urgent fix, you can bypass it with `git commit --no-verify` or
`git push --no-verify`. Use sparingly; CI will still catch the regression.

### Recommended pre-PR checklist

Run this before opening a PR — it's roughly what CI runs:

```sh
npm run format:check
npm run lint
npm run lint:md
npm run typecheck
npm run test:coverage
npm run build
# optional but encouraged for UI-touching changes:
npm run test:e2e
npm run a11y       # requires `npm start` running on :3000
```

## Adding a new feature — definition of done

A "feature" is anything user-visible or anything that changes how the app behaves. Before you
mark a PR ready for review, work through this list:

1. **Tests added.** Co-located in `src/**/__tests__/`. Use **Vitest** for unit / component
   tests and **Playwright** (`tests/`) for full user-flow scenarios. Coverage thresholds
   (lines 90, statements 90, functions 90, branches 80) must hold for the files configured
   in `vitest.config.ts`.
2. **Changelog updated.** Add a one-liner to `docs/CHANGELOG.md` under `## Unreleased`,
   grouped under `Added`, `Changed`, `Fixed`, `Removed`, `Security`, or `Performance`.
3. **Docs updated.** If your change affects:
   - the public app surface → update `README.md`.
   - the system shape, routing, data flow, or build → update [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md).
   - visual / interaction language (spacing, motion, type, color) → update
     [`docs/DESIGN_GUIDE.md`](./DESIGN_GUIDE.md).
   - environment variables → update `.env.example`.
   - a non-obvious technical trade-off → create an ADR (`npm run adr -- "Decision title"`)
     and reference it from the PR.
4. **Accessibility.** Keyboard reachable, focus visible, contrast ≥ 4.5:1 for text, animations
   gated by `useReducedMotion()`. Re-run `npm run a11y` (`@axe-core/cli`) on at least the affected route.
5. **Performance.** No new layout shifts. Heavy components are dynamic-imported. New images
   ship through `next/image` with explicit dimensions.
6. **Security.** External `<a>` tags use `rel="noopener noreferrer"`. New `dangerouslySetInnerHTML`
   uses must be reviewed by a maintainer. Secrets never land in the repo —
   `.gitleaks.toml` scans on CI.
7. **License.** This repository is **proprietary** (see [`LICENSE`](../LICENSE)). By opening a
   PR you license your contribution under the same terms.

## Commit message format

```
<type>(<scope>): <short imperative summary>     ← header, ≤ 100 chars

<body — wrap as you like, no line-length limit>

<footer — BREAKING CHANGE: …, Refs: #123, etc.>
```

Allowed `type`s: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, `revert`, `deps`. Scope is optional but encouraged (`contact`, `feeds`, `work`,
`a11y`, `seo`, …).

## Repository file reference

The repo has a lot of dotfiles — here's what each one does so nothing feels mysterious.

### Editor / formatter

| File                      | Purpose                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `.editorconfig`           | Keeps indentation, charset, and line endings consistent across editors.                |
| `.prettierrc.json`        | Prettier formatting rules (also wired through `prettier-plugin-tailwindcss`).          |
| `eslint.config.mjs`       | ESLint **flat config** — extends `next/core-web-vitals` plus `eslint-plugin-jsx-a11y`. |
| `.markdownlint.json`      | Markdown style rules consumed by `markdownlint-cli2` (and the VS Code extension).      |
| `.vscode/settings.json`   | Workspace-level VS Code defaults (format on save, file nesting, etc.).                 |
| `.vscode/extensions.json` | Recommended VS Code extensions — VS Code prompts to install them on first open.        |

### Git / line endings / secrets

| File             | Purpose                                                                         |
| ---------------- | ------------------------------------------------------------------------------- |
| `.gitignore`     | Files Git must not track (build output, env files, coverage, IDE state).        |
| `.gitattributes` | Normalizes line endings (`eol=lf` for text, `crlf` for `*.bat`, etc.).          |
| `.gitleaks.toml` | Gitleaks config — extends upstream rules and allowlists build/coverage folders. |

### Node / package management

| File                  | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `.node-version`       | Node version pin (read by `fnm`, `nvm`, Volta, etc.). Currently `22.18.0`. |
| `.npmrc`              | Project-scoped npm settings (registry, save-exact, etc.).                  |
| `.env` / `.env.local` | Local-only secrets — **never commit**. See `.env.example` for the schema.  |
| `.env.example`        | Documented template of every env var the app reads.                        |

### Git hooks & commits

| File                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `.husky/pre-commit`     | Runs `lint-staged` and blocks focused/skipped tests.         |
| `.husky/commit-msg`     | Validates the message via `commitlint`.                      |
| `.husky/pre-push`       | Typecheck + lint + tests before any push leaves the machine. |
| `commitlint.config.cjs` | Conventional Commits rules + allowed `type`s.                |
| `.lintstagedrc.json`    | Per-extension formatting/lint pipeline run on staged files.  |

### Build / config

| File                   | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `next.config.mjs`      | Next.js config — image domains, security headers (HSTS, COOP, CORP, Permissions). |
| `tailwind.config.ts`   | Tailwind theme tokens (colors, typography scale, motion).                         |
| `postcss.config.mjs`   | PostCSS plugins (tailwind + autoprefixer).                                        |
| `tsconfig.json`        | TypeScript strict mode + path aliases (`@/*` → `src/*`).                          |
| `vitest.config.ts`     | Vitest config — jsdom env, React plugin, coverage thresholds.                     |
| `vitest.setup.ts`      | Loaded before every test — imports `@testing-library/jest-dom` matchers.          |
| `playwright.config.ts` | Playwright e2e config (browsers, baseURL, retry policy).                          |

### Scripts

| File                  | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| `scripts/adr-new.mjs` | Scaffolds a new ADR from `docs/ADR/0000-template.md`. |

## Reporting issues

- **Bug?** Use the [bug template](../.github/ISSUE_TEMPLATE/bug_report.yml).
- **Feature?** Use the [feature template](../.github/ISSUE_TEMPLATE/feature_request.yml).
- **Security vulnerability?** See [SECURITY.md](../SECURITY.md) — please **do not** open a public issue.
