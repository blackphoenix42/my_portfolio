---
name: Skills tab — UI frags + design snaps
date: 2026-10-09
status: Superseded — focus-area card layout (design snaps removed)
---

# Skills tab: UI fragments & design snaps

How `/skills` should look and feel once upgraded — not yet implemented.
Today the page is a **chip filter + tool list card** (`SkillsExplorer`). The
goal is a **composition that feels like an engineering arsenal**, not a tag
cloud.

Preserve: tokens (`text-fg`, `bg-bg-elev`, accents), `useReducedMotion()`,
i18n via `messages/en.json`, no invented proficiency scores or metrics.

---

## Design snap — first viewport

```text
+------------------------------------------------------------------+
|  / skills                                                        |
|  Engineering arsenal                                             |
|  Tools I reach for, grouped by how I actually use them.          |
|                                                                  |
|  +-- Technical ------------------------------------------------+ |
|  | [Languages 12] [Systems 8] [AI/ML 6] [Web 9] [Tooling 7]   | |
|  +-------------------------------------------------------------+ |
|  +-- Applied --------------------------------------------------+ |
|  | [Perf Core] [Diagnostics] [Automation] [Product Eng] ...    | |
|  +-------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

Below the fold (after a category is selected), a **split stage** appears —
not a flat card dump:

```text
+------------------------------+-----------------------------------+
| SELECTED: Performance Core   | Design snap / UI frag stage       |
| mono eyebrow · 8 tools       |                                   |
|                              |   +-----------------------------+ |
|  [C++] [perf] [flame] ...    |   | stylized mini UI / diagram  | |
|                              |   | (SVG or static mock)        | |
| Applied in                   |   +-----------------------------+ |
| -> MAESTRO  -> Xcelium ...   |   caption: "Hot-path profile UI"  |
|                              |   [Prev frag]  2 / 4  [Next]      |
+------------------------------+-----------------------------------+
```

Mobile: stage stacks under the tool chips; frags become a horizontal snap
carousel (`scroll-snap`), one frag visible at a time.

---

## Vocabulary

| Term            | Meaning                                                                                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI frag**     | A small, self-contained visual fragment — not a full page. Examples: a fake profiler strip, a chip row, a terminal prompt, a DAG of tools. Built as SVG / pure CSS / tiny client widget. Lazy-loaded. |
| **Design snap** | A framed “screenshot-like” composition of one or more frags inside a bezel (browser chrome or panel chrome), used as the hero visual for a category.                                                  |

Frags are **illustrative** — they must not claim product screenshots of
Cadence internals or invent customer UIs.

---

## Proposed frag catalogue (per applied cluster)

| Cluster (existing ids) | Frag ideas (2–4 each)                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| Performance Core       | Flame-graph strip; latency histogram; “p99 badge” ticker                                              |
| Diagnostics / RCA      | Log line highlighter; flag-bit matrix; root-cause tree                                                |
| Automation             | Pipeline nodes (ingest→act→ack); cron/lease pulse                                                     |
| Product / full-stack   | Form→API→DB mini flow; skill-chip constellation                                                       |
| AI / ML tooling        | Prompt→retrieve→answer rail; embedding dots (decorative)                                              |
| Technical categories   | Logo-forward mosaic only (existing `SkillChip`), optional “stack layers” frag (lang → libs → runtime) |

Exact cluster ids stay whatever `src/content/skills.ts` already defines —
map frags by id, skip gracefully if missing.

---

## Interaction model

1. **Default:** no category selected → show a muted “pick a category” empty
   state with one ambient design snap (rotating slowly, reduced-motion = static).
2. **Select category:** left/main column lists tools; right/stage swaps frags
   with a short cross-fade (`useReducedMotion` → instant).
3. **Frag pager:** prev/next + dots; keyboard ← → when stage is focused.
4. **Applied links:** keep “Applied in” project links under tools.
5. **Deep link (optional later):** `/skills?cat=applied:performance` via
   plain `URLSearchParams` — not required for v1.

---

## Layout rules (match portfolio taste)

- One job per section: filters, then detail stage.
- No hero stats strip, no proficiency bars, no radar charts.
- Cards only where they aid interaction (tool panel + snap frame).
- Prefer full-bleed subtle grid/gradient in the snap stage background
  (existing CSS tokens), not purple-glow clichés.
- Frags gated on `useReducedMotion()`; heavy ones via `next/dynamic`.

---

## File sketch (when implementing)

```text
src/components/skills/
  skills-explorer.tsx          # orchestrates filters + stage
  skills-stage.tsx             # design-snap frame + pager
  frags/
    frag-registry.ts           # clusterId → lazy frag list
    flame-strip.tsx
    latency-histogram.tsx
    log-highlighter.tsx
    pipeline-nodes.tsx
    stack-layers.tsx
messages/en.json               # skillsExplorer.stage*, frag captions
tests/skills.spec.ts           # filter + frag pager smoke
```

---

## Visual acceptance (done when)

- [x] Selecting an applied cluster shows ≥1 design snap with caption.
- [x] Technical categories still show logo chips; optional stack-layers frag.
- [x] Mobile stacks stage under tools; frag pager + ← →; reduced-motion gated.
- [x] No new cookies; no fabricated skill levels.
- [ ] axe clean on `/skills`; i18n keys for all new chrome strings (keys added).

---

## Out of scope (v1)

- Drag-and-drop skill ranking
- GitHub-powered live language stats
- Replacing `SkillChip` logos wholesale
- Engineer-mode-only skill deep-dives (can layer later)
