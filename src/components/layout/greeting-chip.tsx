"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CloudSun, Moon, Sparkles, Sun, Sunrise, Sunset, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getGreetingBucket, type GreetingBucket } from "@/lib/greeting";

const AUTO_OPEN_DELAY_MS = 900;
const AUTO_CLOSE_DELAY_MS = 7000;
const SESSION_FLAG = "greeting-seen-v1";

const ICON_BY_BUCKET: Record<GreetingBucket, typeof Sun> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
};

/** Tailwind gradient classes per time-of-day. Tokens come from globals.css. */
const GRADIENT_BY_BUCKET: Record<GreetingBucket, string> = {
  morning: "from-accent-amber/30 via-accent-cyan/20 to-transparent",
  afternoon: "from-accent-cyan/30 via-accent-emerald/20 to-transparent",
  evening: "from-accent-amber/30 via-accent-violet/25 to-transparent",
  night: "from-accent-violet/30 via-accent-cyan/15 to-transparent",
};

const ACCENT_BY_BUCKET: Record<GreetingBucket, string> = {
  morning: "text-accent-amber",
  afternoon: "text-accent-cyan",
  evening: "text-accent-amber",
  night: "text-accent-violet",
};

/**
 * Small cloud-icon button rendered next to the brand name in the header.
 * On click, or once per session automatically, it pops a friendly card
 * that greets the visitor in their language based on _their_ local clock
 * (computed entirely in the browser, never sent anywhere) and invites them
 * to explore the site.
 */
export function GreetingChip() {
  const t = useTranslations("greeting");
  const reduce = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [bucket, setBucket] = useState<GreetingBucket | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoCloseTimer = useRef<number | null>(null);

  // Mount-only: snapshot the visitor's local time-of-day bucket and
  // auto-open the popover on their first visit of the session.
  useEffect(() => {
    setMounted(true);
    setBucket(getGreetingBucket(new Date().getHours()));

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      /* sessionStorage unavailable - treat as fresh visit */
    }

    if (alreadySeen) return;

    const openId = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_FLAG, "1");
      } catch {
        /* ignore */
      }
      autoCloseTimer.current = window.setTimeout(() => setOpen(false), AUTO_CLOSE_DELAY_MS);
    }, AUTO_OPEN_DELAY_MS);

    return () => {
      window.clearTimeout(openId);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
    };
  }, []);

  // Click-outside + Escape to dismiss.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Render nothing on the server to avoid hydration mismatches around time.
  if (!mounted || !bucket) return null;

  const Icon = ICON_BY_BUCKET[bucket];
  const accent = ACCENT_BY_BUCKET[bucket];
  const gradient = GRADIENT_BY_BUCKET[bucket];
  const greeting = t(bucket);

  function toggle() {
    setOpen((currentOpen) => {
      const next = !currentOpen;
      if (next && autoCloseTimer.current) {
        window.clearTimeout(autoCloseTimer.current);
        autoCloseTimer.current = null;
      }
      return next;
    });
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={toggle}
        aria-label={t("ariaLabel", { greeting })}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={greeting}
        className={cn(
          "border-border/60 bg-bg-elev/40 hover:border-accent-cyan/40 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
          accent,
        )}
      >
        <CloudSun className="h-3.5 w-3.5" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="greeting-pop"
            role="dialog"
            aria-label={t("ariaLabel", { greeting })}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-border bg-bg-elev/95 absolute top-full left-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md"
          >
            {/* Gradient header strip tinted by time-of-day. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b",
                gradient,
              )}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeLabel")}
              className="text-fg-muted hover:bg-bg-sunken/70 hover:text-fg absolute top-1.5 right-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="relative p-4">
              <div className="flex items-center gap-3">
                <motion.span
                  className={cn(
                    "border-border/60 bg-bg-sunken/70 grid h-10 w-10 shrink-0 place-items-center rounded-full border shadow-sm",
                    accent,
                  )}
                  aria-hidden
                  animate={reduce ? undefined : { rotate: [0, -10, 10, -6, 6, 0] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: 1.4, ease: "easeInOut", delay: 0.15, repeat: 0 }
                  }
                >
                  <Icon className="h-5 w-5" />
                </motion.span>
                <div className="min-w-0">
                  <p className="text-fg text-sm leading-tight font-semibold tracking-tight">
                    {greeting}
                  </p>
                  <p className="text-fg-muted mt-0.5 text-xs">{t("tagline")}</p>
                </div>
              </div>

              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="border-accent-cyan/35 bg-bg-sunken/70 text-fg hover:border-accent-cyan/60 hover:bg-bg-sunken mt-3 inline-flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="text-accent-cyan h-3.5 w-3.5" aria-hidden />
                  {t("exploreCta")}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
