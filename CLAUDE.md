# Claude / Anthropic agent notes

Claude Code, Claude in Cursor, and other Anthropic-powered agents should treat
[`AGENTS.md`](./AGENTS.md) as the canonical guide for this repository. This file
exists only so Claude-aware tooling that looks for `CLAUDE.md` finds an entry
point.

The TL;DR:

- This is **Ayush Yadav's personal portfolio**. License is proprietary; don't
  copy substantial chunks into other repos.
- Tech stack: **Next.js 16 App Router · React 19 · TypeScript 6 (strict) ·
  Tailwind CSS 4 · next-intl 4 · Vitest · Playwright**.
- i18n: `localePrefix: "never"` — every page renders at the same URL in all six
  supported locales. Do not reintroduce URL-prefixed routes.
- Content of record: `src/content/*.ts`. Don't invent metrics, employers, or
  testimonials. The README's "Content integrity" section is non-negotiable.
- Quality gate: `npm run format && npm run lint && npm run lint:md && \
npm run typecheck && npm test -- --run && npm run build`. CI fails on any
  warning (`--max-warnings=0`).

Everything else — directory layout, hard rules, accepted patterns, things that
look wrong but aren't — lives in [`AGENTS.md`](./AGENTS.md). Read it first.
