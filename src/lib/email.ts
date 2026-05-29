import { Resend } from "resend";
import type { ContactInput } from "./validation";

const apiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.CONTACT_TO_EMAIL ?? "aayush.sang@gmail.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Ayush Portfolio <onboarding@resend.dev>";

export type Attachment = {
  filename: string;
  content: Buffer | string; // Buffer or base64 string
  contentType?: string;
};

export async function sendContactEmail(
  input: ContactInput,
  meta: { ip?: string; ua?: string },
  attachments: Attachment[] = [],
) {
  if (!apiKey) {
    // Soft success in dev — log instead of throwing so the form remains usable locally.
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] (dev) RESEND_API_KEY not set. Payload:", {
        input,
        meta,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          size: typeof a.content === "string" ? a.content.length : a.content.byteLength,
        })),
      });
      return { ok: true, dev: true };
    }
    throw new Error("Email is not configured");
  }
  const resend = new Resend(apiKey);

  const otherDetail = input.role === "Other" && input.otherRole ? ` (${input.otherRole})` : "";
  const subject = `[Portfolio] ${input.role}${otherDetail}: ${input.subject}`;
  const attachmentSummary = attachments
    .map((a) => `${a.filename}${a.contentType ? ` (${a.contentType})` : ""}`)
    .join(", ");
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.company ? `Company: ${input.company}` : null,
    `Role: ${input.role}${otherDetail}`,
    input.opportunity ? `Opportunity: yes` : null,
    attachments.length > 0 ? `Attachments: ${attachmentSummary}` : null,
    "",
    "Message:",
    input.message,
    "",
    `— IP: ${meta.ip ?? "?"}`,
    `— UA: ${meta.ua ?? "?"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui; max-width: 640px; color:#111;">
      <h2 style="margin:0 0 12px;">${escape(input.subject)}</h2>
      <p style="margin:0 0 6px;"><strong>${escape(input.name)}</strong> &lt;${escape(input.email)}&gt;</p>
      ${input.phone ? `<p style="margin:0 0 6px;">Phone: ${escape(input.phone)}</p>` : ""}
      ${input.company ? `<p style="margin:0 0 6px;">Company: ${escape(input.company)}</p>` : ""}
      <p style="margin:0 0 12px;">Role: ${escape(input.role)}${escape(otherDetail)}${input.opportunity ? " · Opportunity" : ""}</p>
      <pre style="white-space:pre-wrap; background:#f6f8fa; padding:12px; border-radius:8px;">${escape(
        input.message,
      )}</pre>
      ${
        attachments.length > 0
          ? `<p style="margin:12px 0 0;font-size:12px;color:#666;">Attachments: ${escape(attachmentSummary)}</p>`
          : ""
      }
      <p style="font-size:12px;color:#666;">IP ${escape(meta.ip ?? "?")} · UA ${escape(meta.ua ?? "?")}</p>
    </div>
  `;

  // IMPORTANT: resend.emails.send() returns { data, error } and does NOT throw
  // on API-level errors (unverified domain, invalid sender, free-tier "send to
  // your own email only" restriction, etc.). We must explicitly inspect the
  // error field and surface it to the caller.
  let result;
  try {
    result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: input.email,
      subject,
      text,
      html,
      ...(attachments.length > 0 ? { attachments } : {}),
    });
  } catch (networkErr) {
    // The Resend SDK *does* throw on transport-level failures (DNS, TLS,
    // unreachable host). In development, fall back to dev soft-success so
    // local iteration on the form isn't blocked by an offline laptop.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[contact] (dev) Resend network failure — soft-succeeding so local " +
          "development isn't blocked. The real API call did not go through.\n" +
          "  · Check your network / VPN / firewall (api.resend.com must be reachable).\n" +
          "  · Verify RESEND_API_KEY is valid.\n" +
          "  · For attachments, ensure total size is well under 40 MB.\n" +
          "Underlying error:",
        networkErr,
      );
      return { ok: true, dev: true, id: undefined };
    }
    throw networkErr;
  }

  if (result.error) {
    const err = result.error;
    const detail = "name" in err ? `${err.name}: ${err.message}` : String(err);

    // In development, the most common cause is Resend's free-tier
    // restriction: `onboarding@resend.dev` can only deliver TO the email
    // address that owns the Resend account. Soft-succeed and emit a clear
    // diagnostic so the form is usable locally even when delivery is blocked.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[contact] (dev) Resend rejected the request — soft-succeeding.\n` +
          `  · ${detail}\n` +
          `  · Most common cause: the free Resend tier can only deliver to the email\n` +
          `    that owns the account. Either send to that address, or verify a custom\n` +
          `    domain at https://resend.com/domains and update CONTACT_FROM_EMAIL.\n` +
          `  · CONTACT_FROM_EMAIL=${fromEmail}, CONTACT_TO_EMAIL=${toEmail}`,
      );
      return { ok: true, dev: true, id: undefined };
    }

    // In production: surface a structured error so the API route logs it AND
    // can map it to a user-facing message without leaking provider internals.
    throw new Error(`Resend send failed — ${detail}`);
  }

  return { ok: true, id: result.data?.id };
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
