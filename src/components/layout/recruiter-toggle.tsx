"use client";

import { Briefcase, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecruiterMode } from "./recruiter-mode";
import { cn } from "@/lib/utils";

export function RecruiterToggle() {
  const { recruiter, toggle } = useRecruiterMode();
  const [justEnabled, setJustEnabled] = useState(false);

  useEffect(() => {
    if (!justEnabled) return;
    const t = setTimeout(() => setJustEnabled(false), 4200);
    return () => clearTimeout(t);
  }, [justEnabled]);

  const handleClick = () => {
    if (!recruiter) setJustEnabled(true);
    toggle();
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={recruiter}
        title={recruiter ? "Exit recruiter mode" : "Enable recruiter mode"}
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-all",
          recruiter
            ? "border-accent-emerald/60 bg-gradient-to-r from-accent-emerald/15 to-accent-emerald/5 text-accent-emerald shadow-[0_0_0_1px_hsl(var(--accent-emerald)/0.35),0_0_18px_-4px_hsl(var(--accent-emerald)/0.45)]"
            : "border-border text-fg-muted hover:border-accent-emerald/40 hover:text-fg",
        )}
      >
        {recruiter ? (
          <>
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-emerald opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald" />
            </span>
            <Check className="h-3.5 w-3.5" />
            <span className="font-medium">Recruiter</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest sm:inline">
              on
            </span>
          </>
        ) : (
          <>
            <Briefcase className="h-3.5 w-3.5" />
            <span>Recruiter</span>
          </>
        )}
      </button>
      {/* Brief one-time explainer right after enabling. */}
      {justEnabled && recruiter && (
        <div
          role="status"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-accent-emerald/40 bg-bg-elev p-3 text-xs shadow-xl"
        >
          <p className="font-semibold text-accent-emerald">Recruiter mode enabled</p>
          <p className="mt-1.5 leading-relaxed text-fg-muted">
            Optimized for time-pressed reviewers — résumé, contact and impact bubble to the top.
            Preference is saved locally.
          </p>
        </div>
      )}
    </div>
  );
}
