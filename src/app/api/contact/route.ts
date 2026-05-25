import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";

  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Honeypot
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await sendContactEmail(parsed.data, { ip, ua });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact send failed", err);
    return NextResponse.json(
      { error: "Could not send message. Please email directly." },
      { status: 500 },
    );
  }
}
