"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Network } from "lucide-react";
import { Link } from "@/i18n/navigation";

const A = "hsl(var(--accent-cyan))";
const V = "hsl(var(--accent-violet))";
const E = "hsl(var(--accent-emerald))";
const BG = "hsl(var(--bg-elev))";
const BD = "hsl(var(--border))";
const FG_M = "hsl(var(--fg-muted))";

// A generic request → LB → service → cache/db fan-out, with an animated packet.
export function SystemDesignDiagram() {
  const reduce = useReducedMotion();
  const t = useTranslations("engineer");
  const nodes = [
    { x: 60, y: 90, label: "client", c: A },
    { x: 180, y: 90, label: "LB", c: A },
    { x: 300, y: 90, label: "service", c: V },
    { x: 420, y: 40, label: "cache", c: E },
    { x: 420, y: 140, label: "db", c: E },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
  ];

  return (
    <section aria-label={t("sysTitle")} className="container-tight py-14">
      <p className="text-accent-cyan inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
        <Network className="h-3.5 w-3.5" /> {t("sysTag")}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("sysTitle")}
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl text-sm">{t("sysIntro")}</p>
        </div>
        <Link href="/system-design" className="btn-secondary text-sm">
          {t("viewSystemDesign")} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="card mt-6 p-6">
        <svg viewBox="0 0 480 190" className="h-auto w-full" role="img" aria-label={t("sysTitle")}>
          {edges.map(([a, b], i) => {
            const na = nodes[a]!;
            const nb = nodes[b]!;
            return (
              <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={BD} strokeWidth="1.5" />
            );
          })}
          {!reduce &&
            edges.map(([a, b], i) => {
              const na = nodes[a]!;
              const nb = nodes[b]!;
              return (
                <motion.circle
                  key={`p-${i}`}
                  r="3.5"
                  fill={V}
                  initial={{ cx: na.x, cy: na.y, opacity: 0 }}
                  animate={{ cx: [na.x, nb.x], cy: [na.y, nb.y], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                />
              );
            })}
          {nodes.map((n) => (
            <g key={n.label} transform={`translate(${n.x},${n.y})`}>
              <circle r="22" fill={BG} stroke={n.c} strokeWidth="1.5" />
              <text
                textAnchor="middle"
                dy="4"
                style={{ fontSize: 10, fill: FG_M, fontFamily: "var(--font-mono)" }}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
