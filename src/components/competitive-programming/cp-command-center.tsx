"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Terminal, ExternalLink, Trophy, Target, Flame, Zap } from "lucide-react";
import { competitive } from "@/content/achievements";
import { accentText } from "@/lib/utils";
import { SITE } from "@/content/profile";

const PLATFORM_LOGOS: Record<string, string> = {
  CodeChef: "/assets/logos/codechef.png",
  Codeforces: "/assets/logos/codeforces.svg",
  LeetCode: "/assets/logos/leetcode.png",
  HackerRank: "/assets/logos/hackerrank.png",
};

const HIGHLIGHTS = [
  { label: "Years competing", value: "6+", icon: Flame, accent: "amber" as const },
  { label: "Problems solved", value: "2.4k+", icon: Target, accent: "cyan" as const },
  { label: "Contest podiums", value: "10+", icon: Trophy, accent: "violet" as const },
  { label: "Peak rating", value: "2353", icon: Zap, accent: "emerald" as const },
];

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
            <Link href="/work/algolens" className="btn-secondary text-sm">
              Explore AlgoLens
            </Link>
            <a href={`${SITE.github}?tab=repositories`} className="btn-secondary text-sm">
              CP repositories
            </a>
          </div>
        </header>

        {/* Highlights strip */}
        <ul className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <li key={h.label} className="card flex items-center gap-3 p-4">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${
                    h.accent === "amber"
                      ? "border-accent-amber/40 bg-accent-amber/10 text-accent-amber"
                      : h.accent === "cyan"
                        ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                        : h.accent === "violet"
                          ? "border-accent-violet/40 bg-accent-violet/10 text-accent-violet"
                          : "border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className={`text-xl font-semibold ${accentText[h.accent]}`}>{h.value}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                    {h.label}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-bg-sunken/60 px-4 py-2 font-mono text-xs text-fg-subtle">
            <Terminal className="h-3.5 w-3.5" />
            <span>~/competitive-programming</span>
            <span className="ml-auto">$ ranks --all</span>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {competitive.map((a, i) => {
              const logo = PLATFORM_LOGOS[a.platform];
              return (
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
                    <div className="flex items-center gap-2">
                      {logo && (
                        <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-bg-sunken/60 p-1">
                          <Image
                            src={logo}
                            alt={`${a.platform} logo`}
                            width={24}
                            height={24}
                            className="h-full w-full object-contain"
                          />
                        </span>
                      )}
                      <span className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
                        {a.platform}
                      </span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className={`mt-3 text-2xl font-semibold ${accentText[a.accent]}`}>
                    {a.rank}
                  </div>
                  {a.rating && <div className="mt-1 font-mono text-sm text-fg">{a.rating}</div>}
                  <p className="mt-1 text-xs text-fg-subtle">
                    {a.detail ? `${a.detail} · ` : ""}@{a.handle}
                  </p>
                  {/* hover accent stripe */}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                      a.accent === "amber"
                        ? "bg-accent-amber"
                        : a.accent === "cyan"
                          ? "bg-accent-cyan"
                          : a.accent === "violet"
                            ? "bg-accent-violet"
                            : "bg-accent-emerald"
                    }`}
                    aria-hidden
                  />
                </motion.a>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-xs text-fg-subtle">
          Handles &amp; live ratings update independently on each platform — click a tile to verify.
        </p>
      </div>
    </section>
  );
}
