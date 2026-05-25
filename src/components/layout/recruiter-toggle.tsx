"use client";

import { Briefcase, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRecruiterMode } from "./recruiter-mode";
import { cn } from "@/lib/utils";

const TOAST_MS = 4200;

export function RecruiterToggle() {
  const { recruiter, toggle } = useRecruiterMode();
  const [toast, setToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  const handleClick = () => {
    if (!recruiter) setToast(true);
    else setToast(false);
    toggle();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={recruiter}
        title={recruiter ? "Exit recruiter mode" : "Enable recruiter mode"}
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-all",
          recruiter
            ? "border-accent-emerald/60 bg-gradient-to-r from-accent-emerald/15 to-accent-emerald/5 text-accent-emerald shadow-[0_0_0_1px_hsl(var(--accent-emerald)/0.35),0_0_18px_-4px_hsl(var(--accent-emerald)/0.45)]"
            : "border-border text-fg-muted hover:border-accent-emerald/40 hover:text-fg",
        )}
      >
        {recruiter ? (
          <>
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald" />
            </span>
            <Check className="h-3.5 w-3.5" />
            <span className="font-medium">Recruiter</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest sm:inline">
              on
            </span>
          </>
        ) : (
          <>
            <Briefcase className="h-3.5 w-3.5" />
            <span>Recruiter</span>
          </>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {toast && recruiter && (
              <motion.div
                key="recruiter-toast"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed right-4 top-28 z-[100] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-accent-emerald/40 bg-bg-elev p-3 text-xs shadow-2xl backdrop-blur sm:right-6"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-emerald/15 text-accent-emerald">
                    <Check className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-accent-emerald">Recruiter mode enabled</p>
                    <p className="mt-1 leading-relaxed text-fg-muted">
                      Optimized for time-pressed reviewers — résumé, contact and impact bubble to
                      the top. Preference is saved locally.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToast(false)}
                    aria-label="Dismiss"
                    className="flex-none rounded p-0.5 text-fg-subtle transition-colors hover:bg-bg-sunken hover:text-fg"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* auto-dismiss progress bar */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent-emerald"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: TOAST_MS / 1000, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
