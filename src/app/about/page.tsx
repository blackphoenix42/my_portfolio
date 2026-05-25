import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { otherAchievements } from "@/content/achievements";
import { Award, Coins, Trophy, GraduationCap, Users, BookOpen, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ayush Yadav — engineer focused on performance, AI tooling and interactive products.",
};

const ICONS = [Coins, Trophy, GraduationCap, Users, BookOpen, BadgeCheck];
const ACCENTS = [
  "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
  "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
  "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
  "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
  "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
  "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
];

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
              Grants, awards, certifications and community work that complement my engineering
              practice — across blockchain, competitive programming, academics and teaching.
            </p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherAchievements.map((o, i) => {
              const Icon = ICONS[i % ICONS.length]!;
              const accent = ACCENTS[i % ACCENTS.length]!;
              return (
                <li key={o.title} className="card card-hover group relative overflow-hidden p-5">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-fg">{o.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">{o.detail}</p>
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-accent-cyan/0 to-accent-violet/0 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
