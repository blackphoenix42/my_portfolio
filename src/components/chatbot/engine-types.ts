import type { ChatMessage } from "@/lib/chatbot/llm";
import type { Speed } from "@/lib/chatbot/settings";

export type LoadStatus = { phase: "download"; fraction: number } | { phase: "warmup" };

/** Shared shape of the GPU (WebLLM) and CPU (wllama) runtimes. */
export type LocalEngine = {
  /** Loads (or reuses) the model and measures its speed on this device. */
  load(status: (status: LoadStatus) => void): Promise<Speed>;
  stream(messages: ChatMessage[], maxTokens: number): AsyncGenerator<string>;
  interrupt(): void;
  /** Frees memory immediately, even mid-download. */
  unload(): void;
  scheduleUnload(ms: number): void;
};
