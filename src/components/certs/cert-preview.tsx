"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

export type CertPreviewProps = {
  href: string;
  label: string;
  /** Optional override; otherwise inferred from href extension */
  kind?: "image" | "pdf";
  className?: string;
  /** When true uses a smaller compact layout (for inline-in-experience) */
  compact?: boolean;
};

function isPdf(href: string) {
  return /\.pdf($|\?)/i.test(href);
}

// Hrefs the user has already scrolled past in this SPA session. Combined with
// the immutable Cache-Control on /assets/** (see next.config.mjs), this means
// the second time a card scrolls into view we mount it eagerly and the
// browser cache satisfies the request instantly.
const seenPreviews = new Set<string>();
const SESSION_KEY = "cert-preview-seen-v1";

function loadSessionSeen(): void {
  if (typeof window === "undefined" || seenPreviews.size > 0) return;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (typeof item === "string") seenPreviews.add(item);
      }
    }
  } catch {
    // sessionStorage may be unavailable (private mode, CSP); best-effort.
  }
}

function persistSessionSeen(href: string): void {
  if (typeof window === "undefined") return;
  seenPreviews.add(href);
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify([...seenPreviews]));
  } catch {
    // Quota or unavailable — ignore.
  }
}

export function CertPreview({ href, label, kind, className, compact = false }: CertPreviewProps) {
  const resolved = kind ?? (isPdf(href) ? "pdf" : "image");
  const height = compact ? "h-32" : "h-44";
  const ref = useRef<HTMLAnchorElement | null>(null);

  // Defer the heavy <Image>/<object> render until the card scrolls near the
  // viewport, so the initial paint of the about page stays cheap. Eager-mount
  // on second visit (session cache) — the HTTP cache makes it free.
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    loadSessionSeen();
    if (seenPreviews.has(href)) {
      setMounted(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true);
            persistSessionSeen(href);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [href]);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "group border-border bg-bg-elev/60 hover:border-accent-amber/50 block overflow-hidden rounded-lg border transition-colors " +
        (className ?? "")
      }
      title={`Open ${label} in new tab`}
    >
      <div
        className={`relative ${height} w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent-amber)/0.10),transparent_60%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent-violet)/0.10),transparent_60%)]`}
      >
        {!mounted ? (
          <div className="text-fg-subtle grid h-full w-full place-items-center" aria-hidden="true">
            <FileText className="h-6 w-6 opacity-60" />
          </div>
        ) : resolved === "image" ? (
          <Image
            src={href}
            alt={label}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-contain p-2 transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <>
            <object
              data={`${href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              className="pointer-events-none h-full w-full"
              aria-label={label}
            >
              <div className="text-fg-subtle grid h-full w-full place-items-center">
                <FileText className="h-8 w-8" />
              </div>
            </object>
            <span className="from-bg/40 text-fg-subtle pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b to-transparent px-2 py-1 font-mono text-[10px] tracking-wider uppercase">
              pdf
            </span>
          </>
        )}
        <span className="bg-bg/85 text-fg-muted pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span className="line-clamp-1">{label}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </span>
      </div>
      {!compact && (
        <div className="border-border/60 flex items-center justify-between gap-2 border-t px-3 py-2">
          <span className="text-fg line-clamp-1 text-xs font-medium">{label}</span>
          <FileText className="text-fg-subtle h-3.5 w-3.5 shrink-0" />
        </div>
      )}
    </a>
  );
}
