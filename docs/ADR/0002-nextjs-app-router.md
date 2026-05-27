---
id: 0002
title: Next.js 14 (App Router) + TypeScript + Tailwind for the portfolio
date: 2026-05-27
status: Accepted
owners:
  - "@blackphoenix42"
tags: [stack, frontend]
---

# 0002 — Next.js 14 (App Router) + TypeScript + Tailwind

## Context

The portfolio needs static rendering for speed and SEO, an Edge runtime for the contact form,
strong type-safety, and a fast styling story. It also needs first-class image optimization
because the certificate / project sections ship many raster assets.

## Decision

Use **Next.js 14 (App Router)** with **TypeScript** (`strict`, `noUncheckedIndexedAccess`) and
**Tailwind CSS 3** with CSS-variable design tokens.

- Most routes statically rendered (`export const revalidate` where appropriate).
- `/api/contact` runs on the Edge runtime with Resend + zod + in-memory rate-limiting.
- `next/image` (backed by `sharp` in production) handles all image work.

## Consequences

### Positive

- Single framework for routing, rendering, image optimization, and API routes.
- App Router enables Server Components by default → tiny client bundles for content-heavy pages.
- Vercel deployment is one click.

### Negative

- App Router is younger; some Next.js conventions still in flux.
- Edge runtime restricts certain Node APIs.

## Alternatives considered

- **Vite + React Router** — would need to stitch image optimization, SEO meta, and an API layer by hand.
- **Astro** — great DX, but framer-motion / Radix bring-along stories felt heavier than Next.js.
- **Pages Router** — older API, no React Server Components.

## References

- <https://nextjs.org/docs>
