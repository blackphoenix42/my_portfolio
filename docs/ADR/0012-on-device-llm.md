---
id: 0012
title: Optional on-device LLM for "Ask my portfolio" (WebLLM + RAG)
date: 2026-09-29
status: Accepted
owners:
  - "@blackphoenix42"
tags: [ai, security, performance, privacy]
---

# 0012 — Optional on-device LLM for "Ask my portfolio" (WebLLM + RAG)

## Context

ADR-0010 shipped an extractive assistant: TF-IDF retrieval returns raw content
chunks. It is fast and honest, but it doesn't converse — no follow-ups, no
greetings, no summarising across chunks. We want LLM-style answers while
keeping the portfolio's rules:

- **No tracking and no server inference.** The site is static on Vercel, and
  visitor questions must not leave the browser.
- **Content integrity.** The assistant must not invent employers, metrics or
  dates.
- **Performance first.** Nobody should pay for the feature unless they ask for
  it, and it must never make the site janky. If a device can't run it smoothly,
  it should be turned off.

## Decision

Keep ADR-0010's retrieval and add an **opt-in, on-device generator**:

- **Model:** open-source **Llama 3.2 1B Instruct** (q4f16, with a q4f32
  fallback when `shader-f16` is missing), run by **WebLLM** on **WebGPU**.
  Settings also offer **Qwen2.5 0.5B** on CPU using **wllama**. CPU mode
  explicitly disables GPU layers. Quick answers remain the default.
- **Retrieval-augmented generation:** the TF-IDF index picks 2 or 4 chunks
  (follow-ups also search with the previous question). The system prompt allows
  only facts from that context, bans invented numbers and abbreviation
  expansions, and caps answers at a few sentences. Sources are linked below
  every answer, and a disclaimer notes that AI answers can be wrong.
- **Learns from the app:** `scripts/build-chatbot-index.mjs` now derives
  chunks from `src/content/*.ts` (projects, experience, skills, `/now`, system
  design, honors, ratings) through `src/lib/chatbot/ingest.ts` on every
  `predev`/`prebuild`, in addition to the curated
  `chatbot-knowledge.json`. New content becomes answerable without writing
  prompts. Visitor conversations are never used for training. ADR-0013 adds tab-session storage.
- **Opt-in and device-aware:** settings expose quick/GPU/CPU modes and show
  download sizes before selection (~705 MB GPU, ~429 MB CPU). GPU is disabled
  without hardware WebGPU; AI is disabled when reported memory is below 4 GB
  or Data Saver is on. Benchmarks inform recommendations without overriding a
  visitor's explicit choice on a slower device. Preferences and speeds live in
  `phoenix:chat:settings` in localStorage; conversation storage is scoped to the tab session under ADR-0013.
- **Performance controls:** short/detailed answers and focused/thorough context
  change generation budgets. CPU usage can change thread counts only on an
  isolated page; this site currently uses a single CPU thread. Keeping AI warm
  for two minutes after closing is optional; the default releases memory on
  close. Turning AI off or switching engines releases the previous runtime.
- **Off the main thread:** WebLLM runs in `llm.worker.ts`; wllama uses its own
  worker. Both runtimes load only when selected. CPU WASM is copied from the
  locked npm dependency and served same-origin.
- **Graceful fallback:** the generated corpus is imported into the lazy panel,
  removing the separate content-fetch failure path. AI failures use quick
  answers with a neutral mode indicator, never a technical error banner.
- **Supply chain:** the model repo and the WASM model library are pinned to
  immutable commits, and the config, tokenizer and WASM library are checked
  with SRI hashes (`src/lib/chatbot/llm.ts`). A mismatch fails closed back to
  quick answers.

## Consequences

### Positive

- Conversational, grounded answers with follow-ups, at zero server cost, and
  questions never leave the device.
- New site content becomes answerable automatically on the next build.
- No cost for visitors who don't opt in: the idle bundle only grows by the
  small chat glue.

### Negative

- **CSP relaxation:** `script-src` gains `'wasm-unsafe-eval'` (WebAssembly
  compilation only, not JS `eval`). `connect-src` gains `huggingface.co`,
  `*.huggingface.co`, `*.hf.co` and `raw.githubusercontent.com`. This is
  mitigated by commit pinning plus SRI.
- A 1B model still makes mistakes (e.g. expanding acronyms wrongly). The
  prompt, tight context, sources and disclaimer reduce this but can't remove it.
- Large initial downloads and memory use. CPU generation can be slow and
  its smaller model is less capable; recommendations favor quick answers
  when measured performance is low.

### Neutral

- Hugging Face and GitHub see a standard download request when a visitor opts
  in. This is disclosed on `/privacy` and in `docs/PRIVACY.md`.

## Alternatives considered

- **Server endpoint (Ollama / hosted Llama via an OpenAI-compatible API)** —
  rejected for now: needs hosting or API keys, costs money, and sends questions
  off-device.
- **Automatic CPU fallback** — rejected: visitors explicitly choose CPU and
  accept its download and performance trade-offs. Failures use quick answers.
- **Smaller models (SmolLM2-360M, Qwen2.5-0.5B)** — faster, but noticeably
  worse at grounded answers.

## References

- ADR-0010 (retrieval, still in use)
- `src/lib/chatbot/llm.ts`, `src/lib/chatbot/ingest.ts`
- `src/components/chatbot/{gpu-engine,cpu-engine,llm.worker,llm-protocol,use-local-llm}.ts`
- `next.config.mjs` (CSP)
