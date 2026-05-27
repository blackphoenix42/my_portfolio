"use client";

import { useReducedMotion } from "framer-motion";
import { TECH_ICONS, TechIcon, type TechName } from "@/components/logos/tech-icons";

const LOGOS: TechName[] = [
  "C++",
  "Python",
  "TypeScript",
  "Go",
  "Next.js",
  "React",
  "Tailwind CSS",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Docker",
  "AWS",
  "GCP",
  "Linux",
  "Git",
  "GitHub",
];

const ICONS = LOGOS.filter((l) => l in TECH_ICONS) as TechName[];

export function TechMarquee() {
  const reduce = useReducedMotion();
  const row = (
    <div className="flex shrink-0 items-center gap-10 px-5">
      {ICONS.map((name) => (
        <div
          key={name}
          className="group text-fg-muted hover:text-fg flex items-center gap-2 transition-colors"
          title={name}
        >
          <TechIcon name={name} className="h-7 w-7" />
          <span className="font-mono text-xs tracking-wider uppercase opacity-70 group-hover:opacity-100">
            {name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Technologies"
      className="border-line/60 bg-bg-elev/30 relative overflow-hidden border-y py-8"
    >
      <div className="from-bg pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
      <div className="from-bg pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />
      <div
        className={reduce ? "flex flex-wrap justify-center gap-y-4" : "marquee-track flex w-max"}
      >
        {row}
        {!reduce && row}
      </div>
    </section>
  );
}
