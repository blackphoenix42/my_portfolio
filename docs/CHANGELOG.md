# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed — October 2026 portfolio update

- Renamed the assistant to Ask Ayush; added independent session chats, context and
  transcript clearing, model-cache removal, shared settings entry points and smaller
  generation budgets with a first-token fallback.
- Updated the résumé, introduction, principles, metrics, recognition and Cadence
  role progression using owner-supplied facts.
- Added expandable Work previews and dedicated system-design detail tabs; merged
  applied engineering into Skills filters and current focus into Practice & Plans
  with 2027 roadmap targets. Engineer Mode now starts off and is in Site settings.
- Improved automatic feed fetching with authenticated GitHub requests, Atom fallback,
  XML links and a scheduled check/warm workflow.
- Fixed mobile quote wrapping and reduced-motion hydration in project thumbnails
  and the navbar name, found during the updated layout review.
- Documented recording instructions, interaction effects and the proposed server
  migration in [Portfolio update notes](PORTFOLIO_UPDATE_NOTES.md).

### Added

- **Engineer Mode** — an audience toggle (header pill, `n` shortcut, command
  menu) that mirrors Recruiter Mode and is mutually exclusive with it. When on,
  case-study pages reveal deep-tech sections (architecture diagram, algorithms &
  data structures, performance engineering, technical write-up) sourced from
  real public project facts, and the home page swaps in an engineer-first view.
  State persists in `localStorage` (no new cookie). New `engineer.*` i18n
  namespace across all six locales. See ADR-0009.
- **`/now` page** — a Derek-Sivers-style snapshot of current focus, learning,
  building, reading and sharpening, driven by `src/content/now.ts` and the new
  `now.*` i18n namespace. Linked from nav, footer, command menu, sitemap and the
  `g n` shortcut.
- **`/system-design` whiteboards** — interactive walkthroughs of classic
  problems (URL shortener, rate limiter, job scheduler) plus three sketched
  "coming soon" boards, lazy-loaded through a dynamic registry. Content lives in
  `src/content/system-design.ts`; new home diagrams (performance + system
  design) and the `systemDesign.*` namespace. See ADR-0011.
- **"Ask my portfolio" assistant** — a fully client-side chatbot that answers
  from real site content using a dependency-free TF-IDF lexical index (no
  WebAssembly, no model download, no network calls, no tracking). The corpus is
  precomputed at build time (`scripts/build-chatbot-index.mjs` →
  `public/chatbot/corpus.json`) from a curated `src/content/chatbot-knowledge.json`.
  New `chatbot.*` namespace. See ADR-0010.
- **On-device AI for "Ask my portfolio"** — assistant settings offer GPU
  (Llama 3.2 1B/WebLLM), CPU (Qwen2.5 0.5B/wllama), and AI off. Includes
  device recommendations, download sizes, measured speed, answer length,
  context depth and memory controls with performance guidance. The launcher
  sits above the scroll arrows on desktop and mobile. The corpus ships with
  the lazy panel; AI failures keep quick answers available without error
  banners. GPU executable artifacts are pinned and SRI-verified; the CPU
  runtime is served locally from the locked dependency. See ADR-0012.
- **Chatbot corpus learns from the site** — `scripts/build-chatbot-index.mjs`
  now derives chunks from `src/content/*.ts` (projects, experience, skills,
  `/now`, system design, honors, ratings) via `src/lib/chatbot/ingest.ts`, runs
  on `predev` as well as `prebuild`, and shares the tokenizer with
  `src/lib/chatbot/embed.ts` instead of duplicating it.
- **Quirky project filters** — chip filters on `/work` (favourites, late-night
  ideas, hardest bugs, most fun, open source, research, AI, systems) backed by a
  pure, unit-tested `src/lib/quirky-tags.ts` and the `quirkyTags.*` namespace.
- **Personality & flair** — a glitch effect on the header brand name
  (reduced-motion safe), a once-per-session hacker-style **boot sequence**
  overlay (skippable, reduced-motion safe), a decorative **commit rain** overlay
  (terminal `commits` / command menu), a synthesized Web-Audio **sound-effects
  engine** with a global mute toggle in settings, and a **voice-intro player**
  scaffold with transcript fallback.
- **Terminal expansion** — `phoenix-shell` gains an interactive `vim` sub-mode,
  hidden commands (`hire ayush`, `coffee`, `bug`, `binary`, `fortune`, `ascii`,
  `matrix`, `commits`, `boss`, `neon`, `glitch`, `party`, `download resume`,
  `cd`, `ls -a`, `cat .hidden-impact`, and more), tab-completion for the new
  verbs, and sound effects. Pure command output lives in a unit-tested
  `src/lib/terminal/commands.ts`.
