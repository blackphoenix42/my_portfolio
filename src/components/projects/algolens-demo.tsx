"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

// Deterministic input
const SAMPLE = [42, 8, 15, 23, 4, 16, 31, 19, 27, 11];

type Step = {
  array: number[];
  i: number;
  j: number;
  swapped?: boolean;
  done?: boolean;
  pseudo: number;
};

const PSEUDO = [
  "for i = 0 to n-1:",
  "  for j = 0 to n-i-2:",
  "    if a[j] > a[j+1]:",
  "      swap(a[j], a[j+1])",
];

function generateBubbleSortSteps(input: number[]): Step[] {
  const a = [...input];
  const steps: Step[] = [{ array: [...a], i: -1, j: -1, pseudo: 0 }];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], i, j, pseudo: 2 });
      if (a[j]! > a[j + 1]!) {
        [a[j], a[j + 1]] = [a[j + 1]!, a[j]!];
        steps.push({ array: [...a], i, j, swapped: true, pseudo: 3 });
      }
    }
  }
  steps.push({ array: [...a], i: -1, j: -1, done: true, pseudo: 0 });
  return steps;
}

export function AlgoLensDemo() {
  const steps = useMemo(() => generateBubbleSortSteps(SAMPLE), []);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    ref.current = window.setInterval(() => {
      setIdx((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 280);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [playing, steps.length]);

  const s = steps[idx]!;
  const max = Math.max(...SAMPLE);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg-sunken/60 px-4 py-2 font-mono text-xs text-fg-subtle">
        <span>algolens · bubble-sort · deterministic</span>
        <span>
          step {idx + 1} / {steps.length}
        </span>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr,260px]">
        <div>
          <div className="flex h-56 items-end gap-2">
            {s.array.map((v, i) => {
              const active = i === s.j || i === s.j + 1;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-200"
                  style={{
                    height: `${(v / max) * 100}%`,
                    background: active
                      ? "hsl(var(--accent-violet))"
                      : "hsl(var(--accent-cyan) / 0.7)",
                    boxShadow: active ? "0 0 0 1px hsl(var(--accent-violet))" : undefined,
                  }}
                  aria-label={`Bar value ${v}`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="btn-secondary text-xs" onClick={() => setIdx(0)} aria-label="Reset">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              className="btn-secondary text-xs"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              aria-label="Step back"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              className="btn-primary text-xs"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              className="btn-secondary text-xs"
              onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
              aria-label="Step forward"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <aside>
          <div>
            <p className="mono-label">Pseudocode</p>
            <pre className="mt-2 rounded-md border border-border bg-bg-sunken p-3 font-mono text-xs leading-relaxed">
              {PSEUDO.map((line, i) => (
                <span
                  key={i}
                  className={
                    i === s.pseudo ? "block bg-accent-cyan/15 text-fg" : "block text-fg-muted"
                  }
                >
                  {line}
                </span>
              ))}
            </pre>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border p-2">
              <p className="font-mono text-[10px] text-fg-subtle">Time</p>
              <p className="text-sm text-fg">O(n²)</p>
            </div>
            <div className="rounded-md border border-border p-2">
              <p className="font-mono text-[10px] text-fg-subtle">Space</p>
              <p className="text-sm text-fg">O(1)</p>
            </div>
          </div>
          <a
            href="https://github.com/blackphoenix42/algolens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-4 w-full text-xs"
          >
            Explore full AlgoLens →
          </a>
        </aside>
      </div>
    </div>
  );
}
