"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { experiences, type Experience } from "@/content/experience";
import { CompanyLogo } from "@/components/experience/company-logo";
import { CertPreview } from "@/components/certs/cert-preview";
import { Link } from "@/i18n/navigation";
import { slugify } from "@/lib/utils";

type CareerTimelineProps = {
  items?: Experience[];
  eyebrow?: string;
  title?: string;
  ariaLabel?: string;
  cta?: { href: string; label: string };
};

export function CareerTimeline({
  items = experiences,
  eyebrow,
  title,
  ariaLabel,
  cta,
}: CareerTimelineProps = {}) {
  const t = useTranslations("experience");
  const tData = useTranslations("experienceData");
  const td = (slug: string, key: string, fallback: string) => {
    const path = `${slug}.${key}` as never;
    return tData.has(path) ? tData(path) : fallback;
  };
  const resolvedEyebrow = eyebrow ?? t("eyebrow");
  const resolvedTitle = title ?? t("heading");
  const resolvedAriaLabel = ariaLabel ?? t("heading");
  return (
    <section
      className="section border-border/60 bg-bg-sunken/30 border-y"
      aria-label={resolvedAriaLabel}
    >
      <div className="container-tight">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label">{resolvedEyebrow}</p>
            <h2 className="section-title mt-2">{resolvedTitle}</h2>
          </div>
          {cta && (
            <Link href={cta.href} className="btn-secondary text-sm">
              {cta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </header>

        <div className="space-y-16">
          {items.map((exp) => {
            const slug = slugify(exp.company);
            return (
              <article key={exp.company} className="grid gap-8 lg:grid-cols-12">
                <header className="lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <CompanyLogo
                      name={exp.company}
                      className="border-border bg-bg-elev h-10 w-10 rounded-md border p-1"
                    />
                    <div>
                      <p className="text-accent-cyan font-mono text-xs">
                        {exp.start} — {exp.end}
                      </p>
                      <h3 className="mt-1 text-2xl leading-tight font-semibold tracking-tight">
                        {exp.company}
                      </h3>
                    </div>
                  </div>
                  <p className="text-fg-muted mt-2">{td(slug, "role", exp.role)}</p>
                  <p className="text-fg-subtle mt-1 font-mono text-xs">
                    {td(slug, "location", exp.location)}
                  </p>
                  <p className="text-fg-muted mt-4 max-w-sm text-sm">
                    {td(slug, "summary", exp.summary)}
                  </p>
                  {exp.certificateUrl && (
                    <div className="mt-4 max-w-55">
                      <p className="mono-label mb-2">{t("certificate")}</p>
                      <CertPreview
                        href={exp.certificateUrl}
                        label={`${exp.company} — ${t("certificate")}`}
                        compact
                      />
                    </div>
                  )}
                </header>
                <ol className="relative lg:col-span-8">
                  <span
                    className="from-accent-cyan via-accent-violet to-accent-emerald absolute top-2 bottom-2 left-3 w-px bg-linear-to-b opacity-50"
                    aria-hidden
                  />
                  {exp.highlights.map((h, i) => (
                    <motion.li
                      key={h.title}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: i * 0.05 }}
                      className="relative mb-6 pl-10 last:mb-0"
                    >
                      <span
                        className="border-bg bg-accent-cyan absolute top-2 left-1.5 h-3 w-3 rounded-full border-2"
                        aria-hidden
                      />
                      <h4 className="text-base font-semibold tracking-tight">
                        {td(slug, `highlights.${i}.title`, h.title)}
                      </h4>
                      <p className="text-fg-muted mt-1 text-sm">
                        {td(slug, `highlights.${i}.detail`, h.detail)}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {h.tags.map((tag) => (
                          <li key={tag} className="chip">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </motion.li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
