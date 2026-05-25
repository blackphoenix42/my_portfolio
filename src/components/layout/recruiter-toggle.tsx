"use client";

import { Briefcase } from "lucide-react";
import { useRecruiterMode } from "./recruiter-mode";
import { cn } from "@/lib/utils";

export function RecruiterToggle() {
  const { recruiter, toggle } = useRecruiterMode();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={recruiter}
      title="Toggle Recruiter Mode"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
        recruiter
          ? "border-accent-emerald/50 bg-accent-emerald/10 text-accent-emerald shadow-[0_0_0_1px_hsl(var(--accent-emerald)/0.25)]"
          : "border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg",
      )}
    >
      <Briefcase className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Recruiter</span>
      {recruiter && (
        <span className="hidden sm:inline" aria-hidden>
          · ON
        </span>
      )}
    </button>
  );
}
