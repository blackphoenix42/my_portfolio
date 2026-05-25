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

export function PostureMini() {
  const reduce = useReducedMotion();
  // Stylized stick-figure with pose landmarks
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      {/* head */}
      <motion.circle
        cx="240"
        cy="38"
        r="14"
        fill="hsl(var(--bg-elev))"
        stroke="hsl(var(--accent-cyan))"
        strokeWidth="1.5"
        animate={reduce ? undefined : { cy: [38, 36, 38] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      {/* spine */}
      <line x1="240" y1="52" x2="240" y2="115" stroke="hsl(var(--accent-violet))" strokeWidth="2" />
      {/* shoulders */}
      <line x1="200" y1="68" x2="280" y2="68" stroke="hsl(var(--accent-cyan))" strokeWidth="2" />
      {/* arms */}
      <motion.line
        x1="200"
        y1="68"
        x2="172"
        y2="120"
        stroke="hsl(var(--accent-emerald))"
        strokeWidth="2"
        animate={reduce ? undefined : { x2: [172, 178, 172] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <motion.line
        x1="280"
        y1="68"
        x2="308"
        y2="120"
        stroke="hsl(var(--accent-emerald))"
        strokeWidth="2"
        animate={reduce ? undefined : { x2: [308, 302, 308] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      {/* hips */}
      <line x1="218" y1="115" x2="262" y2="115" stroke="hsl(var(--accent-cyan))" strokeWidth="2" />
      {/* legs */}
      <line x1="218" y1="115" x2="206" y2="160" stroke="hsl(var(--accent-amber))" strokeWidth="2" />
      <line x1="262" y1="115" x2="274" y2="160" stroke="hsl(var(--accent-amber))" strokeWidth="2" />
      {/* landmark dots */}
      {[
        [240, 38],
        [200, 68],
        [280, 68],
        [172, 120],
        [308, 120],
        [218, 115],
        [262, 115],
        [206, 160],
        [274, 160],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="hsl(var(--accent-cyan))" />
      ))}
      {/* score badge */}
      <rect
        x="380"
        y="20"
        width="78"
        height="34"
        rx="6"
        fill="hsl(var(--bg-elev))"
        stroke="hsl(var(--accent-emerald))"
      />
      <text
        x="419"
        y="42"
        textAnchor="middle"
        style={{
          fontSize: 14,
          fontWeight: 600,
          fill: "hsl(var(--accent-emerald))",
          fontFamily: "var(--font-mono)",
        }}
      >
        REP 12
      </text>
      <text
        x="40"
        y="172"
        style={{ fontSize: 10, fill: "hsl(var(--fg-subtle))", fontFamily: "var(--font-mono)" }}
      >
        PostureIQ · 60 FPS pose landmarks
      </text>
    </svg>
  );
}

export function TrackMini() {
  const reduce = useReducedMotion();
  // Simulated movement trail on a grid
  const pts = [
    [60, 130],
    [120, 80],
    [180, 110],
    [240, 60],
    [300, 100],
    [360, 70],
    [420, 110],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      <defs>
        <pattern id="grid-t" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="480" height="180" fill="url(#grid-t)" opacity="0.5" />
      <path d={d} stroke="hsl(var(--accent-cyan))" strokeWidth="2" fill="none" opacity="0.85" />
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === pts.length - 1 ? 6 : 3.5}
          fill={i === pts.length - 1 ? "hsl(var(--accent-violet))" : "hsl(var(--accent-cyan))"}
          animate={reduce ? undefined : { scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      <text
        x="40"
        y="172"
        style={{ fontSize: 10, fill: "hsl(var(--fg-subtle))", fontFamily: "var(--font-mono)" }}
      >
        Track Person · movement trail
      </text>
    </svg>
  );
}

export function BrainMini() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 480 180" className="h-full w-full">
      {/* image frame */}
      <rect
        x="40"
        y="22"
        width="220"
        height="130"
        rx="6"
        fill="hsl(var(--bg-elev))"
        stroke="hsl(var(--border))"
      />
      {/* face silhouette */}
      <circle cx="150" cy="80" r="36" fill="hsl(var(--accent-cyan)/0.18)" />
      <circle cx="138" cy="76" r="3" fill="hsl(var(--fg-muted))" />
      <circle cx="162" cy="76" r="3" fill="hsl(var(--fg-muted))" />
      <path
        d="M 138 92 Q 150 100 162 92"
        stroke="hsl(var(--fg-muted))"
        strokeWidth="1.5"
        fill="none"
      />
      {/* detection box */}
      <motion.rect
        x="110"
        y="46"
        width="80"
        height="80"
        rx="4"
        fill="none"
        stroke="hsl(var(--accent-emerald))"
        strokeWidth="2"
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <text
        x="114"
        y="42"
        style={{ fontSize: 10, fill: "hsl(var(--accent-emerald))", fontFamily: "var(--font-mono)" }}
      >
        face · 98%
      </text>
      {/* API call arrow */}
      <line
        x1="270"
        y1="80"
        x2="320"
        y2="80"
        stroke="hsl(var(--accent-violet))"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <polygon points="320,76 330,80 320,84" fill="hsl(var(--accent-violet))" />
      {/* Clarifai badge */}
      <rect
        x="335"
        y="58"
        width="105"
        height="44"
        rx="6"
        fill="hsl(var(--bg-elev))"
        stroke="hsl(var(--accent-violet))"
      />
      <text
        x="387"
        y="78"
        textAnchor="middle"
        style={{
          fontSize: 11,
          fontWeight: 600,
          fill: "hsl(var(--fg))",
          fontFamily: "var(--font-mono)",
        }}
      >
        Clarifai
      </text>
      <text
        x="387"
        y="93"
        textAnchor="middle"
        style={{ fontSize: 9, fill: "hsl(var(--fg-muted))", fontFamily: "var(--font-mono)" }}
      >
        face-detect
      </text>
      <text
        x="40"
        y="172"
        style={{ fontSize: 10, fill: "hsl(var(--fg-subtle))", fontFamily: "var(--font-mono)" }}
      >
        Smart Brain · vision API loop
      </text>
    </svg>
  );
}