- **Easter-egg layer (22 eggs across 5 tiers)** — a discoverable second
  reading of the site. Includes **Phoenix Run**, a Chrome-dino-style
  endless runner on the 404 page (flaming phoenix, parallax volcanic world,
  power-ups, Phoenix Rebirth, Inferno Mode, score milestones, audio, and
  fullscreen; crossing **500** unlocks the score egg and collecting **five
  golden feathers** unlocks the feather egg, both with persistent high
  scores), a retro `phoenix-shell` terminal overlay with history (↑/↓),
  Tab autocompletion, click-to-type, ESC-to-close, and 10+ commands
  (`help`, `theme`, `ls`, `cat`, `pwd`, `date`, `echo`, `history`,
  `neofetch`, `sudo`, `projects --list`), a full-screen
  matrix-rain overlay with brighter cyan leading characters and a "MATRIX"
  glyph, hidden `/phoenix` and `/credits` routes, a trophy room at
  `/secret` with shareable progress URLs, a sculpted gradient console
  banner with `help()` / `phoenix()` / `hire()` / `cv()` / `humans()` /
  `robots()` / `secrets()` globals (all return strings so the REPL never
  prints `undefined`), per-egg full-screen unlock bursts (rings, confetti,
  embers, color wash, spiral, glitch — palette + variant chosen by egg
  id), the Konami code, typed-word triggers (`phoenix`, `matrix`,
  `terminal`), a Sanskrit-locale egg, a polyglot egg for visiting all six
  languages, a theme-cycler egg, devtools-open detection, a three-page
  haiku trail, a CSS `::selection` reveal under the hero, an OG-image QR
  code that deep-links to the trophy room, a `humans-txt` egg (visit
  `/humans.txt` in a browser or call `humans()`), a `robots-txt` egg (call
  `robots()` — `/robots.txt` carries a small ASCII greeting alongside the
  directives but stays plain text for crawlers), and a completionist reward.
  Global keyboard listeners back off whenever an overlay (terminal,
  matrix) is open so typing inside them no longer cycles themes / fires
  Konami. All progress lives in a single `localStorage` key (no new
  cookies, no analytics). Animations gate on `useReducedMotion()`. UI
  strings are translated across all six locales (en, hi, ja, sa, zh, ru).
  See `docs/EGGS.md` for the full catalogue and ADR-0008 for the decision
  record.
- **Contact: company autofill from email domain** — typing a work email
  (e.g. `jane@acme.com`) now pre-fills the Company field ("Acme"), with a
  small curated map for well-known brands (Google, Meta, NVIDIA, …). Free /
  personal providers (gmail, outlook, proton, …) and unusable addresses
  leave it blank, and anything the visitor types by hand always wins. Logic
  is a pure, unit-tested `src/lib/company-from-email.ts`.
- **Certificate previews preload + cache** — the About page now warms the
  browser HTTP cache for every certificate asset during idle time after load
  (staggered, Data-Saver-aware), so the PDF/image previews are ready before a
  card scrolls into view. Pairs with the existing immutable `/assets/**`
  caching for instant repeat visits.
- **Quote refresh hint** — the rotating motivational / funny quote card now
  includes a subtle localized "wait 30s for a new motivational or funny quote"
  caption and a focused component test for the timer behavior.
- **Weather/geolocation removal** — removed the experimental greeting weather
  path, Open-Meteo client fetch, browser location prompt, weather utility/tests,
  privacy table row, and `geolocation=(self)` permission. ADR-0007 records the
  removal decision.
- **Local-time greeting chip** — small cloud-icon button next to the brand
  name in the header. Pops a localized "Good morning / afternoon / evening /
  night" card that welcomes visitors and invites them to explore the
  portfolio. The time-of-day bucket is computed entirely in the browser, with
  no visible clock, no IP geolocation, and no extra cookie. Auto-opens once per time-of-day
  window per day (remembered in a single `localStorage` key, so revisits in
  the same window stay quiet), dismissible with click-outside / `Esc`, fully
  translated across all six locales and gated on `useReducedMotion()`.
- **Vercel Web Analytics + Speed Insights** wired into the root layout. Both
  are cookie-less and GDPR-exempt; they report page views and real-user
  Core Web Vitals from production.
- **Contact form attachments** — drag-and-drop, 5 files / 10 MB total,
  PDF / images / DOCX / TXT / MD, image previews. Multipart `POST /api/contact`,
  forwarded to Resend.
