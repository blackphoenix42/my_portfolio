"use client";

import { motion } from "framer-motion";
import { Beaker, Github } from "lucide-react";
import { concepts } from "@/content/concepts";
import { accentText, cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  design: "text-accent-amber border-accent-amber/40 bg-accent-amber/10",
  prototyping: "text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10",
  "in-development": "text-accent-emerald border-accent-emerald/40 bg-accent-emerald/10",
};

const statusLabel: Record<string, string> = {
  design: "Design phase",
  prototyping: "Prototyping",
  "in-development": "In development",
};

export function ConceptLabs() {
  return (
    <section className="section" aria-label="Roadmap">
      <div className="container-tight">
        <header className="mb-10">
          <p className="mono-label inline-flex items-center gap-2">
            <Beaker className="h-3.5 w-3.5" /> / roadmap
          </p>
          <h2 className="section-title mt-2">What I'd build next</h2>
          <p className="mt-2 max-w-2xl text-fg-muted">
            Product concepts at the intersection of performance engineering and intelligent
            developer tooling.{" "}
            <span className="text-accent-amber">Pre-launch — repos are placeholders</span> until the
            first commit lands.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {concepts.map((c, i) => (
            <motion.article
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="card card-hover relative flex flex-col p-5"
            >
              <div className={cn("chip absolute right-3 top-3", statusStyles[c.status])}>
                {statusLabel[c.status]}
              </div>
              <h3 className={`text-lg font-semibold ${accentText[c.accent]}`}>{c.name}</h3>
              <p className="mt-2 text-sm font-medium text-fg">{c.pitch}</p>
              <p className="mt-2 text-sm text-fg-muted">{c.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {c.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                <a
                  href={c.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-fg-muted hover:text-fg"
                  title="Placeholder repo — in development"
                >
                  <Github className="h-3.5 w-3.5" />
                  blackphoenix42/{c.slug}
                </a>
                {c.eta && (
                  <span className="font-mono text-[10px] text-fg-subtle">target {c.eta}</span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
