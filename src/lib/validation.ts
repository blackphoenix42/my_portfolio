import { z } from "zod";

// Schema messages are short identifiers; the contact form maps them onto
// translated strings via `messages/*.json → contact.form.errors.*`. Keeping
// codes here (instead of full English sentences) lets server validation stay
// locale-agnostic and the client render the user's preferred language.
export const ROLES = [
  "Recruiter",
  "Hiring Manager",
  "Founder",
  "Engineer",
  "Collaborator",
  "Other",
] as const;
export type Role = (typeof ROLES)[number];

// Attachment limits — mirror the client-side caps in attachment-field.tsx.
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_ATTACHMENT_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/markdown",
] as const;

export const contactSchema = z
  .object({
    name: z.string().min(2, "nameShort").max(80, "nameLong"),
    email: z.string().min(1, "emailInvalid").max(120, "emailLong").email("emailInvalid"),
    phone: z
      .string()
      .max(24, "phoneLong")
      .regex(/^$|^\+\d{6,20}$/u, "phoneInvalid")
      .optional()
      .or(z.literal("")),
    company: z.string().max(120, "companyLong").optional().or(z.literal("")),
    role: z.enum(ROLES, { message: "roleInvalid" }),
    // Free-text "specify" field — required (and only used) when role === "Other".
    otherRole: z.string().max(80, "otherRoleLong").optional().or(z.literal("")),
    subject: z.string().min(3, "subjectShort").max(140, "subjectLong"),
    message: z.string().min(20, "messageShort").max(4000, "messageLong"),
    opportunity: z.boolean().optional(),
    // honeypot: must be empty
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Other" && (!data.otherRole || data.otherRole.trim().length < 2)) {
      ctx.addIssue({
        code: "custom",
        path: ["otherRole"],
        message: "otherRoleRequired",
      });
    }
  });

export type ContactInput = z.infer<typeof contactSchema>;
