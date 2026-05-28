"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const tNav = useTranslations("nav");
  const tLang = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    // With `localePrefix: "never"` the URL doesn't change — only the locale
    // cookie does. next-intl's router handles writing the cookie; the explicit
    // `router.refresh()` forces a server-component re-render so the new
    // translations swap in without a hard reload.
    router.replace(pathname, { locale: next });
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={tLang("switch")}
        title={tLang("switch")}
        className="border-border bg-bg-elev/60 text-fg-muted hover:text-fg hover:border-accent-cyan/40 inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-xs transition"
      >
        <Globe className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">{tLang("names." + locale)}</span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label={tNav("primary")}
          className="border-border bg-bg-elev absolute right-0 z-50 mt-1 min-w-[10rem] rounded-md border p-1 shadow-lg"
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              onClick={() => switchTo(l)}
              className="text-fg-muted hover:bg-bg-sunken hover:text-fg flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-xs"
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
