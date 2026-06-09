"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame } from "lucide-react";

/**
 * Brief one-shot flight of a phoenix glyph across the viewport. Used as the
 * visual confirmation for the Konami and `phoenix`-typed eggs. Self-unmounts
 * after the animation. Honors `prefers-reduced-motion` — degrades to a brief
 * static glow.
 */
export function PhoenixFlight({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(onDone, reduce ? 800 : 2200);
    return () => clearTimeout(id);
  }, [onDone, reduce]);

  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
      >
        <Flame className="text-accent-amber h-16 w-16" />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <motion.div
        initial={{ x: "-15vw", y: "70vh", rotate: -10, opacity: 0 }}
        animate={{
          x: "110vw",
          y: ["70vh", "20vh", "55vh", "10vh"],
          rotate: [-10, 8, -4, 6],
          opacity: [0, 1, 1, 0.7, 0],
        }}
        transition={{ duration: 2, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] }}
        className="absolute"
      >
        <Flame
          className="text-accent-amber drop-shadow-[0_0_24px_rgba(245,165,36,0.65)]"
          style={{ width: 64, height: 64 }}
        />
      </motion.div>
      {/* Ember trail */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="bg-accent-amber/70 absolute h-1.5 w-1.5 rounded-full"
          initial={{ x: "-15vw", y: "70vh", opacity: 0 }}
          animate={{
            x: "110vw",
            y: ["70vh", "30vh", "60vh", "20vh"],
            opacity: [0, 1, 0.6, 0],
          }}
          transition={{
            duration: 2,
            delay: 0.05 * i + 0.05,
            ease: "easeInOut",
            times: [0, 0.3, 0.7, 1],
          }}
        />
      ))}
    </div>
  );
}