- **"Other" role specify field** — when the role pill picker selects "Other",
  a free-text input appears and is required (min 2, max 80 chars).
- **Email autocomplete inline hint** — subtle copy under the email input
  explains the Tab-to-accept domain autocomplete.
- **Full keyboard-shortcut layer** — `?` opens a help overlay. Shortcuts cover
  navigation (`g h`/`g w`/…), actions (`t`/`r`/`l`/`e`/`d`), section jumps
  (`j`/`k`), search (`/`, `⌘K`), and `Esc` to close overlays.
- **Consolidated header settings menu** — gear icon collapses the old
  Language + Recruiter + Theme + Resume row into a single dropdown with
  inline theme picker and a Language submenu.
- **Soft cookie consent banner** — informational, dismissable, with a
  Privacy link. Language switcher works immediately regardless of consent.
- **`/privacy` route** — full privacy policy page with third-party services
  table, rendered from `messages/*.json` so it's fully translated.
- **Web App Manifest** (`/manifest.webmanifest`) — PWA-friendly install
  metadata with the phoenix icon.
- **BreadcrumbList + CreativeWork JSON-LD** on project case-study pages.
- **Per-project metadata** — proper canonical URL, OG image, twitter card.
- **Rate-limit UX** — server emits `Retry-After` + `X-RateLimit-*` headers;
  the form renders a live countdown on the submit button.
- **Improved 404 page** — phoenix ASCII art, suggested routes, and a
  Back / Home / Command-palette action row.
- **`setRequestLocale(locale)`** in every page so SSG knows the active locale.
- Phoenix favicon (`src/app/icon.jpg`, `src/app/apple-icon.jpg`).
- Full demo-control localization (algolens, xmai, xcelium, tezos, posture,
  track-person, smart-brain) under a new `demos.*` namespace.
- Translated contact-form validation errors via short Zod codes mapped to
  `contact.form.errors.*` on the client.
- AI/LLM adapter files: `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `llms-full.txt`,
  `.cursor/rules/portfolio.mdc`, `.github/copilot-instructions.md`.
- Content-Security-Policy header (`next.config.mjs`).

### Changed

- **Case studies refreshed from current work.** The XMAI project, its demo and
  its diagram are replaced by four professional case studies: **MAESTRO**
  (multi-agent ticket resolution), **ChipStack Xcelium AI agents** (performance
  and memory), the **Xcelium regression triage & regold system** and
  **cross-stream Perforce replay**. Each has an architecture whiteboard
  (shared `diagram-kit.tsx`, translated labels under `architecture.*`) and an
  animated thumbnail; MAESTRO also gets an interactive conductor demo with
  human approval gates. Experience, `/now`, honors, skills, hero diagram and
  the chatbot corpus are updated to match, across all six locales. The old
  `/work/xmai` URL permanently redirects to `/work/maestro`.
- **404 mini-game rebuilt as Phoenix Run** — the old Chrome-dino runner +
  Feather Catch mode are replaced by a single polished endless runner: a
  flaming phoenix (canvas gradients, animated wing-flaps, fire trail, ember
  particles) over a parallax volcanic world with lava spikes, ravens,
  meteors, pillars, fire rings, and lava rocks; flame-shield / golden-feather
  / phoenix-burst / slow-time / double-score power-ups; a one-charge Phoenix
  Rebirth at 1000; Inferno Mode at 2000; score milestones; screen shake;
  Web-Audio sound effects with a mute toggle; fullscreen + responsive
  canvas; and mobile tap/swipe controls. Up/Down no longer scroll the page
  mid-run, and the game claims `overlay-state` while active so page
  shortcuts stay dormant. The 404 heading is retitled "Page Lost in the
  Ashes" with a "Go Home" action.
- **Terminal overlay upgraded** — click anywhere to focus the prompt, **Tab**
  autocompletes commands and arguments (with an ambiguous-match list), a new
  `pwd` command, the `neofetch` splash now renders the shared phoenix ASCII,
  and a footer shows the key hints.
- **OG-image QR hardened** — switched to high error-correction, larger
  modules, and dark-on-white with a real quiet zone (cyan-on-dark looked nice
  but rarely scanned), plus a "scan → /secret" caption.
- **Matrix-rain overlay reworked** — richer rendering (trailing heads with a
  cyan glow, CRT vignette + scanlines, DPR-aware canvas), the visible close
  button is gone, and it now closes on **ESC, a click anywhere, or by
  re-typing `matrix`**. Localized hint updated across all six locales.
- **`/humans.txt` is now content-negotiated** — crawlers and curl still get
  the plain-text manifest; a real browser navigation gets a small styled HTML
  page whose inline script reliably unlocks the `humans-txt` egg (the old
  referrer trick rarely fired). `/robots.txt` stays plain text for every
  client, so its egg remains console-only (`robots()`).
- **Unified phoenix mark** — one phoenix ASCII
  (`src/components/eggs/phoenix-art.ts`) is now shared by the devtools console
  banner, the 404 page (gradient text fill), and the terminal `neofetch`. The
  art is third-party ASCII that keeps its original "M J P" artist signature
  intact (reproduced at the owner's request — see the file header).
- **Phoenix Run gains in-game help & settings** — a `?` button (and a header
  pause button) opens a "How to play" panel covering the goal, full control
  map, power-up legend, and mechanics (Rebirth / Inferno / milestones), with a
  Settings row for sound + fullscreen. Opening it pauses an in-progress run.
- **404 page shows a scan-to-continue QR** — instead of yet another text link,
  the suggestions card now includes a crisp server-rendered SVG QR
  (`src/components/eggs/qr-tag.tsx`) that points at the site home so a lost
  visitor can hop to their phone.
- **Contact autofill uses full company names** — the email-domain → company map
  now resolves EDA / semiconductor employers to their proper names (e.g.
  `cadence.com` → "Cadence Design Systems", `ti.com` → "Texas Instruments")
  rather than a naive title-case.
- **Live feeds refresh faster** — the Medium / YouTube / GitHub ISR window
  dropped from 60 → 30 minutes so new activity surfaces sooner.
- **`SITE.url` switched to `https://binaryphoenix.vercel.app`** (the live
  deployment). All canonical URLs, OG metadata, sitemap, manifest, and JSON-LD
  follow.
