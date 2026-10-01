import type { Wllama } from "@wllama/wllama/esm/index.js";
import { CPU_MODEL, type ChatMessage } from "@/lib/chatbot/llm";
import type { Speed } from "@/lib/chatbot/settings";
import type { LoadStatus, LocalEngine } from "./engine-types";

// CPU engine: llama.cpp compiled to WebAssembly (wllama), which runs inference
// in its own worker. Multi-threaded when the page is cross-origin isolated.

/** Copied from node_modules by scripts/copy-wllama-wasm.mjs so it is served same-origin. */
const WASM_URL = "/wllama/wllama.wasm";
const BENCHMARK_PROMPT = `Reply with one short sentence. ${"The simulator profiles hot paths and reports throughput. ".repeat(12)}`;
const noop = () => undefined;
const SILENT = { debug: noop, log: noop, warn: noop, error: noop };

let instance: Wllama | null = null;
let ready: Promise<Speed> | null = null;
let loadedThreads = 0;
let onStatus: ((status: LoadStatus) => void) | null = null;
let unloadTimer: ReturnType<typeof setTimeout> | null = null;
let download: AbortController | null = null;
let generation: AbortController | null = null;
let released: Promise<unknown> = Promise.resolve();

function cancelScheduledUnload() {
  if (unloadTimer) clearTimeout(unloadTimer);
  unloadTimer = null;
}

function unload() {
  cancelScheduledUnload();
  download?.abort();
  generation?.abort();
  // Wait for in-flight writes and worker shutdown before deleting model files.
  released = Promise.allSettled([released, ready, instance?.exit()]);
  instance = null;
  ready = null;
  onStatus = null;
}

async function measure(w: Wllama): Promise<Speed> {
  const started = performance.now();
  let firstToken = 0;
  let pieces = 0;
  let timings: { prompt_per_second: number; predicted_per_second: number } | undefined;
  let promptTokens = BENCHMARK_PROMPT.length / 4;
  const stream = await w.createChatCompletion({
    messages: [{ role: "user", content: BENCHMARK_PROMPT }],
    stream: true,
    max_tokens: 16,
    temperature: 0,
  });
  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta.content) {
      firstToken ||= performance.now();
      pieces++;
    }
    timings = chunk.timings ?? timings;
    promptTokens = chunk.usage?.prompt_tokens ?? promptTokens;
  }
  if (timings) {
    return { decodeTps: timings.predicted_per_second, prefillTps: timings.prompt_per_second };
  }
  const ended = performance.now();
  const seconds = (ms: number) => Math.max(ms, 1) / 1000;
  return {
    prefillTps: promptTokens / seconds((firstToken || ended) - started),
    decodeTps: pieces / seconds(ended - (firstToken || started)),
  };
}

function load(threads: number, status: (status: LoadStatus) => void): Promise<Speed> {
  cancelScheduledUnload();
  if (ready && loadedThreads !== threads) unload();
  onStatus = status;
  if (!ready) {
    loadedThreads = threads;
    const controller = new AbortController();
    download = controller;
    const pending = (async () => {
      const { Wllama } = await import("@wllama/wllama/esm/index.js");
      controller.signal.throwIfAborted();
      const w = new Wllama({ default: WASM_URL }, { suppressNativeLog: true, logger: SILENT });
      instance = w;
      await w.loadModelFromUrl(CPU_MODEL.url, {
        n_ctx: CPU_MODEL.contextWindow,
        n_gpu_layers: 0,
        n_threads: threads,
        signal: controller.signal,
        progressCallback: ({ loaded, total }) =>
          onStatus?.({ phase: "download", fraction: total > 0 ? loaded / total : 0 }),
      });
      controller.signal.throwIfAborted();
      onStatus?.({ phase: "warmup" });
      return measure(w);
    })();
    ready = pending;
    pending.catch(() => {
      if (ready === pending) unload();
    });
  }
  return ready;
}

async function* stream(messages: ChatMessage[], maxTokens: number): AsyncGenerator<string> {
  if (!ready) throw new Error("CPU engine is not loaded");
  await ready;
  const w = instance;
  if (!w) throw new Error("CPU engine is not loaded");
  const controller = new AbortController();
  generation = controller;
  try {
    const chunks = await w.createChatCompletion({
      messages,
      stream: true,
      max_tokens: maxTokens,
      temperature: 0.2,
      top_p: 0.9,
      abortSignal: controller.signal,
    });
    for await (const chunk of chunks) {
      const text = chunk.choices[0]?.delta.content;
      if (text) yield text;
    }
  } catch (err) {
    // Stopping an answer aborts the stream; that's a normal end, not a failure.
    if (!controller.signal.aborted) throw err;
  } finally {
    if (generation === controller) generation = null;
  }
}

export function cpuEngine(threads: number): LocalEngine {
  return {
    load: (status) => load(threads, status),
    stream,
    interrupt: () => generation?.abort(),
    unload,
    scheduleUnload: (ms) => {
      cancelScheduledUnload();
      onStatus = null;
      unloadTimer = setTimeout(unload, ms);
    },
  };
}

/** wllama keeps downloaded GGUF files in its own cache (OPFS). */
export async function deleteCpuModels(): Promise<void> {
  unload();
  await released;
  const { Wllama } = await import("@wllama/wllama/esm/index.js");
  await new Wllama({ default: WASM_URL }, { logger: SILENT }).cacheManager.clear();
}
