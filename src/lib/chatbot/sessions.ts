import { z } from "zod";

export const CHATS_KEY = "phoenix:chat:sessions";
export const MAX_CHATS = 20;
const sourceSchema = z.object({
  source: z.string().max(200),
  href: z
    .string()
    .regex(/^\/(?!\/)[^\s\\]*$/)
    .max(300)
    .optional(),
});
const messageSchema = z.object({
  id: z.number().int().nonnegative(),
  role: z.enum(["user", "bot"]),
  text: z.string().max(16000),
  mode: z.enum(["ai", "lexical"]).optional(),
  sources: z.array(sourceSchema).max(8).optional(),
});
export type Message = z.infer<typeof messageSchema> & { streaming?: boolean };
export type Chat = { id: string; messages: Message[]; contextStart: number };
export type ChatSessions = { activeId: string; chats: Chat[] };

export function emptySessions(): ChatSessions {
  return { activeId: "first", chats: [{ id: "first", messages: [], contextStart: 0 }] };
}

/** Session storage is untrusted, including links restored into the transcript. */
export function parseSessions(raw: string | null): ChatSessions {
  try {
    const parsed = z
      .object({
        activeId: z.string(),
        chats: z
          .array(
            z.object({
              id: z.string().min(1).max(100),
              messages: z.array(messageSchema).max(100),
              contextStart: z.number().int().nonnegative(),
            }),
          )
          .min(1)
          .max(MAX_CHATS),
      })
      .parse(JSON.parse(raw ?? "null"));
    if (
      !parsed.chats.some((c) => c.id === parsed.activeId) ||
      new Set(parsed.chats.map((c) => c.id)).size !== parsed.chats.length ||
      parsed.chats.some((c) => c.contextStart > c.messages.length)
    )
      return emptySessions();
    return parsed;
  } catch {
    return emptySessions();
  }
}

/** Bound storage without moving the context boundary onto an older turn. */
export function updateChat(chat: Chat, messages: Message[]): Chat {
  const dropped = Math.max(0, messages.length - 100);
  return {
    ...chat,
    messages: messages.slice(dropped),
    contextStart: Math.max(0, chat.contextStart - dropped),
  };
}
