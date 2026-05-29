import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme",
  role: "Recruiter" as const,
  subject: "Performance engineering role",
  message: "Hello, I'd love to chat about a senior engineering role on our team.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a well-formed payload", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts optional company as empty string", () => {
    const r = contactSchema.safeParse({ ...valid, company: "" });
    expect(r.success).toBe(true);
  });

  it("rejects too-short name", () => {
    const r = contactSchema.safeParse({ ...valid, name: "A" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toMatch(/short/i);
    }
  });

  it("rejects invalid email", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects unknown role", () => {
    const r = contactSchema.safeParse({ ...valid, role: "Wizard" as never });
    expect(r.success).toBe(false);
  });

  it("rejects too-short subject", () => {
    const r = contactSchema.safeParse({ ...valid, subject: "hi" });
    expect(r.success).toBe(false);
  });

  it("rejects too-short message", () => {
    const r = contactSchema.safeParse({ ...valid, message: "short" });
    expect(r.success).toBe(false);
  });

  it("rejects message longer than 4000 chars", () => {
    const r = contactSchema.safeParse({ ...valid, message: "a".repeat(4001) });
    expect(r.success).toBe(false);
  });

  it("rejects honeypot when filled", () => {
    const r = contactSchema.safeParse({ ...valid, website: "filled-by-bot" });
    expect(r.success).toBe(false);
  });

  it("allows opportunity boolean (legacy field) when provided", () => {
    const r = contactSchema.safeParse({ ...valid, opportunity: true });
    expect(r.success).toBe(true);
  });

  it("rejects name longer than 80 chars", () => {
    const r = contactSchema.safeParse({ ...valid, name: "a".repeat(81) });
    expect(r.success).toBe(false);
  });

  it("rejects email longer than 120 chars", () => {
    const long = "a".repeat(116) + "@x.io";
    const r = contactSchema.safeParse({ ...valid, email: long });
    expect(r.success).toBe(false);
  });

  it("rejects subject longer than 140 chars", () => {
    const r = contactSchema.safeParse({ ...valid, subject: "a".repeat(141) });
    expect(r.success).toBe(false);
  });

  it("rejects company longer than 120 chars", () => {
    const r = contactSchema.safeParse({ ...valid, company: "a".repeat(121) });
    expect(r.success).toBe(false);
  });

  it("accepts the new Collaborator role", () => {
    const r = contactSchema.safeParse({ ...valid, role: "Collaborator" });
    expect(r.success).toBe(true);
  });

  it("requires otherRole when role === 'Other'", () => {
    const missing = contactSchema.safeParse({ ...valid, role: "Other", otherRole: "" });
    expect(missing.success).toBe(false);
    if (!missing.success) {
      expect(missing.error.issues.some((i) => i.message === "otherRoleRequired")).toBe(true);
    }

    const tooShort = contactSchema.safeParse({ ...valid, role: "Other", otherRole: "x" });
    expect(tooShort.success).toBe(false);

    const ok = contactSchema.safeParse({ ...valid, role: "Other", otherRole: "Investor" });
    expect(ok.success).toBe(true);
  });

  it("rejects otherRole longer than 80 chars", () => {
    const r = contactSchema.safeParse({
      ...valid,
      role: "Other",
      otherRole: "a".repeat(81),
    });
    expect(r.success).toBe(false);
  });

  describe("phone", () => {
    it("accepts an empty phone", () => {
      expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
    });
    it("accepts a canonical E.164 value (+digits, no spaces)", () => {
      expect(contactSchema.safeParse({ ...valid, phone: "+919876543210" }).success).toBe(true);
    });
    it("rejects phone without a leading +", () => {
      const r = contactSchema.safeParse({ ...valid, phone: "919876543210" });
      expect(r.success).toBe(false);
    });
    it("rejects phone with spaces", () => {
      const r = contactSchema.safeParse({ ...valid, phone: "+91 9876543210" });
      expect(r.success).toBe(false);
    });
    it("rejects letters in the phone field", () => {
      const r = contactSchema.safeParse({ ...valid, phone: "+abcdefg" });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.issues.some((i) => i.message === "phoneInvalid")).toBe(true);
      }
    });
    it("rejects phone longer than 24 characters", () => {
      const r = contactSchema.safeParse({ ...valid, phone: `+${"1".repeat(24)}` });
      expect(r.success).toBe(false);
    });
  });
});
