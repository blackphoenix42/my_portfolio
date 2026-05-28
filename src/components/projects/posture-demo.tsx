"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw } from "lucide-react";

// Simulated rep-quality scoring: a sine-wave "form score" with confidence gate.
export function PostureDemo() {
  const reduce = useReducedMotion();
  const tr = useTranslations("demos.posture");
  const tc = useTranslations("demos.common");
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || reduce) return;
    ref.current = window.setInterval(() => setT((x) => x + 1), 60);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [playing, reduce]);

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
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span>{tr("title")}</span>
        <span className={gate ? "text-accent-emerald" : "text-accent-amber"}>
          {gate ? tr("tracking") : tr("lowConfidence")}
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
          <p className="text-fg-subtle mt-2 font-mono text-[11px]">{tr("note")}</p>
        </div>
        <div className="space-y-2">
          <div className="border-border bg-bg-elev rounded-md border p-3">
            <p className="text-fg-subtle font-mono text-[10px]">{tr("formScore")}</p>
            <p className="text-accent-cyan font-mono text-2xl font-semibold">{score}</p>
          </div>
          <div className="border-border bg-bg-elev rounded-md border p-3">
            <p className="text-fg-subtle font-mono text-[10px]">{tr("repsConf")}</p>
            <p className="text-fg font-mono text-lg font-semibold">
              {reps}{" "}
              <span className="text-fg-muted text-xs">· {(confidence * 100).toFixed(0)}%</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="btn-secondary flex-1 text-xs"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? tc("pause") : tc("play")}
            </button>
            <button
              type="button"
              onClick={() => setT(0)}
              className="btn-secondary text-xs"
              aria-label={tc("reset")}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
