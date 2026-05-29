"use client";

import { useTranslations } from "next-intl";
import { SITE } from "@/content/profile";
import { Heart, Mail, Sparkles } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/brand";
import { TechIcon, type TechName } from "@/components/logos/tech-icons";
import { QuoteCard } from "@/components/quotes/quote-card";
import { Link } from "@/i18n/navigation";

const BUILT_WITH: { name: TechName; label: string }[] = [
  { name: "Next.js", label: "Next.js 16" },
  { name: "React", label: "React 19" },
  { name: "TypeScript", label: "TypeScript 6" },
  { name: "Tailwind CSS", label: "Tailwind CSS 4" },
];

export function SiteFooter() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  return (
    <footer className="border-border/70 bg-bg-sunken/40 border-t">
      <div className="container-tight pt-10">
        <QuoteCard placement="footer" />
      </div>

      <div className="container-tight flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="text-fg text-sm font-semibold tracking-tight">{SITE.name}</p>
          <p className="text-fg-muted mt-1 text-xs">{t("tagline")}</p>

          {/* "Built with" — a small icon row with hover tooltips rather than a
              plain text list. Reads better at a glance and adds a touch of
              brand colour without competing with the social buttons below. */}
          <div className="mt-5">
            <p className="mono-label inline-flex items-center gap-1.5">
              <Sparkles className="text-accent-amber h-3 w-3" />
              {t("builtWith")}
            </p>
            <ul
              aria-label={t("stackAriaLabel")}
              className="mt-2 flex flex-wrap items-center gap-1.5"
            >
              {BUILT_WITH.map((tech) => (
                <li key={tech.name}>
                  <span
                    title={tech.label}
                    className="border-border bg-bg-elev/50 text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] tracking-wider transition-colors"
                  >
                    <TechIcon name={tech.name} className="h-3 w-3" />
                    {tech.label}
                  </span>
                </li>
              ))}
              <li>
                <span
                  title="Vitest + Playwright"
                  className="border-border bg-bg-elev/50 text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] tracking-wider transition-colors"
                >
                  Vitest · Playwright
                </span>
              </li>
              <li>
                <span
                  title="Deployed on Vercel"
                  className="border-border bg-bg-elev/50 text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] tracking-wider transition-colors"
                >
                  Vercel
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs"
            aria-label={tCommon("github")}
          >
            <Github className="h-3.5 w-3.5" />
            {tCommon("github")}
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs"
            aria-label={tCommon("linkedin")}
          >
            <Linkedin className="h-3.5 w-3.5" />
            {tCommon("linkedin")}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="btn-secondary text-xs"
            aria-label={tCommon("email")}
          >
            <Mail className="h-3.5 w-3.5" />
            {tCommon("email")}
          </a>
        </div>
      </div>

      <div className="container-tight border-border/60 text-fg-subtle flex flex-wrap items-center justify-between gap-3 border-t py-4 font-mono text-[11px]">
        <span className="inline-flex items-center gap-1">
          {t("copyright", { year: new Date().getFullYear(), name: SITE.name })} ·
          <span className="inline-flex items-center gap-1">
            <Heart className="text-accent-amber/80 h-3 w-3" aria-hidden /> v1.0
          </span>
        </span>
        <Link href="/privacy" className="hover:text-fg underline-offset-4 hover:underline">
          {tCommon("privacy")}
        </Link>
      </div>
    </footer>
  );
}
