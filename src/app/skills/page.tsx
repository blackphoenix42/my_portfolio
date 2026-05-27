import type { Metadata } from "next";
import { EngineeringSpectrum } from "@/components/skills/engineering-spectrum";
import { SkillsExplorer } from "@/components/skills/skills-explorer";

export const metadata: Metadata = {
  title: "Skills · Engineering Arsenal",
  description:
    "Filterable skills explorer plus capability clusters spanning performance, intelligent systems, backend, product and infrastructure.",
};

export default function SkillsPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ skills</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">Engineering arsenal</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">
          Filter individual skills by category, or scroll down to see the capability clusters and
          how they map onto real projects.
        </p>
      </header>
      <SkillsExplorer />
      <section className="border-border/60 border-t">
        <EngineeringSpectrum hideHeader />
      </section>
    </div>
  );
}
