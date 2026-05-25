"use client";

import { motion, useReducedMotion } from "framer-motion";

export function XmaiPipeline() {
  const reduce = useReducedMotion();
  const steps = ["Logs", "Embed", "Retrieve", "Agent", "RTL"];
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      <defs>
        <linearGradient id="x-edge" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0.0" />
          <stop offset="50%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--accent-violet))" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <line x1="40" y1="90" x2="440" y2="90" stroke="url(#x-edge)" strokeWidth="1.5" />
      {steps.map((s, i) => {
        const x = 40 + i * 100;
        return (
          <g key={s} transform={`translate(${x}, 90)`}>
            <motion.circle
              r="14"
              fill="hsl(var(--bg-elev))"
              stroke="hsl(var(--accent-cyan))"
              strokeWidth="1.5"
              animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}
            />
            <circle r="3" fill="hsl(var(--accent-cyan))" />
            <text
              y="38"
              textAnchor="middle"
              style={{ fontSize: 10, fill: "hsl(var(--fg-muted))", fontFamily: "var(--font-mono)" }}
            >
              {s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function FlamegraphMini() {
  const rows = [
    [120, "hsl(var(--accent-amber))"],
    [110, "hsl(var(--accent-cyan))"],
    [80, "hsl(var(--accent-violet))"],
    [60, "hsl(var(--accent-emerald))"],
    [40, "hsl(var(--accent-amber))"],
  ] as const;
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      <g>
        {rows.map(([w, c], i) => (
          <rect
            key={i}
            x={40 + i * 12}
            y={20 + i * 22}
            width={w * 3}
            height={16}
            rx={2}
            fill={c}
            opacity={0.8}
          />
        ))}
        {/* "after" overlay shorter, lighter */}
        {rows.map(([w, c], i) => (
          <rect
            key={`a-${i}`}
            x={40 + i * 12}
            y={20 + i * 22}
            width={w * 3 * 0.82}
            height={16}
            rx={2}
            fill="hsl(var(--bg-elev))"
            opacity={0.55}
          />
        ))}
      </g>
      <text
        x="40"
        y="172"
        style={{ fontSize: 10, fill: "hsl(var(--fg-subtle))", fontFamily: "var(--font-mono)" }}
      >
        before · after — 18–19% throughput gain
      </text>
    </svg>
  );
}

export function AlgoMini() {
  const bars = [40, 80, 30, 100, 55, 70, 20, 90, 60, 45];
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={40 + i * 38}
          y={150 - h}
          width={28}
          height={h}
          rx={2}
          fill={i === 3 ? "hsl(var(--accent-violet))" : "hsl(var(--accent-cyan))"}
          opacity={0.85}
          initial={{ scaleY: 0.6 }}
          animate={{ scaleY: [0.6, 1, 0.6] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.05 }}
          style={{ transformOrigin: "bottom" }}
        />
      ))}
      <text
        x="40"
        y="172"
        style={{ fontSize: 10, fill: "hsl(var(--fg-subtle))", fontFamily: "var(--font-mono)" }}
      >
        AlgoLens · 60+ algorithms
      </text>
    </svg>
  );
}

export function ChainBracket() {
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect
            x={40}
            y={20 + i * 36}
            width={120}
            height={22}
            rx={3}
            fill="hsl(var(--bg-elev))"
            stroke="hsl(var(--border))"
          />
          <line
            x1={160}
            y1={31 + i * 36}
            x2={220}
            y2={i < 2 ? 60 : 120}
            stroke="hsl(var(--accent-amber))"
            strokeWidth="1.2"
          />
        </g>
      ))}
      <rect
        x={220}
        y={50}
        width={120}
        height={22}
        rx={3}
        fill="hsl(var(--bg-elev))"
        stroke="hsl(var(--accent-amber))"
      />
      <rect
        x={220}
        y={110}
        width={120}
        height={22}
        rx={3}
        fill="hsl(var(--bg-elev))"
        stroke="hsl(var(--accent-amber))"
      />
      <line
        x1={340}
        y1={61}
        x2={400}
        y2={91}
        stroke="hsl(var(--accent-violet))"
        strokeWidth="1.2"
      />
      <line
        x1={340}
        y1={121}
        x2={400}
        y2={91}
        stroke="hsl(var(--accent-violet))"
        strokeWidth="1.2"
      />
      <rect
        x={400}
        y={80}
        width={40}
        height={22}
        rx={3}
        fill="hsl(var(--accent-violet))"
        opacity="0.3"
        stroke="hsl(var(--accent-violet))"
      />
      <text
        x="40"
        y="172"
        style={{ fontSize: 10, fill: "hsl(var(--fg-subtle))", fontFamily: "var(--font-mono)" }}
      >
        Tezos · bracket on-chain
      </text>
    </svg>
  );
}
