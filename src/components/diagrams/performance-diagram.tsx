"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gauge } from "lucide-react";

const A = "hsl(var(--accent-cyan))";
const E = "hsl(var(--accent-emerald))";
const FG_S = "hsl(var(--fg-subtle))";
const BD = "hsl(var(--border))";

// Before/after throughput bars + an upward latency-down curve. Illustrative of
// the kind of profiling-driven wins described in the case studies.
export function PerformanceDiagram() {
  const reduce = useReducedMotion();
  const t = useTranslations("engineer");
  const bars = [
    { label: "baseline", v: 100, c: BD },
    { label: "profiled", v: 118, c: A },
    { label: "+ RTL xform", v: 134, c: E },
  ];
  const max = 150;

  return (
    <section aria-label={t("perfTitle")} className="container-tight py-14">
      <p className="text-accent-cyan inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
        <Gauge className="h-3.5 w-3.5" /> {t("perfTag")}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t("perfTitle")}</h2>
      <p className="text-fg-muted mt-2 max-w-2xl text-sm">{t("perfIntro")}</p>

      <div className="card mt-6 p-6">
        <svg viewBox="0 0 480 220" className="h-auto w-full" role="img" aria-label={t("perfTitle")}>
          <line x1="50" y1="190" x2="450" y2="190" stroke={BD} />
          {[0, 50, 100, 150].map((g) => {
            const y = 190 - (g / max) * 150;
            return (
              <g key={g}>
                <line x1="50" y1={y} x2="450" y2={y} stroke={BD} strokeOpacity="0.4" />
                <text x="40" y={y + 3} textAnchor="end" style={{ fontSize: 9, fill: FG_S }}>
                  {g}
                </text>
              </g>
            );
          })}
          {bars.map((b, i) => {
            const x = 90 + i * 130;
            const h = (b.v / max) * 150;
            return (
              <g key={b.label}>
                <motion.rect
                  x={x}
                  width={70}
                  rx={6}
                  fill={b.c}
                  fillOpacity={0.25}
                  stroke={b.c}
                  initial={reduce ? false : { height: 0, y: 190 }}
                  whileInView={{ height: h, y: 190 - h }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: reduce ? 0 : i * 0.18, ease: "easeOut" }}
                />
                <text
                  x={x + 35}
                  y={190 - h - 8}
                  textAnchor="middle"
                  style={{ fontSize: 12, fill: "hsl(var(--fg))", fontFamily: "var(--font-mono)" }}
                >
                  {b.v}
                </text>
                <text
                  x={x + 35}
                  y={206}
                  textAnchor="middle"
                  style={{ fontSize: 10, fill: FG_S, fontFamily: "var(--font-mono)" }}
                >
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
