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
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Engineering arsenal</h1>
      </header>
      <EngineeringSpectrum />
    </div>
  );
}
