import { TECH_ICONS } from "@/components/logos/tech-icons";
import { SKILL_GLYPHS, SkillFallbackGlyph } from "@/components/logos/skill-glyph";
import { cn } from "@/lib/utils";

type Accent = "cyan" | "violet" | "emerald" | "amber";

const accentTile: Record<Accent, string> = {
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/40",
  violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/40",
  emerald: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/40",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/40",
};

export function SkillChip({
  name,
  accent = "cyan",
  className,
}: {
  name: string;
  accent?: Accent;
  className?: string;
}) {
  const Icon = (TECH_ICONS as Record<string, (p: { className?: string }) => React.ReactElement>)[
    name
  ];
  const Glyph = SKILL_GLYPHS[name];
  return (
    <span className={cn("chip gap-1.5", className)}>
      <span
        aria-hidden
        className={cn(
          "inline-grid h-4 w-4 place-items-center rounded-sm border",
          accentTile[accent],
        )}
      >
        {Icon ? (
          <Icon className="h-2.5 w-2.5" />
        ) : Glyph ? (
          <Glyph className="h-2.5 w-2.5" strokeWidth={2.2} />
        ) : (
          <SkillFallbackGlyph className="h-2.5 w-2.5" />
        )}
      </span>
      {name}
    </span>
  );
}
