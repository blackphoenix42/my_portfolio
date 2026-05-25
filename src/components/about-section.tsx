import Link from "next/link";
import { ArrowRight, Mail, Github, Linkedin } from "lucide-react";
import { SITE } from "@/content/profile";

const philosophy = [
  "Measure before optimizing",
  "Build tools engineers trust",
  "Complexity made observable",
  "Performance is a product feature",
];

export function AboutSection() {
  return (
    <section className="section" aria-label="About">
      <div className="container-tight grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="mono-label">/ about</p>
          <h2 className="section-title mt-2">A brief introduction</h2>
          <div className="mt-5 space-y-4 text-fg-muted">
            <p>
              I'm <span className="font-medium text-fg">Ayush Yadav</span>, an engineer focused on
              building faster systems and more intelligent developer workflows. At {SITE.company}, I
              work at the intersection of low-level performance optimization, simulation technology
              and AI-assisted analysis.
            </p>
            <p>
              Beyond professional engineering, I enjoy transforming complex ideas into interactive
              products — from algorithm visualization platforms to full-stack applications and
              competitive-programming solutions.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {philosophy.map((p) => (
              <li key={p} className="chip border-accent-cyan/30 text-fg">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <aside className="lg:col-span-5">
          <div className="card p-6">
            <p className="mono-label">Engineering principles in motion</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
                <span className="text-fg-muted">
                  <span className="font-medium text-fg">Profile first.</span> Optimization without
                  measurement is folklore.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-violet" />
                <span className="text-fg-muted">
                  <span className="font-medium text-fg">Reduce the gap</span> between intent and
                  observability.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-emerald" />
                <span className="text-fg-muted">
                  <span className="font-medium text-fg">Design for trust:</span> deterministic,
                  accessible, well-tested.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber" />
                <span className="text-fg-muted">
                  <span className="font-medium text-fg">Treat performance</span> as a first-class
                  product feature.
                </span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/contact" className="btn-primary text-xs">
                Get in touch <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href={`mailto:${SITE.email}`} className="btn-ghost text-xs">
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
              <a href={SITE.github} className="btn-ghost text-xs">
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
              <a href={SITE.linkedin} className="btn-ghost text-xs">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
