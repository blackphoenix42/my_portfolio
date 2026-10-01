import type { ChatMessage, LlmModel } from "@/lib/chatbot/llm";
import type { Speed } from "@/lib/chatbot/settings";

// Message protocol between the chat UI and llm.worker.ts. Keeping WebLLM
// entirely inside the worker means the main thread never parses its ~6 MB bundle.

export type LlmRequest =
  | { type: "load"; model: LlmModel }
  | { type: "chat"; id: number; messages: ChatMessage[]; maxTokens: number }
  | { type: "interrupt" };

export type LlmEvent =
  | { type: "progress"; progress: number }
  | { type: "benchmarking" }
  | ({ type: "ready" } & Speed)
  | { type: "load-error"; message: string }
  | { type: "delta"; id: number; text: string }
  | { type: "done"; id: number }
  | { type: "chat-error"; id: number; message: string };
