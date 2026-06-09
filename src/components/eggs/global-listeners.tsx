"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { matchKonami } from "@/lib/eggs";
import { useEggs } from "./egg-provider";
import { PhoenixFlight } from "./phoenix-flight";
import { isAnyOverlayOpen } from "./overlay-state";

/**
 * Global keyboard / interaction listeners that drive the bulk of the egg
 * unlock logic. One mounted instance per app — lives inside `EggProvider`.
 */
export function GlobalListeners() {
  const { unlock, recordLocaleVisit, progress } = useEggs();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [showFlight, setShowFlight] = useState(false);

  // Konami sequence + "phoenix" / "matrix" typed-word detection.
  const konamiBuf = useRef<string[]>([]);
  const wordBuf = useRef("");
  const wordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function isTyping(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return target.isContentEditable;
    }

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      // Don't trigger eggs while an overlay (matrix, terminal) is open —
      // typing "matrix" inside the matrix overlay must not bounce back.
      if (isAnyOverlayOpen()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Konami.
      const { buffer, matched } = matchKonami(konamiBuf.current, e.key);
      konamiBuf.current = buffer;
      if (matched) {
        unlock("konami");
        setShowFlight(true);
        window.dispatchEvent(new CustomEvent("egg-burst", { detail: { id: "konami" } }));
      }

      // Typed words.
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        wordBuf.current = (wordBuf.current + e.key.toLowerCase()).slice(-12);
        if (wordTimer.current) clearTimeout(wordTimer.current);
        wordTimer.current = setTimeout(() => {
          wordBuf.current = "";
        }, 1500);

        if (wordBuf.current.endsWith("phoenix")) {
          unlock("phoenix-type");
          setShowFlight(true);
        }
        if (wordBuf.current.endsWith("matrix")) {
          window.dispatchEvent(new CustomEvent("open-matrix-rain"));
        }
        if (wordBuf.current.endsWith("terminal")) {
          window.dispatchEvent(new CustomEvent("open-terminal-mode"));
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (wordTimer.current) clearTimeout(wordTimer.current);
    };
  }, [unlock]);

  // Logo-shift-click: 5x shift+click on the brand link toggles phoenix theme +
  // dispatches an egg-burst so the user sees a visible reward.
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!e.shiftKey) return;
      const target = e.target instanceof Element ? e.target.closest("a[aria-label]") : null;
      if (!target) return;
      const label = target.getAttribute("aria-label") ?? "";
      if (!/home/i.test(label)) return;
      e.preventDefault();
      clickCount.current += 1;
      // Small pulse on every shift+click so the user gets immediate feedback.
      window.dispatchEvent(
        new CustomEvent("egg-pulse", {
          detail: { count: clickCount.current, of: 5 },
        }),
      );
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1800);
      if (clickCount.current >= 5) {
        clickCount.current = 0;
        setTheme("phoenix");
        unlock("logo-shift-click");
        window.dispatchEvent(new CustomEvent("egg-burst", { detail: { id: "logo-shift-click" } }));
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [setTheme, unlock]);

  // Locale-based eggs.
  useEffect(() => {
    if (!locale) return;
    recordLocaleVisit(locale);
    if (locale === "sa") unlock("sanskrit-locale");
  }, [locale, recordLocaleVisit, unlock]);

  // Polyglot egg — fires when visitedLocales hits all 6.
  useEffect(() => {
    const SIX = ["en", "hi", "ja", "sa", "zh", "ru"];
    if (SIX.every((l) => progress.visitedLocales.includes(l))) {
      unlock("polyglot");
    }
  }, [progress.visitedLocales, unlock]);

  // Fallback unlock for /humans.txt: the route handler already unlocks the
  // egg via an inline script when a browser navigates to it, but if the visitor
  // somehow lands back on the site with /humans.txt as the referrer, honour it
  // too. /robots.txt is intentionally NOT here — it stays plain text for every
  // client, so its egg is reachable only through the console `robots()` helper.
  useEffect(() => {
    try {
      const ref = document.referrer;
      if (!ref) return;
      const u = new URL(ref);
      if (u.origin !== window.location.origin) return;
      if (u.pathname.endsWith("/humans.txt")) unlock("humans-txt");
    } catch {
      /* malformed referrer — ignore */
    }
  }, [unlock]);

  // Theme cycler: visit all three themes within 2 seconds.
  const themeBuf = useRef<{ theme: string; t: number }[]>([]);
  useEffect(() => {
    if (!theme) return;
    const now = Date.now();
    themeBuf.current = [...themeBuf.current, { theme, t: now }].filter((e) => now - e.t < 2000);
    const seen = new Set(themeBuf.current.map((e) => e.theme));
    if (seen.has("light") && seen.has("dark") && seen.has("phoenix")) {
      unlock("theme-cycler");
    }
  }, [theme, unlock]);

  // Devtools-open detection — heuristic, harmless console-log only.
  useEffect(() => {
    const fired = { current: false };
    const check = () => {
      if (fired.current) return;
      const wDiff = window.outerWidth - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      // Threshold tuned so normal window chrome doesn't trigger.
      if (wDiff > 220 || hDiff > 220) {
        fired.current = true;
        unlock("devtools-open");
        console.log(
          "%cDevtools spotted. Respect. 🜂",
          "color:#22d3ee;font-family:ui-monospace,monospace;font-size:12px;",
        );
      }
    };
    const id = window.setInterval(check, 1500);
    check();
    return () => window.clearInterval(id);
  }, [unlock]);

  return showFlight ? <PhoenixFlight onDone={() => setShowFlight(false)} /> : null;
}
