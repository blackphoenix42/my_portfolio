"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function useThumbnailReducedMotion() {
  const reduce = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return !hydrated || reduce;
}

const A = "hsl(var(--accent-cyan))";
const V = "hsl(var(--accent-violet))";
const E = "hsl(var(--accent-emerald))";
const M = "hsl(var(--accent-amber))";
const BG = "hsl(var(--bg-elev))";
const BG_S = "hsl(var(--bg-sunken))";
const BD = "hsl(var(--border))";
const FG_S = "hsl(var(--fg-subtle))";
const FG_M = "hsl(var(--fg-muted))";
const FG = "hsl(var(--fg))";

function mono(x: number, y: number, text: string, fill = FG_S, size = 11) {
  return (
    <text x={x} y={y} style={{ fontSize: size, fill, fontFamily: "var(--font-mono)" }}>
      {text}
    </text>
  );
}

function node(x: number, y: number, w: number, h: number, label: string, stroke: string) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={BG} stroke={stroke} strokeWidth="1.4" />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3.5}
        textAnchor="middle"
        style={{ fontSize: 10, fill: FG, fontFamily: "var(--font-mono)", fontWeight: 600 }}
      >
        {label}
      </text>
    </g>
  );
}

/* URL shortener — write path then redirect pulse */
export function UrlShortenerThumb() {
  const reduce = useThumbnailReducedMotion();
  const hops = [
    { x: 55, label: "client", c: A },
    { x: 155, label: "edge", c: E },
    { x: 255, label: "api", c: V },
    { x: 355, label: "redis", c: M },
  ];
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {mono(40, 22, "url-shortener · create → cache → redirect")}
      <line x1="70" y1="88" x2="390" y2="88" stroke={BD} strokeWidth="1.5" />
      {hops.map((h) => (
        <g key={h.label}>{node(h.x, 68, 70, 40, h.label, h.c)}</g>
      ))}
      {!reduce && (
        <motion.circle
          r="5"
          fill={A}
          initial={{ cx: 90, cy: 88, opacity: 0.3 }}
          animate={{ cx: [90, 190, 290, 390, 290, 90], cy: 88, opacity: [0.3, 1, 1, 1, 0.6, 0.3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <rect x="55" y="140" width="370" height="36" rx="8" fill={BG_S} stroke={BD} />
      {mono(70, 162, "https://ex.com/long…", FG_M, 10)}
      {mono(300, 162, "→ ay.sh/a7Kx91", A, 11)}
    </svg>
  );
}

/* Rate limiter — token bucket refill */
export function RateLimiterThumb() {
  const reduce = useThumbnailReducedMotion();
  const tokens = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {mono(40, 22, "rate-limiter · token bucket · redis atomic")}
      <path d="M160 50 L320 50 L290 160 L190 160 Z" fill={BG_S} stroke={A} strokeWidth="1.6" />
      {tokens.map((i) => (
        <motion.circle
          key={i}
          cx={240}
          r="9"
          fill={i % 2 ? V : A}
          stroke={BG}
          strokeWidth="1.5"
          initial={false}
          animate={
            reduce
              ? { cy: 135 - i * 18 }
              : { cy: [135 - i * 18, 70, 135 - i * 18], opacity: [1, 0.5, 1] }
          }
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      {node(40, 70, 90, 44, "req", M)}
      {node(350, 70, 90, 44, "allow", E)}
      {!reduce && (
        <motion.circle
          r="4"
          fill={M}
          animate={{ cx: [85, 200, 85], cy: [92, 92, 92], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      )}
      {mono(40, 185, "fail-open reads · fail-closed pay/auth", FG_S, 10)}
    </svg>
  );
}

/* Job scheduler — lease claim across workers */
export function JobSchedulerThumb() {
  const reduce = useThumbnailReducedMotion();
  const jobs = [
    { y: 58, label: "cron", c: A },
    { y: 96, label: "delay", c: V },
    { y: 134, label: "prio", c: M },
  ];
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {mono(40, 22, "job-scheduler · leases · fencing · workers")}
      <rect x="40" y="42" width="160" height="130" rx="8" fill={BG_S} stroke={BD} />
      {mono(55, 60, "queue", FG_S, 10)}
      {jobs.map((j, i) => (
        <motion.g
          key={j.label}
          animate={reduce ? undefined : { x: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35 }}
        >
          <rect
            x="55"
            y={j.y}
            width="130"
            height="28"
            rx="5"
            fill={BG}
            stroke={j.c}
            strokeWidth="1.3"
          />
          {mono(70, j.y + 18, j.label, FG_M, 10)}
        </motion.g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {node(260, 50 + i * 42, 80, 34, `w${i + 1}`, E)}
          {!reduce && (
            <motion.path
              d={`M 195 ${72 + i * 38} L 260 ${67 + i * 42}`}
              stroke={E}
              strokeWidth="1.2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.4 }}
            />
          )}
        </g>
      ))}
      {node(370, 92, 70, 36, "DLQ", M)}
    </svg>
  );
}

/* Log analytics — ingest fan-in to hot/cold */
export function LogAnalyticsThumb() {
  const reduce = useThumbnailReducedMotion();
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {mono(40, 22, "log-analytics · ingest → stream → hot/cold")}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {node(40, 48 + i * 40, 70, 30, `src${i + 1}`, A)}
          <line x1="110" y1={63 + i * 40} x2="170" y2="100" stroke={BD} strokeWidth="1.2" />
        </g>
      ))}
      {node(170, 80, 90, 40, "stream", V)}
      <line x1="260" y1="100" x2="310" y2="70" stroke={BD} strokeWidth="1.2" />
      <line x1="260" y1="100" x2="310" y2="130" stroke={BD} strokeWidth="1.2" />
      {node(310, 50, 110, 40, "hot index", E)}
      {node(310, 110, 110, 40, "cold store", M)}
      {!reduce && (
        <motion.circle
          r="4"
          fill={A}
          animate={{
            cx: [75, 215, 365, 365],
            cy: [63, 100, 70, 130],
            opacity: [0.2, 1, 1, 0.3],
          }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {mono(40, 185, "bounded queries · retention policies", FG_S, 10)}
    </svg>
  );
}

/* Sim regression dashboard — failing suite heatmap pulse */
export function SimRegressionThumb() {
  const reduce = useThumbnailReducedMotion();
  const cells = Array.from({ length: 24 }, (_, i) => ({
    x: 50 + (i % 8) * 36,
    y: 50 + Math.floor(i / 8) * 36,
    fail: [2, 5, 11, 14, 19].includes(i),
  }));
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {mono(40, 22, "sim-regression · suite matrix · triage")}
      {cells.map((c, i) => (
        <motion.rect
          key={i}
          x={c.x}
          y={c.y}
          width="28"
          height="28"
          rx="4"
          fill={c.fail ? M : BG}
          stroke={c.fail ? M : BD}
          strokeWidth="1.2"
          animate={reduce || !c.fail ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
      {node(360, 70, 80, 36, "RCA", V)}
      {node(360, 120, 80, 36, "fix", E)}
      {mono(40, 185, "cluster failures · bisect · replay", FG_S, 10)}
    </svg>
  );
}

/* Waveform compression — dense → sparse signal */
export function WaveformCompressionThumb() {
  const reduce = useThumbnailReducedMotion();
  const dense = Array.from({ length: 40 }, (_, i) => {
    const x = 50 + i * 4.2;
    const y = 90 + Math.sin(i * 0.7) * 28 + (i % 3) * 2;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  const sparse = Array.from({ length: 12 }, (_, i) => {
    const x = 265 + i * 14;
    const y = 90 + Math.sin(i * 0.9) * 22;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {mono(40, 22, "waveform-compression · VCD/FSDB · delta encode")}
      <rect x="40" y="40" width="190" height="110" rx="8" fill={BG_S} stroke={BD} />
      <rect x="250" y="40" width="190" height="110" rx="8" fill={BG_S} stroke={BD} />
      {mono(55, 58, "raw", FG_S, 10)}
      {mono(265, 58, "compressed", FG_S, 10)}
      <path d={dense} stroke={A} strokeWidth="1.4" fill="none" opacity="0.85" />
      <path d={sparse} stroke={E} strokeWidth="2" fill="none" />
      {!reduce && (
        <motion.rect
          x="250"
          y="40"
          width="190"
          height="110"
          rx="8"
          fill={E}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.08, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      {mono(40, 185, "lossless deltas · windowed encode", FG_S, 10)}
    </svg>
  );
}

export const SYSTEM_DESIGN_THUMBS: Record<string, () => ReactElement> = {
  "url-shortener": () => <UrlShortenerThumb />,
  "rate-limiter": () => <RateLimiterThumb />,
  "job-scheduler": () => <JobSchedulerThumb />,
  "log-analytics": () => <LogAnalyticsThumb />,
  "sim-regression-dashboard": () => <SimRegressionThumb />,
  "waveform-compression": () => <WaveformCompressionThumb />,
};
