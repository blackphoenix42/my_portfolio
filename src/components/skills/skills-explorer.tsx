"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { flatSkillCategories } from "@/content/skills-flat";
import { clusters } from "@/content/skills";
import { projects } from "@/content/projects";
import { SkillChip } from "@/components/logos/skill-chip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type View = "applied" | "technical";

/**
 * Skills explorer: focus areas first (scannable cards with blurbs + tools +
 * related work), then a technical category filter.
 */
export function SkillsExplorer() {
  const t = useTranslations("skillsExplorer");
  const ts = useTranslations("engineeringSpectrum");
  const tp = useTranslations("projects");
  const [view, setView] = useState<View>("applied");
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [activeApplied, setActiveApplied] = useState<string | null>(null);

  const techItems = flatSkillCategories.map((c) => ({
    ...c,
    label: t(("categories." + c.id) as never),
  }));
  const selectedTech = techItems.find((c) => c.id === activeTech);

  return (
    <section className="section" aria-label={t("ariaLabel")}>
      <div className="container-tight">
        <header className="mb-8">
          <p className="mono-label inline-flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" />
            {t("eyebrow")}
          </p>
          <h2 className="section-title mt-2">{t("heading")}</h2>
          <p className="text-fg-muted mt-2 max-w-2xl">{t("intro")}</p>
        </header>

        <div
          role="tablist"
          aria-label={t("filterAriaLabel")}
          className="border-border mb-8 flex flex-wrap gap-2 border-b pb-5"
        >
          {(
            [
              { id: "applied" as const, label: t("groups.applied") },
              { id: "technical" as const, label: t("groups.technical") },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={view === tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "chip",
                view === tab.id && "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {view === "applied" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {clusters.map((cluster) => {
              const name = ts.has(`clusters.${cluster.id}.name` as never)
                ? ts(`clusters.${cluster.id}.name` as never)
                : cluster.name;
              const blurb = ts.has(`clusters.${cluster.id}.blurb` as never)
                ? ts(`clusters.${cluster.id}.blurb` as never)
                : cluster.blurb;
              const expanded = activeApplied === cluster.id || activeApplied === null;
              const focused = activeApplied === cluster.id;

              return (
                <article
                  key={cluster.id}
                  className={cn(
                    "card border-border flex flex-col p-5 transition-opacity",
                    activeApplied && !focused && "opacity-55",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={focused || activeApplied === null}
                    onClick={() =>
                      setActiveApplied((cur) => (cur === cluster.id ? null : cluster.id))
                    }
                    className="text-left"
                  >
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3
                        className={cn(
                          "text-base font-semibold",
                          cluster.accent === "amber" && "text-accent-amber",
                          cluster.accent === "violet" && "text-accent-violet",
                          cluster.accent === "cyan" && "text-accent-cyan",
                          cluster.accent === "emerald" && "text-accent-emerald",
                        )}
                      >
                        {name}
                      </h3>
                      <span className="text-fg-subtle shrink-0 font-mono text-[10px]">
                        {t("toolsCount", { count: cluster.skills.length })}
                      </span>
                    </div>
                    <p className="text-fg-muted text-sm leading-relaxed">{blurb}</p>
                  </button>

                  {expanded && (
                    <>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {cluster.skills.map((s) => (
                          <li key={s.name}>
                            <SkillChip name={s.name} accent={cluster.accent} />
                          </li>
                        ))}
                      </ul>
                      {(cluster.relatedProjects?.length ?? 0) > 0 && (
                        <div className="border-border mt-4 border-t pt-3">
                          <h4 className="mono-label">{ts("appliedIn")}</h4>
                          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {projects
                              .filter((p) => cluster.relatedProjects!.includes(p.slug))
                              .map((p) => (
                                <li key={p.slug}>
                                  <Link
                                    href={"/work/" + p.slug}
                                    className="text-accent-cyan text-sm underline-offset-4 hover:underline"
                                  >
                                    {tp("items." + p.slug + ".title")}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <div
              role="group"
              aria-label={t("groups.technical")}
              className="mb-5 flex flex-wrap gap-2"
            >
              {techItems.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={activeTech === c.id}
                  onClick={() => setActiveTech((cur) => (cur === c.id ? null : c.id))}
                  className={cn(
                    "chip gap-2",
                    activeTech === c.id &&
                      "border-accent-amber/60 bg-accent-amber/10 text-accent-amber",
                  )}
                >
                  <span>{c.label}</span>
                  <span className="font-mono text-[10px] opacity-70">{c.skills.length}</span>
                </button>
              ))}
            </div>
            {selectedTech ? (
              <div className="card p-5" aria-live="polite">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold">{selectedTech.label}</h3>
                  <span className="text-fg-subtle text-xs">
                    {t("toolsCount", { count: selectedTech.skills.length })}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {selectedTech.skills.map((s) => (
                    <li key={s}>
                      <SkillChip name={s} accent={selectedTech.accent} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="border-border text-fg-subtle rounded-lg border border-dashed p-8 text-center text-sm">
                {t("emptyState")}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
