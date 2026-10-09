---
id: 0014
title: Server-backed Ask Ayush inference
date: 2026-10-09
status: Proposed # scaffold shipped; not enabled in production
owners:
  - "@blackphoenix42"
tags: [ai, security, performance, privacy, cost]
---

# 0014 — Server-backed Ask Ayush inference

> **Status: Proposed.** This ADR is the decision record for migrating generative
> Ask Ayush answers off the visitor device. It does **not** enable a live
> endpoint by itself. Acceptance requires the phases and checks below, plus
> privacy / env / cost sign-off.
>
> Related: [ADR-0010](0010-lexical-chatbot.md) (TF-IDF retrieval, stays),
> [ADR-0012](0012-on-device-llm.md) (on-device LLM — becomes optional / fallback),
> [ADR-0013](0013-session-scoped-ask-ayush-conversations.md) (session chats),
> [PORTFOLIO_UPDATE_NOTES.md](../PORTFOLIO_UPDATE_NOTES.md) (expanded sketch).

## Context

Ask Ayush today has two answer paths:

1. **Quick answers (default)** — local TF-IDF over `public/chatbot/corpus.json`
   (ADR-0010). No model download.
2. **Opt-in on-device LLM** — WebLLM (GPU) or wllama (CPU) downloads hundreds of
   MB of weights into the browser, then runs inference on-device (ADR-0012).

Visitor pain: cold starts load weights into RAM/VRAM, initialize runtimes, and
may compile shaders. This site is not cross-origin isolated, so the CPU engine
uses a single WebAssembly thread. Phones and low-RAM laptops either refuse the
download or feel unusable. “Remove downloaded models” and Quick answers mitigate
this but do not give every visitor conversational synthesis without a download.

Forces:

- **No visitor model download** for the primary generative path.
- **Content integrity** — no invented employers, metrics, or dates; answers
  grounded in the built corpus from `src/content/*.ts`.
- **Hard repo rules** — no new cookies, no analytics scripts, no `NEXT_PUBLIC_*`
  secrets, no locale URL prefixes, CSP stays tight (prefer dropping Hugging Face
  / GitHub model `connect-src` hosts if on-device becomes unused).
- **Cost and abuse** — a public billed API needs rate limits, spend caps, and
  origin checks beyond the contact form’s in-memory limiter.
- **Privacy** — questions leave the device; disclosure on `/privacy` is mandatory
  before enablement.
- **Keep Quick answers** always available when the server path is down, rate-
  limited, or opted out.

ADR-0012 previously **rejected** a server endpoint. Device download cost and
latency have overturned that trade-off for the generative path. Retrieval stays
client-or-server TF-IDF; a vector DB is not justified for this corpus size.

## Decision

Add an **opt-in, same-origin** generative path:

```text
Ask Ayush UI  →  POST /api/chat  →  validate + rate-limit
              →  TF-IDF retrieve from built corpus (server)
              →  managed inference API (stream)
              →  SSE / fetch stream back to UI (text + trusted sources)
```

Concrete choices:

| Choice              | Decision                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Hosting             | Keep the portfolio on Vercel; gateway is a Next.js Route Handler                                                                |
| Route               | `POST /api/chat` (new; today only `/api/contact` exists)                                                                        |
| Retrieval           | Reuse ADR-0010 TF-IDF on the server over the same built corpus; no vector DB initially                                          |
| Inference           | Managed API behind a small adapter (`src/lib/chatbot/server.ts`); smallest model that passes factuality + six-locale evaluation |
| Streaming           | Provider stream → app events: `sources`, `delta`, `done`, `error` (each with request id)                                        |
| Client engines      | Add **Server** alongside Quick / GPU / CPU; default remains Quick until evaluation passes                                       |
| Secrets             | Server-only env vars (document in `.env.example` + README); never `NEXT_PUBLIC_*`                                               |
| On-device path      | Keep until Server is default-ready; then deprecate or hide GPU/CPU behind an advanced setting                                   |
| Cookies / analytics | None added                                                                                                                      |

### Proposed request contract

```json
{
  "chatId": "tab-local-random-id",
  "message": "How did MAESTRO improve ticket resolution?",
  "history": [
    { "role": "user", "content": "Tell me about MAESTRO" },
    { "role": "assistant", "content": "A portfolio-grounded answer." }
  ],
  "locale": "en",
  "length": "short"
}
```

Rules:

- Enforce byte limits before JSON parse; max ~1,000-character question; ≤ 4 recent
  history messages; role allowlist; known locales only.
- Client history is **untrusted**. Never accept system prompt, credentials,
  provider URL, or authoritative source chunks from the client — build those
  server-side from versioned content.
- Source IDs/URLs come from retrieval, not model-generated citations.
- `AbortController` cancels upstream on Stop / chat switch / clear / close.
- Never blindly retry a partially streamed response into the transcript.
- When limits or provider fail: fall back to Quick answers (or a clear error +
  quick answer), never invent facts.

