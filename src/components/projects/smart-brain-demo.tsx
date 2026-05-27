"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, RefreshCcw, Camera } from "lucide-react";

type Box = [number, number, number, number]; // x1,y1,x2,y2 in 0..100 / 0..60
type Detection = { label: string; conf: number; box: Box; kind: "face" | "object" };

type Sample = {
  name: string;
  hue: number;
  scene: "selfie" | "group" | "object";
  detections: Detection[];
};

const SAMPLES: Sample[] = [
  {
    name: "selfie",
    hue: 190,
    scene: "selfie",
    detections: [{ label: "face", conf: 0.98, box: [38, 18, 62, 50], kind: "face" }],
  },
  {
    name: "group photo",
    hue: 270,
    scene: "group",
    detections: [
      { label: "face", conf: 0.95, box: [8, 22, 30, 50], kind: "face" },
      { label: "face", conf: 0.92, box: [40, 18, 60, 46], kind: "face" },
      { label: "face", conf: 0.89, box: [70, 24, 92, 52], kind: "face" },
    ],
  },
  {
    name: "object scene",
    hue: 150,
    scene: "object",
    detections: [
      { label: "person", conf: 0.97, box: [12, 14, 48, 56], kind: "object" },
      { label: "laptop", conf: 0.84, box: [54, 38, 92, 54], kind: "object" },
    ],
  },
];

type LogLine = { t: number; msg: string };