- **i18n architecture:** switched `next-intl` from `localePrefix: "as-needed"`
  to `localePrefix: "never"`. Every page renders at one canonical URL across
  all six locales; switching language updates content + cookie + `<html lang>`
  without changing the URL.
- **Sitemap** now emits one URL per route (no locale fan-out) since URLs are
  locale-agnostic.
- **Project demos lazy-loaded via `next/dynamic` + `ssr: false`** in a
  client-only wrapper (`project-demo.tsx`). One demo's JS per case study,
  instead of all seven bundled together.
- **Contact role enum:** `Collaboration` → `Collaborator` (grammatically a role).
- **Contact API now accepts multipart** in addition to JSON. The route reads
  attachments via `request.formData()`, validates type + size + count, and
  forwards them to Resend with the right buffer.
- **Resend wrapper** now inspects `{ data, error }` and throws on API-level
  failures (silent-error bug fix — see Fixed).
- **`.dark` palette** is now a real CSS selector — previously dark mode worked
  only by accident via the `:root` default.
- **ConceptLabs intro** uses one rich-text translation key instead of three
  glued sentences.
- **Mobile action bar, command menu, recruiter banner, and `/lab` redirect**
  now use `@/i18n/navigation` so locale context isn't lost on navigation.
- **CI workflows** pinned to `.node-version` instead of a hardcoded major.
- **Footer "Built with"** block redesigned as small chips with tech glyphs.

### Fixed

- Exclude cached Next.js development validators from TypeScript checks so stale
  route types cannot break production builds on Windows. Production route types
  and application code remain checked.
- **Home page title** — the root default title became just the name; the home
  page now sets a localized, descriptive title (`home.metaTitle`).
- **"Ask my portfolio" accessibility** — the panel no longer claims
  `aria-modal` without trapping focus. It is a non-modal dialog: Escape closes
  it only while focus is inside it, and focus returns to the launcher.
- **Untranslated strings from the MAESTRO/case-study update** — the new
  project, experience, honors, MAESTRO demo, diagram descriptions, terminal and
  chatbot strings are now translated in hi, ja, ru, sa and zh. SVG diagram
  labels intentionally stay English.
- **Terminal `download resume --<variant>` note** printed a literal
  `{variant}`, because `'{…}'` is an ICU escape. It now uses typographic quotes.
- **Looping thumbnail and diagram animations were frozen** — `initial={false}`
  blocks framer-motion's mount animation, so every `repeat: Infinity` keyframe
  loop (case-study thumbnails, architecture lane packets, system-design
  packets) sat on its last frame and the packets stayed invisible. Loops now
  start on mount, each animated element carries a resting-frame attribute for
  SSR and reduced motion, and `scripts/patch-motion-initial.mjs` skips loops.
- **`/work` hydration mismatch** — the MAESTRO thumbnail's trig-derived agent
  positions differed in the last digit between Node and the browser; they are
  now rounded.
