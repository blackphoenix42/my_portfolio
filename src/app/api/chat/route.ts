import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import {
  isServerChatEnabled,
  selectServerChatContext,
  serverChatRequestSchema,
  streamServerChat,
} from "@/lib/chatbot/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const encoder = new TextEncoder();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function event(type: "sources" | "delta" | "done" | "error", data: unknown): Uint8Array {
  return encoder.encode(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function POST(req: Request) {
  if (!isServerChatEnabled()) return NextResponse.json({ error: "disabled" }, { status: 503 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`chat:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rateLimited" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 60_000) / 1000)) },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalidPayload" }, { status: 400 });
  }
  const parsed = serverChatRequestSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "validationFailed" }, { status: 422 });

  const requestId = crypto.randomUUID();
  const { sources } = selectServerChatContext(parsed.data);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(event("sources", { requestId, sources }));
      try {
        const deltas = await streamServerChat(parsed.data, req.signal);
        for await (const delta of deltas) controller.enqueue(event("delta", { requestId, delta }));
        controller.enqueue(event("done", { requestId }));
      } catch {
        controller.enqueue(event("error", { requestId, error: "unavailable" }));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
