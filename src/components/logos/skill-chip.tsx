import { SkillMark, hasBrandSkillIcon } from "@/components/logos/skill-mark";
import { cn } from "@/lib/utils";

type Accent = "cyan" | "violet" | "emerald" | "amber";

const accentRing: Record<Accent, string> = {
  cyan: "ring-accent-cyan/30",
  violet: "ring-accent-violet/30",
  emerald: "ring-accent-emerald/30",
  amber: "ring-accent-amber/30",
};

const accentTint: Record<Accent, string> = {
  cyan: "text-accent-cyan",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
  amber: "text-accent-amber",
};

/**
 * Recruiter-scannable skill pill: larger brand/tech mark + label.
 * Brand SVGs stay near-neutral; Lucide glyphs pick up the cluster accent.
 */
export function SkillChip({
  name,
  accent = "cyan",
  className,
}: {
  name: string;
  accent?: Accent;
  className?: string;
}) {
  const brand = hasBrandSkillIcon(name);
  return (
    <span
      className={cn(
        "border-border bg-bg-elev/90 text-fg inline-flex items-center gap-2 rounded-lg border py-1 pr-2.5 pl-1 text-xs font-medium",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "bg-bg-sunken inline-grid h-7 w-7 place-items-center rounded-md ring-1",
          accentRing[accent],
          brand ? "text-fg" : accentTint[accent],
        )}
      >
        <SkillMark name={name} className="h-4 w-4" />
      </span>
      {name}
    </span>
  );
}
