"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { SITE } from "@/content/profile";
import { useRecruiterMode } from "@/components/layout/recruiter-mode";
import { useTheme } from "next-themes";
import { useEggs } from "@/components/eggs/egg-provider";
import { isAnyOverlayOpen } from "@/components/eggs/overlay-state";
import { TOTAL_EGGS } from "@/lib/eggs";

// Shortcuts that are visible in the help overlay. The first column is the
// translation key under `shortcuts.items.*`; the second is the human-readable
// key combo to render. Combos use lucide-style notation: `g` then `h` is
// shown as "g then h".
const SHORTCUT_GROUPS = [
  {
    group: "global",
    items: [
      { key: "palette", combo: "⌘K / Ctrl+K" },
      { key: "search", combo: "/" },
      { key: "help", combo: "?" },
      { key: "escape", combo: "Esc" },
    ],
  },
  {
    group: "navigation",
    items: [
      { key: "home", combo: "g then h" },
      { key: "work", combo: "g then w" },
      { key: "skills", combo: "g then s" },
      { key: "experience", combo: "g then e" },
      { key: "about", combo: "g then a" },
      { key: "contact", combo: "g then c" },
      { key: "nextSection", combo: "j" },
      { key: "prevSection", combo: "k" },
    ],
  },
  {
    group: "actions",
    items: [
      { key: "theme", combo: "t" },
      { key: "recruiter", combo: "r" },
      { key: "language", combo: "l" },
      { key: "copyEmail", combo: "e" },
      { key: "downloadResume", combo: "d" },
    ],
  },
  {
    group: "menus",
    items: [{ key: "arrows", combo: "↑↓ ⏎" }],
  },
] as const;

const THEMES = ["light", "dark", "phoenix"] as const;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

function getSections(): HTMLElement[] {
  // Treat each <section> with an aria-label / id as a navigable landmark.
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "main section[aria-label], main section[id], main article",
    ),
  );
}

export function KeyboardShortcuts() {
  const t = useTranslations("shortcuts");
  const tEggs = useTranslations("eggs");
  const router = useRouter();
  const { toggle: toggleRecruiter } = useRecruiterMode();
  const { theme, setTheme } = useTheme();
  const { progress } = useEggs();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pendingPrefix = useRef<string | null>(null);
  const prefixTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  const cycleTheme = useCallback(() => {
    const idx = THEMES.indexOf((theme as (typeof THEMES)[number]) ?? "phoenix");
    const next = THEMES[(idx + 1) % THEMES.length] ?? "phoenix";
    setTheme(next);
  }, [theme, setTheme]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      // noop — clipboard may be blocked
    }
  }, []);

  const downloadResume = useCallback(() => {
    const a = document.createElement("a");
    a.href = SITE.resumePath;
    a.download = "";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const focusSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-command-menu"));
  }, []);

  const openLanguagePicker = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-language-picker"));
  }, []);

  const scrollToSection = useCallback((direction: 1 | -1) => {
    const sections = getSections();
    if (sections.length === 0) return;
    const scrollY = window.scrollY + 80;
    const currentIdx = sections.findIndex((el) => el.offsetTop + el.offsetHeight > scrollY);
    const targetIdx = Math.min(
      sections.length - 1,
      Math.max(0, (currentIdx === -1 ? sections.length - 1 : currentIdx) + direction),
    );
    const target = sections[targetIdx];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const clearPrefix = () => {
      pendingPrefix.current = null;
      if (prefixTimer.current) clearTimeout(prefixTimer.current);
      prefixTimer.current = null;
    };

    const handler = (e: KeyboardEvent) => {
      // While a fullscreen egg overlay (matrix / terminal) is open, ignore all
      // page shortcuts — otherwise typing inside it cycles themes, toggles
      // recruiter mode, navigates, etc.
      if (isAnyOverlayOpen()) return;
      // Allow custom open events to bypass focus checks.
      if (e.key === "Escape") {
        clearPrefix();
        setOpen(false);
        return;
      }

      // Don't capture shortcuts while typing in inputs.
      if (isTypingTarget(e.target)) return;

      if (e.metaKey || e.ctrlKey || e.altKey) return; // we don't override modifier combos

      // 2-step prefixes: `g` followed by [h/w/s/e/a/c]
      if (pendingPrefix.current === "g") {
        const map: Record<string, string> = {
          h: "/",
          w: "/work",
          s: "/skills",
          e: "/experience",
          a: "/about",
          c: "/contact",
        };
        const target = map[e.key.toLowerCase()];
        clearPrefix();
        if (target) {
          e.preventDefault();
          router.push(target);
          return;
        }
        return;
      }

      switch (e.key) {
        case "?":
          e.preventDefault();
          setOpen(true);
          break;
        case "/":
          e.preventDefault();
          focusSearch();
          break;
        case "g":
          e.preventDefault();
          pendingPrefix.current = "g";
          prefixTimer.current = setTimeout(clearPrefix, 1200);
          break;
        case "j":
          e.preventDefault();
          scrollToSection(1);
          break;
        case "k":
          e.preventDefault();
          scrollToSection(-1);
          break;
        case "t":
          e.preventDefault();
          cycleTheme();
          break;
        case "r":
          e.preventDefault();
          toggleRecruiter();
          break;
        case "l":
          e.preventDefault();
          openLanguagePicker();
          break;
        case "e":
          e.preventDefault();
          copyEmail();
          break;
        case "d":
          e.preventDefault();
          downloadResume();
          break;
      }
    };

    const openHandler = () => setOpen(true);
    window.addEventListener("keydown", handler);
    window.addEventListener("open-shortcuts-help", openHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-shortcuts-help", openHandler);
      if (prefixTimer.current) clearTimeout(prefixTimer.current);
    };
  }, [
    router,
    focusSearch,
    scrollToSection,
    cycleTheme,
    toggleRecruiter,
    openLanguagePicker,
    copyEmail,
    downloadResume,
  ]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="shortcuts-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="border-border bg-bg-elev relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl"
          >
            <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
              <div className="flex items-center gap-2">
                <Keyboard className="text-accent-cyan h-4 w-4" />
                <h2 className="text-sm font-semibold tracking-tight">{t("title")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="text-fg-subtle hover:bg-bg-sunken hover:text-fg rounded-md p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="grid gap-6 px-5 py-5 sm:grid-cols-2">
              {SHORTCUT_GROUPS.map((g) => (
                <section key={g.group} aria-label={t(`groups.${g.group}`)}>
                  <h3 className="mono-label mb-3">{t(`groups.${g.group}`)}</h3>
                  <ul className="space-y-2 text-sm">
                    {g.items.map((it) => (
                      <li key={it.key} className="flex items-center justify-between gap-3">
                        <span className="text-fg-muted">{t(`items.${it.key}`)}</span>
                        <Kbd>{it.combo}</Kbd>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <footer className="border-border bg-bg-sunken/40 text-fg-subtle flex items-center justify-between gap-3 border-t px-5 py-3 font-mono text-[10px]">
              <span>
                {t.rich("subtitle", {
                  kbd: (chunks) => <Kbd>{chunks as string}</Kbd>,
                })}
              </span>
              <Link
                href="/secret"
                className="text-accent-amber hover:text-accent-cyan inline-flex items-center gap-1"
                title={tEggs("shortcutsCounter.title")}
              >
                🜂{" "}
                {tEggs("shortcutsCounter.label", {
                  found: progress.unlocked.length,
                  total: TOTAL_EGGS,
                })}
              </Link>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="border-border bg-bg-sunken text-fg-muted inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap">
      {children}
    </kbd>
  );
}
