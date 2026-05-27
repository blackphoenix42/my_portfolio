# Roadmap

A living, lightweight list of things planned. No firm dates — this is a personal site.

## Now (this quarter)

- [x] Performance pass: pause off-screen animations, install `sharp`, GPU-promote marquee.
- [x] Contact form redesign — email autocomplete, pill role picker, char counter.
- [x] `.github/` + `docs/` scaffolding, ADRs, vitest unit tests for `lib/`.
- [ ] Lighthouse CI workflow with route budgets.
- [ ] Replace remaining raw `<img>` tags with `next/image`.

## Next (medium-term)

- [ ] Localization (`en` → optional `hi`, `fr`).
- [ ] OpenGraph image generator per route (currently only one shared image).
- [ ] MDX content for the `/lab` concepts section (currently flat TS).
- [ ] Search command palette (`cmd-k`) across pages, projects, posts.
- [ ] Axe-core a11y workflow on every PR.

## Later (someday-maybe)

- [ ] Live RSS reader on `/feeds` (currently placeholder).
- [ ] Public uptime status page.
- [ ] Theme variants beyond `dark` / `light`.

## Done

- [x] Switch to Next.js 14 App Router.
- [x] Tailwind 3 + design tokens.
- [x] Contact form via Resend + zod + rate limit.
- [x] Playwright e2e for navigation + contact.

> Open an [issue](../../issues) if you'd like to discuss anything on this list.
