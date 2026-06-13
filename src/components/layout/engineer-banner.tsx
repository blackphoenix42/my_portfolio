"use client";

import { Cpu, GitBranch, Layers, X } from "lucide-react";
import { Github } from "@/components/icons/brand";
import { useEngineerMode } from "./engineer-mode";
import { SITE } from "@/content/profile";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function EngineerBanner() {
  const t = useTranslations("engineer");
  const { engineer, setEngineer } = useEngineerMode();
  if (!engineer) return null;
  return (
    <div className="border-accent-cyan/30 bg-accent-cyan/10 sticky top-16 z-30 border-b backdrop-blur-md">
      <div className="container-tight flex flex-wrap items-center gap-3 px-5 py-2 text-xs">
        <span className="text-accent-cyan font-mono text-[10px] tracking-widest uppercase">
          {t("bannerModeOn")}
        </span>
        <span className="text-fg-muted hidden sm:inline">{t("bannerSummary")}</span>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/system-design"
            className="border-accent-cyan/40 bg-bg-elev text-fg hover:border-accent-cyan inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <Layers className="h-3 w-3" /> {t("bannerSystemDesign")}
          </Link>
          <Link
            href="/work"
            className="border-border text-fg-muted hover:text-fg inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <Cpu className="h-3 w-3" /> {t("bannerDeepDives")}
          </Link>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-fg-muted hover:text-fg inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <Github className="h-3 w-3" /> {t("bannerGithub")}
          </a>
          <Link
            href="/competitive-programming"
            className="border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 inline-flex items-center gap-1 rounded-md border px-2 py-1"
          >
            <GitBranch className="h-3 w-3" /> {t("bannerAlgorithms")}
          </Link>
          <button
            type="button"
            onClick={() => setEngineer(false)}
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
