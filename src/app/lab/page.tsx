import type { Metadata } from "next";
import { ConceptLabs } from "@/components/concept-labs";
import { RoadmapDiagram } from "@/components/diagrams/roadmap-diagram";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Upcoming product concepts and engineering experiments under active design.",
};

export default function LabPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ roadmap</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Roadmap</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Product concepts I&apos;m actively designing and prototyping — the next set of systems
          I&apos;d love to ship. Each ships with a placeholder repo until first commit.
        </p>
      </header>
      <div className="container-tight mt-10">
        <RoadmapDiagram />
      </div>
      <ConceptLabs />
    </div>
  );
}
