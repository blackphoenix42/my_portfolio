import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email").max(120),
  company: z.string().max(120).optional().or(z.literal("")),
  role: z.enum(["Recruiter", "Hiring Manager", "Founder", "Engineer", "Collaboration", "Other"]),
  subject: z.string().min(3, "Subject is too short").max(140),
  message: z.string().min(20, "Please write at least 20 characters").max(4000),
  opportunity: z.boolean().optional(),
  // honeypot: must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
