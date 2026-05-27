"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts children only when the wrapper enters the viewport, and unmounts
 * (or hides) them when scrolled away. Useful for pausing animation-heavy
 * subtrees (framer-motion infinite loops, RAF tickers) when offscreen.
 *
 * Defaults to "keepMounted: false" — children are removed from the DOM
 * once they leave the viewport, so timers/animations are fully stopped.
 */
export function InView({
  children,
  rootMargin = "200px",
  minHeight = 200,
  keepMounted = false,
  className,
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number;
  keepMounted?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      setHasBeenInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry?.isIntersecting;
        setInView(visible);
        if (visible) setHasBeenInView(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const show = keepMounted ? hasBeenInView : inView;

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {show ? children : null}
    </div>
  );
}
