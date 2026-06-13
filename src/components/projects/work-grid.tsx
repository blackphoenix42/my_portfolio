"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Cpu, Layers, Activity, Coins, Filter } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  XmaiPipeline,
  FlamegraphMini,
  AlgoMini,
  ChainBracket,
  PostureMini,
  TrackMini,
  BrainMini,
} from "@/components/diagrams/case-study-thumbs";
import {
  ALL_QUIRKY_FILTER,
  availableQuirkyTags,
  filterByQuirkyTag,
  type QuirkyFilter,
} from "@/lib/quirky-tags";

export type WorkCard = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  tags: string[];
  status: "professional" | "open-source" | "concept";
  quirkyTags: string[];
};

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

export function WorkGrid({
  cards,
  labels,
  quirkyLabels,
  allLabel,
}: {
  cards: WorkCard[];
  labels: { readMore: string; professional: string; openSource: string; filter: string };
  quirkyLabels: Record<string, string>;
  allLabel: string;
}) {
  const [active, setActive] = useState<QuirkyFilter>(ALL_QUIRKY_FILTER);
  const tags = useMemo(() => availableQuirkyTags(cards), [cards]);
  const visible = useMemo(() => filterByQuirkyTag(cards, active), [cards, active]);

  return (
    <>
      <div
        className="mb-6 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={labels.filter}
      >
        <span className="text-fg-subtle inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase">
          <Filter className="h-3 w-3" /> {labels.filter}
        </span>
        <FilterChip
          label={allLabel}
          active={active === ALL_QUIRKY_FILTER}
          onClick={() => setActive(ALL_QUIRKY_FILTER)}
        />
        {tags.map((tag) => (
          <FilterChip
            key={tag}
            label={quirkyLabels[tag] ?? tag}
            active={active === tag}
            onClick={() => setActive(tag)}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {visible.map((p) => {
          const Icon = Icons[p.slug] ?? Cpu;
          const Thumb = Thumbs[p.slug];
          return (
            <article key={p.slug} className="card card-hover group relative overflow-hidden">
              <div className="border-border bg-bg-sunken/60 relative h-44 overflow-hidden border-b">
                {Thumb ? (
                  <Thumb />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <Icon className="text-accent-cyan/70 h-14 w-14" />
                  </div>
                )}
                <div className="border-border bg-bg-elev/80 text-fg-muted absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] backdrop-blur">
                  <Icon className="h-3 w-3" /> {p.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold tracking-tight">
                  <Link
                    href={`/work/${p.slug}`}
                    className="group-hover:text-accent-cyan transition-colors after:absolute after:inset-0 focus-visible:outline-none"
                    aria-label={labels.readMore + ": " + p.title}
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="text-fg-muted mt-2 line-clamp-3 text-sm">{p.tagline}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-accent-cyan group-hover:text-fg inline-flex items-center gap-1 text-sm font-medium transition-colors">
                    {labels.readMore} <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                  {p.status === "professional" && (
                    <span className="chip text-accent-amber">{labels.professional}</span>
                  )}
                  {p.status === "open-source" && (
                    <span className="chip text-accent-emerald">{labels.openSource}</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
        active
          ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan"
          : "border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
