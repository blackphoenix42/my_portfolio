"use client";

import { TerminalSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export function EngineerHomeIntro() {
  const t = useTranslations("engineer");
  return (
    <section aria-label={t("homeHeading")} className="container-tight pt-16">
      <p className="text-accent-cyan inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
        <TerminalSquare className="h-3.5 w-3.5" /> {t("homeHeading")}
      </p>
      <h2 className="text-display-2 mt-2 font-semibold tracking-tight">{t("bannerModeOn")}</h2>
      <p className="text-fg-muted mt-3 max-w-2xl">{t("homeIntro")}</p>
    </section>
  );
}