- **MAESTRO demo scroll-jacking** — the log used `scrollIntoView`, which also
  scrolled the page back to the demo on every step; only the log panel scrolls
  now, and log placeholders re-translate on a language switch.
- **i18n drift** — the contact "Collaborator" role and the Hindi `/lab`
  concepts intro used keys the code never reads, so they fell back to English;
  `binary` in the terminal egg printed its raw key because `<text>` parsed as
  an ICU tag; five legacy case studies (AlgoLens, PostureIQ, Track Person,
  Smart Brain, Tezos Premier League) showed titles and taglines that
  contradicted their content of record in every locale; the hero diagram's
  node labels and accessible name are now translated.
- **`format:check` failing after every build** — the generated
  `public/chatbot/corpus.json` is now in `.prettierignore`.
- **`/opengraph-image` 404** — the next-intl proxy matcher caught the
  extensionless metadata-image route and rewrote it into the `[locale]` tree,
  where it hit the catch-all and returned the 404 page instead of the PNG. The
  route is now excluded from the matcher, so `/opengraph-image` serves the
  share image directly (and link unfurlers can read it).
- **GitHub feed "Pushed 0 commits"** — the public events API can return an
  empty/truncated `commits` array; the activity feed now reads `payload.size`
  for the count and falls back to a branch-aware "Pushed to …" label so it
  never claims zero commits.
- **Page shortcuts no longer fire under egg overlays** — the keyboard-shortcut
  layer and the ⌘K command palette now respect `overlay-state`, so typing
  inside the matrix/terminal overlay can't cycle the theme (`t`), toggle
  recruiter mode (`r`), or navigate behind it.
- **Resend silent-error bug** — `resend.emails.send()` returns `{ data, error }`
  and does not throw on API-level errors (unverified domain, invalid sender,
  etc.). The wrapper now surfaces the error so failures don't become silent
  200s in production logs.
- **Browser autofill blue background** — Chromium injects a hard-to-override
  light blue background on autofilled inputs. Killed via a `box-shadow` /
  `-webkit-text-fill-color` reset scoped to `.contact-input` so we don't
  clobber third-party form widgets.
- **CODEOWNERS pattern** (`-` → `*`) so PRs auto-request review.
- **SmartBrain demo:** inference log no longer floods (every-frame push) —
  uses a stage ref.
- **XceliumDemo:** removed dead `auto` / `Play/Pause` state that never animated
  anything.
- **All project demos** now honour `prefers-reduced-motion` (timers and tickers
  no-op or jump to final state).
- **`/lab` redirect** preserves the active locale.
- **Stray `sr-only` span** at the end of `AboutSection`.

### Removed

- `LanguageSwitcher` + `ThemeToggle` deleted (functionality moved into the
  new `SettingsMenu`).
- `/lab` from the sitemap (it 308-redirects to `/competitive-programming`).
- Unimplemented Upstash env vars from `.env.example`.

### Security

- **CSP relaxed for opt-in on-device AI** — `script-src` adds
  `'wasm-unsafe-eval'` (WebAssembly compilation only, not JS `eval`), and
  `connect-src` adds Hugging Face (`huggingface.co`, `*.huggingface.co`,
  `*.hf.co`) and `raw.githubusercontent.com`. The model repo and WASM library are
  pinned to immutable commits, and the config, tokenizer and WASM are
  SRI-verified. See ADR-0012.
- **Chatbot keeps the CSP strict** — "Ask my portfolio" uses a pure-JavaScript
  TF-IDF index instead of transformers.js/WebAssembly, so no `'wasm-unsafe-eval'`
  was added to `script-src`. Its only runtime fetch is a same-origin GET of
  `/chatbot/corpus.json`, already covered by `connect-src 'self'`. The corpus is
  served with a short, revalidating cache (not `immutable`, since it changes per
  deploy). See ADR-0010.
- **Content-Security-Policy** header added (`default-src 'self'` with explicit
  allow-list for GitHub avatars, Clearbit, Google s2 favicons).
- `npm audit` re-enabled locally so contributors see advisories on install.

### Performance

- **Lazy-loaded project demos** via `next/dynamic` — only the demo for the
  currently visited project ships JS to the browser.
- **`setRequestLocale`** enables static generation for content pages.
- **Pre-connect** to GitHub avatars + logo CDN fallbacks (saves ~150 ms on
  first repo-card paint).
- **ISR** added to `/privacy` (revalidate weekly — content is essentially static).
- **Demos** jump straight to the final visual when `prefers-reduced-motion` is
  set, instead of running their `setInterval` ticker.
