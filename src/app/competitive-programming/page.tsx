import type { Metadata } from "next";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { ConceptLabs } from "@/components/concept-labs";
import { RoadmapDiagram } from "@/components/diagrams/roadmap-diagram";

export const metadata: Metadata = {
  title: "Craft · Competitive Programming & Roadmap",
  description:
    "Years of competitive programming across CodeChef, Codeforces, LeetCode and HackerRank — plus the engineering roadmap of what I'm building next.",
};

export const revalidate = 3600;

export default function CPPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ craft</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">
          Competitive programming
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Sustained problem-solving across the major platforms — sharpening data structures,
          algorithms and the kind of disciplined thinking that pays off in performance engineering.
        </p>
      </header>
      <CPCommandCenter />
      <section className="section border-t border-border/60" aria-label="Engineering roadmap">
        <div className="container-tight">
          <header className="mb-6">
            <p className="mono-label">/ roadmap</p>
            <h2 className="section-title mt-2">What I&apos;m building next</h2>
            <p className="mt-2 max-w-2xl text-fg-muted">
              Product concepts under active design — the next set of systems I&apos;d love to ship.
            </p>
          </header>
          <RoadmapDiagram />
        </div>
      </section>
      <ConceptLabs />
    </div>
  );
}
