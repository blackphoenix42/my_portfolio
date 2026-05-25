import type { Metadata } from "next";
import { ConceptLabs } from "@/components/concept-labs";

export const metadata: Metadata = {
  title: "Concept Lab",
  description: "Experimental product concepts demonstrating design and engineering thinking.",
};

export default function LabPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ lab</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Concept lab</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Product concepts I'd love to build next — clearly labeled as experiments, not shipped
          systems.
        </p>
      </header>
      <ConceptLabs />
    </div>
  );
}
