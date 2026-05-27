"use client";

import Link from "next/link";
import { Download, Linkedin, Mail, MessageSquare, X } from "lucide-react";
import { useRecruiterMode } from "./recruiter-mode";
import { SITE } from "@/content/profile";

export function RecruiterBanner() {
  const { recruiter, setRecruiter } = useRecruiterMode();
  if (!recruiter) return null;
  return (
    <div className="sticky top-16 z-30 border-b border-accent-emerald/30 bg-accent-emerald/10 backdrop-blur-md">
      <div className="container-tight flex flex-wrap items-center gap-3 px-5 py-2 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-emerald">
          Recruiter mode · on
        </span>
        <span className="hidden text-fg-muted sm:inline">
          {SITE.role} · {SITE.location} · open to software engineering roles — C++ performance,
          distributed systems, AI tooling. Production wins on Apple, Google, Samsung &amp; NVIDIA
          workloads.
        </span>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={SITE.resumePath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-accent-emerald/40 bg-bg-elev px-2 py-1 text-fg hover:border-accent-emerald"
          >
            <Download className="h-3 w-3" /> Resume
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-fg-muted hover:text-fg"
          >
            <Linkedin className="h-3 w-3" /> LinkedIn
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-fg-muted hover:text-fg"
          >
            <Mail className="h-3 w-3" /> Email
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 rounded-md border border-accent-emerald/40 bg-accent-emerald/10 px-2 py-1 text-accent-emerald hover:bg-accent-emerald/20"
          >
            <MessageSquare className="h-3 w-3" /> Contact
          </Link>
          <button
            type="button"
            onClick={() => setRecruiter(false)}
            aria-label="Exit recruiter mode"
            className="rounded-md border border-border p-1 text-fg-subtle hover:text-fg"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
