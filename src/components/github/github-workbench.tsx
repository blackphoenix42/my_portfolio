"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Star } from "lucide-react";
import { Github } from "@/components/icons/brand";
import type { FeaturedRepo } from "@/lib/github";

export function GithubWorkbench({ repos }: { repos: FeaturedRepo[] }) {
  // Build categories dynamically so empty filters never show.
  const categories = useMemo(() => {
    const order: FeaturedRepo["category"][] = [
      "AI",
      "Systems",
      "Frontend",
      "Mobile",
      "CP",
      "Blockchain",
    ];
    const present = new Set(repos.map((r) => r.category));
    return ["All", ...order.filter((c) => present.has(c))] as const;
  }, [repos]);
  const [cat, setCat] = useState<string>("All");
  const filtered = useMemo(
    () => (cat === "All" ? repos : repos.filter((r) => r.category === cat)),
    [cat, repos],
  );

  return (
    <section
      className="section border-border/60 bg-bg-sunken/30 border-y"
      aria-label="GitHub workbench"
    >
      <div className="container-tight">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label">/ github</p>
            <h2 className="section-title mt-2">Public workbench</h2>
            <p className="text-fg-muted mt-2 max-w-xl">
              A curated slice of public repositories spanning algorithms, full-stack apps, mobile,
              blockchain and competitive programming.
            </p>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                    cat === c
                      ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                      : "border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <motion.a
              key={r.full_name}
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="card card-hover group block p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="text-fg-subtle h-4 w-4" />
                  <span className="font-mono text-sm font-medium">{r.name}</span>
                </div>
                <span className="chip">{r.category}</span>
              </div>
              <p className="text-fg-muted mt-3 line-clamp-2 text-sm">
                {r.description ?? "No description provided."}
              </p>
              <div className="text-fg-subtle mt-4 flex items-center justify-between font-mono text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: languageColor(r.language) }}
                    aria-hidden
                  />
                  {r.language ?? "—"}
                </span>
                <span className="inline-flex items-center gap-3">
                  {r.stargazers_count > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" /> {r.stargazers_count}
                    </span>
                  )}
                  {r.forks_count > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {r.forks_count}
                    </span>
                  )}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function languageColor(lang: string | null) {
  switch (lang) {
    case "TypeScript":
      return "#3178c6";
    case "JavaScript":
      return "#f1e05a";
    case "Python":
      return "#3572a5";
    case "C++":
      return "#f34b7d";
    case "Go":
      return "#00add8";
    default:
      return "hsl(var(--fg-subtle))";
  }
}
