import { z } from "zod";
import bundledCorpus from "../../../public/chatbot/corpus.json";
import { SITE } from "@/content/profile";
import { routing } from "@/i18n/routing";
import { buildChatMessages, selectContext, type ChatTurn } from "./llm";
import type { Corpus, RankedChunk } from "./retrieval";
import { generationBudget } from "./settings";

const corpus = bundledCorpus as unknown as Corpus;
const MAX_MESSAGE_CHARS = 1000;

const historyTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(400),
});

export const serverChatRequestSchema = z.object({
  chatId: z.string().trim().min(1).max(128),
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  history: z.array(historyTurnSchema).max(4).default([]),
  locale: z.enum(routing.locales),
  length: z.enum(["short", "detailed"]).default("short"),
});

export type ServerChatRequest = z.infer<typeof serverChatRequestSchema>;
export type ServerChatSource = { source: string; href?: string };

export function isServerChatEnabled(): boolean {
  return process.env.CHAT_API_ENABLED === "true";
}

export function selectServerChatContext(input: ServerChatRequest): {
  messages: ReturnType<typeof buildChatMessages>;
  sources: ServerChatSource[];
} {
  const budget = generationBudget({ length: input.length, context: "focused" });
  const history: ChatTurn[] = input.history;
  const ranked = selectContext(input.message, history, corpus, budget.contextChunks);
  const context = ranked.map((result) => result.chunk);
  const baseline = corpus.chunks.find((chunk) => chunk.id === "profile");
  if (baseline && !context.some((chunk) => chunk.id === baseline.id)) context.push(baseline);
  return {
    messages: buildChatMessages({
      name: SITE.name,
      question: input.message,
      context,
      history,
      maxContextChars: budget.maxContextChars,
      length: input.length,
    }),
    sources: sourcesFromRanked(ranked),
  };
}

function sourcesFromRanked(results: RankedChunk[]): ServerChatSource[] {
  const seen = new Set<string>();
  return results.flatMap(({ chunk }) => {
    if (seen.has(chunk.source)) return [];
    seen.add(chunk.source);
    return [{ source: chunk.source, href: chunk.href }];
  });
}

export function serverChatConfig():
  | { ok: true; apiKey: string; baseUrl: string; model: string }
  | { ok: false } {
  const apiKey = process.env.CHAT_API_KEY?.trim();
  const baseUrl = process.env.CHAT_API_BASE_URL?.trim().replace(/\/$/, "");
  const model = process.env.CHAT_API_MODEL?.trim();
  return apiKey && baseUrl && model ? { ok: true, apiKey, baseUrl, model } : { ok: false };
}

/**
 * Streams plain text deltas from an OpenAI-compatible Chat Completions endpoint.
 * The provider URL and credentials are server-only environment configuration.
 */
export async function streamServerChat(
  input: ServerChatRequest,
  signal?: AbortSignal,
): Promise<AsyncGenerator<string>> {
  const config = serverChatConfig();
  if (!config.ok) throw new Error("serverUnavailable");
  const { messages } = selectServerChatContext(input);
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: 0,
      max_tokens: generationBudget({ length: input.length, context: "focused" }).maxTokens,
    }),
    signal,
  });
  if (!response.ok || !response.body) throw new Error("providerFailed");
  return readOpenAiDeltas(response.body);
}

async function* readOpenAiDeltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";
      for (const event of events) {
        for (const line of event.split(/\r?\n/)) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") return;
          try {
            const parsed = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {
            // Ignore malformed provider keepalive events; valid deltas still stream.
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
