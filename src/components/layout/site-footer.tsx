import Link from "next/link";
import { SITE } from "@/content/profile";
import { Github, Linkedin, Mail } from "lucide-react";
import { QuoteCard } from "@/components/quotes/quote-card";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-bg-sunken/40">
      <div className="container-tight pt-10">
        <QuoteCard placement="footer" />
      </div>
      <div className="container-tight flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-fg">{SITE.name}</p>
          <p className="mt-1 text-xs text-fg-subtle">
            {SITE.role} · {SITE.company} · {SITE.location}
          </p>
          <p className="mt-2 max-w-md text-xs text-fg-subtle">
            Built with Next.js, TypeScript, Tailwind and Framer Motion. Designed for clarity, speed
            and accessibility.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={SITE.github} className="btn-secondary text-xs" aria-label="GitHub">
            <Github className="h-3.5 w-3.5" />
            GitHub
          </Link>
          <Link href={SITE.linkedin} className="btn-secondary text-xs" aria-label="LinkedIn">
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
          </Link>
          <Link href={`mailto:${SITE.email}`} className="btn-secondary text-xs" aria-label="Email">
            <Mail className="h-3.5 w-3.5" />
            Email
          </Link>
        </div>
      </div>
      <div className="container-tight flex items-center justify-between border-t border-border/60 py-4 font-mono text-[11px] text-fg-subtle">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span>v1.0 · {SITE.tagline}</span>
      </div>
    </footer>
  );
}
