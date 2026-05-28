"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw } from "lucide-react";

const PATH: [number, number][] = [
  [70, 150],
  [120, 130],
  [165, 100],
  [220, 110],
  [270, 70],
  [320, 90],
  [380, 60],
  [420, 100],
];

export function TrackPersonDemo() {
  const reduce = useReducedMotion();
  const tr = useTranslations("demos.track");
  const tc = useTranslations("demos.common");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || reduce) return;
    ref.current = window.setInterval(() => setT((x) => (x + 1) % (PATH.length * 12)), 80);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [playing, reduce]);

  const seg = Math.floor(t / 12);
  const frac = (t % 12) / 12;
  const a = PATH[seg]!;
  const b = PATH[(seg + 1) % PATH.length]!;
  const x = a[0] + (b[0] - a[0]) * frac;
  const y = a[1] + (b[1] - a[1]) * frac;
  const distance = (Math.round(((seg + frac) / PATH.length) * 3200) / 100).toFixed(2);

  return (
    <div className="card overflow-hidden">
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span>{tr("title")}</span>
        <span className="text-accent-emerald">{tr("inZone")}</span>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-[1fr,220px]">
        <svg
          viewBox="0 0 480 200"
          className="border-border bg-bg-sunken/40 h-64 w-full rounded-md border"
        >
          <defs>
            <pattern id="map-grid-d" width="22" height="22" patternUnits="userSpaceOnUse">
              <path
                d="M 22 0 L 0 0 0 22"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="480" height="200" fill="url(#map-grid-d)" opacity="0.7" />
          <path d="M 0 80 H 480" stroke="hsl(var(--border))" strokeWidth="2" />
          <path d="M 0 130 H 480" stroke="hsl(var(--border))" strokeWidth="2" />
          <path d="M 160 0 V 200" stroke="hsl(var(--border))" strokeWidth="2" />
          <path d="M 290 0 V 200" stroke="hsl(var(--border))" strokeWidth="2" />
          <path
            d={PATH.map(([px, py], i) => (i === 0 ? `M ${px} ${py}` : `L ${px} ${py}`)).join(" ")}
            stroke="hsl(var(--accent-cyan))"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          {PATH.map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="3" fill="hsl(var(--accent-cyan))" />
          ))}
          <circle cx={PATH[0]![0]} cy={PATH[0]![1]} r="6" fill="hsl(var(--accent-emerald))" />
          <circle
            cx={x}
            cy={y}
            r="9"
            fill="hsl(var(--accent-violet))"
            stroke="hsl(var(--bg-sunken))"
            strokeWidth="2"
          />
          <circle cx={x} cy={y} r="16" fill="hsl(var(--accent-violet))" opacity="0.18" />
        </svg>
        <div className="space-y-2">
          <div className="border-border bg-bg-elev rounded-md border p-3">
            <p className="text-fg-subtle font-mono text-[10px]">{tr("distance")}</p>
            <p className="text-accent-cyan font-mono text-xl font-semibold">{distance} km</p>
          </div>
          <div className="border-border bg-bg-elev rounded-md border p-3">
            <p className="text-fg-subtle font-mono text-[10px]">{tr("waypoint")}</p>
            <p className="text-fg font-mono text-lg">
              {seg + 1} / {PATH.length}
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
              aria-label={tc("reset")}
              className="btn-secondary text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
