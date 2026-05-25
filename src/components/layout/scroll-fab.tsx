"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ScrollFab() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setPct(total > 0 ? h.scrollTop / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  // Show top button when scrolled > 30%, bottom button when scrolled < 70%
  const showTop = pct > 0.3;
  const showBottom = pct < 0.7;

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-40 flex flex-col gap-2 sm:bottom-8 sm:right-6">
      {showTop && (
        <button
          type="button"
          onClick={goTop}
          aria-label="Scroll to top"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-elev/95 text-fg-muted shadow-lg backdrop-blur transition-colors hover:border-accent-cyan/50 hover:text-fg"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
      {showBottom && (
        <button
          type="button"
          onClick={goBottom}
          aria-label="Scroll to bottom"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-elev/95 text-fg-muted shadow-lg backdrop-blur transition-colors hover:border-accent-cyan/50 hover:text-fg"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
