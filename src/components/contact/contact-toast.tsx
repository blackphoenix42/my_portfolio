"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

const DEFAULT_MS = 4500;

/**
 * Floating contact notice. Auto-dismisses; the timer lives here so callers
 * only set and clear the message.
 */
export function ContactToast({
  message,
  tone = "info",
  onDismiss,
  durationMs = DEFAULT_MS,
  lift = false,
}: {
  message: string | null;
  tone?: "info" | "warn";
  onDismiss: () => void;
  durationMs?: number;
  /** Sit above another toast so two notices don't cover each other. */
  lift?: boolean;
}) {
  const t = useTranslations("common");
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => dismissRef.current(), durationMs);
    return () => window.clearTimeout(id);
  }, [message, durationMs]);

  if (!mounted) return null;

  const warn = tone === "warn";
  const Icon = warn ? AlertCircle : Check;

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          role={warn ? "alert" : "status"}
          aria-live="polite"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
          className={
            "border-border bg-bg-elev/95 fixed left-1/2 z-[70] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border shadow-2xl backdrop-blur " +
            (lift ? "bottom-28 sm:bottom-32" : "bottom-6 sm:bottom-8")
          }
        >
          <div className="flex items-start gap-3 p-3.5 pr-2">
            <span
              className={
                warn
                  ? "bg-accent-amber/15 text-accent-amber mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full"
                  : "bg-accent-cyan/15 text-accent-cyan mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full"
              }
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <p className="text-fg min-w-0 flex-1 pt-1 text-sm leading-snug">{message}</p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label={t("close")}
              className="text-fg-subtle hover:bg-bg-sunken hover:text-fg flex-none rounded-md p-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {!reduce && (
            <motion.div
              className={
                warn
                  ? "bg-accent-amber absolute inset-x-0 bottom-0 h-0.5 origin-left"
                  : "bg-accent-cyan absolute inset-x-0 bottom-0 h-0.5 origin-left"
              }
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: durationMs / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
