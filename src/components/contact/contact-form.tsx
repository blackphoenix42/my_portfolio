"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const ROLES: ContactInput["role"][] = [
  "Recruiter",
  "Hiring Manager",
  "Founder",
  "Engineer",
  "Collaboration",
  "Other",
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const payload: ContactInput = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      role: (fd.get("role") as ContactInput["role"]) ?? "Other",
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      opportunity: fd.get("opportunity") === "on",
      website: String(fd.get("website") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please email me directly.");
        setStatus("error");
        return;
      }
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setServerError("Network error. Please try again or email directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent-emerald" />
        <h2 className="text-xl font-semibold">Message sent.</h2>
        <p className="max-w-md text-sm text-fg-muted">
          Thanks for reaching out — I'll get back to you as soon as possible. In urgent cases, email
          me directly.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-secondary text-sm">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6" noValidate>
      {/* honeypot */}
      <div aria-hidden className="hidden">
        <label>
          Do not fill this field
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} required />
        <Field label="Work email" name="email" type="email" error={errors.email} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" name="company" error={errors.company} />
        <div className="grid gap-1.5">
          <label
            htmlFor="role"
            className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle"
          >
            Role / context
          </label>
          <select
            id="role"
            name="role"
            defaultValue="Recruiter"
            className="rounded-md border border-border bg-bg-elev px-3 py-2 text-sm outline-none focus:border-accent-cyan/60"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Field label="Subject" name="subject" error={errors.subject} required />
      <div className="grid gap-1.5">
        <label
          htmlFor="message"
          className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="rounded-md border border-border bg-bg-elev px-3 py-2 text-sm outline-none focus:border-accent-cyan/60"
        />
        {errors.message && <FieldError message={errors.message} />}
      </div>
      <label className="flex items-center gap-2 text-sm text-fg-muted">
        <input type="checkbox" name="opportunity" className="accent-accent-cyan" />
        I'm reaching out regarding a role or collaboration opportunity.
      </label>

      {serverError && (
        <div className="flex items-start gap-2 rounded-md border border-accent-amber/40 bg-accent-amber/10 p-3 text-sm text-accent-amber">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-2">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
      <p className="font-mono text-[10px] text-fg-subtle">
        Protected by rate limiting and server validation. By submitting, you agree to be contacted
        at the email provided.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle"
      >
        {label} {required && "*"}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        className="rounded-md border border-border bg-bg-elev px-3 py-2 text-sm outline-none focus:border-accent-cyan/60"
      />
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="font-mono text-[11px] text-accent-amber">
      {message}
    </p>
  );
}
