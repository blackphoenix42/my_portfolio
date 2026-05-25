import type { Metadata } from "next";
import { CareerTimeline } from "@/components/experience/career-timeline";
import { education } from "@/content/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Engineering experience and education timeline.",
};

export default function ExperiencePage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ experience</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Experience</h1>
      </header>
      <CareerTimeline />
      <section className="container-tight pb-20">
        <h2 className="section-title">Education</h2>
        <div className="card mt-6 p-6">
          <p className="font-mono text-xs text-accent-cyan">
            {education.start} — {education.end}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{education.school}</h3>
          <p className="mt-1 text-fg-muted">{education.degree}</p>
          <p className="mt-1 font-mono text-xs text-fg-subtle">CGPA: {education.cgpa}</p>
        </div>
      </section>
    </div>
  );
}
