"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { EggId } from "@/lib/eggs";
import { useEggs } from "./egg-provider";

/**
 * Plays a brief, full-screen celebratory animation when an egg is unlocked.
 * Each egg id maps to a different visual flavor (color, shape, motion).
 * Sits on top of the toast (z-90) but underneath terminal/matrix overlays
 * (z-70..80), and respects `prefers-reduced-motion` by skipping the burst
 * entirely.
 *
 * This is purely decorative — no functional interactions, no focus stealing,
 * and `pointer-events: none` everywhere.
 */
export function EggUnlockBurst() {
  const { lastUnlock } = useEggs();
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<EggId | null>(null);

  useEffect(() => {
    if (!lastUnlock || reduce) return;
    setCurrent(lastUnlock);
    const t = window.setTimeout(() => setCurrent(null), 1600);
    return () => window.clearTimeout(t);
  }, [lastUnlock, reduce]);

  const palette = useMemo(() => paletteFor(current), [current]);

  if (reduce || !current) return null;
  const variant = variantFor(current);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <AnimatePresence>
        {variant === "rings" && <Rings key={current} palette={palette} />}
        {variant === "confetti" && <Confetti key={current} palette={palette} />}
        {variant === "wash" && <ColorWash key={current} palette={palette} />}
        {variant === "embers" && <Embers key={current} palette={palette} />}
        {variant === "spiral" && <Spiral key={current} palette={palette} />}
        {variant === "glitch" && <Glitch key={current} palette={palette} />}
      </AnimatePresence>
    </div>
  );
}

type Palette = { core: string; mid: string; glow: string };
type Variant = "rings" | "confetti" | "wash" | "embers" | "spiral" | "glitch";

// Deterministic pseudo-random in [0, 1) seeded by index. Used in place of
// `Math.random()` so the per-particle styles stay pure for React's render
// rules — each component still gets a varied-looking burst.
function r(seed: number, salt = 0): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function variantFor(id: EggId | null): Variant {
  switch (id) {
    case "konami":
      return "rings";
    case "trophy-room-visit":
    case "completionist":
      return "confetti";
    case "theme-cycler":
    case "polyglot":
      return "wash";
    case "logo-shift-click":
    case "phoenix-type":
      return "embers";
    case "matrix-rain":
    case "css-selection":
      return "glitch";
    case "dino-score-5":
    case "haiku-trail":
      return "spiral";
    default:
      return "embers";
  }
}

function paletteFor(id: EggId | null): Palette {
  switch (id) {
    case "matrix-rain":
    case "css-selection":
      return { core: "#a5f3fc", mid: "#22d3ee", glow: "rgba(34,211,238,0.45)" };
    case "theme-cycler":
    case "polyglot":
      return { core: "#fde047", mid: "#a78bfa", glow: "rgba(168,85,247,0.4)" };
    case "trophy-room-visit":
    case "completionist":
      return { core: "#fde047", mid: "#f59e0b", glow: "rgba(245,165,36,0.5)" };
    case "konami":
      return { core: "#fef3c7", mid: "#dc2626", glow: "rgba(220,38,38,0.5)" };
    case "dino-score-5":
    case "haiku-trail":
      return { core: "#fef3c7", mid: "#fb923c", glow: "rgba(251,146,60,0.5)" };
    default:
      return { core: "#fde047", mid: "#f97316", glow: "rgba(249,115,22,0.45)" };
  }
}

function Rings({ palette }: { palette: Palette }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {[0, 0.12, 0.24].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 4 + i * 0.6, opacity: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="absolute h-40 w-40 rounded-full border-2"
          style={{ borderColor: palette.mid, boxShadow: `0 0 60px ${palette.glow}` }}
        />
      ))}
    </motion.div>
  );
}

function Confetti({ palette }: { palette: Palette }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        i,
        left: `${r(i, 1) * 100}%`,
        delay: r(i, 2) * 0.25,
        rot: r(i, 3) * 360,
        duration: 1.4 + r(i, 4) * 0.6,
      })),
    [],
  );
  return (
    <>
      {pieces.map((p) => {
        const color = p.i % 2 ? palette.core : palette.mid;
        return (
          <motion.span
            key={p.i}
            initial={{ top: "-5%", left: p.left, rotate: 0, opacity: 1 }}
            animate={{ top: "105%", rotate: p.rot + 720, opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            className="absolute block h-2 w-3 rounded-sm"
            style={{ background: color }}
          />
        );
      })}
    </>
  );
}

function ColorWash({ palette }: { palette: Palette }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.55, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, times: [0, 0.35, 1] }}
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${palette.core} 0%, ${palette.mid} 35%, transparent 75%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}

function Embers({ palette }: { palette: Palette }) {
  const sparks = useMemo(() => {
    const n = 24;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2;
      const dist = 200 + r(i, 5) * 180;
      return {
        i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        duration: 1.2 + r(i, 6) * 0.4,
      };
    });
  }, []);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute h-32 w-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${palette.core}, transparent 70%)` }}
      />
      {sparks.map((s) => (
        <motion.span
          key={s.i}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: s.x, y: s.y, opacity: 0 }}
          transition={{ duration: s.duration, ease: "easeOut" }}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ background: palette.mid, boxShadow: `0 0 8px ${palette.glow}` }}
        />
      ))}
    </div>
  );
}

function Spiral({ palette }: { palette: Palette }) {
  const dots = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {dots.map((i) => {
        const t = i / dots.length;
        const angle = t * Math.PI * 4;
        const r = 40 + t * 220;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * r,
              y: Math.sin(angle) * r,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.3],
            }}
            transition={{ duration: 1.3, delay: t * 0.25, ease: "easeOut" }}
            className="absolute h-2 w-2 rounded-full"
            style={{ background: palette.mid, boxShadow: `0 0 10px ${palette.glow}` }}
          />
        );
      })}
    </div>
  );
}

function Glitch({ palette }: { palette: Palette }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        i,
        duration: 0.6 + r(i, 7) * 0.3,
      })),
    [],
  );
  return (
    <>
      {bars.map((b) => (
        <motion.div
          key={b.i}
          initial={{ x: b.i % 2 ? "-100%" : "100%", opacity: 0 }}
          animate={{ x: ["100%", "-100%"], opacity: [0, 0.7, 0] }}
          transition={{ duration: b.duration, delay: b.i * 0.04 }}
          className="absolute right-0 left-0 h-1"
          style={{
            top: `${(b.i / bars.length) * 100}%`,
            background: b.i % 3 ? palette.mid : palette.core,
            boxShadow: `0 0 12px ${palette.glow}`,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </>
  );
}
