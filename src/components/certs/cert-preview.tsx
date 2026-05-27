"use client";

import Image from "next/image";
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

export function CertPreview({ href, label, kind, className, compact = false }: CertPreviewProps) {
  const resolved = kind ?? (isPdf(href) ? "pdf" : "image");
  const height = compact ? "h-32" : "h-44";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "group block overflow-hidden rounded-lg border border-border bg-bg-elev/60 transition-colors hover:border-accent-amber/50 " +
        (className ?? "")
      }
      title={`Open ${label} in new tab`}
    >
      <div
        className={`relative ${height} w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent-amber)/0.10),transparent_60%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent-violet)/0.10),transparent_60%)]`}
      >
        {resolved === "image" ? (
          <Image
            src={href}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-contain p-2 transition-transform group-hover:scale-[1.02]"
            unoptimized
          />
        ) : (
          <>
            <object
              data={`${href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              className="pointer-events-none h-full w-full"
              aria-label={label}
            >
              <div className="grid h-full w-full place-items-center text-fg-subtle">
                <FileText className="h-8 w-8" />
              </div>
            </object>
            <span className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-bg/40 to-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              pdf
            </span>
          </>
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-bg/85 px-2.5 py-1.5 text-xs text-fg-muted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <span className="line-clamp-1">{label}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </span>
      </div>
      {!compact && (
        <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2">
          <span className="line-clamp-1 text-xs font-medium text-fg">{label}</span>
          <FileText className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
        </div>
      )}
    </a>
  );
}
