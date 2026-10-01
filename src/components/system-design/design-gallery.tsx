"use client";

import { useState } from "react";
import { ArrowUpRight, Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { systemDesigns } from "@/content/system-design";
import { Link } from "@/i18n/navigation";

export function DesignGallery({ limit = 4, home = false }: { limit?: number; home?: boolean }) {
  const t = useTranslations("systemDesign");
  const [expanded, setExpanded] = useState(false);
  const items = expanded ? systemDesigns : systemDesigns.slice(0, limit);
  return (
    <section aria-label={t("pageHeading")} className={home ? "section container-tight" : "mb-20"}>
      <header className="mb-6">
        <p className="mono-label">{t("tag")}</p>
        <h2 className="section-title mt-2">{t("pageHeading")}</h2>
        <p className="text-fg-muted mt-2 max-w-2xl">{t("galleryIntro")}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.slug} className="card card-hover relative p-6">
            <Network className="text-accent-cyan mb-4 h-7 w-7" aria-hidden />
            <h3 className="text-lg font-semibold">
              <Link href={`/system-design/${item.slug}`} className="after:absolute after:inset-0">
                {t(`systems.${item.slug}.title`)}
              </Link>
            </h3>
            <p className="text-fg-muted mt-2 text-sm">{t(`systems.${item.slug}.tagline`)}</p>
            <p className="text-fg-subtle mt-4 font-mono text-xs">{t("galleryContents")}</p>
            <span className="text-accent-cyan mt-4 inline-flex items-center gap-1 text-sm">
              {t("openDesign")}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </article>
        ))}
      </div>
      {home ? (
        <Link href="/work#system-design" className="btn-secondary mt-6 text-sm">
          {t("seeMore")}
        </Link>
      ) : (
        systemDesigns.length > limit && (
          <button
            type="button"
            className="btn-secondary mt-6 text-sm"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            {t(expanded ? "seeLess" : "seeMore")}
          </button>
        )
      )}
    </section>
  );
}
