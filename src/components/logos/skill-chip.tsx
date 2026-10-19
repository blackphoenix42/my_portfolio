import { SkillMark, hasBrandSkillIcon } from "@/components/logos/skill-mark";
import { getTechBrandColor, techBrandNeedsDarkTile } from "@/components/logos/tech-brand-colors";
import { cn } from "@/lib/utils";

type Accent = "cyan" | "violet" | "emerald" | "amber";

const accentTint: Record<Accent, string> = {
  cyan: "text-accent-cyan",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
  amber: "text-accent-amber",
};

/**
 * Recruiter-scannable skill pill: brand-colored tech mark (when known) + label.
 * Brand logos keep their official colors — not recolored by cluster accent.
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
  const brandColor = brand ? getTechBrandColor(name) : undefined;
  const darkTile = brand && techBrandNeedsDarkTile(name);

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
          "inline-grid h-7 w-7 place-items-center rounded-md ring-1",
          brand
            ? darkTile
              ? "bg-black/90 ring-white/10"
              : "bg-bg-sunken ring-border/80"
            : cn("bg-bg-sunken ring-border/60", accentTint[accent]),
        )}
        style={brandColor ? { color: brandColor } : undefined}
      >
        <SkillMark name={name} className="h-4 w-4" />
      </span>
      {name}
    </span>
  );
}
