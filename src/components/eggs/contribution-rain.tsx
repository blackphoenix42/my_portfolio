"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  COMMIT_RAIN_FALL_MS,
  COMMIT_RAIN_STAGGER_MS,
  commitRainDurationMs,
  sequenceCommitDrops,
  type CommitDropLine,
} from "@/content/commit-rain";
import { absorbCommits, readCachedCommits } from "./commit-rain-cache";
import { readCommitRainWindow } from "./commit-rain-prefs";
import { setOverlayOpen } from "./overlay-state";

type Drop = {
  id: number;
  text: string;
  hash: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
};

function makeDrops(messages: CommitDropLine[] = []): Drop[] {
  // Newest first — rain every commit once until the sequence ends.
  return sequenceCommitDrops(messages).map((line, i) => ({
    id: i,
    text: line.message,
    hash: line.sha,
    left: 2 + ((i * 47) % 90) + (i % 5),
    delay: (i * COMMIT_RAIN_STAGGER_MS) / 1000,
    duration: COMMIT_RAIN_FALL_MS / 1000 + ((i % 5) - 2) * 0.12,
    size: 11 + (i % 4),
  }));
}

async function loadMessages(fallback: CommitDropLine[]): Promise<CommitDropLine[]> {
  const rainWindow = readCommitRainWindow();
  const cached = readCachedCommits(rainWindow);
  const seed = cached.length > 0 ? cached : fallback;

  try {
    const res = await fetch(`/api/commits?window=${encodeURIComponent(rainWindow)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return seed;
    const json = (await res.json()) as { lines?: CommitDropLine[] };
    const fresh = Array.isArray(json.lines) ? json.lines : [];
    // Merge newest-first into the browser cache; return the full sequenced pool.
    if (fresh.length === 0) return seed;
    return absorbCommits(rainWindow, fresh);
  } catch {
    return seed;
  }
}

/**
 * Decorative "commit rain" overlay. Plays every commit in the selected window
 * (newest → oldest) until the last drop finishes, or the visitor clicks / Esc.
 */
export function ContributionRain({ initialMessages = [] }: { initialMessages?: CommitDropLine[] }) {
  const t = useTranslations("eggs.commitRain");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onOpen = () => {
      void (async () => {
        const messages = await loadMessages(initialMessages);
        const next = makeDrops(messages);
        setDrops(next);
        setOpen(true);
      })();
    };
    window.addEventListener("open-contribution-rain", onOpen);
    return () => window.removeEventListener("open-contribution-rain", onOpen);
  }, [initialMessages]);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen("commit-rain", true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Stay open until the full sequence finishes (or the user dismisses).
    if (!reduce && drops.length > 0) {
      closeTimer.current = setTimeout(() => setOpen(false), commitRainDurationMs(drops.length));
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setOverlayOpen("commit-rain", false);
    };
  }, [open, drops.length, reduce]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setOpen(false)}
          className="bg-bg/40 fixed inset-0 z-[60] overflow-hidden backdrop-blur-[1px]"
          role="presentation"
        >
          <span className="sr-only" role="status">
            {t("label")}
          </span>
          <p className="text-fg-subtle pointer-events-none absolute top-4 right-4 z-10 font-mono text-[10px]">
            {t("dismissHint")}
          </p>
          {reduce ? (
            <div
              className="border-accent-emerald/30 bg-bg-elev/95 absolute top-1/2 left-1/2 max-h-[70vh] w-[min(28rem,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border p-5 font-mono text-xs shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-accent-emerald mb-1">{t("label")}</p>
              <p className="text-fg-subtle mb-3 text-[10px]">
                {t("count", { count: drops.length })} · {t("dismissHint")}
              </p>
              <ul className="text-fg-muted space-y-1">
                {drops.map((d) => (
                  <li key={d.id}>
                    <span className="text-accent-amber">{d.hash}</span> {d.text}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="border-border text-fg-muted hover:text-fg mt-4 rounded-md border px-3 py-1.5 text-[11px]"
                onClick={() => setOpen(false)}
              >
                {t("close")}
              </button>
            </div>
          ) : (
            drops.map((d) => (
              <motion.div
                key={d.id}
                initial={{ y: "-10vh", opacity: 0 }}
                animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
                transition={{ duration: d.duration, delay: d.delay, ease: "linear" }}
                style={{ left: `${d.left}%`, fontSize: d.size }}
                className="text-accent-emerald pointer-events-none absolute font-mono whitespace-nowrap"
              >
                <span className="text-accent-amber">{d.hash}</span> {d.text}
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
