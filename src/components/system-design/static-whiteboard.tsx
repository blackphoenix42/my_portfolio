"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getSystemDesign } from "@/content/system-design";

// Step-through architecture explorer for the reference pipelines.
export function StaticWhiteboard({ slug }: { slug: string }) {
  const t = useTranslations("systemDesign");
  const [step, setStep] = useState(0);
  const item = getSystemDesign(slug);
  if (!item) return null;
  return (
    <div className="space-y-4">
      <p className="text-fg-muted text-sm">
        {t("pipelineStep", { current: step + 1, total: item.components.length })}
      </p>
      <div className="border-border bg-bg-sunken/40 flex flex-wrap items-center gap-2 rounded-lg border p-4">
        {item.components.map((c, i) => (
          <div key={c.name} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-pressed={step === i}
              className={`rounded-md border px-3 py-2 text-center font-mono text-[11px] ${step === i ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan" : "border-border bg-bg-elev/70 text-fg-muted"}`}
            >
              {t(`systems.${slug}.components.${i}.name` as never)}
            </button>
            {i < item.components.length - 1 && (
              <ArrowRight className="text-fg-subtle h-3.5 w-3.5" />
            )}
          </div>
        ))}
      </div>
      <p role="status" className="text-fg-muted text-sm">
        {t(`systems.${slug}.components.${step}.role` as never)}
      </p>
      <button
        type="button"
        className="btn-secondary text-xs"
        onClick={() => setStep((s) => (s + 1) % item.components.length)}
      >
        {t(step === item.components.length - 1 ? "restart" : "nextStep")}
      </button>
    </div>
  );
}
