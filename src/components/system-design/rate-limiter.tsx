"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";

const CAPACITY = 5;
const REFILL_MS = 1500; // one token every 1.5s

type LogEntry = { id: number; ok: boolean };

export function RateLimiterWhiteboard() {
  const t = useTranslations("systemDesign.rateLimiter");
  const reduce = useReducedMotion();
  const [tokens, setTokens] = useState(CAPACITY);
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextId = useRef(0);

  // Refill the bucket over time (token-bucket algorithm).
  useEffect(() => {
    const id = setInterval(() => {
      setTokens((tk) => Math.min(CAPACITY, tk + 1));
    }, REFILL_MS);
    return () => clearInterval(id);
  }, []);

  const send = () => {
    setTokens((tk) => {
      const ok = tk > 0;
      setLog((prev) => [{ id: nextId.current++, ok }, ...prev].slice(0, 8));
      return ok ? tk - 1 : tk;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={send} className="btn-primary text-sm">
          {t("sendRequest")}
        </button>
        <span className="text-fg-subtle font-mono text-xs">
          {t("refillNote", { ms: REFILL_MS })}
        </span>
      </div>

      <div>
        <p className="text-fg-subtle mb-2 font-mono text-[11px] tracking-widest uppercase">
          {t("bucket", { count: tokens, capacity: CAPACITY })}
        </p>
        <div className="flex gap-2" aria-hidden>
          {Array.from({ length: CAPACITY }).map((_, i) => {
            const filled = i < tokens;
            return (
              <motion.div
                key={i}
                animate={
                  reduce ? undefined : { scale: filled ? 1 : 0.85, opacity: filled ? 1 : 0.3 }
                }
                className={
                  filled
                    ? "border-accent-emerald/60 bg-accent-emerald/20 h-10 w-10 rounded-md border"
                    : "border-border bg-bg-sunken/60 h-10 w-10 rounded-md border"
                }
              />
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-fg-subtle mb-2 font-mono text-[11px] tracking-widest uppercase">
          {t("recent")}
        </p>
        <ul className="flex flex-wrap gap-2">
          {log.length === 0 && <li className="text-fg-subtle text-xs">{t("empty")}</li>}
          {log.map((e) => (
            <motion.li
              key={e.id}
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                e.ok
                  ? "text-accent-emerald border-accent-emerald/40 bg-accent-emerald/10 inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[11px]"
                  : "text-accent-amber border-accent-amber/40 bg-accent-amber/10 inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[11px]"
              }
            >
              {e.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {e.ok ? "200" : "429"}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
