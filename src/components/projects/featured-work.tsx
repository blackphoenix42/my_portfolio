"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Layers, Activity, Coins } from "lucide-react";
import { projects } from "@/content/projects";
import {
  XmaiPipeline,
  FlamegraphMini,
  AlgoMini,
  ChainBracket,
  PostureMini,
  TrackMini,
  BrainMini,
} from "@/components/diagrams/case-study-thumbs";

const Icons: Record<string, React.ComponentType<{ className?: string }>> = {
  xmai: Cpu,
  "xcelium-optimization": Activity,
  algolens: Layers,
  postureiq: Activity,
  "track-person-app": Layers,
  "smart-brain": Cpu,
  "tezos-premier-league": Coins,
};

const Thumbs: Record<string, () => React.ReactElement> = {
  xmai: () => <XmaiPipeline />,
  "xcelium-optimization": () => <FlamegraphMini />,
  algolens: () => <AlgoMini />,
  postureiq: () => <PostureMini />,
  "track-person-app": () => <TrackMini />,
  "smart-brain": () => <BrainMini />,
  "tezos-premier-league": () => <ChainBracket />,
};

export function FeaturedWork({ limit }: { limit?: number } = {}) {
  const items = typeof limit === "number" ? projects.slice(0, limit) : projects;
  return (
    <section className="section" aria-label="Featured work">
      <div className="container-tight">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label">/ work</p>
            <h2 className="section-title mt-2">Featured work</h2>
            <p className="mt-2 max-w-xl text-fg-muted">
              Selected projects across performance engineering, agentic AI, developer tooling and
              product engineering.
            </p>
          </div>
          <Link href="/work" className="btn-secondary text-sm">
            All work <ArrowUpRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((p, i) => {
            const Icon = Icons[p.slug] ?? Cpu;
            const Thumb = Thumbs[p.slug];
            return (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="card card-hover group overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden border-b border-border bg-bg-sunken/60">
                  {Thumb ? (
                    <Thumb />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_30%,hsl(var(--accent-cyan)/0.18),transparent_45%),linear-gradient(135deg,hsl(var(--bg-elev)),hsl(var(--bg-sunken)))]">
                      <Icon className="h-14 w-14 text-accent-cyan/70" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev/80 px-2.5 py-1 font-mono text-[10px] text-fg-muted backdrop-blur">
                    <Icon className="h-3 w-3" /> {p.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{p.tagline}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 6).map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/work/${p.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent-cyan transition-colors group-hover:text-fg"
                    >
                      Read more <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    {p.status === "professional" && (
                      <span className="chip text-accent-amber">Professional</span>
                    )}
                    {p.status === "open-source" && (
                      <span className="chip text-accent-emerald">Open source</span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
