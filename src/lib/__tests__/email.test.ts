import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactInput } from "@/lib/validation";

const baseInput: ContactInput = {
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme",
  role: "Recruiter",
  subject: "Hello",
  message: "This is a test message that is at least twenty characters long.",
  website: "",
  opportunity: true,
};

describe("sendContactEmail (dev mode fallback)", () => {
  const ORIGINAL_ENV = { ...process.env };
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.RESEND_API_KEY;
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    vi.resetModules();
  });
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns dev soft-success when no API key is set in non-prod", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendContactEmail } = await import("@/lib/email");
    const res = await sendContactEmail(baseInput, { ip: "1.2.3.4", ua: "test-ua" });
    expect(res).toEqual({ ok: true, dev: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("throws in production when no API key is set", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    const { sendContactEmail } = await import("@/lib/email");
    await expect(sendContactEmail(baseInput, { ip: "1.2.3.4", ua: "test-ua" })).rejects.toThrow(
      /not configured/i,
    );
  });
});

describe("sendContactEmail (with Resend)", () => {
  const ORIGINAL_ENV = { ...process.env };
  const sendMock = vi.fn(async () => ({ id: "msg_123" }));

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.RESEND_API_KEY = "re_test";
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    sendMock.mockClear();
    vi.resetModules();
    vi.doMock("resend", () => {
      class Resend {
        emails = { send: sendMock };
      }
      return { Resend };
    });
  });
  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.doUnmock("resend");
  });

  it("sends an email with the expected subject and escaped fields", async () => {
    const { sendContactEmail } = await import("@/lib/email");
    const res = await sendContactEmail(
      {
        ...baseInput,
        subject: "<script>alert(1)</script>",
        name: "A&B",
        message: "test message <ok>",
      },
      { ip: "9.9.9.9", ua: "ua/1" },
    );
    expect(res).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const arg = (
      sendMock.mock.calls as unknown as Array<
        Array<{
          subject: string;
          text: string;
          html: string;
          replyTo: string;
          to: string[];
        }>
      >
    )[0]![0]!;
    expect(arg.subject).toContain("[Portfolio]");
    expect(arg.subject).toContain("Recruiter");
    expect(arg.replyTo).toBe(baseInput.email);
    // HTML must escape angle brackets.
    expect(arg.html).not.toMatch(/<script>alert/);
    expect(arg.html).toMatch(/&lt;script&gt;/);
    // Text contains IP and UA meta lines.
    expect(arg.text).toMatch(/IP: 9\.9\.9\.9/);
    expect(arg.text).toMatch(/UA: ua\/1/);
    // Opportunity rendered.
    expect(arg.text).toMatch(/Opportunity: yes/);
    expect(arg.html).toMatch(/Opportunity/);
  });

  it("omits company line when company is empty", async () => {
    const { sendContactEmail } = await import("@/lib/email");
    await sendContactEmail({ ...baseInput, company: "" }, { ip: "1.1.1.1", ua: "ua" });
    const arg = (
      sendMock.mock.calls as unknown as Array<Array<{ text: string; html: string }>>
    )[0]![0]!;
    expect(arg.text).not.toMatch(/Company:/);
    expect(arg.html).not.toMatch(/Company:/);
  });

  it("omits opportunity line when false / undefined", async () => {
    const { sendContactEmail } = await import("@/lib/email");
    await sendContactEmail({ ...baseInput, opportunity: false }, { ip: "1.1.1.1", ua: "ua" });
    const arg = (sendMock.mock.calls as unknown as Array<Array<{ text: string }>>)[0]![0]!;
    expect(arg.text).not.toMatch(/Opportunity:/);
  });
});
