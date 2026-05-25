"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

type Detection = { label: string; conf: number; box: [number, number, number, number] };
const SAMPLES: { name: string; bg: string; detections: Detection[] }[] = [
  {
    name: "selfie",
    bg: "hsl(var(--accent-cyan))",
    detections: [{ label: "face", conf: 0.98, box: [40, 30, 60, 80] }],
  },
  {
    name: "group photo",
    bg: "hsl(var(--accent-violet))",
    detections: [
      { label: "face", conf: 0.95, box: [10, 35, 28, 60] },
      { label: "face", conf: 0.92, box: [42, 30, 60, 56] },
      { label: "face", conf: 0.89, box: [72, 38, 90, 62] },
    ],
  },
  {
    name: "object scene",
    bg: "hsl(var(--accent-emerald))",
    detections: [
      { label: "person", conf: 0.97, box: [20, 25, 55, 85] },
      { label: "laptop", conf: 0.84, box: [55, 55, 90, 85] },
    ],
  },
];

export function SmartBrainDemo() {
  const [idx, setIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState(true);

  const run = (i: number) => {
    setIdx(i);
    setRevealed(false);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setRevealed(true);
    }, 900);
  };

  const sample = SAMPLES[idx]!;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg-sunken/60 px-4 py-2 font-mono text-xs text-fg-subtle">
        <span>smart-brain · clarifai detect · simulated</span>
        <span className="inline-flex items-center gap-1">
          {scanning ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> scanning…
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-accent-emerald" /> ready
            </>
          )}
        </span>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr,220px]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-bg-sunken/60">
          <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id="sb-face" cx="0.5" cy="0.45" r="0.55">
                <stop offset="0%" stopColor={sample.bg} stopOpacity="0.65" />
                <stop offset="100%" stopColor={sample.bg} stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <rect width="100" height="60" fill="url(#sb-face)" />
            {revealed &&
              sample.detections.map((d, i) => (
                <g key={i}>
                  <rect
                    x={d.box[0]}
                    y={d.box[1]}
                    width={d.box[2] - d.box[0]}
                    height={d.box[3] - d.box[1]}
                    fill="none"
                    stroke="hsl(var(--accent-emerald))"
                    strokeWidth="0.6"
                  />
                  <text
                    x={d.box[0]}
                    y={d.box[1] - 1}
                    style={{
                      fontSize: 3,
                      fill: "hsl(var(--accent-emerald))",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {d.label} · {d.conf.toFixed(2)}
                  </text>
                </g>
              ))}
            {scanning && (
              <rect
                width="100"
                height="2"
                y="0"
                fill="hsl(var(--accent-emerald))"
                opacity="0.7"
                style={{
                  animation: "sbScan 0.9s linear",
                }}
              />
            )}
          </svg>
          <style jsx>{`
            @keyframes sbScan {
              0% {
                transform: translateY(0);
              }
              100% {
                transform: translateY(60px);
              }
            }
          `}</style>
        </div>
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
            Try a sample
          </p>
          {SAMPLES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => run(i)}
              className={`flex w-full items-center justify-between rounded-md border p-2 text-left text-xs transition-colors ${
                i === idx
                  ? "border-accent-violet/40 bg-accent-violet/5 text-fg"
                  : "border-border text-fg-muted hover:border-accent-violet/30 hover:text-fg"
              }`}
            >
              <span>{s.name}</span>
              <span className="font-mono text-[10px] text-fg-subtle">
                {s.detections.length} obj
              </span>
            </button>
          ))}
          {revealed && (
            <div className="rounded-md border border-border bg-bg-elev p-2 text-[11px] text-fg-muted">
              {sample.detections.map((d) => (
                <div key={d.label + d.conf} className="flex justify-between font-mono">
                  <span>{d.label}</span>
                  <span className="text-accent-emerald">{(d.conf * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
