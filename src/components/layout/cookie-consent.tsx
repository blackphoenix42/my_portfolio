"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "cookie-consent-v1";

/**
 * Soft, informational cookie notice. The site sets exactly one cookie —
 * `NEXT_LOCALE` (used by the language switcher) — and uses no third-party
 * analytics cookies (Vercel Analytics is cookie-less and exempt from GDPR
 * consent). Dismissing the banner stores a flag in `localStorage` so it
 * doesn't reappear on the next visit. The language switcher continues to
 * work regardless of dismissal.
 */
export function CookieConsent() {
  const t = useTranslations("consent");
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Defer a tick to avoid bumping LCP and landing-into-blocker flash.
        const id = setTimeout(() => setShow(true), 600);
        return () => clearTimeout(id);
      }
    } catch {
      // localStorage may be unavailable (incognito, sandboxed). Default to
      // never showing the banner rather than annoying users.
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-3 bottom-3 z-40 md:right-4 md:bottom-4 md:left-auto md:max-w-md"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="border-border bg-bg-elev/95 grid grid-cols-[auto,1fr,auto] items-start gap-3 rounded-xl border p-3 shadow-2xl backdrop-blur-md">
        <span
          className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber grid h-8 w-8 place-items-center rounded-md border"
          aria-hidden
        >
          <Cookie className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-fg text-sm font-semibold">{t("title")}</p>
          <p className="text-fg-muted mt-1 text-xs leading-relaxed">
            {t.rich("body", {
              code: (chunks) => (
                <code className="bg-bg-sunken rounded px-1 font-mono text-[10px]">{chunks}</code>
              ),
            })}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={dismiss} className="btn-primary text-xs">
              {t("accept")}
            </button>
            <Link href="/privacy" className="btn-ghost text-xs">
              {t("privacy")}
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismissAriaLabel")}
          className="text-fg-subtle hover:bg-bg-sunken hover:text-fg rounded p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
