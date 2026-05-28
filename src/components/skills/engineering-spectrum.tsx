"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { clusters } from "@/content/skills";
import { projects } from "@/content/projects";
import { accentText, cn } from "@/lib/utils";
import { TECH_ICONS } from "@/components/logos/tech-icons";
import { SKILL_GLYPHS, SkillFallbackGlyph } from "@/components/logos/skill-glyph";
import { Link } from "@/i18n/navigation";

const accentTile: Record<string, string> = {
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/40",
  violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/40",
  emerald: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/40",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/40",
};

export function EngineeringSpectrum({
  hideHeader = false,
  clusterIds,
  showFilters = false,
}: {
  hideHeader?: boolean;
  clusterIds?: string[];
  showFilters?: boolean;
}) {
  const t = useTranslations("engineeringSpectrum");
  const tr = (id: string, key: "name" | "blurb", fallback: string) => {
    const path = `clusters.${id}.${key}` as never;
    return t.has(path) ? t(path) : fallback;
  };
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const base = clusterIds ? clusters.filter((c) => clusterIds.includes(c.id)) : clusters;
  const visible = filter === "all" ? base : base.filter((c) => c.id === filter);

  const filterChips: { id: string; label: string }[] = [
    { id: "all", label: t("all") },
    ...base.map((c) => ({ id: c.id, label: tr(c.id, "name", c.name) })),
  ];

  return (
    <section className="section" aria-label={t("ariaLabel")}>
      <div className="container-tight">
        {!hideHeader && (
          <header className="mb-10">
            <p className="mono-label">{t("eyebrow")}</p>
            <h2 className="section-title mt-2">{t("heading")}</h2>
            <p className="text-fg-muted mt-2 max-w-2xl">{t("intro")}</p>
          </header>
        )}

        {showFilters && (
          <div
            role="tablist"
            aria-label={t("filterAriaLabel")}
            className="mb-8 flex flex-wrap gap-2"
          >
            {filterChips.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "chip transition-colors",
                    active
                      ? "border-accent-amber/60 bg-accent-amber/10 text-accent-amber"
                      : "hover:border-accent-cyan/40 hover:text-fg",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((c, i) => {
            const related = projects.filter((p) => c.relatedProjects?.includes(p.slug));
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onMouseEnter={() => setActiveCluster(c.id)}
                onMouseLeave={() => setActiveCluster(null)}
                className={cn(
                  "card p-5 transition-all",
                  activeCluster === c.id && "border-accent-cyan/40",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className={cn("text-base font-semibold", accentText[c.accent])}>
                    {tr(c.id, "name", c.name)}
                  </h3>
                  <span className="text-fg-subtle font-mono text-[10px]">
                    {t("toolsCount", { count: c.skills.length })}
                  </span>
                </div>
                <p className="text-fg-muted mt-2 text-sm">{tr(c.id, "blurb", c.blurb)}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {c.skills.map((s) => {
                    const Icon = (
                      TECH_ICONS as Record<
                        string,
                        (p: { className?: string }) => React.ReactElement
                      >
                    )[s.name];
                    const Glyph = SKILL_GLYPHS[s.name];
                    return (
                      <li
                        key={s.name}
                        className={cn("chip gap-1.5", s.level === "core" && "border-fg/40 text-fg")}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "inline-grid h-4 w-4 place-items-center rounded-sm border",
                            accentTile[c.accent],
                          )}
                        >
                          {Icon ? (
                            <Icon className="h-2.5 w-2.5" />
                          ) : Glyph ? (
                            <Glyph className="h-2.5 w-2.5" strokeWidth={2.2} />
                          ) : (
                            <SkillFallbackGlyph className="h-2.5 w-2.5" />
                          )}
                        </span>
                        {s.name}
                      </li>
                    );
                  })}
                </ul>
                {related.length > 0 && (
                  <div className="border-border/60 mt-4 border-t pt-3">
                    <p className="mono-label">{t("appliedIn")}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/work/${r.slug}`}
                            className="text-fg-muted hover:text-fg text-xs underline-offset-4 hover:underline"
                          >
                            {r.title.split("—")[0]?.trim()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
