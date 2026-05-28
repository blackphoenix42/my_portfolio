---
id: 0002
title: Next.js 16 (App Router) + TypeScript + Tailwind for the portfolio
date: 2026-05-27
status: Accepted
owners:
  - "@blackphoenix42"
tags: [stack, frontend]
---

# 0002 — Next.js 16 (App Router) + TypeScript + Tailwind

## Context

The portfolio needs static rendering for speed and SEO, a server runtime for the contact form,
strong type-safety, and a fast styling story. It also needs first-class image optimization
because the certificate / project sections ship many raster assets.

## Decision

Use **Next.js 16 (App Router, Turbopack)** with **TypeScript** (`strict`,
`noUncheckedIndexedAccess`) and **Tailwind CSS 4** with CSS-variable design tokens.

- Most routes statically rendered (`export const revalidate` where appropriate).
- `/api/contact` runs on the Node runtime with Resend + Zod 4 + in-memory rate-limiting.
- `next/image` (backed by `sharp` in production) handles all image work.
- The Open Graph image generator is the only Edge-runtime surface.

## Consequences

### Positive

- Single framework for routing, rendering, image optimization, and API routes.
- App Router enables Server Components by default → tiny client bundles for content-heavy pages.
- Vercel deployment is one click.

### Negative

- App Router is rapidly evolving; conventions can change between minor releases (e.g.
  Next 16's `middleware → proxy` rename).
- Tailwind 4's `@theme`/`@utility` model differs from v3 plugins and needed config glue.

## Alternatives considered

- **Vite + React Router** — would need to stitch image optimization, SEO meta, and an API layer by hand.
- **Astro** — great DX, but framer-motion / Radix bring-along stories felt heavier than Next.js.
- **Pages Router** — older API, no React Server Components.

## References

- <https://nextjs.org/docs>
