import { describe, expect, it } from "vitest";
import { emptySessions, parseSessions, updateChat, type Chat } from "@/lib/chatbot/sessions";

describe("independent chat sessions", () => {
  it("restores separate transcripts and context reset boundaries", () => {
    const data = {
      activeId: "a",
      chats: [
        { id: "a", messages: [{ id: 1, role: "user", text: "MAESTRO" }], contextStart: 1 },
        { id: "b", messages: [{ id: 2, role: "user", text: "C++" }], contextStart: 0 },
      ],
    };
    expect(parseSessions(JSON.stringify(data))).toEqual(data);
  });
  it("recovers from invalid storage and rejects unsafe source links", () => {
    for (const raw of [
      null,
      "{",
      "null",
      JSON.stringify({ activeId: "x", chats: [] }),
      JSON.stringify({
        activeId: "a",
        chats: [
          {
            id: "a",
            contextStart: 0,
            messages: [
              { id: 0, role: "bot", text: "x", sources: [{ source: "x", href: "//evil.test" }] },
            ],
          },
        ],
      }),
      JSON.stringify({ activeId: "missing", chats: [{ id: "a", messages: [], contextStart: 0 }] }),
      JSON.stringify({ activeId: "a", chats: [{ id: "a", messages: [], contextStart: 1 }] }),
      JSON.stringify({
        activeId: "a",
        chats: [
          { id: "a", messages: [], contextStart: 0 },
          { id: "a", messages: [], contextStart: 0 },
        ],
      }),
    ])
      expect(parseSessions(raw)).toEqual(emptySessions());
  });
  it("drops stale streaming flags on reload", () => {
    const data = emptySessions();
    data.chats[0]!.messages.push({ id: 0, role: "bot", text: "partial", streaming: true });
    expect(parseSessions(JSON.stringify(data)).chats[0]!.messages[0]).not.toHaveProperty(
      "streaming",
    );
  });
  it("rejects links that browsers normalize to an external origin", () => {
    for (const href of ["/\\evil.test", "/\t/evil.test", "/\n/evil.test"]) {
      const data = emptySessions();
      data.chats[0]!.messages.push({
        id: 0,
        role: "bot",
        text: "source",
        sources: [{ source: "unsafe", href }],
      });
      expect(parseSessions(JSON.stringify(data))).toEqual(emptySessions());
    }
  });
  it("bounds history and keeps the reset boundary aligned after trimming", () => {
    const chat: Chat = { id: "a", messages: [], contextStart: 10 };
    const messages = Array.from({ length: 106 }, (_, id) => ({
      id,
      role: "user" as const,
      text: String(id),
    }));
    const result = updateChat(chat, messages);
    expect(result.messages).toHaveLength(100);
    expect(result.messages[result.contextStart]!.text).toBe("10");
    expect(updateChat({ ...chat, contextStart: 2 }, messages).contextStart).toBe(0);
    expect(updateChat(chat, []).messages).toEqual([]);
  });
});
