"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

// Simulated rep-quality scoring: a sine-wave "form score" with confidence gate.
export function PostureDemo() {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    ref.current = window.setInterval(() => setT((x) => x + 1), 60);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [playing]);

  const score = Math.round(82 + 14 * Math.sin(t / 6));
  const confidence = 0.78 + 0.15 * Math.sin(t / 9 + 1);
  const reps = Math.floor(t / 24);
  const gate = confidence > 0.75;

  // build series for sparkline
  const N = 60;
  const series = Array.from({ length: N }, (_, i) =>
    Math.round(82 + 14 * Math.sin((t - (N - i)) / 6)),
  );
  const path = series
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * 380) / (N - 1)} ${80 - (v - 60) * 1.4}`)
    .join(" ");

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg-sunken/60 px-4 py-2 font-mono text-xs text-fg-subtle">
        <span>postureiq · live rep · simulated</span>
        <span className={gate ? "text-accent-emerald" : "text-accent-amber"}>
          {gate ? "● tracking" : "○ low confidence"}
        </span>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr,220px]">
        <div>
          <svg viewBox="0 0 380 100" className="h-28 w-full">
            <path d={path} stroke="hsl(var(--accent-cyan))" strokeWidth="2" fill="none" />
            <line
              x1="0"
              y1="38"
              x2="380"
              y2="38"
              stroke="hsl(var(--accent-emerald))"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          </svg>
          <p className="mt-2 font-mono text-[11px] text-fg-subtle">
            form-score(t) with confidence gate — peaks count when above threshold
          </p>
        </div>
        <div className="space-y-2">
          <div className="rounded-md border border-border bg-bg-elev p-3">
            <p className="font-mono text-[10px] text-fg-subtle">FORM SCORE</p>
            <p className="font-mono text-2xl font-semibold text-accent-cyan">{score}</p>
          </div>
          <div className="rounded-md border border-border bg-bg-elev p-3">
            <p className="font-mono text-[10px] text-fg-subtle">REPS · CONF</p>
            <p className="font-mono text-lg font-semibold text-fg">
              {reps}{" "}
              <span className="text-xs text-fg-muted">· {(confidence * 100).toFixed(0)}%</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="btn-secondary flex-1 text-xs"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => setT(0)}
              className="btn-secondary text-xs"
              aria-label="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
