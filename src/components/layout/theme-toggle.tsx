"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Flame } from "lucide-react";
import { useEffect, useState } from "react";

const ORDER = ["light", "dark", "phoenix"] as const;
type T = (typeof ORDER)[number];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Until the client mounts, render a neutral placeholder that matches SSR
  // exactly (no theme-derived label/icon). This avoids next-themes hydration
  // mismatches when the persisted theme differs from the server default.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme"
        className="border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex items-center gap-1.5 rounded-md border px-2 py-1.5"
        suppressHydrationWarning
      >
        <Moon className="h-4 w-4" aria-hidden />
        <span
          className="hidden font-mono text-[10px] tracking-widest uppercase sm:inline"
          aria-hidden
        >
          theme
        </span>
      </button>
    );
  }

  const current = (theme as T) ?? "dark";
  const idx = ORDER.indexOf(current);
  const next = ORDER[(idx + 1) % ORDER.length]!;
  const Icon = current === "light" ? Sun : current === "phoenix" ? Flame : Moon;

  return (
    <button
      type="button"
      aria-label={`Theme: ${current}. Click for ${next}.`}
      title={`Theme: ${current} → ${next}`}
      className="border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex items-center gap-1.5 rounded-md border px-2 py-1.5"
      onClick={() => setTheme(next)}
    >
      <Icon className={`h-4 w-4 ${current === "phoenix" ? "text-accent-amber" : ""}`} />
      <span className="hidden font-mono text-[10px] tracking-widest uppercase sm:inline">
        {current}
      </span>
    </button>
  );
}
