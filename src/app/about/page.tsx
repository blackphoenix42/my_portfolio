import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { otherAchievements } from "@/content/achievements";
import { Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ayush Yadav — engineer focused on performance, AI tooling and interactive products.",
};

export default function AboutPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ about</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">About</h1>
      </header>
      <AboutSection />

      <section className="section border-t border-border/60" aria-label="Awards and recognition">
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <Award className="h-3.5 w-3.5" /> / awards &amp; recognition
            </p>
            <h2 className="section-title mt-2">Beyond the day job</h2>
            <p className="mt-2 max-w-2xl text-fg-muted">
              Grants, recognition, certifications and community work that complement my engineering
              practice.
            </p>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherAchievements.map((o) => (
              <li key={o.title} className="card p-5">
                <div className="text-sm font-semibold text-fg">{o.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-fg-muted">{o.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
