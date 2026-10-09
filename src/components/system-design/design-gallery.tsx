"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Network } from "lucide-react";
import { useTranslations } from "next-intl";
import { systemDesigns } from "@/content/system-design";
import { Link } from "@/i18n/navigation";
import {
  ALL_QUIRKY_FILTER,
  availableQuirkyTags,
  filterByQuirkyTag,
  type QuirkyFilter,
} from "@/lib/quirky-tags";
import { cn } from "@/lib/utils";

export function DesignGallery({ limit = 4, home = false }: { limit?: number; home?: boolean }) {
  const t = useTranslations("systemDesign");
  const tQuirky = useTranslations("quirkyTags");
  const [active, setActive] = useState<QuirkyFilter>(ALL_QUIRKY_FILTER);
  const [expanded, setExpanded] = useState(false);
  const tags = useMemo(() => availableQuirkyTags(systemDesigns), []);
  const visible = useMemo(() => filterByQuirkyTag(systemDesigns, active), [active]);
  const items = expanded ? visible : visible.slice(0, limit);
  const filterLabel = t.has("filter") ? t("filter") : tQuirky("filterLabel");
  const allLabel = t.has("all") ? t("all") : tQuirky("all");

  return (
    <section aria-label={t("pageHeading")} className={home ? "section container-tight" : "mb-20"}>
      <header className="mb-6">
        <p className="mono-label">{t("tag")}</p>
        <h2 className="section-title mt-2">{t("pageHeading")}</h2>
        <p className="text-fg-muted mt-2 max-w-2xl">{t("galleryIntro")}</p>
      </header>
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label={filterLabel}>
        <span className="text-fg-subtle inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase">
          <Filter className="h-3 w-3" aria-hidden /> {filterLabel}
        </span>
        <FilterChip
          label={allLabel}
          active={active === ALL_QUIRKY_FILTER}
          onClick={() => setActive(ALL_QUIRKY_FILTER)}
        />
        {tags.map((tag) => (
          <FilterChip
            key={tag}
            label={tQuirky(`labels.${tag}`)}
            active={active === tag}
            onClick={() => setActive(tag)}
          />
        ))}
      </div>
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
            {item.quirkyTags && item.quirkyTags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.quirkyTags.map((tag) => (
                  <li key={tag} className="chip text-[10px]">
                    {tQuirky(`labels.${tag}`)}
                  </li>
                ))}
              </ul>
            )}
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
        visible.length > limit && (
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

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
        active
          ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan"
          : "border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
