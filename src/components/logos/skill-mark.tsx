import type { ReactElement } from "react";
import { TECH_ICONS } from "@/components/logos/tech-icons";
import { SKILL_GLYPHS, SkillFallbackGlyph } from "@/components/logos/skill-glyph";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

/**
 * Resolves a skill name to a brand SVG (preferred) or curated Lucide glyph.
 * Used by SkillChip so every surface gets the same mark quality.
 */
export function SkillMark({ name, className }: { name: string; className?: string }) {
  const Brand = (TECH_ICONS as Record<string, (p: IconProps) => ReactElement>)[name];
  if (Brand) return <Brand className={cn("shrink-0", className)} />;

  const Glyph = SKILL_GLYPHS[name];
  if (Glyph) return <Glyph className={cn("shrink-0", className)} strokeWidth={2} aria-hidden />;

  return <SkillFallbackGlyph className={cn("shrink-0", className)} />;
}

export function hasBrandSkillIcon(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(TECH_ICONS, name);
}
