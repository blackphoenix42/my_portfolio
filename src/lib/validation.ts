import { z } from "zod";

// Schema messages are short identifiers; the contact form maps them onto
// translated strings via `messages/*.json → contact.form.errors.*`. Keeping
// codes here (instead of full English sentences) lets server validation stay
// locale-agnostic and the client render the user's preferred language.
export const contactSchema = z.object({
  name: z.string().min(2, "nameShort").max(80, "nameLong"),
  email: z.string().min(1, "emailInvalid").max(120, "emailLong").email("emailInvalid"),
  company: z.string().max(120, "companyLong").optional().or(z.literal("")),
  role: z.enum(["Recruiter", "Hiring Manager", "Founder", "Engineer", "Collaboration", "Other"], {
    message: "roleInvalid",
  }),
  subject: z.string().min(3, "subjectShort").max(140, "subjectLong"),
  message: z.string().min(20, "messageShort").max(4000, "messageLong"),
  opportunity: z.boolean().optional(),
  // honeypot: must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
