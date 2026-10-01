---
id: 0010
title: Client-side "Ask my portfolio" via TF-IDF lexical search
date: 2026-06-13
status: Accepted (amended by ADR-0012)
owners:
  - "@blackphoenix42"
tags: [ai, search, security, performance]
---

# 0010 — Client-side "Ask my portfolio" via TF-IDF lexical search

> **Amended by [ADR-0012](0012-on-device-llm.md):** retrieval below is still
> used, and now also feeds an optional, opt-in on-device LLM. That ADR relaxes
> the CSP described here.

## Context

We wanted a small "ask me anything" assistant that answers from real portfolio
content. Constraints from this repo are strict:

- **No tracking, no new cookies, no third-party scripts** (see README content
  and privacy rules).
- **A tight Content-Security-Policy** — `script-src` is `'self' 'unsafe-inline'`
  in production with no `'unsafe-eval'`.
- **SSG-friendly and cheap** — no per-request server inference.

The obvious approach, in-browser embeddings via `transformers.js`, pulls a
multi-megabyte model and an ONNX/WebAssembly runtime that would require relaxing
the CSP with `'wasm-unsafe-eval'` and shipping large assets.

## Decision

Implement retrieval as a **dependency-free TF-IDF lexical index** computed
entirely in plain JavaScript:

- `src/lib/chatbot/embed.ts` — tokenizer, term-frequency, IDF weighting and
  vector normalization.
- `src/lib/chatbot/retrieval.ts` — cosine similarity + ranking.
- `src/content/chatbot-knowledge.json` — a curated corpus of public facts.
- `scripts/build-chatbot-index.mjs` — precomputes `public/chatbot/corpus.json`
  at build time (wired into `prebuild`).
- `src/components/chatbot/ask-portfolio*.tsx` — lazy-loaded UI that bundles the
  generated corpus and returns extractive answers with sources.

## Consequences

### Positive

- **Retrieval stays local** — the corpus ships with the lazy chat panel.
  Optional AI uses WebAssembly under the CSP described in ADR-0012.
- **Tiny + offline** — kilobytes of JSON instead of a model download; works with
  no network after first load.
- **Content integrity** — answers are extractive from a curated corpus, so the
  bot can't invent employers, metrics, or testimonials.
- **No server cost** — fully client-side, SSG-compatible.

### Negative

- Lexical matching is less "semantic" than embeddings; paraphrased questions can
  miss. Mitigated by curating the corpus and suggested questions.
- English-only corpus today; non-English questions fall back to English answers
  (disclosed in the UI).

### Neutral

- The corpus changes per deploy, so `/chatbot/*` is served with a short,
  revalidating cache (`max-age=600, stale-while-revalidate`), not `immutable`.

## Alternatives considered

- **transformers.js + self-hosted MiniLM/ONNX** — rejected: requires
  `'wasm-unsafe-eval'`, multi-MB assets, and a heavier cold start.
- **Server API (RAG) with a hosted LLM** — rejected: adds a network dependency,
  cost, and a tracking/abuse surface; conflicts with the no-tracking rule.

## References

- `next.config.mjs` (CSP + `/chatbot` cache header)
- `src/lib/chatbot/*`, `scripts/build-chatbot-index.mjs`
- ADR-0008 (easter eggs), README "content integrity"
