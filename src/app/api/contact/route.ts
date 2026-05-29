import { NextResponse } from "next/server";
import {
  contactSchema,
  ALLOWED_ATTACHMENT_MIME,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_TOTAL_BYTES,
  type ContactInput,
} from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactEmail, type Attachment } from "@/lib/email";

export const runtime = "nodejs";

// Node default body limit is generous enough for our 10 MB attachment cap.
// Vercel's default is 4.5 MB on Hobby; we set the route segment config so the
// platform sizes the request body buffer correctly.
export const maxDuration = 30;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";

  const limit = rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    const retrySec = Math.max(1, Math.ceil((limit.retryAfterMs ?? RATE_WINDOW_MS) / 1000));
    return NextResponse.json(
      {
        error: "rateLimited",
        retryAfterSec: retrySec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retrySec),
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // Accept multipart (with attachments) and JSON (legacy / no attachments).
  let payload: unknown;
  const attachments: Attachment[] = [];

  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.startsWith("multipart/form-data")) {
      const form = await req.formData();
      payload = {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        company: String(form.get("company") ?? ""),
        role: String(form.get("role") ?? ""),
        otherRole: String(form.get("otherRole") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
        website: String(form.get("website") ?? ""),
        phone: String(form.get("phone") ?? ""),
        opportunity: form.get("opportunity") === "true",
      };

      const files = form.getAll("attachments").filter((v): v is File => v instanceof File);
      if (files.length > MAX_ATTACHMENTS) {
        return NextResponse.json(
          { error: "tooManyAttachments", max: MAX_ATTACHMENTS },
          { status: 413 },
        );
      }

      let total = 0;
      for (const file of files) {
        if (
          !ALLOWED_ATTACHMENT_MIME.includes(file.type as (typeof ALLOWED_ATTACHMENT_MIME)[number])
        ) {
          return NextResponse.json(
            { error: "unsupportedAttachmentType", filename: file.name, type: file.type },
            { status: 415 },
          );
        }
        total += file.size;
        if (total > MAX_ATTACHMENT_TOTAL_BYTES) {
          return NextResponse.json(
            {
              error: "attachmentsTooLarge",
              maxBytes: MAX_ATTACHMENT_TOTAL_BYTES,
            },
            { status: 413 },
          );
        }
        const buf = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buf,
          contentType: file.type,
        });
      }
    } else {
      payload = await req.json();
    }
  } catch {
    return NextResponse.json({ error: "invalidPayload" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validationFailed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Honeypot — silently accept (don't reveal it's a trap to the bot).
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const result = await sendContactEmail(parsed.data as ContactInput, { ip, ua }, attachments);
    return NextResponse.json(result);
  } catch (err) {
    // The Resend wrapper now throws on { error } responses; log the detail
    // (visible in Vercel logs) but never echo provider internals to the client.
    console.error("[contact] send failed", err);
    return NextResponse.json({ error: "sendFailed" }, { status: 502 });
  }
}
