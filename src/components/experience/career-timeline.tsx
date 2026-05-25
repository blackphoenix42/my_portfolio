"use client";

import { motion } from "framer-motion";
import { experiences } from "@/content/experience";

export function CareerTimeline() {
  return (
    <section
      className="section border-y border-border/60 bg-bg-sunken/30"
      aria-label="Career timeline"
    >
      <div className="container-tight">
        <header className="mb-10">
          <p className="mono-label">/ experience</p>
          <h2 className="section-title mt-2">Career timeline</h2>
        </header>

        {experiences.map((exp) => (
          <article key={exp.company} className="grid gap-8 lg:grid-cols-12">
            <header className="lg:col-span-4">
              <p className="font-mono text-xs text-accent-cyan">
                {exp.start} — {exp.end}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{exp.company}</h3>
              <p className="mt-1 text-fg-muted">{exp.role}</p>
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
                  className="relative mb-6 pl-10"
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
    </section>
  );
}
