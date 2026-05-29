"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileDown, Mail, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Github, Linkedin } from "@/components/icons/brand";
import { SITE, TAGLINES } from "@/content/profile";
import { HeroVisualization } from "./hero-visualization";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const [tagIndex, setTagIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTagIndex((i) => (i + 1) % TAGLINES.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="border-border/60 relative overflow-hidden border-b" aria-label="Hero">
      {/* background grid + glow */}
      <div className="grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div
        className="bg-accent-cyan/10 absolute -top-32 left-1/2 -z-10 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full blur-[70px]"
        aria-hidden
      />
      <div
        className="bg-accent-violet/10 absolute right-0 -bottom-32 -z-10 h-[22rem] w-[32rem] rounded-full blur-[80px]"
        aria-hidden
      />

      <div className="container-tight grid gap-12 py-10 sm:py-14 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="border-border bg-bg-elev/60 text-fg-muted inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px]"
          >
            <span className="relative flex h-2 w-2">
              <span className="bg-accent-emerald absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              <span className="bg-accent-emerald relative inline-flex h-2 w-2 rounded-full" />
            </span>
            {t("statusLabel", { role: SITE.role, company: SITE.company })}
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-fg mt-6 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
          >
            {t.rich("headline", {
              strong: (chunks) => <span className="text-accent-cyan">{chunks}</span>,
            })}
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-fg-muted mt-6 max-w-2xl text-lg"
          >
            {t("subhead")}
          </motion.p>

          <div className="mt-4 flex items-center gap-2">
            <Sparkles className="text-accent-cyan h-3.5 w-3.5" aria-hidden />
            <motion.span
              key={tagIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-fg-subtle font-mono text-xs"
            >
              {TAGLINES[tagIndex]}
            </motion.span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/work" className="btn-primary">
              {t("primaryCta")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/experience" className="btn-secondary">
              {t("secondaryCta")}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a
              href={SITE.github}
              className="btn-ghost text-fg-muted text-xs"
              aria-label={tCommon("github")}
            >
              <Github className="h-3.5 w-3.5" /> {tCommon("github")}
            </a>
            <a
              href={SITE.linkedin}
              className="btn-ghost text-fg-muted text-xs"
              aria-label={tCommon("linkedin")}
            >
              <Linkedin className="h-3.5 w-3.5" /> {tCommon("linkedin")}
            </a>
            <a href={SITE.resumePath} download className="btn-ghost text-fg-muted text-xs">
              <FileDown className="h-3.5 w-3.5" /> {tCommon("downloadResume")}
            </a>
            <Link href="/contact" className="btn-ghost text-fg-muted text-xs">
              <Mail className="h-3.5 w-3.5" /> {tNav("contact")}
            </Link>
          </div>

          {/* Quick-scan impact strip — visible in first viewport */}
          <ul className="mt-10 grid grid-cols-3 gap-3 sm:max-w-xl">
            {[
              { v: "18–19%", k: "throughput" as const },
              { v: "~40%", k: "rca" as const },
              { v: "Top 1%", k: "leetcode" as const },
            ].map((m) => (
              <li key={m.k} className="border-border bg-bg-elev/50 rounded-lg border p-3">
                <div className="text-fg font-mono text-lg font-semibold">{m.v}</div>
                <div className="text-fg-subtle mt-1 text-[11px]">{t(`impactStrip.${m.k}`)}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-5">
          <div className="card border-border/80 from-bg-elev/80 to-bg-sunken/80 relative aspect-[5/4] overflow-hidden rounded-2xl bg-gradient-to-br p-4">
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="bg-accent-amber/70 h-2 w-2 rounded-full" />
              <span className="bg-accent-emerald/70 h-2 w-2 rounded-full" />
              <span className="bg-accent-cyan/70 h-2 w-2 rounded-full" />
              <span className="text-fg-muted ml-2 font-mono text-xs font-medium">
                {t("visualization.panelLabel")}
              </span>
            </div>
            <HeroVisualization />
            <div className="pointer-events-none absolute inset-x-3 bottom-2 flex items-center justify-between font-mono text-xs font-medium">
              <span className="text-fg-muted">{t("visualization.flow")}</span>
              <span className="text-accent-emerald">{t("visualization.throughputUp")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
