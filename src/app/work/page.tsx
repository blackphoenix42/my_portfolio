import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Work · Case Studies",
  description:
    "Selected case studies across performance engineering, agentic AI, developer tooling and product engineering.",
};

export default function WorkIndexPage() {
  return (
    <div className="container-tight py-20">
      <header className="mb-10 max-w-2xl">
        <p className="mono-label">/ work</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Case studies</h1>
        <p className="mt-3 text-fg-muted">
          Deep-dives into selected engineering work — problem framing, technical decisions,
          trade-offs and measurable impact.
        </p>
      </header>
      <ul className="grid gap-4">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              className="card card-hover group flex items-start justify-between gap-6 p-6"
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-fg-subtle">{p.category}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{p.title}</h2>
                <p className="mt-2 max-w-2xl text-sm text-fg-muted">{p.tagline}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 8).map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-fg-subtle transition-colors group-hover:text-accent-cyan" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
