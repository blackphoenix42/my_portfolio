"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEggs } from "./egg-provider";

/**
 * Small bottom-center toast announcing newly-unlocked eggs. Uses an
 * `aria-live="polite"` region so screen readers announce the unlock without
 * stealing focus. Auto-dismisses after 3.5s.
 */
export function EggToast() {
  const { lastUnlock, consumeLastUnlock, progress } = useEggs();
  const t = useTranslations("eggs");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!lastUnlock) return;
    const id = setTimeout(() => consumeLastUnlock(), 3500);
    return () => clearTimeout(id);
  }, [lastUnlock, consumeLastUnlock]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <AnimatePresence>
        {lastUnlock && (
          <motion.div
            key={lastUnlock}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.22 }}
            className="border-accent-amber/40 bg-bg-elev/95 text-fg pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border px-4 py-2.5 shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="text-accent-amber h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0 text-sm">
              <p className="text-fg font-semibold">{t("toast.title")}</p>
              <p className="text-fg-muted truncate text-xs">
                {t.has(`catalogue.${lastUnlock}.title` as never)
                  ? t(`catalogue.${lastUnlock}.title` as never)
                  : lastUnlock}{" "}
                · {progress.unlocked.length}/{t("toast.totalShort")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
