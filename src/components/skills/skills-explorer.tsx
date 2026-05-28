"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { flatSkillCategories } from "@/content/skills-flat";
import { SkillChip } from "@/components/logos/skill-chip";
import { cn } from "@/lib/utils";

type Filtered = {
  id: string;
  label: string;
  accent: "cyan" | "violet" | "emerald" | "amber";
  skills: string[];
};

export function SkillsExplorer() {
  const t = useTranslations("skillsExplorer");
  const trCat = (id: string, fallback: string) => {
    const path = `categories.${id}` as never;
    return t.has(path) ? t(path) : fallback;
  };
  const [active, setActive] = useState<string | null>(null);

  const allSkills: Filtered[] = useMemo(() => flatSkillCategories, []);
  const filterChips = useMemo(
    () =>
      allSkills.map((c) => ({
        id: c.id,
        label: trCat(c.id, c.label),
        count: c.skills.length,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSkills],
  );

  const visible: Filtered[] = active === null ? [] : allSkills.filter((c) => c.id === active);

  return (
    <section className="section" aria-label={t("ariaLabel")}>
      <div className="container-tight">
        <header className="mb-8">
          <p className="mono-label inline-flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" /> {t("eyebrow")}
          </p>
          <h2 className="section-title mt-2">{t("heading")}</h2>
          <p className="text-fg-muted mt-2 max-w-2xl">{t("intro")}</p>
        </header>

        <div role="tablist" aria-label={t("filterAriaLabel")} className="mb-8 flex flex-wrap gap-2">
          {filterChips.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f.id)}
                className={cn(
                  "chip gap-2 transition-colors",
                  isActive
                    ? "border-accent-amber/60 bg-accent-amber/10 text-accent-amber"
                    : "hover:border-accent-cyan/40 hover:text-fg",
                )}
              >
                <span>{f.label}</span>
                <span className="font-mono text-[10px] opacity-70">{f.count}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-8">
          {visible.length === 0 && (
            <p className="border-border/70 bg-bg-elev/30 text-fg-subtle rounded-lg border border-dashed px-4 py-8 text-center text-sm">
              {t("emptyState")}
            </p>
          )}
          {visible.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: ci * 0.03 }}
            >
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="text-base font-semibold tracking-tight">
                  {trCat(cat.id, cat.label)}
                </h3>
                <span className="text-fg-subtle font-mono text-[11px]">
                  {t("toolsCount", { count: cat.skills.length })}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <li key={`${cat.id}-${s}`}>
                    <SkillChip name={s} accent={cat.accent} />
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
