# Easter eggs

This site hides 22 small surprises. They're catalogued here so the next
maintainer can keep them working — and so readers who give up the hunt can
still see what they missed.

All progress lives in a single `localStorage` key (`phoenix:eggs:v1`).
Nothing is sent over the network. Reset progress from the trophy room at
[`/secret`](https://binaryphoenix.vercel.app/secret).

## How discovery works

- Pure registry + codec: [`src/lib/eggs.ts`](../src/lib/eggs.ts)
- Provider + persistence: [`src/components/eggs/egg-provider.tsx`](../src/components/eggs/egg-provider.tsx)
- Global listeners (Konami, typed words, theme cycler, devtools, locales):
  [`src/components/eggs/global-listeners.tsx`](../src/components/eggs/global-listeners.tsx)
- Trophy room: [`src/components/eggs/trophy-room.tsx`](../src/components/eggs/trophy-room.tsx)
- Translation keys: `messages/<locale>.json` under `eggs.catalogue.<id>.*`

A toast appears on each unlock (`aria-live="polite"`), a brief full-screen
burst animation plays (palette + shape vary per egg, gated on
`useReducedMotion()`), and the keyboard-shortcuts overlay shows a live
`Secrets X/22` counter that links to the trophy room.

While a fullscreen overlay (terminal, matrix) is open — or while **Phoenix
Run** is being played — the global key listeners, the page keyboard
shortcuts, and the ⌘K command palette all back off via
[`overlay-state.ts`](../src/components/eggs/overlay-state.ts) — so typing
"matrix" or pressing `t` inside the overlay can't cycle the theme, and the
game's Space/↑/↓ keys never scroll the page or fire other shortcuts behind
it.

> **Static text files can't run JS.** `/humans.txt` is therefore served by a
> route handler that content-negotiates: a plain-text manifest for crawlers
> and curl, a small styled HTML page (with an inline unlock script) for real
> browser navigations. `/robots.txt` stays plain text for everyone, so its
> egg is console-only (`robots()`).

## Tier 1 — surface

| ID                | How to trigger                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `console-banner`  | Open devtools and call `help()`, `phoenix()`, `hire()`, `cv()`, `secrets()`, `humans()`, or `robots()`.                                                                |
| `html-comment`    | Implicit when `help()` is called for the first time — the HTML comment in `src/app/layout.tsx` tells you to.                                                           |
| `humans-txt`      | Open [`/humans.txt`](https://binaryphoenix.vercel.app/humans.txt) in a browser (it serves a styled HTML page that unlocks the egg), or call `humans()` in the console. |
| `robots-txt`      | Call `robots()` in the console. `/robots.txt` itself stays plain text for every client (its crawler contract is sacred), so visiting it does **not** unlock the egg.   |
| `dino-score-5`    | Reach a score of **500** in **Phoenix Run** on the [404 page](https://binaryphoenix.vercel.app/does-not-exist).                                                        |
| `feather-score-5` | Collect **five golden feathers** in a single Phoenix Run (they spawn as a power-up).                                                                                   |

## Tier 2 — keyboard / interaction

| ID                 | How to trigger                                                                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `konami`           | Type **↑ ↑ ↓ ↓ ← → ← → B A** anywhere on the page. The phoenix takes flight across your viewport.                                                                                                                                                               |
| `terminal-mode`    | Type **`terminal`** anywhere — a retro phoenix-shell overlay opens (also in the Command Menu, ⌘K). Click to focus, **Tab** autocompletes; supports `help`, `theme`, `ls`, `cat`, `pwd`, `date`, `echo`, `history` (↑/↓), `neofetch`, `sudo`. **Esc** closes it. |
| `phoenix-type`     | Type **`phoenix`** anywhere.                                                                                                                                                                                                                                    |
| `logo-shift-click` | Hold **Shift** and click the header logo five times. The hidden **phoenix** theme activates.                                                                                                                                                                    |

## Tier 3 — content / locale

| ID                | How to trigger                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `sanskrit-locale` | Switch the site language to **संस्कृतम् (sa)**.                                                 |
| `polyglot`        | Visit the site in all six supported languages (en, hi, ja, sa, zh, ru) — progress persists.     |
| `theme-cycler`    | Press the theme key (`t`) three times in under two seconds to cycle through light/dark/phoenix. |
| `devtools-open`   | Open browser devtools. Detected with the classic window-size heuristic; harmless.               |

## Tier 4 — for treasure hunters

| ID              | How to trigger                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `phoenix-route` | Visit the hidden [`/phoenix`](https://binaryphoenix.vercel.app/phoenix) page.                            |
| `credits-route` | Visit the hidden [`/credits`](https://binaryphoenix.vercel.app/credits) page.                            |
| `haiku-trail`   | Find the invisible `data-haiku` markers on **home**, **about**, and **work** (one per page).             |
| `css-selection` | Select the invisible line under the hero tagline (`phoenix · rise · /secret`).                           |
| `matrix-rain`   | Type **`matrix`** anywhere, or open it from the Command Menu. ESC, a click, or re-typing `matrix` exits. |
| `og-qr-scan`    | Scan the QR code in the social-share preview image (or open `/secret?via=og`).                           |

## Tier 5 — meta

| ID                  | How to trigger                                                        |
| ------------------- | --------------------------------------------------------------------- |
| `trophy-room-visit` | Visit [`/secret`](https://binaryphoenix.vercel.app/secret).           |
| `completionist`     | Unlock every other egg. Reveals a private mailto with a "say hi" CTA. |

## Sharing progress

The trophy room provides a "Copy share link" button. The link encodes the
unlocked set + high scores into a short base-36 string (`?eggs=…`). Opening
someone else's link shows a preview of their progress — it does **not**
unlock anything on the visitor's device.

## Accessibility

- All animations (phoenix flight, matrix rain, Phoenix Run, theme cycler
  feedback) gate on `useReducedMotion()`; Phoenix Run is opt-in under reduced
  motion and trims its ambient particles.
- The toast uses `aria-live="polite"` and never steals focus.
- The Konami listener does not intercept arrow keys inside form fields.
- The terminal and matrix overlays are dismissible with **Esc** (the matrix
  also closes on a click or by re-typing `matrix`).

## Testing

- Unit tests for the registry & codec live in [`src/lib/__tests__/eggs.test.ts`](../src/lib/__tests__/eggs.test.ts).
- The trophy room and the secret route are exercised by Playwright in
  [`tests/eggs.spec.ts`](../tests/eggs.spec.ts).

## License

The egg layer is part of the proprietary portfolio (see `LICENSE`). Don't
copy it wholesale into another site.
