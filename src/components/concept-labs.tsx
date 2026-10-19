"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Beaker } from "lucide-react";
import { useTranslations } from "next-intl";
import { Github } from "@/components/icons/brand";
import { concepts } from "@/content/concepts";
import { accentText, cn } from "@/lib/utils";
import { SkillChip } from "@/components/logos/skill-chip";

const statusStyles: Record<string, string> = {
  design: "text-accent-amber border-accent-amber/40 bg-accent-amber/10",
  prototyping: "text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10",
  "in-development": "text-accent-emerald border-accent-emerald/40 bg-accent-emerald/10",
};

const statusKey: Record<string, "design" | "prototyping" | "inDevelopment"> = {
  design: "design",
  prototyping: "prototyping",
  "in-development": "inDevelopment",
};

const ETA_ORDER = ["Q1 2027", "Q2 2027", "Q3 2027", "Q4 2027"];

type ConceptLabsProps = {
  /** When true, skip the outer section chrome (used inside the unified roadmap). */
  embedded?: boolean;
};

export function ConceptLabs({ embedded = false }: ConceptLabsProps) {
  const t = useTranslations("concepts");
  const reduce = useReducedMotion();
  const tr = (slug: string, key: string, fallback: string) => {
    const path = `items.${slug}.${key}` as never;
    return t.has(path) ? t(path) : fallback;
  };

  const ordered = [...concepts].sort((a, b) => {
    const ai = ETA_ORDER.indexOf(a.eta ?? "");
    const bi = ETA_ORDER.indexOf(b.eta ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const grid = (
    <div className="grid gap-4 md:grid-cols-3">
      {ordered.map((c, i) => (
        <motion.article
          key={c.slug}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.07 }}
          className="card card-hover relative flex flex-col p-5"
        >
          <div className={cn("chip absolute top-3 right-3", statusStyles[c.status])}>
            {t(`status.${statusKey[c.status]}` as never)}
          </div>
          <h3 className={`text-lg font-semibold ${accentText[c.accent]}`}>
            {tr(c.slug, "name", c.name)}
          </h3>
          <p className="text-fg mt-2 text-sm font-medium">{tr(c.slug, "pitch", c.pitch)}</p>
          <p className="text-fg-muted mt-2 text-sm">{tr(c.slug, "description", c.description)}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {c.stack.map((s) => (
              <li key={s}>
                <SkillChip name={s} accent={c.accent} />
              </li>
            ))}
          </ul>
          <div className="border-border/60 mt-5 flex items-center justify-between border-t pt-3 text-xs">
            <a
              href={c.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5 font-mono"
              title={t("placeholderRepo")}
            >
              <Github className="h-3.5 w-3.5" />
              blackphoenix42/{c.slug}
            </a>
            {c.eta && (
              <span className="text-fg-subtle font-mono text-[10px]">
                {t("target")} {c.eta}
              </span>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );

  if (embedded) return grid;

  return (
    <section className="section" aria-label={t("ariaLabel")}>
      <div className="container-tight">
        <header className="mb-10">
          <p className="mono-label inline-flex items-center gap-2">
            <Beaker className="h-3.5 w-3.5" /> {t("eyebrow")}
          </p>
          <h2 className="section-title mt-2">{t("heading")}</h2>
          <p className="text-fg-muted mt-2 max-w-2xl">{t("intro")}</p>
        </header>
        {grid}
      </div>
    </section>
  );
}
