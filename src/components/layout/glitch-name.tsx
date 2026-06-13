"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Brand name with a short RGB-split glitch that fires on first mount and again
 * whenever `glitch` flips true (e.g. when the user hovers the nav bar). The
 * effect is purely decorative and is disabled entirely under reduced-motion.
 */
export function GlitchName({
  name,
  glitch = false,
  className,
}: {
  name: string;
  glitch?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  // Glitch once on load.
  useEffect(() => {
    if (reduce) return;
    setActive(true);
    const id = setTimeout(() => setActive(false), 760);
    return () => clearTimeout(id);
  }, [reduce]);

  // Glitch on hover trigger.
  useEffect(() => {
    if (reduce || !glitch) return;
    setActive(true);
    const id = setTimeout(() => setActive(false), 620);
    return () => clearTimeout(id);
  }, [glitch, reduce]);

  if (reduce) {
    return <span className={className}>{name}</span>;
  }

  return (
    <span
      data-text={name}
      className={cn("glitch-name", active && "glitch-name--active", className)}
    >
      {name}
    </span>
  );
}
