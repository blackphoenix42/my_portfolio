---
id: 0013
title: Session-scoped Ask Ayush conversations
date: 2026-10-01
status: Accepted
owners:
  - "@blackphoenix42"
tags: [chatbot, privacy, performance]
---

# 0013 — Session-scoped Ask Ayush conversations

## Context

Visitors need independent conversations, an explicit context reset and a way to
delete downloaded models. The existing assistant discards messages on close and
has model-cache deletion helpers without a UI. Site settings must expose the same
assistant settings without creating a second model runtime.

## Decision

Store independent conversations in tab-scoped session storage, validated on read
and bounded to 20 chats and 100 messages per chat. Each chat owns a context boundary:
Clear context advances it; Clear chat erases the transcript and resets it. Chat
switching and clearing are disabled while generating; Stop remains available.

Both settings entry points open one lazy assistant panel. Model removal stops the
runtime, persists quick mode and attempts both GPU and CPU cache deletion, reporting
partial failure for retry. Short answers use a 96-token cap and 1,400-character
retrieval budget; a stalled first-token wait falls back to quick answers after eight
seconds. Backend inference remains a documented proposal, not an enabled service.

## Consequences

### Positive

- Conversations survive closing the panel and reloading the tab, without cookies
  or server-side storage. Settings have a single runtime owner.
- Explicit reset semantics prevent earlier transcript entries entering new prompts.

### Negative

- Session storage can be unavailable or full; the current panel then retains chats
  only in memory. Browser session restoration can restore session storage.
- Slow local inference still depends on hardware. The timeout bounds a stalled
  generation attempt, not model download, compilation or benchmark warmup.

### Neutral

- Privacy copy now describes browser-local transcript retention and deletion.
- Engineer Mode starts off on full loads; users enable it in Site settings.

## Alternatives considered

- **Long-lived local storage for chats** — unnecessary retention for a public portfolio.
- **Separate settings runtime** — risks simultaneous downloads and conflicting state.
- **Immediate server inference** — requires provider, cost and data-handling choices;
  the user requested a plan for this migration.

## References

- [On-device AI](0012-on-device-llm.md)
- [Owner answers and server plan](../PORTFOLIO_UPDATE_NOTES.md)
