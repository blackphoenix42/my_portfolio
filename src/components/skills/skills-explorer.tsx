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

export function SkillsExplorer() {
  const t = useTranslations("skillsExplorer");
  const ts = useTranslations("engineeringSpectrum");
  const tp = useTranslations("projects");
  const [active, setActive] = useState<string | null>(null);
  const groups = [
    {
      id: "technical",
      items: flatSkillCategories.map((c) => ({
        ...c,
        label: t(("categories." + c.id) as never),
        relatedProjects: [] as string[],
      })),
    },
    {
      id: "applied",
      items: clusters.map((c) => ({
        ...c,
        label: ts(("clusters." + c.id + ".name") as never),
        skills: c.skills.map((s) => s.name),
        relatedProjects: c.relatedProjects ?? [],
      })),
    },
  ];
  const selected = groups
    .flatMap((g) => g.items.map((c) => ({ ...c, key: g.id + ":" + c.id })))
    .find((c) => c.key === active);
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
        {groups.map((group) => (
          <div
            key={group.id}
            role="group"
            aria-label={t("groups." + group.id)}
            className="border-border mb-5 border-b pb-5"
          >
            <p className="mono-label mb-3">{t("groups." + group.id)}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((c) => {
                const key = group.id + ":" + c.id;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active === key}
                    onClick={() => setActive(key)}
                    className={cn(
                      "chip gap-2",
                      active === key &&
                        "border-accent-amber/60 bg-accent-amber/10 text-accent-amber",
                    )}
                  >
                    <span>{c.label}</span>
                    <span className="font-mono text-[10px] opacity-70">{c.skills.length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {selected ? (
          <div className="card p-5" aria-live="polite">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-base font-semibold">{selected.label}</h3>
              <span className="text-fg-subtle text-xs">
                {t("toolsCount", { count: selected.skills.length })}
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {selected.skills.map((s) => (
                <li key={s}>
                  <SkillChip name={s} accent={selected.accent} />
                </li>
              ))}
            </ul>
            {selected.relatedProjects.length > 0 && (
              <div className="border-border mt-5 border-t pt-4">
                <h4 className="mono-label">{ts("appliedIn")}</h4>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {projects
                    .filter((p) => selected.relatedProjects.includes(p.slug))
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
          </div>
        ) : (
          <p className="border-border text-fg-subtle rounded-lg border border-dashed p-8 text-center text-sm">
            {t("emptyState")}
          </p>
        )}
      </div>
    </section>
  );
}
