"use client";

import { motion } from "framer-motion";
import { concepts } from "@/content/concepts";
import { accentText } from "@/lib/utils";
import { Beaker } from "lucide-react";

export function ConceptLabs() {
  return (
    <section className="section" aria-label="Concept labs">
      <div className="container-tight">
        <header className="mb-10">
          <p className="mono-label inline-flex items-center gap-2">
            <Beaker className="h-3.5 w-3.5" /> / concept labs
          </p>
          <h2 className="section-title mt-2">Experiments and products I'd build next</h2>
          <p className="mt-2 max-w-2xl text-fg-muted">
            Product concepts that explore the space between performance engineering and intelligent
            developer tooling.{" "}
            <span className="text-accent-amber">These are not shipped systems</span> — they are
            deliberate design and engineering thought experiments.
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
              className="card card-hover relative p-5"
            >
              <div className="chip absolute right-3 top-3 text-accent-amber">
                Concept · Experimental
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
