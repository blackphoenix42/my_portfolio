"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { metrics } from "@/content/metrics";
import { accentText } from "@/lib/utils";

export function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <section className="border-border/60 bg-bg-sunken/30 border-b" aria-label="Impact metrics">
      <div className="container-tight py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mono-label">Impact · verified</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Measurable engineering outcomes
            </h2>
          </div>
          <span className="mono-label hidden sm:block">cadence · 2022–present</span>
        </div>
        <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m, i) => (
            <motion.article
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card card-hover p-4"
            >
              <div className={`font-mono text-2xl font-semibold ${accentText[m.accent]}`}>
                {m.value}
              </div>
              <div className="text-fg mt-2 text-sm font-medium">{m.label}</div>
              <p className="text-fg-subtle mt-1 text-xs leading-snug">{m.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