export function SmartBrainDemo() {
  const [idx, setIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [revealedCount, setRevealedCount] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const startedAt = useRef<number>(0);

  const sample = SAMPLES[idx]!;
  const revealedDets = sample.detections.slice(0, revealedCount);

  const run = (i: number) => {
    setIdx(i);
    setScanning(true);
    setRevealedCount(0);
    setProgress(0);
    setLog([]);
    startedAt.current = performance.now();
  };

  // Drive the scan: progress bar 0→100 over 1100ms, then reveal detections one by one.
  useEffect(() => {
    if (!scanning) return;
    const total = 1100;
    const target = SAMPLES[idx]!;
    let raf = 0;

    const tick = () => {
      const t = performance.now() - startedAt.current;
      const p = Math.min(100, (t / total) * 100);
      setProgress(p);
      if (p >= 25 && log.length < 1) {
        push("input · 224×224 RGB normalized");
      }
      if (p >= 55 && log.length < 2) {
        push("backbone · ResNet-50 forward pass");
      }
      if (p >= 80 && log.length < 3) {
        push("nms · suppress overlapping boxes");
      }
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        push(`detected · ${target.detections.length} region(s)`);
        // reveal one by one
        target.detections.forEach((_, k) => {
          setTimeout(() => setRevealedCount(k + 1), 120 * k + 60);
        });
        setTimeout(() => setScanning(false), 120 * target.detections.length + 80);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning, idx]);

  // initial scan on mount
  useEffect(() => {
    run(0);
  }, []);

  function push(msg: string) {
    setLog((prev) => [...prev, { t: performance.now() - startedAt.current, msg }]);
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5" />
          smart-brain · vision inference · simulated
        </span>
        <span className="inline-flex items-center gap-1">
          {scanning ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> scanning…
            </>
          ) : (
            <>
              <Sparkles className="text-accent-emerald h-3 w-3" /> ready
            </>
          )}
        </span>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr,240px]">
        {/* canvas */}
        <div className="border-border bg-bg-sunken/60 relative aspect-[16/10] overflow-hidden rounded-md border">
          <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id="sb-bg" cx="0.5" cy="0.45" r="0.7">
                <stop offset="0%" stopColor={`hsl(${sample.hue} 70% 55%)`} stopOpacity="0.32" />
                <stop offset="100%" stopColor={`hsl(${sample.hue} 70% 25%)`} stopOpacity="0.08" />
              </radialGradient>
              <pattern id="sb-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path
                  d="M 5 0 L 0 0 0 5"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.1"
                />
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#sb-bg)" />
            <rect width="100" height="60" fill="url(#sb-grid)" opacity="0.4" />

            {/* stylized scene */}
            <Scene sample={sample} />

            {/* scan overlay */}
            {scanning && (
              <>
                <motion.line
                  x1="0"
                  x2="100"
                  stroke="hsl(var(--accent-emerald))"
                  strokeWidth="0.4"
                  animate={{ y1: [0, 60], y2: [0, 60] }}
                  transition={{ duration: 1.1, ease: "linear" }}
                />
                <motion.rect
                  x="0"
                  width="100"
                  height="6"
                  fill="hsl(var(--accent-emerald))"
                  opacity="0.18"
                  animate={{ y: [-6, 60] }}
                  transition={{ duration: 1.1, ease: "linear" }}
                />
              </>
            )}

            {/* detections */}
            {revealedDets.map((d, i) => {
              const [x1, y1, x2, y2] = d.box;
              const w = x2 - x1;
              const h = y2 - y1;
              return (
                <motion.g
                  key={`${idx}-${i}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ transformOrigin: `${x1 + w / 2}px ${y1 + h / 2}px` }}
                >
                  {/* corner crosshairs */}
                  <Corner x={x1} y={y1} dx={1} dy={1} />
                  <Corner x={x2} y={y1} dx={-1} dy={1} />
                  <Corner x={x1} y={y2} dx={1} dy={-1} />
                  <Corner x={x2} y={y2} dx={-1} dy={-1} />
                  <rect
                    x={x1}
                    y={y1}
                    width={w}
                    height={h}
                    fill="none"
                    stroke="hsl(var(--accent-emerald))"
                    strokeWidth="0.35"
                    strokeDasharray="0.8 0.6"
                  />
                  {/* label pill */}
                  <rect
                    x={x1}
                    y={y1 - 4.4}
                    width={d.label.length * 1.7 + 8}
                    height="3.6"
                    rx="0.6"
                    fill="hsl(var(--accent-emerald))"
                    opacity="0.92"
                  />
                  <text
                    x={x1 + 0.8}
                    y={y1 - 1.8}
                    style={{
                      fontSize: 2.4,
                      fill: "hsl(var(--bg))",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                    }}
                  >
                    {d.label} · {(d.conf * 100).toFixed(0)}%
                  </text>
                  {/* face landmarks for faces */}
                  {d.kind === "face" && (
                    <>
                      <circle
                        cx={x1 + w * 0.35}
                        cy={y1 + h * 0.4}
                        r="0.5"
                        fill="hsl(var(--accent-cyan))"
                      />
                      <circle
                        cx={x1 + w * 0.65}
                        cy={y1 + h * 0.4}
                        r="0.5"
                        fill="hsl(var(--accent-cyan))"
                      />
                      <circle
                        cx={x1 + w * 0.5}
                        cy={y1 + h * 0.6}
                        r="0.4"
                        fill="hsl(var(--accent-cyan))"
                      />
                      <path
                        d={`M ${x1 + w * 0.38} ${y1 + h * 0.75} Q ${x1 + w * 0.5} ${y1 + h * 0.82} ${x1 + w * 0.62} ${y1 + h * 0.75}`}
                        fill="none"
                        stroke="hsl(var(--accent-cyan))"
                        strokeWidth="0.3"
                      />
                    </>
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* progress bar */}
          <div className="bg-border/40 absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full">
            <motion.div
              className="bg-accent-emerald h-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-fg-subtle font-mono text-[10px] tracking-widest uppercase">
              Try a sample
            </p>
            <button
              type="button"
              onClick={() => run(idx)}
              disabled={scanning}
              aria-label="Re-run inference"
              className="border-border text-fg-muted hover:border-accent-emerald/40 hover:text-fg inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] transition-colors disabled:opacity-50"
            >
              <RefreshCcw className="h-3 w-3" /> rerun
            </button>
          </div>
          {SAMPLES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => run(i)}
              disabled={scanning && i !== idx}
              className={`flex w-full items-center justify-between rounded-md border p-2 text-left text-xs transition-colors ${
                i === idx
                  ? "border-accent-violet/40 bg-accent-violet/5 text-fg"
                  : "border-border text-fg-muted hover:border-accent-violet/30 hover:text-fg"
              } disabled:opacity-50`}
            >
              <span>{s.name}</span>
              <span className="text-fg-subtle font-mono text-[10px]">
                {s.detections.length} obj
              </span>
            </button>
          ))}

          {/* inference log */}
          <div className="border-border bg-bg-elev rounded-md border p-2">
            <p className="text-fg-subtle mb-1 font-mono text-[10px] tracking-widest uppercase">
              Inference log
            </p>
            <ul className="text-fg-muted space-y-0.5 font-mono text-[10px]">
              {log.length === 0 && <li className="text-fg-subtle">waiting for input…</li>}
              {log.map((l, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-fg-subtle">{(l.t / 1000).toFixed(2)}s</span>
                  <span className="flex-1 truncate">{l.msg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* results */}
          {!scanning && revealedDets.length > 0 && (
            <div className="border-border bg-bg-elev rounded-md border p-2">
              <p className="text-fg-subtle mb-1 font-mono text-[10px] tracking-widest uppercase">
                Detections
              </p>
              <ul className="space-y-1">
                {revealedDets.map((d, i) => (
                  <li key={i} className="text-[11px]">
                    <div className="text-fg-muted flex justify-between font-mono">
                      <span>{d.label}</span>
                      <span className="text-accent-emerald">{(d.conf * 100).toFixed(0)}%</span>
                    </div>
                    <div className="bg-border/40 mt-0.5 h-1 overflow-hidden rounded-full">
                      <div
                        className="bg-accent-emerald h-full"
                        style={{ width: `${d.conf * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Corner({ x, y, dx, dy }: { x: number; y: number; dx: number; dy: number }) {
  const len = 2;
  return (
    <g stroke="hsl(var(--accent-emerald))" strokeWidth="0.5" strokeLinecap="square">
      <line x1={x} y1={y} x2={x + dx * len} y2={y} />
      <line x1={x} y1={y} x2={x} y2={y + dy * len} />
    </g>
  );
}

function Scene({ sample }: { sample: Sample }) {
  const skin = `hsl(${sample.hue} 50% 70%)`;
  const dark = `hsl(${sample.hue} 40% 30%)`;
  if (sample.scene === "selfie") {
    return (
      <g>
        {/* shoulders */}
        <path d="M 22 60 Q 50 38 78 60 Z" fill={dark} opacity="0.55" />
        {/* head */}
        <ellipse cx="50" cy="32" rx="14" ry="16" fill={skin} opacity="0.8" />
        {/* hair */}
        <path d="M 36 28 Q 50 12 64 28 L 64 22 Q 50 8 36 22 Z" fill={dark} opacity="0.85" />
      </g>
    );
  }
  if (sample.scene === "group") {
    return (
      <g opacity="0.85">
        {[19, 50, 81].map((cx, i) => (
          <g key={i}>
            <path d={`M ${cx - 14} 60 Q ${cx} 44 ${cx + 14} 60 Z`} fill={dark} opacity="0.55" />
            <ellipse cx={cx} cy={36} rx="10" ry="12" fill={skin} />
            <path
              d={`M ${cx - 10} 32 Q ${cx} 18 ${cx + 10} 32 L ${cx + 10} 28 Q ${cx} 14 ${cx - 10} 28 Z`}
              fill={dark}
            />
          </g>
        ))}
      </g>
    );
  }
  // object scene: person silhouette + laptop
  return (
    <g opacity="0.85">
      {/* person */}
      <ellipse cx="30" cy="22" rx="8" ry="9" fill={skin} />
      <path d="M 16 56 Q 30 28 44 56 Z" fill={dark} opacity="0.6" />
      {/* laptop */}
      <rect x="56" y="42" width="34" height="10" rx="1" fill={dark} opacity="0.6" />
      <rect
        x="58"
        y="44"
        width="30"
        height="6"
        fill={`hsl(${sample.hue} 70% 50%)`}
        opacity="0.45"
      />
      <rect x="54" y="52" width="38" height="2" rx="0.6" fill={dark} opacity="0.85" />
    </g>
  );
}
