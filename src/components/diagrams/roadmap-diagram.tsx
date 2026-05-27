"use client";

import { motion, useReducedMotion } from "framer-motion";
import { concepts } from "@/content/concepts";

const statusColor: Record<string, string> = {
  design: "hsl(var(--accent-amber))",
  prototyping: "hsl(var(--accent-cyan))",
  "in-development": "hsl(var(--accent-emerald))",
};

const QUARTERS = ["Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027"];

export function RoadmapDiagram() {
  const reduce = useReducedMotion();

  return (
    <div className="card overflow-hidden p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="mono-label">/ roadmap diagram</p>
          <h3 className="mt-1 text-base font-semibold text-fg">Delivery timeline</h3>
        </div>
        <ul className="hidden gap-3 sm:flex">
          {Object.entries(statusColor).map(([k, v]) => (
            <li key={k} className="flex items-center gap-1.5 font-mono text-[10px] text-fg-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: v }} /> {k}
            </li>
          ))}
        </ul>
      </div>

      <svg viewBox="0 0 880 260" className="h-auto w-full" role="img" aria-label="Roadmap diagram">
        <defs>
          <linearGradient id="rd-axis" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--accent-violet))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--accent-emerald))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* axis */}
        <line x1="140" y1="220" x2="840" y2="220" stroke="url(#rd-axis)" strokeWidth="2" />
        {QUARTERS.map((q, i) => {
          const x = 140 + i * 233;
          return (
            <g key={q}>
              <line x1={x} y1="216" x2={x} y2="224" stroke="hsl(var(--border))" />
              <text
                x={x}
                y="244"
                textAnchor="middle"
                style={{
                  fontSize: 11,
                  fill: "hsl(var(--fg-subtle))",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {q}
              </text>
            </g>
          );
        })}

        {/* now marker */}
        <line
          x1="160"
          y1="20"
          x2="160"
          y2="220"
          stroke="hsl(var(--accent-cyan))"
          strokeDasharray="3 4"
          opacity="0.7"
        />
        <text
          x="166"
          y="34"
          style={{
            fontSize: 10,
            fill: "hsl(var(--accent-cyan))",
            fontFamily: "var(--font-mono)",
          }}
        >
          now
        </text>

        {/* concept lanes */}
        {concepts.map((c, i) => {
          const lane = 60 + i * 56;
          // map ETA → x range
          const map: Record<string, [number, number]> = {
            "Q2 2026": [160, 280],
            "Q3 2026": [280, 513],
            "Q4 2026": [513, 746],
            "Q1 2027": [746, 840],
          };
          const range: [number, number] = (c.eta && map[c.eta]) || [280, 513];
          const x1 = range[0];
          const x2 = range[1];
          const color = statusColor[c.status]!;
          return (
            <g key={c.slug}>
              <text
                x="10"
                y={lane + 4}
                textAnchor="start"
                style={{ fontSize: 12, fontWeight: 600, fill: "hsl(var(--fg))" }}
              >
                {c.name}
              </text>
              {/* lane track */}
              <rect
                x="140"
                y={lane - 8}
                width="700"
                height="16"
                rx="3"
                fill="hsl(var(--bg-sunken))"
                opacity="0.6"
              />
              {/* delivery bar */}
              <motion.rect
                x={x1}
                y={lane - 8}
                width={x2 - x1}
                height="16"
                rx="3"
                fill={color}
                opacity="0.85"
                initial={reduce ? undefined : { width: 0 }}
                animate={reduce ? undefined : { width: x2 - x1 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.15 }}
              />
              {/* ship marker */}
              <circle
                cx={x2}
                cy={lane}
                r="6"
                fill={color}
                stroke="hsl(var(--bg))"
                strokeWidth="2"
              />
              <text
                x={x2 + 10}
                y={lane + 4}
                style={{ fontSize: 10, fill: color, fontFamily: "var(--font-mono)" }}
              >
                {c.eta}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
