import { CreateMLCEngine, type MLCEngineInterface } from "@mlc-ai/web-llm";
import type { Speed } from "@/lib/chatbot/settings";
import type { LlmEvent, LlmRequest } from "./llm-protocol";

// Runs WebLLM download, WebGPU setup and inference off the main thread.
let engine: Promise<MLCEngineInterface> | null = null;

const post = (event: LlmEvent) => self.postMessage(event);
const describe = (err: unknown) => (err instanceof Error ? err.message : String(err));

// ~250 prompt tokens: long enough to measure prefill, short enough to finish in seconds.
const BENCHMARK_PROMPT = `Reply with one short sentence. ${"The simulator profiles hot paths and reports throughput. ".repeat(25)}`;

async function measure(eng: MLCEngineInterface): Promise<Speed> {
  const reply = await eng.chat.completions.create({
    messages: [{ role: "user", content: BENCHMARK_PROMPT }],
    max_tokens: 24,
    temperature: 0,
  });
  await eng.resetChat();
  return {
    decodeTps: reply.usage?.extra.decode_tokens_per_s ?? 0,
    prefillTps: reply.usage?.extra.prefill_tokens_per_s ?? 0,
  };
}

async function chat({ id, messages, maxTokens }: Extract<LlmRequest, { type: "chat" }>) {
  try {
    if (!engine) throw new Error("model not loaded");
    const stream = await (
      await engine
    ).chat.completions.create({
      messages,
      stream: true,
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: maxTokens,
    });
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta.content;
      if (text) post({ type: "delta", id, text });
    }
    post({ type: "done", id });
  } catch (err) {
    post({ type: "chat-error", id, message: describe(err) });
  }
}

self.onmessage = (e: MessageEvent<LlmRequest>) => {
  const msg = e.data;
  switch (msg.type) {
    case "load":
      if (!engine) {
        const loading = CreateMLCEngine(msg.model.model_id, {
          appConfig: { model_list: [msg.model] },
          initProgressCallback: (report) => post({ type: "progress", progress: report.progress }),
        });
        engine = loading;
        loading
          .then((eng) => {
            post({ type: "benchmarking" });
            return measure(eng);
          })
          .then(
            (speed) => post({ type: "ready", ...speed }),
            (err: unknown) => {
              engine = null;
              post({ type: "load-error", message: describe(err) });
            },
          );
      }
      break;
    case "chat":
      void chat(msg);
      break;
    case "interrupt":
      void engine?.then((eng) => eng.interruptGenerate()).catch(() => undefined);
      break;
  }
};
