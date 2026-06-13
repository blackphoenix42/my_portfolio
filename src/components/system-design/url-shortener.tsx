"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Database, Globe, Server, Zap } from "lucide-react";

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function base62(n: number): string {
  if (n === 0) return "0";
  let s = "";
  let x = n;
  while (x > 0) {
    s = BASE62.charAt(x % 62) + s;
    x = Math.floor(x / 62);
  }
  return s;
}

// Small deterministic hash → 7-char Base62 code. Illustrative only.
function shortCode(url: string): string {
  let h = 2166136261;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const code = base62(Math.abs(h));
  return (code + "0000000").slice(0, 7);
}

export function UrlShortenerWhiteboard() {
  const t = useTranslations("systemDesign.urlShortener");
  const reduce = useReducedMotion();
  const [url, setUrl] = useState("https://example.com/articles/distributed-systems/consistency");
  const [mode, setMode] = useState<"write" | "read">("write");
  const code = shortCode(url.trim() || "https://example.com");

  const steps =
    mode === "write"
      ? [
          { icon: Globe, label: t("client") },
          { icon: Server, label: t("api") },
          { icon: Zap, label: t("keygen") },
          { icon: Database, label: t("store") },
        ]
      : [
          { icon: Globe, label: t("client") },
          { icon: Server, label: t("api") },
          { icon: Zap, label: t("cache") },
          { icon: Globe, label: t("redirect") },
        ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <ModeButton
          active={mode === "write"}
          onClick={() => setMode("write")}
          label={t("writePath")}
        />
        <ModeButton
          active={mode === "read"}
          onClick={() => setMode("read")}
          label={t("readPath")}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase">
          {t("longUrl")}
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label={t("longUrl")}
          className="border-border bg-bg-sunken/60 text-fg focus:border-accent-cyan/60 w-full rounded-md border px-3 py-2 font-mono text-xs outline-none"
          spellCheck={false}
        />
        <div className="text-fg-muted flex flex-wrap items-center gap-2 text-sm">
          <span className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase">
            {t("shortUrl")}
          </span>
          <code className="text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10 rounded border px-2 py-1 font-mono text-xs">
            sho.rt/{code}
          </code>
        </div>
      </div>

      <div
        className="border-border bg-bg-sunken/40 grid grid-cols-2 gap-3 rounded-lg border p-4 sm:grid-cols-4"
        aria-label={mode === "write" ? t("writePath") : t("readPath")}
      >
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={`${mode}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.12 }}
              className="border-border bg-bg-elev/70 relative flex flex-col items-center gap-2 rounded-md border p-3 text-center"
            >
              <Icon className="text-accent-cyan h-5 w-5" />
              <span className="text-fg-muted text-xs">{s.label}</span>
              {i < steps.length - 1 && (
                <ArrowRight className="text-fg-subtle absolute top-1/2 -right-3.5 hidden h-3.5 w-3.5 -translate-y-1/2 sm:block" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan rounded-full border px-3 py-1 font-mono text-[11px]"
          : "border-border text-fg-muted hover:text-fg rounded-full border px-3 py-1 font-mono text-[11px]"
      }
    >
      {label}
    </button>
  );
}
