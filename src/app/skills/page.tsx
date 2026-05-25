import type { Metadata } from "next";
import { EngineeringSpectrum } from "@/components/skills/engineering-spectrum";

export const metadata: Metadata = {
  title: "Skills · Engineering Arsenal",
  description:
    "Capability clusters spanning performance, intelligent systems, backend, product and infrastructure.",
};

export default function SkillsPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ skills</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Engineering spectrum</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Capability clusters spanning low-level performance, intelligent systems, distributed
          backends, product engineering, infrastructure and reliability.
        </p>
      </header>
      <EngineeringSpectrum hideHeader />
    </div>
  );
}
