import { Resend } from "resend";
import type { ContactInput } from "./validation";

const apiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.CONTACT_TO_EMAIL ?? "aayush.sang@gmail.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Ayush Portfolio <onboarding@resend.dev>";

export async function sendContactEmail(input: ContactInput, meta: { ip?: string; ua?: string }) {
  if (!apiKey) {
    // Soft success in dev — log instead of throwing so the form remains usable locally.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[contact] (dev) RESEND_API_KEY not set. Payload:", { input, meta });
      return { ok: true, dev: true };
    }
    throw new Error("Email is not configured");
  }
  const resend = new Resend(apiKey);

  const subject = `[Portfolio] ${input.role}: ${input.subject}`;
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.company ? `Company: ${input.company}` : null,
    `Role: ${input.role}`,
    input.opportunity ? `Opportunity: yes` : null,
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
      ${input.company ? `<p style="margin:0 0 6px;">Company: ${escape(input.company)}</p>` : ""}
      <p style="margin:0 0 12px;">Role: ${escape(input.role)}${input.opportunity ? " · Opportunity" : ""}</p>
      <pre style="white-space:pre-wrap; background:#f6f8fa; padding:12px; border-radius:8px;">${escape(
        input.message,
      )}</pre>
      <p style="font-size:12px;color:#666;">IP ${escape(meta.ip ?? "?")} · UA ${escape(meta.ua ?? "?")}</p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: input.email,
    subject,
    text,
    html,
  });

  return { ok: true };
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
