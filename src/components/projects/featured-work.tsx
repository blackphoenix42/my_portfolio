"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Layers, Activity, Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import { projects } from "@/content/projects";
import { InView } from "@/components/layout/in-view";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("work");
  const tCommon = useTranslations("common");
  const tProjects = useTranslations("projects");
  const tr = (slug: string, key: "title" | "tagline" | "category", fallback: string) => {
    try {
      return tProjects(`items.${slug}.${key}`);
    } catch {
      return fallback;
    }
  };
  return (
    <section className="section" aria-label={t("featured")}>
      <div className="container-tight">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label">/ {t("title").toLowerCase()}</p>
            <h2 className="section-title mt-2">{t("featured")}</h2>
            <p className="text-fg-muted mt-2 max-w-xl">{t("featuredSubheading")}</p>
          </div>
          <Link href="/work" className="btn-secondary text-sm">
            {t("allWork")} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((p, i) => {
            const Icon = Icons[p.slug] ?? Cpu;
            const Thumb = Thumbs[p.slug];
            const title = tr(p.slug, "title", p.title);
            return (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="card card-hover group relative overflow-hidden"
              >
                <div className="border-border bg-bg-sunken/60 relative h-44 overflow-hidden border-b">
                  {Thumb ? (
                    <InView rootMargin="300px" minHeight={176} className="absolute inset-0">
                      <Thumb />
                    </InView>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_30%,hsl(var(--accent-cyan)/0.18),transparent_45%),linear-gradient(135deg,hsl(var(--bg-elev)),hsl(var(--bg-sunken)))]">
                      <Icon className="text-accent-cyan/70 h-14 w-14" />
                    </div>
                  )}
                  <div className="border-border bg-bg-elev/90 text-fg-muted absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px]">
                    <Icon className="h-3 w-3" /> {tr(p.slug, "category", p.category)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {/* The link covers the whole card via the `::before`
                        pseudo-element (`after:absolute after:inset-0`), so
                        every safe-area click takes you to the case study,
                        but the inner `chip` list and the "Read more" affordance
                        remain individually focusable. */}
                    <Link
                      href={`/work/${p.slug}`}
                      className="group-hover:text-accent-cyan transition-colors after:absolute after:inset-0 focus-visible:outline-none"
                      aria-label={t("readMore") + ": " + title}
                    >
                      {title}
                    </Link>
                  </h3>
                  <p className="text-fg-muted mt-2 line-clamp-3 text-sm">
                    {tr(p.slug, "tagline", p.tagline)}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 6).map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-accent-cyan group-hover:text-fg inline-flex items-center gap-1 text-sm font-medium transition-colors">
                      {t("readMore")} <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                    {p.status === "professional" && (
                      <span className="chip text-accent-amber">{tCommon("professional")}</span>
                    )}
                    {p.status === "open-source" && (
                      <span className="chip text-accent-emerald">{tCommon("openSource")}</span>
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
