"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Node = { id: string; x: number; y: number; label: string; accent: string };

const NODES: Node[] = [
  { id: "src", x: 60, y: 200, label: "Simulation Artifacts", accent: "hsl(var(--accent-cyan))" },
  { id: "rag", x: 220, y: 110, label: "RAG", accent: "hsl(var(--accent-violet))" },
  { id: "mcp", x: 220, y: 290, label: "MCP", accent: "hsl(var(--accent-emerald))" },
  { id: "agent", x: 380, y: 200, label: "Agent · Tools", accent: "hsl(var(--accent-cyan))" },
  { id: "rtl", x: 540, y: 110, label: "RTL Transform", accent: "hsl(var(--accent-amber))" },
  { id: "hot", x: 540, y: 290, label: "18–19% Throughput", accent: "hsl(var(--accent-emerald))" },
  { id: "out", x: 700, y: 200, label: "Recommendations", accent: "hsl(var(--accent-violet))" },
];

const EDGES: [string, string][] = [
  ["src", "rag"],
  ["src", "mcp"],
  ["rag", "agent"],
  ["mcp", "agent"],
  ["agent", "rtl"],
  ["agent", "hot"],
  ["rtl", "out"],
  ["hot", "out"],
];

export function HeroVisualization() {
  const reduce = useReducedMotion();
  const nodesById = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = svgRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = !reduce && inView;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 780 400"
      className="h-full w-full"
      role="img"
      aria-label="Animated diagram: simulation artifacts flowing through RAG, MCP and agent layers into RTL recommendations."
    >
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0.1" />
          <stop offset="50%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--accent-violet))" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="hsl(var(--border))" />
        </pattern>
      </defs>

      <rect width="780" height="400" fill="url(#dots)" opacity="0.4" />

      {/* Flamegraph-style background slats */}
      <g opacity="0.18">
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={i}
            x={20 + i * 12}
            y={350 - i * 4}
            width={740 - i * 24}
            height={6}
            rx={1}
            fill={
              [
                "hsl(var(--accent-cyan))",
                "hsl(var(--accent-violet))",
                "hsl(var(--accent-emerald))",
                "hsl(var(--accent-amber))",
              ][i % 4]
            }
          />
        ))}
      </g>

      {/* Edges */}
      <g>
        {EDGES.map(([a, b], i) => {
          const A = nodesById[a]!;
          const B = nodesById[b]!;
          const pathId = `edge-path-${a}-${b}`;
          const d = `M ${A.x} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x} ${B.y}`;
          return (
            <g key={`${a}-${b}`}>
              <path
                id={pathId}
                d={d}
                stroke="url(#edge)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.75"
              />
              {animate && (
                <circle r="3" fill="hsl(var(--accent-cyan))">
                  <animateMotion
                    dur={`${3 + (i % 3)}s`}
                    begin={`${i * 0.3}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {NODES.map((n) => (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <circle r="22" fill="url(#nodeGlow)" opacity="0.5" />
            <circle
              className={animate ? "node-pulse" : undefined}
              r="10"
              fill="hsl(var(--bg-elev))"
              stroke={n.accent}
              strokeWidth="1.5"
              style={animate ? { animationDelay: `${NODES.indexOf(n) * 0.25}s` } : undefined}
            />
            <circle r="3" fill={n.accent} />
            <text
              y="-22"
              textAnchor="middle"
              className="fill-current font-mono"
              style={{ fontSize: 16, fontWeight: 600, fill: "hsl(var(--fg))" }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
