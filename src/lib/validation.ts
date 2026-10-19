import { z } from "zod";
import { isAudioAttachment } from "@/lib/contact-attachments";

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

export {
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_TOTAL_BYTES,
  ALLOWED_ATTACHMENT_MIME,
  ALLOWED_ATTACHMENT_EXTENSIONS,
  isAllowedAttachment,
  isAudioAttachment,
} from "@/lib/contact-attachments";

/** Typed message floor when no audio voice-note is attached. */
export const MESSAGE_MIN_LENGTH = 20;

/**
 * Message body may be empty when at least one audio attachment is present
 * (voice-note-only contact). Otherwise require MESSAGE_MIN_LENGTH chars.
 */
export function isContactMessageSatisfied(
  message: string,
  attachments: Array<{ name?: string; type?: string }> = [],
): boolean {
  if (message.length > 4000) return false;
  if (attachments.some(isAudioAttachment)) return true;
  return message.trim().length >= MESSAGE_MIN_LENGTH;
}

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
    // Length floor enforced via isContactMessageSatisfied (voice notes may omit text).
    message: z.string().max(4000, "messageLong"),
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
