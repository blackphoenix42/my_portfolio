"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
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
  const reduce = useReducedMotion();
  const t = useTranslations("demos.algolens");
  const tc = useTranslations("demos.common");
  const steps = useMemo(() => generateBubbleSortSteps(SAMPLE), []);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    // Respect prefers-reduced-motion: jump to the end instead of animating.
    if (reduce) {
      setIdx(steps.length - 1);
      setPlaying(false);
      return;
    }
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
  }, [playing, steps.length, reduce]);

  const s = steps[idx]!;
  const max = Math.max(...SAMPLE);

  return (
    <div className="card overflow-hidden">
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span>{t("title")}</span>
        <span>{t("step", { current: idx + 1, total: steps.length })}</span>
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
                  aria-label={t("barLabel", { value: v })}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              className="btn-secondary text-xs"
              onClick={() => setIdx(0)}
              aria-label={tc("reset")}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              className="btn-secondary text-xs"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              aria-label={tc("stepBack")}
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              className="btn-primary text-xs"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? tc("pause") : tc("play")}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? tc("pause") : tc("play")}
            </button>
            <button
              className="btn-secondary text-xs"
              onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
              aria-label={tc("stepForward")}
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <aside>
          <div>
            <p className="mono-label">{t("pseudocode")}</p>
            <pre className="border-border bg-bg-sunken mt-2 rounded-md border p-3 font-mono text-xs leading-relaxed">
              {PSEUDO.map((line, i) => (
                <span
                  key={i}
                  className={
                    i === s.pseudo ? "bg-accent-cyan/15 text-fg block" : "text-fg-muted block"
                  }
                >
                  {line}
                </span>
              ))}
            </pre>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="border-border rounded-md border p-2">
              <p className="text-fg-subtle font-mono text-[10px]">{t("time")}</p>
              <p className="text-fg text-sm">O(n²)</p>
            </div>
            <div className="border-border rounded-md border p-2">
              <p className="text-fg-subtle font-mono text-[10px]">{t("space")}</p>
              <p className="text-fg text-sm">O(1)</p>
            </div>
          </div>
          <a
            href="https://github.com/blackphoenix42/algolens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-4 w-full text-xs"
          >
            {t("explore")}
          </a>
        </aside>
      </div>
    </div>
  );
}
