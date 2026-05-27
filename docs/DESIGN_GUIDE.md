# Design Guide

A short reference for the design system used by **ayushyadav.dev**.

## Design tokens

Defined as CSS variables in [`src/app/globals.css`](../src/app/globals.css) and exposed to Tailwind
via [`tailwind.config.ts`](../tailwind.config.ts).

### Colour

| Token              | Purpose                          |
| ------------------ | -------------------------------- |
| `--bg`             | Page background                  |
| `--bg-elev`        | Elevated surfaces (cards)        |
| `--bg-sunken`      | Recessed / inset surfaces        |
| `--fg`             | Primary text                     |
| `--fg-muted`       | Secondary text                   |
| `--fg-subtle`      | Tertiary text, captions          |
| `--border`         | Default border                   |
| `--accent-cyan`    | Primary accent (links, focus)    |
| `--accent-violet`  | Secondary accent                 |
| `--accent-emerald` | Success / open-source markers    |
| `--accent-amber`   | Warnings, errors, "professional" |

Use `hsl(var(--token) / <alpha>)` when you need opacity.

### Typography

- **Sans (display + body):** `Inter` via `next/font`.
- **Mono (labels, code, eyebrows):** `JetBrains Mono`.
- Mono labels are `text-[11px]`, uppercase, `tracking-widest`, `text-fg-subtle`.

### Spacing & radius

- 8-point spacing scale (`gap-2`, `gap-4`, `gap-6`, `gap-10`).
- Cards: `rounded-xl`; pills/chips: `rounded-full`; buttons & inputs: `rounded-md`.

## Components

### Cards (`.card`, `.card-glass`, `.card-hover`)

`.card` is the base — `bg-bg-elev/60`, `border border-border`, `rounded-xl`.
Use `.card-hover` to add the cyan-border hover. Use `.card-glass` sparingly — `backdrop-blur` is
GPU-expensive on mobile.

### Buttons

- `.btn-primary` — solid `fg` on `bg`. Main CTA.
- `.btn-secondary` — bordered, transparent. Common action.
- `.btn-ghost` — invisible until hover. Tertiary action.

### Chips

`.chip` — small mono pill used for tags, status indicators, etc.

### Form inputs

- Always pair with a mono uppercase label.
- Required asterisk uses `text-accent-cyan`.
- Focus state: `focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/20`.
- Inline icon at `absolute left-3 top-1/2 -translate-y-1/2`; input has `pl-10`.

## Motion

- All animations gated by `useReducedMotion()` from `framer-motion`.
- Long-running animations also pause when off-screen — wrap them in `<InView>`
  (`src/components/layout/in-view.tsx`).
- Default easing: `ease-out` short (200ms) for hover; `ease-in-out` longer (500–900ms) for
  entrance / data viz.

## Accessibility

- Target contrast: WCAG **AA** minimum, **AAA** for body text where possible.
- All interactive controls keyboard-reachable; visible focus ring always.
- Mono / decorative text is decorative only — never relied on alone to convey meaning.
- Animations never required to use the page; reduced-motion path always present.

## Performance budgets

| Metric                | Target               |
| --------------------- | -------------------- |
| LCP (mobile)          | < 2.5 s              |
| CLS                   | < 0.1                |
| INP                   | < 200 ms             |
| First Load JS (route) | < 200 KB             |
| Largest image         | < 250 KB (optimized) |
