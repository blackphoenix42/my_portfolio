"use client";

import { motion, useReducedMotion } from "framer-motion";

// Shared SVG primitives for the slug-keyed architecture whiteboards.
export const DC = {
  cyan: "hsl(var(--accent-cyan))",
  violet: "hsl(var(--accent-violet))",
  emerald: "hsl(var(--accent-emerald))",
  amber: "hsl(var(--accent-amber))",
  bg: "hsl(var(--bg-elev))",
  sunken: "hsl(var(--bg-sunken))",
  border: "hsl(var(--border))",
  fg: "hsl(var(--fg))",
  muted: "hsl(var(--fg-muted))",
  subtle: "hsl(var(--fg-subtle))",
} as const;

const MONO = "var(--font-mono)";

export function ArrowMarker({ id, color = DC.muted }: { id: string; color?: string }) {
  return (
    <marker
      id={id}
      markerWidth="8"
      markerHeight="8"
      refX="7"
      refY="4"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <path d="M0,0 L8,4 L0,8 Z" fill={color} />
    </marker>
  );
}

export function Arrow({
  d,
  marker,
  dashed,
  color = DC.border,
}: {
  d: string;
  marker: string;
  dashed?: boolean;
  color?: string;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.4}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={`url(#${marker})`}
    />
  );
}

/** Rounded box centred on (x, y). `label` may contain "\n" for line breaks. */
export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = DC.cyan,
  dashed,
  fill = DC.bg,
  fontSize = 11,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: string;
  dashed?: boolean;
  fill?: string;
  fontSize?: number;
}) {
  const lines = label.split("\n");
  const lineHeight = fontSize + 2;
  const blockOffset = ((lines.length - 1) * lineHeight) / 2;
  const firstDy = fontSize * 0.36 - blockOffset - (sub ? 6 : 0);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={8}
        fill={fill}
        stroke={accent}
        strokeOpacity={0.65}
        strokeWidth={1.3}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text textAnchor="middle" style={{ fontSize, fill: DC.fg, fontFamily: MONO }}>
        {lines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? firstDy : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
      {sub && (
        <text
          y={h / 2 - 8}
          textAnchor="middle"
          style={{ fontSize: 9, fill: DC.subtle, fontFamily: MONO }}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function Caption({
  x,
  y,
  children,
  anchor = "middle",
  color = DC.subtle,
  size = 10,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  color?: string;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} style={{ fontSize: size, fill: color, fontFamily: MONO }}>
      {children}
    </text>
  );
}

/** Small amber diamond used to mark a human approval gate. */
export function GateMark({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x} ${y - 6} L ${x + 6} ${y} L ${x} ${y + 6} L ${x - 6} ${y} Z`}
      fill={DC.amber}
      stroke={DC.bg}
      strokeWidth={1}
    />
  );
}

/** A packet that travels a horizontal lane; hidden when reduced motion is requested. */
export function LanePacket({
  x1,
  x2,
  y,
  color = DC.violet,
  duration = 5,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.circle
      r={4}
      cy={y}
      fill={color}
      initial={{ cx: x1, opacity: 0 }}
      animate={{ cx: [x1, x2], opacity: [0, 1, 1, 0] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}
