"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experiences, type Experience } from "@/content/experience";
import { CompanyLogo } from "@/components/experience/company-logo";

type CareerTimelineProps = {
  items?: Experience[];
  eyebrow?: string;
  title?: string;
  ariaLabel?: string;
  cta?: { href: string; label: string };
};

export function CareerTimeline({
  items = experiences,
  eyebrow = "/ experience",
  title = "Career timeline",
  ariaLabel = "Career timeline",
  cta,
}: CareerTimelineProps = {}) {
  return (
    <section className="section border-y border-border/60 bg-bg-sunken/30" aria-label={ariaLabel}>
      <div className="container-tight">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label">{eyebrow}</p>
            <h2 className="section-title mt-2">{title}</h2>
          </div>
          {cta && (
            <Link href={cta.href} className="btn-secondary text-sm">
              {cta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </header>

        <div className="space-y-16">
          {items.map((exp) => (
            <article key={exp.company} className="grid gap-8 lg:grid-cols-12">
              <header className="lg:col-span-4">
                <div className="flex items-center gap-3">
                  <CompanyLogo
                    name={exp.company}
                    className="h-10 w-10 rounded-md border border-border bg-bg-elev p-1"
                  />
                  <div>
                    <p className="font-mono text-xs text-accent-cyan">
                      {exp.start} — {exp.end}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-tight">
                      {exp.company}
                    </h3>
                  </div>
                </div>
                <p className="mt-2 text-fg-muted">{exp.role}</p>
                <p className="mt-1 font-mono text-xs text-fg-subtle">{exp.location}</p>
                <p className="mt-4 max-w-sm text-sm text-fg-muted">{exp.summary}</p>
              </header>
              <ol className="relative lg:col-span-8">
                <span
                  className="absolute bottom-2 left-3 top-2 w-px bg-gradient-to-b from-accent-cyan via-accent-violet to-accent-emerald opacity-50"
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
                      className="absolute left-1.5 top-2 h-3 w-3 rounded-full border-2 border-bg bg-accent-cyan"
                      aria-hidden
                    />
                    <h4 className="text-base font-semibold tracking-tight">{h.title}</h4>
                    <p className="mt-1 text-sm text-fg-muted">{h.detail}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {h.tags.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
