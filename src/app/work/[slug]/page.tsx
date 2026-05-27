import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { XmaiArchitecture } from "@/components/diagrams/xmai-architecture";
import { AlgoLensDemo } from "@/components/projects/algolens-demo";
import { XceliumDemo } from "@/components/projects/xcelium-demo";
import { TezosBracketDemo } from "@/components/projects/tezos-bracket-demo";
import { PostureDemo } from "@/components/projects/posture-demo";
import { XmaiPipelineDemo } from "@/components/projects/xmai-demo";
import { TrackPersonDemo } from "@/components/projects/track-person-demo";
import { SmartBrainDemo } from "@/components/projects/smart-brain-demo";
import { SkillChip } from "@/components/logos/skill-chip";

const DEMOS: Record<string, { title: string; subtitle: string; render: () => React.ReactElement }> =
  {
    xmai: {
      title: "Interactive demo",
      subtitle: "Try a prompt against the simulated retrieve → embed → agent pipeline.",
      render: () => <XmaiPipelineDemo />,
    },
    algolens: {
      title: "Interactive demo",
      subtitle: "A miniature visualizer of the AlgoLens execution model.",
      render: () => <AlgoLensDemo />,
    },
    "xcelium-optimization": {
      title: "Interactive demo",
      subtitle: "Drag the slider to see profiles compress as RTL/runtime optimizations land.",
      render: () => <XceliumDemo />,
    },
    "tezos-premier-league": {
      title: "Interactive demo",
      subtitle: "Click play to simulate a deterministic on-chain PvP bracket.",
      render: () => <TezosBracketDemo />,
    },
    postureiq: {
      title: "Interactive demo",
      subtitle: "Live-simulated rep quality with confidence gating.",
      render: () => <PostureDemo />,
    },
    "track-person-app": {
      title: "Interactive demo",
      subtitle: "Animated waypoint route on a stylized map — play / pause / reset.",
      render: () => <TrackPersonDemo />,
    },
    "smart-brain": {
      title: "Interactive demo",
      subtitle: "Try different scenes; the simulated detector reveals bounding boxes & confidence.",
      render: () => <SmartBrainDemo />,
    },
  };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    openGraph: { title: p.title, description: p.tagline },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="container-tight py-16">
      <Link
        href="/work"
        className="text-fg-muted hover:text-fg inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All work
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="mono-label">{project.category}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{project.title}</h1>
        <p className="text-fg-muted mt-4 text-lg">{project.tagline}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {project.impact.map((m) => (
          <div key={m.label} className="card p-4">
            <div className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase">
              {m.label}
            </div>
            <div className="text-fg mt-2 text-xl font-semibold">{m.value}</div>
          </div>
        ))}
      </section>

      {project.slug === "xmai" && (
        <section className="mt-12">
          <h2 className="section-title">Architecture</h2>
          <p className="text-fg-subtle mt-2 text-sm">
            Conceptual architecture based on publicly shareable project information.
          </p>
          <div className="card mt-6 p-6">
            <XmaiArchitecture />
          </div>
        </section>
      )}

      {project.slug !== "xmai" && null /* thumb removed — appears on /work list view */}

      {DEMOS[project.slug] && (
        <section className="mt-12">
          <h2 className="section-title">{DEMOS[project.slug]!.title}</h2>
          <p className="text-fg-muted mt-2 text-sm">{DEMOS[project.slug]!.subtitle}</p>
          <div className="mt-6">{DEMOS[project.slug]!.render()}</div>
        </section>
      )}

      <section className="mt-12 grid gap-10 lg:grid-cols-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Problem</h2>
          <p className="text-fg-muted mt-3">{project.problem}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Technical challenge</h2>
          <p className="text-fg-muted mt-3">{project.challenge}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
          <p className="text-fg-muted mt-3">{project.summary}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Approach &amp; engineering decisions
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {project.approach.map((step, i) => (
            <li key={i} className="card p-4">
              <span className="text-accent-cyan font-mono text-[11px]">Step {i + 1}</span>
              <p className="text-fg-muted mt-2 text-sm">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-base font-semibold tracking-tight">Stack</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s}>
                <SkillChip name={s} accent="cyan" />
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-base font-semibold tracking-tight">Lessons learned</h2>
          <ul className="text-fg-muted mt-3 list-disc space-y-2 pl-4 text-sm">
            <li>
              Profiling-first thinking beats premature abstraction in performance-critical systems.
            </li>
            <li>Agentic AI is most useful when grounded in retrieval and structured tool calls.</li>
            <li>Trustworthy developer tooling earns adoption faster than impressive demos.</li>
          </ul>
        </div>
      </section>

      {project.links && project.links.length > 0 && (
        <section className="mt-10">
          <h2 className="text-base font-semibold tracking-tight">Links</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.links.map((l) => (
              <li key={l.href}>
                <a
                  className="btn-secondary text-sm"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.related && project.related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-base font-semibold tracking-tight">Related work</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.related.map((slug) => {
              const r = getProject(slug);
              if (!r) return null;
              return (
                <li key={slug}>
                  <Link href={`/work/${r.slug}`} className="card card-hover block p-4">
                    <p className="text-fg-subtle font-mono text-[11px]">{r.category}</p>
                    <h3 className="mt-1 font-semibold">{r.title}</h3>
                    <p className="text-fg-muted mt-1 text-sm">{r.tagline}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
