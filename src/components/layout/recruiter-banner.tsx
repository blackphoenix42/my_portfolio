"use client";

import { Download, Mail, MessageSquare, X } from "lucide-react";
import { Linkedin } from "@/components/icons/brand";
import { useRecruiterMode } from "./recruiter-mode";
import { SITE } from "@/content/profile";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function RecruiterBanner() {
  const t = useTranslations("recruiterBanner");
  const { recruiter, setRecruiter } = useRecruiterMode();
  if (!recruiter) return null;
  return (
    <div className="border-accent-emerald/30 bg-accent-emerald/10 sticky top-16 z-30 border-b backdrop-blur-md">
      <div className="container-tight flex flex-wrap items-center gap-3 px-5 py-2 text-xs">
        <span className="text-accent-emerald font-mono text-[10px] tracking-widest uppercase">
          {t("modeOn")}
        </span>
        <span className="text-fg-muted hidden sm:inline">
          {t("summary", { role: SITE.role, location: SITE.location })}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={SITE.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="border-accent-emerald/40 bg-bg-elev text-fg hover:border-accent-emerald inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <Download className="h-3 w-3" /> {t("resume")}
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-fg-muted hover:text-fg inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <Linkedin className="h-3 w-3" /> {t("linkedin")}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="border-border text-fg-muted hover:text-fg inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <Mail className="h-3 w-3" /> {t("email")}
          </a>
          <Link
            href="/contact"
            className="border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald hover:bg-accent-emerald/20 inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <MessageSquare className="h-3 w-3" /> {t("contact")}
          </Link>
          <button
            type="button"
            onClick={() => setRecruiter(false)}
            aria-label={t("exitAria")}
            className="border-border text-fg-subtle hover:text-fg rounded-md border p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
