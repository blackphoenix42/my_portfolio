"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fakeHash, pickCommits } from "@/content/commit-rain";
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

const COUNT = 26;
const AUTO_MS = 7000;

function makeDrops(): Drop[] {
  const msgs = pickCommits(COUNT);
  return msgs.map((text, i) => ({
    id: i,
    text,
    hash: fakeHash(),
    left: Math.random() * 92,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    size: 11 + Math.floor(Math.random() * 4),
  }));
}

/**
 * Decorative "commit rain" overlay — falling commit messages. Triggered by the
 * terminal `commits` / `rain` command or the command menu. Reduced-motion shows
 * a static list instead of an animation. Auto-dismisses; click / Esc to close.
 */
export function ContributionRain() {
  const t = useTranslations("eggs.commitRain");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    const onOpen = () => {
      setDrops(makeDrops());
      setOpen(true);
    };
    window.addEventListener("open-contribution-rain", onOpen);
    return () => window.removeEventListener("open-contribution-rain", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen("commit-rain", true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const id = setTimeout(() => setOpen(false), AUTO_MS);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(id);
      setOverlayOpen("commit-rain", false);
    };
  }, [open]);

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
          {reduce ? (
            <div className="border-accent-emerald/30 bg-bg-elev/90 absolute top-1/2 left-1/2 max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-5 font-mono text-xs shadow-2xl">
              <p className="text-accent-emerald mb-2">{t("label")}</p>
              <ul className="text-fg-muted space-y-1">
                {drops.slice(0, 6).map((d) => (
                  <li key={d.id}>
                    <span className="text-accent-amber">{d.hash}</span> {d.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            drops.map((d) => (
              <motion.div
                key={d.id}
                initial={{ y: "-10vh", opacity: 0 }}
                animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
                transition={{ duration: d.duration, delay: d.delay, ease: "linear" }}
                style={{ left: `${d.left}%`, fontSize: d.size }}
                className="text-accent-emerald absolute font-mono whitespace-nowrap"
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
