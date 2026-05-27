import Link from "next/link";
import { SITE } from "@/content/profile";
import { Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/brand";
import { QuoteCard } from "@/components/quotes/quote-card";

export function SiteFooter() {
  return (
    <footer className="border-border/70 bg-bg-sunken/40 border-t">
      <div className="container-tight pt-10">
        <QuoteCard placement="footer" />
      </div>
      <div className="container-tight flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-fg text-sm">{SITE.name}</p>
          <p className="text-fg-subtle mt-1 text-xs">
            <span className="mono-label text-fg-muted mr-2">Built with</span>
            Next.js · React · TypeScript · Tailwind · Vitest · Playwright · Vercel
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

      <div className="container-tight border-border/60 text-fg-subtle flex items-center justify-between border-t py-4 font-mono text-[11px]">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span>v1.0 · {SITE.tagline}</span>
      </div>
    </footer>
  );
}
