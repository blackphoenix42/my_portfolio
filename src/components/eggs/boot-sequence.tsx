"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { setOverlayOpen } from "./overlay-state";

const SESSION_KEY = "phoenix:boot:seen";
const LINE_MS = 320;

/**
 * Hacker-style boot overlay shown ONCE per browser session. It renders on top of
 * already-painted content (so it never blocks SSR/SEO), is fully skippable
 * (Esc / click / Skip button), and is skipped entirely under reduced motion.
 */
export function BootSequence() {
  const t = useTranslations("eggs.boot");
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const lines = (() => {
    const raw = t.raw("lines" as never);
    return Array.isArray(raw) ? (raw as string[]) : [];
  })();

  const dismiss = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      // Opt-out flag (used by e2e tests) — never show the overlay.
      if (localStorage.getItem("phoenix:boot:disabled") === "1") return;
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    // Under reduced motion we honour the "once per session" record but never
    // show the animated overlay.
    if (reduce) return;
    setShow(true);
  }, [reduce]);

  // Typewriter reveal + auto-dismiss after the last line.
  useEffect(() => {
    if (!show) return;
    setOverlayOpen("boot", true);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    for (let i = 1; i <= lines.length; i++) {
      timers.current.push(setTimeout(() => setRevealed(i), i * LINE_MS));
    }
    timers.current.push(setTimeout(dismiss, lines.length * LINE_MS + 900));
    return () => {
      timers.current.forEach(clearTimeout);
      setOverlayOpen("boot", false);
    };
  }, [show, lines.length, dismiss]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={dismiss}
          className="bg-bg-sunken fixed inset-0 z-[95] flex cursor-pointer flex-col justify-center px-6 font-mono text-sm sm:px-12"
        >
          <pre className="text-accent-cyan mb-4 text-[10px] leading-tight sm:text-xs" aria-hidden>
            {t("banner")}
          </pre>
          <div className="space-y-1">
            {lines.slice(0, revealed).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-fg-muted"
              >
                <span className="text-accent-emerald">[ ok ]</span> {line}
              </motion.p>
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            className="text-fg-subtle hover:text-fg absolute right-5 bottom-5 rounded-md border border-current/30 px-3 py-1 text-xs"
          >
            {t("skip")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
