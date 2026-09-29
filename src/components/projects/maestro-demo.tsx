"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Pause, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "defect" | "enhancement";
type Status = "idle" | "running" | "gate" | "done";
// Log entries store translation keys (placeholder values too), so the log
// re-renders in the active locale.
type LogEntry = { key: string; values?: Record<string, string> };

const STAGES = [
  { id: "intake", phases: "P0–5", gate: false },
  { id: "rca", phases: "P6", gate: true },
  { id: "fix", phases: "P7", gate: true },
  { id: "validate", phases: "P8", gate: true },
  { id: "review", phases: "P9–10", gate: true },
  { id: "regress", phases: "P11–12", gate: false },
  { id: "release", phases: "P13–19", gate: true },
] as const;

const RCA_INDEX = 1;
const VALIDATE_INDEX = 3;
const STEP_MS = 900;

export function MaestroDemo() {
  const t = useTranslations("demos.maestro");
  const [kind, setKind] = useState<Kind>("defect");
  const [failOnce, setFailOnce] = useState(true);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [looped, setLooped] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement | null>(null);

  const stageKey = (id: string) => (id === "rca" && kind === "enhancement" ? "design" : id);
  const push = (entry: LogEntry) => setLog((l) => [...l.slice(-39), entry]);

  const advance = () => {
    if (index >= STAGES.length - 1) {
      push({ key: "log.done" });
      setStatus("done");
      return;
    }
    setIndex((i) => i + 1);
    setStatus("running");
  };

  const reset = () => {
    setIndex(0);
    setStatus("idle");
    setLooped(false);
    setLog([]);
  };

  const start = () => {
    setIndex(0);
    setLooped(false);
    setLog([{ key: "log.start", values: { kind } }]);
    setStatus("running");
  };

  useEffect(() => {
    if (status !== "running") return;
    const id = setTimeout(() => {
      const stage = STAGES[index];
      if (!stage) return;
      if (index === VALIDATE_INDEX && failOnce && !looped) {
        push({ key: "log.validateFail", values: { stage: `stages.${stageKey("rca")}` } });
        setLooped(true);
        setIndex(RCA_INDEX);
        return;
      }
      push({ key: `log.${stageKey(stage.id)}` });
      if (stage.gate) {
        push({ key: "log.gate" });
        setStatus("gate");
        return;
      }
      advance();
    }, STEP_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, index]);

  // Scroll only the log panel; scrollIntoView would also drag the page back to the demo.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const format = (e: LogEntry) =>
    t(e.key, e.values && Object.fromEntries(Object.entries(e.values).map(([k, v]) => [k, t(v)])));

  const onPrimary = () => {
    if (status === "gate") {
      push({ key: "log.approved" });
      advance();
    } else if (status === "running") {
      setStatus("idle");
    } else if (status === "done" || log.length === 0) {
      start();
    } else {
      setStatus("running");
    }
  };

  const started = log.length > 0;

  return (
    <div className="card overflow-hidden">
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span>{t("title")}</span>
        <span>{t("subtitle")}</span>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_240px]">
        <div className="space-y-4">
          <ol
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7"
            aria-label={t("stagesLabel")}
          >
            {STAGES.map((s, i) => {
              const done = i < index || status === "done";
              const active = started && i === index && status !== "done";
              return (
                <li
                  key={s.id}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "relative rounded-md border p-2 font-mono text-[11px] transition-colors",
                    done && "border-accent-emerald/40 bg-accent-emerald/5 text-fg",
                    active &&
                      status === "gate" &&
                      "border-accent-amber/60 bg-accent-amber/10 text-fg",
                    active &&
                      status !== "gate" &&
                      "border-accent-cyan/50 bg-accent-cyan/5 text-fg motion-safe:animate-pulse",
                    !done && !active && "border-border text-fg-subtle",
                  )}
                >
                  <span className="block truncate pr-3">{t(`stages.${stageKey(s.id)}`)}</span>
                  <span className="text-fg-subtle block text-[10px]">{s.phases}</span>
                  {s.gate && (
                    <>
                      <ShieldCheck
                        className="text-accent-amber absolute top-1.5 right-1.5 h-3 w-3"
                        aria-hidden
                      />
                      <span className="sr-only">{t("gateMarker")}</span>
                    </>
                  )}
                  {done && (
                    <Check
                      className="text-accent-emerald absolute right-1.5 bottom-1.5 h-3 w-3"
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <div
            ref={logRef}
            className="border-border bg-bg-sunken/40 max-h-56 min-h-44 overflow-y-auto rounded-md border p-3"
          >
            <p className="text-fg-subtle mb-2 font-mono text-[10px] tracking-widest uppercase">
              {t("docLabel")}
            </p>
            {started ? (
              <ol className="space-y-1 font-mono text-xs" aria-live="polite">
                {log.map((e, i) => (
                  <li
                    key={i}
                    className={cn(
                      "text-fg-muted",
                      e.key === "log.gate" && "text-accent-amber",
                      e.key === "log.validateFail" && "text-accent-violet",
                      e.key === "log.done" && "text-accent-emerald",
                    )}
                  >
                    <span className="text-accent-cyan">›</span> {format(e)}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-fg-muted text-sm">{t("empty")}</p>
            )}
          </div>
          <p className="text-fg-subtle text-[11px]">{t("note")}</p>
        </div>

        <div className="space-y-4">
          <fieldset disabled={started && status !== "done"} className="space-y-2">
            <legend className="text-fg-subtle mb-1 font-mono text-[10px] tracking-widest uppercase">
              {t("kindLabel")}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(["defect", "enhancement"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-xs transition-colors disabled:opacity-60",
                    kind === k
                      ? "border-accent-cyan/50 bg-accent-cyan/5 text-fg"
                      : "border-border text-fg-muted hover:text-fg",
                  )}
                >
                  {t(k)}
                </button>
              ))}
            </div>
            <label className="text-fg-muted flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={failOnce}
                onChange={(e) => setFailOnce(e.target.checked)}
                className="accent-accent-violet"
              />
              {t("failOnce")}
            </label>
          </fieldset>

          <div className="space-y-2">
            <button type="button" onClick={onPrimary} className="btn-primary w-full text-sm">
              {status === "gate" ? (
                <>
                  <ShieldCheck className="h-4 w-4" aria-hidden /> {t("approve")}
                </>
              ) : status === "running" ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden /> {t("pause")}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden />{" "}
                  {status === "done" ? t("again") : started ? t("resume") : t("run")}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              className="btn-secondary w-full text-sm"
              disabled={!started}
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> {t("reset")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
