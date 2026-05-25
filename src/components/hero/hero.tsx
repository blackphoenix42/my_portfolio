"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Github, Linkedin, FileDown, Mail, Sparkles } from "lucide-react";
import { SITE, TAGLINES } from "@/content/profile";
import { HeroVisualization } from "./hero-visualization";
import { useEffect, useState } from "react";

export function Hero() {
  const reduce = useReducedMotion();
  const [tagIndex, setTagIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTagIndex((i) => (i + 1) % TAGLINES.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="relative overflow-hidden border-b border-border/60" aria-label="Hero">
      {/* background grid + glow */}
      <div className="grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div
        className="absolute -top-32 left-1/2 -z-10 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-accent-cyan/10 blur-[70px]"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 right-0 -z-10 h-[22rem] w-[32rem] rounded-full bg-accent-violet/10 blur-[80px]"
        aria-hidden
      />

      <div className="container-tight grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev/60 px-3 py-1.5 font-mono text-[11px] text-fg-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald" />
            </span>
            {SITE.role} @ {SITE.company}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 text-display-1 font-semibold tracking-tight"
          >
            I engineer <span className="gradient-text">performance-critical systems</span> and{" "}
            <span className="gradient-text">AI-powered developer tools</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl text-lg text-fg-muted"
          >
            C++ performance engineering, EDA simulation optimization, agentic AI workflows and
            interactive developer products — built for measurable impact.
          </motion.p>

          <div className="mt-4 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" aria-hidden />
            <motion.span
              key={tagIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-xs text-fg-subtle"
            >
              {TAGLINES[tagIndex]}
            </motion.span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/work" className="btn-primary">
              View Projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/experience" className="btn-secondary">
              See experience
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a href={SITE.github} className="btn-ghost text-xs text-fg-muted" aria-label="GitHub">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <a
              href={SITE.linkedin}
              className="btn-ghost text-xs text-fg-muted"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a href={SITE.resumePath} download className="btn-ghost text-xs text-fg-muted">
              <FileDown className="h-3.5 w-3.5" /> Download Résumé
            </a>
            <Link href="/contact" className="btn-ghost text-xs text-fg-muted">
              <Mail className="h-3.5 w-3.5" /> Contact
            </Link>
          </div>

          {/* Quick-scan impact strip — visible in first viewport */}
          <ul className="mt-10 grid grid-cols-3 gap-3 sm:max-w-xl">
            {[
              { v: "18–19%", l: "Sim. throughput" },
              { v: "~40%", l: "Faster RCA" },
              { v: "Top 1%", l: "LeetCode global" },
            ].map((m) => (
              <li key={m.l} className="rounded-lg border border-border bg-bg-elev/50 p-3">
                <div className="font-mono text-lg font-semibold text-fg">{m.v}</div>
                <div className="mt-1 text-[11px] text-fg-subtle">{m.l}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-5">
          <div className="card relative aspect-[5/4] overflow-hidden rounded-2xl border-border/80 bg-gradient-to-br from-bg-elev/80 to-bg-sunken/80 p-4">
            <div className="absolute left-3 top-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-amber/70" />
              <span className="h-2 w-2 rounded-full bg-accent-emerald/70" />
              <span className="h-2 w-2 rounded-full bg-accent-cyan/70" />
              <span className="ml-2 font-mono text-xs font-medium text-fg-muted">
                xmai · profiler · live
              </span>
            </div>
            <HeroVisualization />
            <div className="pointer-events-none absolute inset-x-3 bottom-2 flex items-center justify-between font-mono text-xs font-medium">
              <span className="text-fg-muted">artifacts → retrieval → agent → rtl</span>
              <span className="text-accent-emerald">↑ throughput</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
