import { describe, it, expect } from "vitest";
import { embed, type SparseVector } from "@/lib/chatbot/embed";
import type { Chunk, Corpus } from "@/lib/chatbot/retrieval";
import {
  CPU_MODEL,
  LLM_MODELS,
  MAX_HISTORY_CHARS,
  MAX_HISTORY_MESSAGES,
  buildChatMessages,
  cleanModelText,
  selectContext,
  toHistory,
} from "@/lib/chatbot/llm";

const BUDGET = 2000;

describe("CPU_MODEL", () => {
  it("pins the GGUF weights to an immutable Hugging Face revision", () => {
    expect(CPU_MODEL.url).toMatch(
      /^https:\/\/huggingface\.co\/.+\/resolve\/[0-9a-f]{40}\/.+\.gguf$/,
    );
  });
});

describe("LLM_MODELS", () => {
  it("pins every artifact to an immutable revision with SRI hashes", () => {
    for (const m of Object.values(LLM_MODELS)) {
      expect(m.model).toMatch(/\/resolve\/[0-9a-f]{40}\/$/);
      expect(m.model_lib).toMatch(/binary-mlc-llm-libs\/[0-9a-f]{40}\//);
      expect(m.integrity?.config).toMatch(/^sha256-/);
      expect(m.integrity?.model_lib).toMatch(/^sha256-/);
      expect(m.integrity?.tokenizer?.["tokenizer.json"]).toMatch(/^sha256-/);
    }
  });
});

const idf: SparseVector = { maestro: 1.8, agents: 1.4, stack: 1.3, contact: 1.7, email: 1.5 };
const chunk = (id: string, text: string, title = id): Chunk => ({
  id,
  source: id,
  title,
  text,
  vector: embed(text, idf),
});
const corpus: Corpus = {
  idf,
  chunks: [
    chunk("maestro", "maestro multi agents"),
    chunk("maestro-stack", "maestro stack python mcp"),
    chunk("contact", "contact email"),
  ],
};

describe("selectContext", () => {
  it("uses only the question when there is no history", () => {
    const ids = selectContext("contact email", [], corpus, 3).map((r) => r.chunk.id);
    expect(ids).toEqual(["contact"]);
  });

  it("widens follow-ups with the previous question without duplicates", () => {
    const history = [
      { role: "user" as const, content: "tell me about maestro" },
      { role: "assistant" as const, content: "MAESTRO is…" },
    ];
    const ids = selectContext("what stack?", history, corpus, 3).map((r) => r.chunk.id);
    expect(ids[0]).toBe("maestro-stack");
    expect(ids).toContain("maestro");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("caps the result at k", () => {
    const history = [{ role: "user" as const, content: "maestro contact" }];
    expect(selectContext("agents stack email", history, corpus, 2)).toHaveLength(2);
  });
});

describe("buildChatMessages", () => {
  it("grounds the system prompt in the provided context", () => {
    const [system, user] = buildChatMessages({
      name: "Ayush Yadav",
      question: "What is MAESTRO?",
      context: [chunk("m", "MAESTRO is a multi-agent platform.", "MAESTRO")],
      history: [],
      maxContextChars: BUDGET,
    });
    expect(system?.role).toBe("system");
    expect(system?.content).toContain("Ayush Yadav's portfolio");
    expect(system?.content).toContain("[MAESTRO]\nMAESTRO is a multi-agent platform.");
    expect(system?.content).toMatch(/Never invent/);
    expect(user).toEqual({ role: "user", content: "What is MAESTRO?" });
  });

  it("says so when nothing relevant was retrieved", () => {
    const [system] = buildChatMessages({
      name: "A",
      question: "hi",
      context: [],
      history: [],
      maxContextChars: BUDGET,
    });
    expect(system?.content).toContain("(nothing relevant found)");
  });

  it("drops context blocks past the character budget but keeps the first", () => {
    const big = "x".repeat(BUDGET);
    const [system] = buildChatMessages({
      name: "A",
      question: "q",
      context: [chunk("a", big, "A1"), chunk("b", "second", "B2")],
      history: [],
      maxContextChars: BUDGET,
    });
    expect(system?.content).toContain("[A1]");
    expect(system?.content).not.toContain("[B2]");
    expect(system?.content.split("CONTEXT:\n")[1]?.length).toBeLessThanOrEqual(BUDGET);
  });

  it("keeps only recent, truncated history", () => {
    const history = Array.from({ length: 6 }, (_, i) => ({
      role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `${i}`.padEnd(MAX_HISTORY_CHARS + 50, "y"),
    }));
    const messages = buildChatMessages({
      name: "A",
      question: "q",
      context: [],
      history,
      maxContextChars: BUDGET,
    });
    expect(messages).toHaveLength(MAX_HISTORY_MESSAGES + 2);
    expect(messages[1]?.content.startsWith("2")).toBe(true);
    expect(messages[1]?.content).toHaveLength(MAX_HISTORY_CHARS);
    expect(messages.at(-1)).toEqual({ role: "user", content: "q" });
  });
});

describe("toHistory", () => {
  it("pairs questions with AI answers and skips extractive or empty ones", () => {
    expect(
      toHistory([
        { role: "user", text: "q1" },
        { role: "bot", text: "raw chunk", mode: "lexical" },
        { role: "user", text: "q2" },
        { role: "bot", text: "a2", mode: "ai" },
        { role: "user", text: "q3" },
        { role: "bot", text: "  ", mode: "ai" },
        { role: "user", text: "q4" },
      ]),
    ).toEqual([
      { role: "user", content: "q2" },
      { role: "assistant", content: "a2" },
    ]);
  });
});

describe("cleanModelText", () => {
  it("removes markdown emphasis and heading marks and normalizes bullets", () => {
    expect(cleanModelText("## Summary\n**MAESTRO** is __fast__.\n* Python\n- Bash  ")).toBe(
      "Summary\nMAESTRO is fast.\n• Python\n• Bash",
    );
  });
});
