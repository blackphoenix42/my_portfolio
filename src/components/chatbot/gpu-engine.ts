import { LLM_MODELS, type ChatMessage } from "@/lib/chatbot/llm";
import type { Speed } from "@/lib/chatbot/settings";
import type { LoadStatus, LocalEngine } from "./engine-types";
import type { LlmEvent, LlmRequest } from "./llm-protocol";

// Browser-only client for llm.worker.ts (WebLLM on WebGPU). The worker and the
// ~6 MB WebLLM bundle inside it are only created by load().

let worker: Worker | null = null;
let ready: Promise<Speed> | null = null;
let onStatus: ((status: LoadStatus) => void) | null = null;
let unloadTimer: ReturnType<typeof setTimeout> | null = null;
let nextChatId = 0;
/** Pending streams to fail if the worker dies or is unloaded mid-answer. */
const aborts = new Set<(err: Error) => void>();

function cancelScheduledUnload() {
  if (unloadTimer) clearTimeout(unloadTimer);
  unloadTimer = null;
}

function unload() {
  cancelScheduledUnload();
  worker?.terminate();
  worker = null;
  ready = null;
  onStatus = null;
  for (const abort of [...aborts]) abort(new Error("GPU engine unloaded"));
}

function load(f16: boolean, status: (status: LoadStatus) => void): Promise<Speed> {
  cancelScheduledUnload();
  onStatus = status;
  if (!ready) {
    const w = new Worker(new URL("./llm.worker.ts", import.meta.url), { type: "module" });
    worker = w;
    const pending = new Promise<Speed>((resolve, reject) => {
      w.addEventListener("message", (e: MessageEvent<LlmEvent>) => {
        const event = e.data;
        if (event.type === "progress") onStatus?.({ phase: "download", fraction: event.progress });
        else if (event.type === "benchmarking") onStatus?.({ phase: "warmup" });
        else if (event.type === "ready")
          resolve({ decodeTps: event.decodeTps, prefillTps: event.prefillTps });
        else if (event.type === "load-error") reject(new Error(event.message));
      });
      w.addEventListener("error", () => {
        reject(new Error("GPU worker crashed"));
        if (worker === w) unload();
      });
    });
    ready = pending;
    pending.catch(() => {
      if (ready === pending) unload();
    });
    const model = f16 ? LLM_MODELS.f16 : LLM_MODELS.f32;
    w.postMessage({ type: "load", model } satisfies LlmRequest);
  }
  return ready;
}

async function* stream(messages: ChatMessage[], maxTokens: number): AsyncGenerator<string> {
  const w = worker;
  if (!w || !ready) throw new Error("GPU engine is not loaded");
  await ready;

  const id = ++nextChatId;
  const queue: string[] = [];
  let finished = false;
  let failure: Error | null = null;
  let wake: (() => void) | null = null;
  const notify = () => {
    wake?.();
    wake = null;
  };
  const abort = (err: Error) => {
    failure = err;
    notify();
  };
  const onMessage = (e: MessageEvent<LlmEvent>) => {
    const event = e.data;
    if (!("id" in event) || event.id !== id) return;
    if (event.type === "delta") queue.push(event.text);
    else if (event.type === "done") finished = true;
    else failure = new Error(event.message);
    notify();
  };

  aborts.add(abort);
  w.addEventListener("message", onMessage);
  w.postMessage({ type: "chat", id, messages, maxTokens } satisfies LlmRequest);
  try {
    while (true) {
      const next = queue.shift();
      if (next !== undefined) {
        yield next;
        continue;
      }
      if (failure) throw failure;
      if (finished) return;
      await new Promise<void>((resolve) => {
        wake = resolve;
      });
    }
  } finally {
    aborts.delete(abort);
    w.removeEventListener("message", onMessage);
  }
}

export function gpuEngine(f16: boolean): LocalEngine {
  return {
    load: (status) => load(f16, status),
    stream,
    interrupt: () => worker?.postMessage({ type: "interrupt" } satisfies LlmRequest),
    unload,
    scheduleUnload: (ms) => {
      cancelScheduledUnload();
      onStatus = null;
      unloadTimer = setTimeout(unload, ms);
    },
  };
}

/** WebLLM keeps its downloads in these Cache Storage buckets. */
export async function deleteGpuModels(): Promise<void> {
  unload();
  await Promise.all(
    ["webllm/model", "webllm/wasm", "webllm/config"].map((name) => caches.delete(name)),
  );
}
