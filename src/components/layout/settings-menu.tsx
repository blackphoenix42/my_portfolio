"use client";

import { useEffect, useRef, useState } from "react";
import {
  Settings,
  Check,
  Sun,
  Moon,
  Flame,
  Globe,
  Keyboard,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "phoenix", icon: Flame },
  { id: "dark", icon: Moon },
  { id: "light", icon: Sun },
] as const;

/**
 * Consolidated header overflow menu. The header used to ship four discrete
 * buttons (Language, Recruiter, Theme, Resume) plus the search trigger and
 * feeds icon — visually noisy. The Resume button + Feeds icon stay on the
 * header; everything else lives behind this single gear-shaped affordance.
 */
export function SettingsMenu() {
  const tSettings = useTranslations("settings");
  const tLang = useTranslations("language");
  const tTheme = useTranslations("theme");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState<null | "root" | "language">(null);
  const root = useRef<HTMLDivElement>(null);

  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Expose `l` keyboard-shortcut and the recruiter banner's exit affordance.
  useEffect(() => {
    const openLang = () => setOpen("language");
    window.addEventListener("open-language-picker", openLang);
    return () => window.removeEventListener("open-language-picker", openLang);
  }, []);

  function switchLocale(next: Locale) {
    setOpen(null);
    // Under `localePrefix: "never"` the next-intl client router still
    // attempts an RSC fetch at a locale-prefixed URL (e.g. `/hi/work`) to
    // distinguish payloads per locale. Those URLs don't exist server-side,
    // so the browser console fills with "Failed to fetch RSC payload" warnings
    // and the soft locale switch is unreliable. Set the cookie ourselves and
    // do a hard navigation — guaranteed correct locale, no RSC mismatch, and
    // the in-flight page state isn't preserved across languages anyway.
    if (typeof document !== "undefined") {
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${oneYear}; samesite=lax`;
    }
    if (typeof window !== "undefined") {
      window.location.assign(pathname);
      return;
    }
    router.replace(pathname, { locale: next });
    router.refresh();
  }

  function switchTheme(next: (typeof THEMES)[number]["id"]) {
    setTheme(next);
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((cur) => (cur ? null : "root"))}
        aria-haspopup="menu"
        aria-expanded={open !== null}
        aria-label={tSettings("openLabel")}
        title={tSettings("openLabel")}
        className="border-border bg-bg-elev/60 text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex h-9 items-center justify-center rounded-md border px-2 transition-colors"
      >
        <Settings className="h-4 w-4" />
      </button>

      {open === "root" && (
        <div
          role="menu"
          aria-label={tSettings("menuLabel")}
          className="border-border bg-bg-elev absolute right-0 z-50 mt-1 w-64 rounded-lg border p-1 shadow-2xl"
        >
          {/* Language */}
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen("language")}
            className="text-fg-muted hover:bg-bg-sunken hover:text-fg flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-xs"
          >
            <span className="inline-flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" />
              {tSettings("language")}
            </span>
            <span className="text-fg-subtle inline-flex items-center gap-1 text-[10px]">
              {tLang("names." + locale)}
              <ChevronRight className="h-3 w-3" />
            </span>
          </button>

          {/* Theme picker (inline radio row) */}
          <div className="border-border/60 mt-1 border-t px-2 pt-2 pb-1">
            <p className="mono-label">{tSettings("theme")}</p>
            <div role="radiogroup" aria-label={tTheme("label")} className="mt-1.5 flex gap-1">
              {THEMES.map((t) => {
                const Icon = t.icon;
                const active = (theme ?? "phoenix") === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => switchTheme(t.id)}
                    title={tTheme(t.id)}
                    className={cn(
                      "border-border flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[10px]",
                      active
                        ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                        : "text-fg-muted hover:border-accent-cyan/30 hover:text-fg",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tTheme(t.id)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(null);
              window.dispatchEvent(new CustomEvent("open-shortcuts-help"));
            }}
            className="text-fg-muted hover:bg-bg-sunken hover:text-fg mt-1 flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-xs"
          >
            <span className="inline-flex items-center gap-2">
              <Keyboard className="h-3.5 w-3.5" />
              {tSettings("shortcuts")}
            </span>
            <kbd className="border-border bg-bg-sunken text-fg-muted rounded border px-1 font-mono text-[10px]">
              ?
            </kbd>
          </button>
        </div>
      )}

      {open === "language" && (
        <div
          role="menu"
          aria-label={tLang("label")}
          className="border-border bg-bg-elev absolute right-0 z-50 mt-1 min-w-[14rem] rounded-lg border p-1 shadow-2xl"
        >
          {/* Back to the root settings menu — keyboard-friendly and visually
              distinct so users don't lose their place. */}
          <button
            type="button"
            onClick={() => setOpen("root")}
            className="text-fg-subtle hover:bg-bg-sunken hover:text-fg flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{tCommon("back")}</span>
          </button>
          <div className="border-border/60 my-1 border-t" aria-hidden />
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              onClick={() => switchLocale(l)}
              className="text-fg-muted hover:bg-bg-sunken hover:text-fg flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left text-xs"
            >
              <span>{tLang("names." + l)}</span>
              {l === locale && <Check className="text-accent-cyan h-3.5 w-3.5" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
