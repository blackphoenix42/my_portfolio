"use client";

import { Check, TerminalSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEngineerMode } from "./engineer-mode";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const TOAST_MS = 4200;

export function EngineerToggle() {
  const t = useTranslations("engineer");
  const { engineer, toggle } = useEngineerMode();
  const [toast, setToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast]);

  const handleClick = () => {
    if (!engineer) {
      const seen = typeof window !== "undefined" && localStorage.getItem("engineer-toast-seen");
      if (!seen) {
        setToast(true);
        try {
          localStorage.setItem("engineer-toast-seen", "1");
        } catch {
          /* ignore */
        }
      }
    } else {
      setToast(false);
    }
    toggle();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={engineer}
        title={engineer ? t("exit") : t("enable")}
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-all",
          engineer
            ? "border-accent-cyan/60 from-accent-cyan/15 to-accent-cyan/5 text-accent-cyan bg-gradient-to-r shadow-[0_0_0_1px_hsl(var(--accent-cyan)/0.35),0_0_18px_-4px_hsl(var(--accent-cyan)/0.45)]"
            : "border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg",
        )}
      >
        {engineer ? (
          <>
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="bg-accent-cyan absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              <span className="bg-accent-cyan relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <Check className="h-3.5 w-3.5" />
            <span className="font-medium">{t("short")}</span>
            <span className="hidden font-mono text-[10px] tracking-widest uppercase sm:inline">
              {t("onShort")}
            </span>
          </>
        ) : (
          <>
            <TerminalSquare className="h-3.5 w-3.5" />
            <span>{t("short")}</span>
          </>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {toast && engineer && (
              <motion.div
                key="engineer-toast"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="border-accent-cyan/40 bg-bg-elev fixed top-28 right-4 z-[100] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border p-3 text-xs shadow-2xl backdrop-blur sm:right-6"
              >
                <div className="flex items-start gap-2">
                  <span className="bg-accent-cyan/15 text-accent-cyan mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full">
                    <Check className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-accent-cyan font-semibold">{t("toastTitle")}</p>
                    <p className="text-fg-muted mt-1 leading-relaxed">{t("toastBody")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToast(false)}
                    aria-label={t("dismiss")}
                    className="text-fg-subtle hover:bg-bg-sunken hover:text-fg flex-none rounded p-0.5 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <motion.div
                  className="bg-accent-cyan absolute inset-x-0 bottom-0 h-0.5 origin-left"
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
