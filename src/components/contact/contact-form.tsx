"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  User,
  Building2,
  MessageSquare,
  Type,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { contactSchema, ROLES, type ContactInput } from "@/lib/validation";
import { EmailField } from "@/components/contact/email-field";
import { PhoneField } from "@/components/contact/phone-field";
import { AttachmentField, mergeAttachments } from "@/components/contact/attachment-field";

type Status = "idle" | "submitting" | "success" | "error";

const ROLE_KEYS: { value: ContactInput["role"]; key: string }[] = [
  { value: "Recruiter", key: "recruiter" },
  { value: "Hiring Manager", key: "hiringManager" },
  { value: "Founder", key: "founder" },
  { value: "Engineer", key: "engineer" },
  { value: "Collaborator", key: "collaborator" },
  { value: "Other", key: "other" },
];

const MESSAGE_MAX = 4000;
const MESSAGE_MIN = 20;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [role, setRole] = useState<ContactInput["role"]>("Recruiter");
  const [otherRole, setOtherRole] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pageDragActive, setPageDragActive] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const otherRef = useRef<HTMLInputElement>(null);

  // Focus the "specify" field as soon as the user picks "Other".
  useEffect(() => {
    if (role === "Other") otherRef.current?.focus();
  }, [role]);

  // Countdown for the rate-limit nudge.
  useEffect(() => {
    if (retrySeconds <= 0) return;
    const id = setInterval(() => setRetrySeconds((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [retrySeconds]);

  // Page-wide drag-and-drop: anywhere on the page becomes a drop target.
  // We only care about drags that carry files; clear the overlay on the
  // last `dragleave` (relatedTarget is null when the cursor leaves the
  // window) or on a successful drop.
  useEffect(() => {
    let dragCounter = 0;
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");

    const onDragEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter += 1;
      setPageDragActive(true);
    };
    const onDragOver = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };
    const onDragLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      dragCounter = Math.max(0, dragCounter - 1);
      if (dragCounter === 0) setPageDragActive(false);
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter = 0;
      setPageDragActive(false);
      const dropped = e.dataTransfer?.files;
      if (!dropped || dropped.length === 0) return;
      const { files: next, error: err } = mergeAttachments(files, dropped);
      if (err) {
        if (err.code === "unsupported")
          setDropError(t("attachments.unsupported", { filename: err.filename }));
        else if (err.code === "tooMany") setDropError(t("attachments.tooMany", { max: err.max }));
        else if (err.code === "tooLarge")
          setDropError(t("attachments.tooLarge", { maxMb: err.maxMb }));
      } else {
        setDropError(null);
      }
      setFiles(next);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [files, t]);

  // Auto-clear the transient drop-error toast after a few seconds.
  useEffect(() => {
    if (!dropError) return;
    const id = setTimeout(() => setDropError(null), 5000);
    return () => clearTimeout(id);
  }, [dropError]);

  function localizeErrorCode(code: string) {
    const path = `errors.${code}` as never;
    return t.has(path) ? t(path) : code;
  }

  function localizeServerError(code: string): string {
    if (code === "rateLimited") return t("genericServerError");
    if (code === "sendFailed") return t("genericServerError");
    if (code === "validationFailed") return t("errorValidation");
    if (code === "tooManyAttachments") return t("attachments.tooMany", { max: 5 });
    if (code === "attachmentsTooLarge") return t("attachments.tooLarge", { maxMb: 10 });
    if (code === "unsupportedAttachmentType") return t("attachments.unsupported", { filename: "" });
    return t("genericServerError");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setServerError(null);

    const fd = new FormData(e.currentTarget);
    const payload: ContactInput = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      role,
      otherRole: role === "Other" ? otherRole : "",
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[key]) fieldErrors[key] = localizeErrorCode(issue.message);
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    // Build multipart body so we can attach files.
    const body = new FormData();
    body.set("name", parsed.data.name);
    body.set("email", parsed.data.email);
    body.set("phone", parsed.data.phone ?? "");
    body.set("company", parsed.data.company ?? "");
    body.set("role", parsed.data.role);
    body.set("otherRole", parsed.data.otherRole ?? "");
    body.set("subject", parsed.data.subject);
    body.set("message", parsed.data.message);
    body.set("website", parsed.data.website ?? "");
    files.forEach((f) => body.append("attachments", f));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body, // browser sets the multipart boundary
      });

      if (res.status === 429) {
        const data = (await res.json().catch(() => ({}))) as { retryAfterSec?: number };
        const seconds = data.retryAfterSec ?? 60;
        setRetrySeconds(seconds);
        setServerError(
          t("rateLimit.body", {
            limit: 5,
            seconds,
            plural: seconds === 1 ? "" : "s",
          }),
        );
        setStatus("error");
        return;
      }

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setServerError(localizeServerError(body.error ?? "sendFailed"));
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage("");
      setFiles([]);
      setOtherRole("");
      (e.target as HTMLFormElement).reset();
    } catch {
      setServerError(t("networkError"));
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
          <h2 className="text-xl font-semibold">{t("successHeading")}</h2>
          <p className="text-fg-muted max-w-md text-sm">{t("successBody")}</p>
          <button onClick={() => setStatus("idle")} className="btn-secondary mt-2 text-sm">
            {t("sendAnother")}
          </button>
        </div>
      </div>
    );
  }

  const messageCount = message.length;
  const messageOver = messageCount > MESSAGE_MAX;
  const messageUnder = messageCount > 0 && messageCount < MESSAGE_MIN;

  return (
    <>
      {pageDragActive && (
        <div
          aria-live="polite"
          className="bg-bg/80 pointer-events-none fixed inset-0 z-60 grid place-items-center p-6 backdrop-blur-sm"
        >
          <div className="border-accent-cyan/60 bg-bg-elev/90 grid place-items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center shadow-2xl">
            <UploadCloud className="text-accent-cyan h-10 w-10" aria-hidden />
            <p className="text-fg text-lg font-semibold">{t("attachments.dropOverlayTitle")}</p>
            <p className="text-fg-muted text-sm">
              {t("attachments.hint", { maxFiles: 5, maxMb: 10 })}
            </p>
          </div>
        </div>
      )}
      {dropError && (
        <div
          role="alert"
          className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber fixed bottom-6 left-1/2 z-60 -translate-x-1/2 rounded-md border px-4 py-2 text-sm shadow-lg"
        >
          {dropError}
        </div>
      )}
      <form
        onSubmit={onSubmit}
        noValidate
        className="card relative overflow-hidden p-6 sm:p-7"
        aria-describedby="contact-form-note"
      >
        <div
          aria-hidden
          className="via-accent-cyan/60 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        />

        <div aria-hidden className="hidden">
          <label>
            {t("honeypotLabel")}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label={t("name")}
              name="name"
              icon={<User className="h-4 w-4" />}
              placeholder={t("namePlaceholderShort")}
              error={errors.name}
              required
              autoComplete="name"
            />
            <EmailField
              label={t("email")}
              name="email"
              placeholder={t("emailPlaceholderShort")}
              error={errors.email}
              required
              hint={
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="text-accent-cyan h-2.5 w-2.5 shrink-0" aria-hidden />
                  {t.rich("emailHint", {
                    kbd: (chunks) => (
                      <kbd className="border-border bg-bg-sunken text-fg mx-0.5 rounded border px-1 font-mono text-[10px]">
                        {chunks}
                      </kbd>
                    ),
                  })}
                </span>
              }
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label={t("company")}
              name="company"
              icon={<Building2 className="h-4 w-4" />}
              placeholder={t("companyPlaceholderShort")}
              error={errors.company}
              autoComplete="organization"
            />
            <PhoneField label={t("phone")} name="phone" error={errors.phone} />
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase">
              {t("iAmA")}
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("roleAriaLabel")}>
              {ROLE_KEYS.map((r) => {
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
                    {t(`roles.${r.key}`)}
                  </button>
                );
              })}
            </div>
            {role === "Other" && (
              <div className="grid gap-1.5 pt-2">
                <label
                  htmlFor="f-otherRole"
                  className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase"
                >
                  {t("otherRoleLabel")} <span className="text-accent-cyan">*</span>
                </label>
                <input
                  ref={otherRef}
                  id="f-otherRole"
                  name="otherRole"
                  value={otherRole}
                  onChange={(e) => setOtherRole(e.target.value)}
                  placeholder={t("otherRolePlaceholder")}
                  aria-invalid={errors.otherRole ? true : undefined}
                  className="contact-input border-border bg-bg-elev/60 placeholder:text-fg-subtle/60 focus:border-accent-cyan/60 focus:bg-bg-elev focus:ring-accent-cyan/20 w-full rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2"
                />
                <FieldError message={errors.otherRole ?? ""} />
              </div>
            )}
          </fieldset>

          <Field
            label={t("subject")}
            name="subject"
            icon={<Type className="h-4 w-4" />}
            placeholder={t("subjectPlaceholderShort")}
            error={errors.subject}
            required
          />

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="message"
                className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase"
              >
                {t("message")} <span className="text-accent-cyan">*</span>
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
                placeholder={t("messagePlaceholderShort")}
                className="contact-input border-border bg-bg-elev/60 placeholder:text-fg-subtle/60 focus:border-accent-cyan/60 focus:bg-bg-elev focus:ring-accent-cyan/20 w-full resize-y rounded-md border py-2.5 pr-3 pl-10 text-sm transition-colors outline-none focus:ring-2"
              />
            </div>
            <FieldError message={errors.message ?? ""} />
          </div>

          <AttachmentField files={files} onChange={setFiles} disabled={status === "submitting"} />

          {serverError && (
            <div
              role="alert"
              className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber flex items-start gap-2 rounded-md border p-3 text-sm"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                {retrySeconds > 0 && <p className="font-semibold">{t("rateLimit.title")}</p>}
                <p>{serverError}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p id="contact-form-note" className="text-fg-subtle font-mono text-[10px]">
              {t("formNote")}
            </p>
            <button
              type="submit"
              disabled={status === "submitting" || retrySeconds > 0}
              className="btn-primary group min-w-[160px]"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("submitting")}
                </>
              ) : retrySeconds > 0 ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {retrySeconds}s
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {t("submit")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
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
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
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
          inputMode={inputMode}
          aria-invalid={error ? true : undefined}
          className={
            "contact-input border-border bg-bg-elev/60 placeholder:text-fg-subtle/60 focus:border-accent-cyan/60 focus:bg-bg-elev focus:ring-accent-cyan/20 w-full rounded-md border py-2.5 pr-3 text-sm transition-colors outline-none focus:ring-2 " +
            (icon ? "pl-10" : "pl-3")
          }
        />
      </div>
      <FieldError message={error ?? ""} />
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  // The wrapper is always rendered with a reserved height; the message only
  // shows when present. This avoids a CLS spike when validation errors flip
  // on after blur, which is the dominant CLS source on /contact.
  return (
    <p
      role="alert"
      aria-live="polite"
      className="text-accent-amber flex min-h-4 items-center gap-1 font-mono text-[11px]"
    >
      {message && (
        <>
          <AlertCircle className="h-3 w-3" />
          {message}
        </>
      )}
    </p>
  );
}

// Re-export to keep the type narrow for tests / external consumers.
export { ROLES };
