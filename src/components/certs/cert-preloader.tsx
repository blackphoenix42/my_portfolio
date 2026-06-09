"use client";

import { useEffect } from "react";

/**
 * Warms the browser HTTP cache for every certificate asset shortly after the
 * About page loads, so the heavy PDF/image previews are already cached by the
 * time a card scrolls into view (the previews themselves still lazy-mount via
 * `CertPreview`'s IntersectionObserver). Combined with the immutable
 * `Cache-Control` on `/assets/**` (see `next.config.mjs`), this means the
 * previews load instantly on this and every later visit.
 *
 * Fetches are deferred and staggered so they never compete with the page's
 * own first paint, skipped entirely under Data Saver, and aborted on unmount.
 */
export function CertPreloader({ hrefs }: { hrefs: readonly string[] }) {
  useEffect(() => {
    if (typeof window === "undefined" || hrefs.length === 0) return;

    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const controller = new AbortController();
    const timers: number[] = [];

    const warm = () => {
      hrefs.forEach((href, i) => {
        const id = window.setTimeout(() => {
          // `force-cache` lets a cached response satisfy the request without a
          // network round-trip; misses populate the cache for next time.
          fetch(href, { cache: "force-cache", signal: controller.signal }).catch(() => {
            /* offline / aborted — preloading is best-effort */
          });
        }, i * 150);
        timers.push(id);
      });
    };

    // Let the initial paint settle, then start warming during idle time.
    const ric = (cb: () => void) => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(cb, { timeout: 2500 });
      } else {
        window.setTimeout(cb, 800);
      }
    };
    ric(warm);

    return () => {
      controller.abort();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [hrefs]);

  return null;
}
