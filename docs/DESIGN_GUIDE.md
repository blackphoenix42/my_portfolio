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

### Header utility order

Keep header utilities ordered by visitor intent: Search, Live feeds, Recruiter mode, Settings,
Resume. Search and live status help exploration; recruiter and settings are mode controls; résumé is
the final high-intent CTA on the far right.

### Chips

`.chip` — small mono pill used for tags, status indicators, etc.

### Header greeting chip

The brand row may include a compact cloud-icon chip that opens a small localized greeting popover.
Keep the trigger icon-only, keyboard reachable, and visually quieter than primary navigation. The
popover should feel like a lightweight welcome: one greeting line, one short explore invitation, and
one clear CTA. Do not show the visitor's exact local time in the UI, and do not add weather or
location-permission prompts to the greeting.

### Quote card

The motivational / funny quote card may rotate automatically every 30 seconds. Phrase the cadence as
a quiet invitation to wait for the next quote, not as mechanical status text.

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

### Audience modes & flair

- **Engineer Mode** uses the `accent-cyan` token (Recruiter Mode uses
  `accent-amber`); the two are mutually exclusive. Deep-tech sections only render
  when Engineer Mode is on.
- The **glitch name** (header brand) and the once-per-session **boot sequence**
  both run only with motion enabled and are fully skippable; under reduced motion
  the boot sequence is skipped entirely.
- **Sound effects** are off by default, synthesized via the Web Audio API
  (`src/components/audio/sfx.ts`), and globally muteable from Settings. Never
  autoplay audio; the voice-intro player is click-to-play with a transcript.
- Temporary terminal visual modes (`data-fx="glitch|neon|boss|minimal"` on
  `<html>`) auto-revert after a few seconds and are decorative only.

## Accessibility

Work uses matching project and system-design card grids, showing four cards per
section with explicit expansion controls. Design details use keyboard-accessible
tabs for demos, high-level architecture, implementation notes and trade-offs.
Skills separates technical filters from applied engineering filters; selected
applied groups show tool chips and project links, without extra write-ups.

Ask Ayush keeps the conversation selector and context/transcript controls above
the message list. Settings have one shared panel, reached from the assistant or
Site settings. Engineer Mode lives in Site settings and starts disabled.

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
