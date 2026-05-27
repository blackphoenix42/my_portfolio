"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  User,
  Building2,
  MessageSquare,
  Type,
} from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { EmailField } from "@/components/contact/email-field";

type Status = "idle" | "submitting" | "success" | "error";

const ROLES: { value: ContactInput["role"]; label: string }[] = [
  { value: "Recruiter", label: "Recruiter" },
  { value: "Hiring Manager", label: "Hiring Manager" },
  { value: "Founder", label: "Founder" },
  { value: "Engineer", label: "Engineer" },
  { value: "Collaboration", label: "Collaboration" },
  { value: "Other", label: "Other" },
];

const MESSAGE_MAX = 4000;
const MESSAGE_MIN = 20;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [role, setRole] = useState<ContactInput["role"]>("Recruiter");
  const [message, setMessage] = useState("");

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
      role,
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
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
      setMessage("");
      (e.target as HTMLFormElement).reset();
    } catch {
      setServerError("Network error. Please try again or email directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card relative overflow-hidden p-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent-emerald)/0.12),transparent_60%)]"
        />
        <div className="relative flex flex-col items-center gap-4">
          <div className="bg-accent-emerald/10 ring-accent-emerald/30 grid h-14 w-14 place-items-center rounded-full ring-1">
            <CheckCircle2 className="text-accent-emerald h-7 w-7" />
          </div>
          <h2 className="text-xl font-semibold">Message sent.</h2>
          <p className="text-fg-muted max-w-md text-sm">
            Thanks for reaching out — I&apos;ll get back to you as soon as possible. In urgent
            cases, email me directly.
          </p>
          <button onClick={() => setStatus("idle")} className="btn-secondary mt-2 text-sm">
            Send another
          </button>
        </div>
      </div>
    );
  }

  const messageCount = message.length;
  const messageOver = messageCount > MESSAGE_MAX;
  const messageUnder = messageCount > 0 && messageCount < MESSAGE_MIN;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="card relative overflow-hidden p-6 sm:p-7"
      aria-describedby="contact-form-note"
    >
      {/* subtle gradient top border accent */}
      <div
        aria-hidden
        className="via-accent-cyan/60 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />

      {/* honeypot */}
      <div aria-hidden className="hidden">
        <label>
          Do not fill this field
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Name"
            name="name"
            icon={<User className="h-4 w-4" />}
            placeholder="Jane Doe"
            error={errors.name}
            required
            autoComplete="name"
          />
          <EmailField
            label="Email"
            name="email"
            placeholder="you@company.com"
            error={errors.email}
            required
          />
        </div>

        <Field
          label="Company"
          name="company"
          icon={<Building2 className="h-4 w-4" />}
          placeholder="Optional"
          error={errors.company}
          autoComplete="organization"
        />

        {/* Role pill picker — replaces the redundant opportunity checkbox + plain select */}
        <fieldset className="grid gap-2">
          <legend className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase">
            I&apos;m a…
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Role">
            {ROLES.map((r) => {
              const active = role === r.value;
              return (
                <button
                  type="button"
                  key={r.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRole(r.value)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                    (active
                      ? "border-accent-cyan/60 bg-accent-cyan/10 text-fg"
                      : "border-border bg-bg-elev/40 text-fg-muted hover:border-accent-cyan/40 hover:text-fg")
                  }
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Field
          label="Subject"
          name="subject"
          icon={<Type className="h-4 w-4" />}
          placeholder="Performance engineering role at …"
          error={errors.subject}
          required
        />

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="message"
              className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase"
            >
              Message <span className="text-accent-cyan">*</span>
            </label>
            <span
              className={
                "font-mono text-[10px] tabular-nums " +
                (messageOver ? "text-accent-amber" : messageUnder ? "text-fg-subtle" : "text-fg")
              }
              aria-live="polite"
            >
              {messageCount}/{MESSAGE_MAX}
            </span>
          </div>
          <div className="relative">
            <MessageSquare className="text-fg-subtle pointer-events-none absolute top-3 left-3 h-4 w-4" />
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              minLength={MESSAGE_MIN}
              maxLength={MESSAGE_MAX}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A few lines about the role, project, or what you'd like to discuss."
              className="border-border bg-bg-elev/60 placeholder:text-fg-subtle/60 focus:border-accent-cyan/60 focus:bg-bg-elev focus:ring-accent-cyan/20 w-full resize-y rounded-md border py-2.5 pr-3 pl-10 text-sm transition-colors outline-none focus:ring-2"
            />
          </div>
          {errors.message && <FieldError message={errors.message} />}
        </div>

        {serverError && (
          <div className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber flex items-start gap-2 rounded-md border p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p id="contact-form-note" className="text-fg-subtle font-mono text-[10px]">
            Protected by rate limiting &amp; server validation.
          </p>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary group min-w-[160px]"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Send message
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  icon,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase"
      >
        {label} {required && <span className="text-accent-cyan">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          className={
            "border-border bg-bg-elev/60 placeholder:text-fg-subtle/60 focus:border-accent-cyan/60 focus:bg-bg-elev focus:ring-accent-cyan/20 w-full rounded-md border py-2.5 pr-3 text-sm transition-colors outline-none focus:ring-2 " +
            (icon ? "pl-10" : "pl-3")
          }
        />
      </div>
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-accent-amber flex items-center gap-1 font-mono text-[11px]">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}
