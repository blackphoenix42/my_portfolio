import type { ModelRecord } from "@mlc-ai/web-llm";
import { retrieve, type Chunk, type Corpus, type RankedChunk } from "./retrieval";

// Optional on-device generation for "Ask my portfolio" (ADR-0012). Everything
// here is pure so it can be unit-tested; the runtimes live in
// src/components/chatbot/ and only load after the visitor picks an AI engine.

const HF = "https://huggingface.co/mlc-ai";
// Pinned commit + SRI hashes: the WASM model library is executable code, so it
// must be immutable and verified before it runs.
const LIBS =
  "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/025bcaf3780fa8254f5e5efd3bfea0a5397248f4/web-llm-models/v0_2_84/base";

export type LlmModel = ModelRecord;

export const LLM_MODELS: Record<"f16" | "f32", LlmModel> = {
  f16: {
    model: `${HF}/Llama-3.2-1B-Instruct-q4f16_1-MLC/resolve/2a37b0a5ecb622d51ddc2fac74de0b95872affd7/`,
    model_id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    model_lib: `${LIBS}/Llama-3.2-1B-Instruct-q4f16_1_cs1k-webgpu.wasm`,
    vram_required_MB: 879.04,
    low_resource_required: true,
    required_features: ["shader-f16"],
    overrides: { context_window_size: 4096 },
    integrity: {
      config: "sha256-DsUTtUtBmtRxAGQwaGvc/6rnECtB97Akb7/N4lF6zH8=",
      model_lib: "sha256-Kqm18MjeUy9sv2u3uGOqoCZFv2//hWCDsgL5aHEtP5I=",
      tokenizer: { "tokenizer.json": "sha256-eePlImNfMXEwCRO7QhRkqH3mIiGCoFcLmyzLoqlksrQ=" },
    },
  },
  f32: {
    model: `${HF}/Llama-3.2-1B-Instruct-q4f32_1-MLC/resolve/a949835e0f9a65335bd834db02a44cf8fae34020/`,
    model_id: "Llama-3.2-1B-Instruct-q4f32_1-MLC",
    model_lib: `${LIBS}/Llama-3.2-1B-Instruct-q4f32_1_cs1k-webgpu.wasm`,
    vram_required_MB: 1128.82,
    low_resource_required: true,
    overrides: { context_window_size: 4096 },
    integrity: {
      config: "sha256-BGVh5aSNDJJrH8pWNyDFNIe1kUn+lYoYmo7mwI4O7zQ=",
      model_lib: "sha256-oUB0BMuFt9vG20vXdWkpHwLatQqusdxZWxdZXC4gTGY=",
      tokenizer: { "tokenizer.json": "sha256-eePlImNfMXEwCRO7QhRkqH3mIiGCoFcLmyzLoqlksrQ=" },
    },
  },
};

export const LLM_MODEL_NAME = "Llama 3.2 1B";
/** One-time download size shown before opt-in (Hugging Face repo size). */
export const LLM_DOWNLOAD_MB = 705;
/** Approximate GPU memory while loaded (WebLLM's `vram_required_MB`). */
export const LLM_GPU_MEMORY_GB = 0.9;

/** CPU (WebAssembly, llama.cpp via wllama) model: smaller so it stays usable without a GPU. */
export const CPU_MODEL = {
  name: "Qwen2.5 0.5B",
  // GGUF weights are data, not code; the revision pin keeps them immutable.
  url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/9217f5db79a29953eb74d5343926648285ec7e67/qwen2.5-0.5b-instruct-q4_0.gguf",
  downloadMB: 429,
  contextWindow: 4096,
} as const;

export type ChatTurn = { role: "user" | "assistant"; content: string };
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export const MAX_HISTORY_MESSAGES = 4;
export const MAX_HISTORY_CHARS = 400;

/**
 * Top chunks for a question. Follow-ups ("and its impact?") are also searched
 * together with the previous question, and both rankings are interleaved so a
 * pronoun still finds the right project while a topic switch still works.
 */
export function selectContext(
  question: string,
  history: ChatTurn[],
  corpus: Corpus,
  k: number,
): RankedChunk[] {
  const primary = retrieve(question, corpus, k);
  const lastUser = history.findLast((t) => t.role === "user");
  if (!lastUser) return primary;
  const followUp = retrieve(`${lastUser.content} ${question}`, corpus, k);
  const out: RankedChunk[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < k && out.length < k; i++) {
    for (const r of [followUp[i], primary[i]]) {
      if (r && !seen.has(r.chunk.id) && out.length < k) {
        seen.add(r.chunk.id);
        out.push(r);
      }
    }
  }
  return out;
}

export function buildChatMessages({
  name,
  question,
  context,
  history,
  maxContextChars,
  length = "short",
}: {
  name: string;
  question: string;
  context: Chunk[];
  history: ChatTurn[];
  maxContextChars: number;
  length?: "short" | "detailed";
}): ChatMessage[] {
  const blocks: string[] = [];
  let used = 0;
  for (const chunk of context) {
    const separator = blocks.length ? 2 : 0;
    const remaining = maxContextChars - used - separator;
    if (remaining <= 0) break;
    const block = `[${chunk.title}]\n${chunk.text}`.slice(0, remaining);
    blocks.push(block);
    used += block.length + separator;
  }
  const system = [
    `You are the assistant on ${name}'s portfolio website. Visitors ask about ${name}'s work, projects, skills, experience and how to get in touch.`,
    "Rules:",
    "- Use ONLY facts from CONTEXT. If CONTEXT does not contain the answer, say the site doesn't mention it (never claim it is false) and suggest the contact page.",
    "- Never invent employers, dates, numbers, links, quotes or opinions, and never expand an abbreviation unless CONTEXT spells it out.",
    `- Refer to ${name} in the third person.`,
    length === "short"
      ? "- Answer in 1-2 short sentences of plain text. No headings or tables."
      : "- Give a detailed answer in up to 8 short sentences, or a short list when listing items. No headings or tables.",
    "- Reply in the same language as the question.",
    "",
    "CONTEXT:",
    blocks.length > 0 ? blocks.join("\n\n") : "(nothing relevant found)",
  ].join("\n");

  const recent = history.slice(-MAX_HISTORY_MESSAGES).map((t) => ({
    role: t.role,
    content: t.content.slice(0, MAX_HISTORY_CHARS),
  }));
  return [{ role: "system", content: system }, ...recent, { role: "user", content: question }];
}

/**
 * Pairs each user question with the AI answer that followed it. Extractive
 * answers are skipped: they are long raw chunks and would crowd the context.
 */
export function toHistory(
  messages: { role: "user" | "bot"; text: string; mode?: "ai" | "lexical" }[],
): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const q = messages[i]!;
    const a = messages[i + 1]!;
    if (q.role === "user" && a.role === "bot" && a.mode === "ai" && a.text.trim()) {
      turns.push({ role: "user", content: q.text }, { role: "assistant", content: a.text });
      i++;
    }
  }
  return turns;
}

/** Strip the Markdown a small model tends to emit; the panel renders plain text. */
export function cleanModelText(text: string): string {
  return text
    .replace(/\*\*|__/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[ \t]*[*-][ \t]+/gm, "• ")
    .trim();
}
