"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, ExternalLink } from "lucide-react";
import { competitive, otherAchievements } from "@/content/achievements";
import { accentText } from "@/lib/utils";
import { SITE } from "@/content/profile";

export function CPCommandCenter() {
  return (
    <section className="section" aria-label="Competitive programming">
      <div className="container-tight">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label">/ competitive programming</p>
            <h2 className="section-title mt-2">Command center</h2>
            <p className="mt-2 max-w-xl text-fg-muted">
              Years of rigorous problem-solving — translated into systems intuition for performance
              work.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/competitive-programming" className="btn-secondary text-sm">
              Explore AlgoLens
            </Link>
            <a href={`${SITE.github}?tab=repositories`} className="btn-secondary text-sm">
              CP repositories
            </a>
          </div>
        </header>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-bg-sunken/60 px-4 py-2 font-mono text-xs text-fg-subtle">
            <Terminal className="h-3.5 w-3.5" />
            <span>~/competitive-programming</span>
            <span className="ml-auto">$ ranks --all</span>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {competitive.map((a, i) => (
              <motion.a
                key={a.platform}
                href={a.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group relative block bg-bg-elev p-5 transition-colors hover:bg-bg-sunken/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
                    {a.platform}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className={`mt-3 text-2xl font-semibold ${accentText[a.accent]}`}>
                  {a.rank}
                </div>
                {a.rating && <div className="mt-1 font-mono text-sm text-fg">{a.rating}</div>}
                <p className="mt-1 text-xs text-fg-subtle">
                  {a.detail ? `${a.detail} · ` : ""}@{a.handle}
                </p>
              </motion.a>
            ))}
          </div>
        </div>

        {otherAchievements.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {otherAchievements.map((o) => (
              <li key={o.title} className="card p-4">
                <div className="text-sm font-semibold text-fg">{o.title}</div>
                <p className="mt-1 text-xs text-fg-muted">{o.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
