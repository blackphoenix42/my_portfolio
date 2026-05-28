"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function ScrollFab() {
  const t = useTranslations("scroll");
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
    <div className="pointer-events-none fixed right-4 bottom-6 z-40 flex flex-col gap-2 sm:right-6 sm:bottom-8">
      {showTop && (
        <button
          type="button"
          onClick={goTop}
          aria-label={t("toTop")}
          className="border-border bg-bg-elev/95 text-fg-muted hover:border-accent-cyan/50 hover:text-fg pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-colors"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
      {showBottom && (
        <button
          type="button"
          onClick={goBottom}
          aria-label={t("toBottom")}
          className="border-border bg-bg-elev/95 text-fg-muted hover:border-accent-cyan/50 hover:text-fg pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-colors"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
