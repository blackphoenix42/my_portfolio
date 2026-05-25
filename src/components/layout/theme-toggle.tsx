"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Flame } from "lucide-react";
import { useEffect, useState } from "react";

const ORDER = ["light", "dark", "phoenix"] as const;
type T = (typeof ORDER)[number];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? (theme as T) : null) ?? (resolvedTheme as T) ?? "dark";
  const idx = ORDER.indexOf(current);
  const next = ORDER[(idx + 1) % ORDER.length]!;
  const Icon = current === "light" ? Sun : current === "phoenix" ? Flame : Moon;

  return (
    <button
      type="button"
      aria-label={`Theme: ${current}. Click for ${next}.`}
      title={`Theme: ${current} → ${next}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-fg-muted hover:border-accent-cyan/40 hover:text-fg"
      onClick={() => setTheme(next)}
    >
      <Icon className={`h-4 w-4 ${current === "phoenix" ? "text-accent-amber" : ""}`} />
      <span className="hidden font-mono text-[10px] uppercase tracking-widest sm:inline">
        {current}
      </span>
    </button>
  );
}
