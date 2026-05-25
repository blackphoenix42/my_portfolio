"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { clusters } from "@/content/skills";
import { projects } from "@/content/projects";
import { accentText, cn } from "@/lib/utils";
import { TECH_ICONS } from "@/components/logos/tech-icons";

export function EngineeringSpectrum() {
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  return (
    <section className="section" aria-label="Engineering spectrum">
      <div className="container-tight">
        <header className="mb-10">
          <p className="mono-label">/ engineering arsenal</p>
          <h2 className="section-title mt-2">Engineering spectrum</h2>
          <p className="mt-2 max-w-2xl text-fg-muted">
            Capability clusters spanning low-level performance, intelligent systems, distributed
            backends, product engineering and infrastructure.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clusters.map((c, i) => {
            const related = projects.filter((p) => c.relatedProjects?.includes(p.slug));
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onMouseEnter={() => setActiveCluster(c.id)}
                onMouseLeave={() => setActiveCluster(null)}
                className={cn(
                  "card p-5 transition-all",
                  activeCluster === c.id && "border-accent-cyan/40",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className={cn("text-base font-semibold", accentText[c.accent])}>{c.name}</h3>
                  <span className="font-mono text-[10px] text-fg-subtle">
                    {c.skills.length} tools
                  </span>
                </div>
                <p className="mt-2 text-sm text-fg-muted">{c.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {c.skills.map((s) => {
                    const Icon = (
                      TECH_ICONS as Record<
                        string,
                        (p: { className?: string }) => React.ReactElement
                      >
                    )[s.name];
                    return (
                      <li
                        key={s.name}
                        className={cn("chip", s.level === "core" && "border-fg/40 text-fg")}
                      >
                        {Icon ? <Icon className="h-3 w-3" /> : null}
                        {s.name}
                      </li>
                    );
                  })}
                </ul>
                {related.length > 0 && (
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <p className="mono-label">Applied in</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/work/${r.slug}`}
                            className="text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                          >
                            {r.title.split("—")[0]?.trim()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