### Hosting options (comparison)

| Option                                    | Visitor download | Trade-off                                                    |
| ----------------------------------------- | ---------------- | ------------------------------------------------------------ |
| Quick retrieval (keep)                    | None             | Fast excerpts; limited synthesis                             |
| On-device GPU/CPU (ADR-0012)              | Hundreds of MB   | Privacy-local; device-dependent                              |
| **Vercel + managed inference (this ADR)** | **None**         | Simplest server path; usage billing + provider data handling |
| Vercel + separate GPU service             | None             | Control over weights; idle/GPU ops cost                      |

Do **not** ship a hundreds-of-MB model inside a Vercel function.

### Suggested acceptance targets (measure, don’t assume)

- Warm first useful text ≤ 2s median; short answers ≤ 5s median.
- Bound fallback when no first token arrives (mirror today’s ~8s client behavior).
- Track errors, concurrency, tokens, and cost in **operational** logs — no visitor
  analytics scripts, no raw conversation logging by default.

## Consequences

### Positive

- Every device gets conversational answers without downloading weights.
- CSP can eventually drop Hugging Face / raw.githubusercontent model hosts if
  on-device is removed.
- Single place to enforce grounding, rate limits, and spend caps.
- Quick answers remain zero-cost and offline-capable in the browser.

### Negative

- Questions (and bounded chat context) leave the device → privacy disclosure,
  retention policy, and provider data settings required.
- Ongoing inference cost; needs daily spend cap and multi-instance rate limiting.
- Operational dependency on a third-party provider (latency, outages, ToS).
- New env vars and a security review of `/api/chat`.

### Neutral

- ADR-0012 is not deleted; status becomes **Accepted (generative path superseded
  by ADR-0014 once enabled)** for the default AI engine. On-device may remain as
  an advanced offline option.
- ADR-0010 retrieval remains the grounding layer (client Quick + server RAG).
- ADR-0013 session chat UX stays; only the engine behind “AI on” changes.

## Implementation phases

1. **Evaluation baseline** — golden questions from real content (roles, MAESTRO,
   benchmarks, contact, refusals, follow-ups, clear-context, all six locales).
   Record factuality, citation accuracy, first-token / completion latency, cost.
2. **Server adapter + route** — `src/lib/chatbot/server.ts`, `src/app/api/chat/route.ts`,
   corpus load, Zod validation, provider adapter. Document env in `.env.example`
   and README. Feature flag **default off**.
3. **Abuse and spend controls** — shared atomic rate/concurrency limiter suitable
   for multiple instances; origin checks; input/output bounds; daily spend cap;
   reject arbitrary model/proxy selection. Quick answers when limited.
4. **Streaming client** — Server engine in shared Ask Ayush settings; preserve
   per-chat isolation (ADR-0013), Stop/abort, first-token fallback, trusted sources.
5. **Privacy and rollout** — update `/privacy`, `docs/PRIVACY.md`, ARCHITECTURE,
   CHANGELOG; accept this ADR; enable only after evaluation + cost checks.
6. **Optional cleanup** — hide or remove GPU/CPU downloads; tighten CSP
   `connect-src`; keep “Remove downloaded models” for residual caches.

## Required acceptance checks

- Two chats never share context; clear context / clear chat / delete chat behave
  as today; late stream events cannot restore cleared content.
- Keys never appear in the browser bundle, network responses, or logs.
- Correct behavior for rate limits, bad input, disconnect, cancel, provider
  timeout, exhausted spend — including mid-stream failure.
- No invented roles/achievements; sources accurate across en/hi/ja/sa/zh/ru.
- No new cookies, locale prefixes, analytics scripts, or silent background downloads.

## Alternatives considered

- **Stay on-device only (ADR-0012)** — rejected as the primary generative path;
  download and device variance dominate visitor experience.
- **Embeddings + vector DB** — rejected for now; corpus is small; TF-IDF is enough
  until measured retrieval quality fails.
- **Self-host full model on Vercel functions** — rejected; cold start and binary
  size are unsuitable.
- **Always-on server AI with no Quick fallback** — rejected; need a free, private,
  offline-capable default.

## References

- [PORTFOLIO_UPDATE_NOTES.md](../PORTFOLIO_UPDATE_NOTES.md) — “Server/API migration plan”
- [OpenAI latency guidance](https://developers.openai.com/api/docs/guides/latency-optimization)
- [Streaming responses](https://developers.openai.com/api/docs/guides/streaming-responses)
- `src/lib/chatbot/`, `src/components/chatbot/`, `src/app/api/contact/route.ts` (pattern for Zod + rate-limit)
- Follow-up product plan: [docs/plans/portfolio_followup_2026-10.md](../plans/portfolio_followup_2026-10.md)
