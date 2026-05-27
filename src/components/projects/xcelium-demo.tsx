"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

// Interactive "before vs after" simulation throughput slider.
// Pure visual — illustrates the 18-19% Xcelium gain story.
const STAGES = [
  { name: "elaborate", before: 100, after: 86 },
  { name: "compile", before: 100, after: 88 },
  { name: "simulate", before: 100, after: 81 },
  { name: "rtl-xform", before: 100, after: 86 },
];

export function XceliumDemo() {
  const [mix, setMix] = useState(0.8); // 0 = before, 1 = after
  const [auto, setAuto] = useState(false);

  if (auto) {
    // simple oscillation via requestAnimationFrame timing isn't needed; rely on CSS transition
  }

  const gainPct = Math.round(
    (STAGES.reduce(
      (acc, s) => acc + (s.before - (s.before * (1 - mix) + s.after * mix)) / s.before,
      0,
    ) /
      STAGES.length) *
      100,
  );

  return (
    <div className="card overflow-hidden">
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span>xcelium · runtime profile</span>
        <span className="text-accent-emerald">{gainPct}% throughput gain</span>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr,220px]">
        <div className="space-y-3">
          {STAGES.map((s) => {
            const value = s.before * (1 - mix) + s.after * mix;
            return (
              <div key={s.name}>
                <div className="text-fg-subtle mb-1 flex items-center justify-between font-mono text-[11px]">
                  <span>{s.name}</span>
                  <span>{value.toFixed(0)} ms</span>
                </div>
                <div className="bg-bg-sunken/70 relative h-4 overflow-hidden rounded-sm">
                  <div
                    className="bg-accent-cyan/70 absolute inset-y-0 left-0 rounded-sm transition-[width] duration-300"
                    style={{ width: `${value}%` }}
                  />
                  <div
                    className="border-accent-violet/50 pointer-events-none absolute inset-y-0 left-0 border-r"
                    style={{ width: `${s.after}%` }}
                    aria-hidden
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          <label className="text-fg-subtle block font-mono text-[11px]">
            workload mix
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={mix}
              onChange={(e) => setMix(Number(e.target.value))}
              className="mt-2 w-full accent-[hsl(var(--accent-cyan))]"
              aria-label="Before / after mix"
            />
            <div className="mt-1 flex justify-between text-[10px]">
              <span>before</span>
              <span>after</span>
            </div>
          </label>
          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            className="btn-secondary text-xs"
            aria-pressed={auto}
          >
            {auto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {auto ? "Pause" : "Play"} animation
          </button>
          <p className="text-fg-subtle text-[11px]">
            Illustrative: bars compress from the &quot;before&quot; profile to the optimized
            &quot;after&quot; profile as you drag the slider.
          </p>
        </div>
      </div>
    </div>
  );
}
