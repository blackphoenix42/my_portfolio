"use client";

import { useEffect, useMemo, useState } from "react";
import { Quote as QuoteIcon } from "lucide-react";
import { quotes, type Quote } from "@/content/quotes";

type Placement = "hero" | "about" | "contact" | "footer";

function pickIndex(): number {
  return Math.floor(Math.random() * quotes.length);
}

const CYCLE_MS = 30_000;

export function QuoteCard({
  placement = "about",
  showTone = false,
}: {
  placement?: Placement;
  showTone?: boolean;
}) {
  const [idx, setIdx] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIdx(pickIndex());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % quotes.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [mounted]);

  const fallback: Quote = useMemo(
    () => quotes[0] ?? { text: "", author: "", tone: "motivational" },
    [],
  );
  const q: Quote = useMemo(() => quotes[idx % quotes.length] ?? fallback, [idx, fallback]);

  const accent =
    placement === "hero"
      ? "border-accent-violet/30 bg-accent-violet/5"
      : placement === "contact"
        ? "border-accent-emerald/30 bg-accent-emerald/5"
        : placement === "footer"
          ? "border-border/60 bg-bg-elev/40"
          : "border-accent-amber/30 bg-accent-amber/5";

  return (
    <figure
      className={`my-10 rounded-xl border ${accent} relative px-5 py-5 sm:px-7 sm:py-6`}
      aria-label="Programming quote"
    >
      <QuoteIcon className="absolute left-3 top-3 h-4 w-4 text-fg-subtle/50" aria-hidden />
      <blockquote className="pl-6 text-sm leading-relaxed text-fg sm:text-base">
        <span suppressHydrationWarning>{mounted ? q.text : fallback.text}</span>
      </blockquote>
      <figcaption className="mt-3 flex items-center justify-between gap-3 pl-6 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        <span suppressHydrationWarning>
          — {mounted ? q.author : fallback.author}
          {showTone && (
            <>
              {" · "}
              <span
                className={mounted && q.tone === "funny" ? "text-accent-amber" : "text-accent-cyan"}
              >
                {mounted ? q.tone : fallback.tone}
              </span>
            </>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
