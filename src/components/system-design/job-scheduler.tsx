"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Pause, Play, Plus } from "lucide-react";

type Job = { id: number; stage: "queued" | "running" | "done" | "failed" };

const WORKERS = 2;
const FAIL_RATE = 0.2;

export function JobSchedulerWhiteboard() {
  const t = useTranslations("systemDesign.jobScheduler");
  const reduce = useReducedMotion();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [running, setRunning] = useState(true);
  const nextId = useRef(1);

  const enqueue = useCallback(() => {
    setJobs((prev) => [...prev, { id: nextId.current++, stage: "queued" as const }].slice(-24));
  }, []);

  // Seed a few jobs on mount.
  useEffect(() => {
    setJobs(Array.from({ length: 4 }, () => ({ id: nextId.current++, stage: "queued" as const })));
  }, []);

  // Tick: pull queued jobs into free worker slots, then complete running ones.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setJobs((prev) => {
        const next = prev.map((j) => ({ ...j }));
        // Complete currently running jobs.
        for (const j of next) {
          if (j.stage === "running") {
            j.stage = Math.random() < FAIL_RATE ? "failed" : "done";
          }
        }
        // Fill free worker slots from the queue.
        const runningCount = next.filter((j) => j.stage === "running").length;
        let free = WORKERS - runningCount;
        for (const j of next) {
          if (free <= 0) break;
          if (j.stage === "queued") {
            j.stage = "running";
            free--;
          }
        }
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [running]);

  const lane = (stage: Job["stage"]) => jobs.filter((j) => j.stage === stage);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={enqueue} className="btn-primary text-sm">
          <Plus className="h-3.5 w-3.5" /> {t("enqueue")}
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="btn-secondary text-sm"
          aria-pressed={running}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? t("pause") : t("resume")}
        </button>
        <span className="text-fg-subtle font-mono text-xs">{t("workers", { count: WORKERS })}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Lane title={t("queued")} accent="cyan" jobs={lane("queued")} reduce={reduce} />
        <Lane title={t("running")} accent="amber" jobs={lane("running")} reduce={reduce} />
        <Lane title={t("done")} accent="emerald" jobs={lane("done")} reduce={reduce} />
        <Lane title={t("failed")} accent="violet" jobs={lane("failed")} reduce={reduce} />
      </div>
      <p className="text-fg-subtle font-mono text-[11px]">{t("retryNote")}</p>
    </div>
  );
}

const ACCENTS: Record<string, string> = {
  cyan: "border-accent-cyan/40 text-accent-cyan",
  amber: "border-accent-amber/40 text-accent-amber",
  emerald: "border-accent-emerald/40 text-accent-emerald",
  violet: "border-accent-violet/40 text-accent-violet",
};

function Lane({
  title,
  accent,
  jobs,
  reduce,
}: {
  title: string;
  accent: string;
  jobs: Job[];
  reduce: boolean | null;
}) {
  return (
    <div className="border-border bg-bg-sunken/40 min-h-32 rounded-lg border p-3">
      <p className={`mb-2 font-mono text-[10px] tracking-widest uppercase ${ACCENTS[accent]}`}>
        {title} · {jobs.length}
      </p>
      <ul className="space-y-1.5">
        <AnimatePresence initial={false}>
          {jobs.map((j) => (
            <motion.li
              key={j.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              className={`bg-bg-elev/70 rounded border px-2 py-1 font-mono text-[11px] ${ACCENTS[accent]}`}
            >
              job #{j.id}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
