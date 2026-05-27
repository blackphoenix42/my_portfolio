import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/brand";
import { SITE } from "@/content/profile";

export function AboutSection() {
  return (
    <section className="section" aria-label="About">
      <div className="container-tight grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="mono-label">/ about</p>
          <h2 className="section-title mt-2">A brief introduction</h2>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <span
                aria-hidden
                className="from-accent-amber/30 via-accent-violet/20 to-accent-cyan/30 absolute -inset-1 rounded-2xl bg-gradient-to-br blur-md"
              />
              <Image
                src="/assets/profile/my_pic.jpg"
                alt="Ayush Yadav"
                width={160}
                height={200}
                className="border-border relative h-40 w-32 rounded-2xl border object-cover shadow-md sm:h-48 sm:w-40"
                priority
              />
            </div>
            <div className="text-fg-muted space-y-4">
              <p>
                I'm <span className="text-fg font-medium">Ayush Yadav</span>, a software engineer
                shipping performance-critical systems and AI-assisted developer tooling at scale. At{" "}
                {SITE.company}, my C++ and runtime work has delivered measurable wins on production
                workloads run by Apple, Google, Samsung and NVIDIA.
              </p>
              <p>
                I care about ownership end-to-end — from low-level profiling and distributed-system
                design to polished, accessible product surfaces. Outside of work I ship open-source
                tools, mentor engineers and stay sharp through competitive programming.
              </p>
            </div>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="card p-6">
            <p className="mono-label">Engineering principles in motion</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="bg-accent-cyan mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="text-fg-muted">
                  <span className="text-fg font-medium">Profile first.</span> Optimization without
                  measurement is folklore.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-accent-violet mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="text-fg-muted">
                  <span className="text-fg font-medium">Reduce the gap</span> between intent and
                  observability.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-accent-emerald mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="text-fg-muted">
                  <span className="text-fg font-medium">Design for trust:</span> deterministic,
                  accessible, well-tested.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-accent-amber mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="text-fg-muted">
                  <span className="text-fg font-medium">Treat performance</span> as a first-class
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
