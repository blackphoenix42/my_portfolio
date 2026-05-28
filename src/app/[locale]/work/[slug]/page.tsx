import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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

const DEMO_RENDERERS: Record<string, () => React.ReactElement> = {
  xmai: () => <XmaiPipelineDemo />,
  algolens: () => <AlgoLensDemo />,
  "xcelium-optimization": () => <XceliumDemo />,
  "tezos-premier-league": () => <TezosBracketDemo />,
  postureiq: () => <PostureDemo />,
  "track-person-app": () => <TrackPersonDemo />,
  "smart-brain": () => <SmartBrainDemo />,
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
  const tProjects = await getTranslations("projects");
  let title = p.title;
  let description = p.tagline;
  const titleKey = `items.${slug}.title` as const;
  const taglineKey = `items.${slug}.tagline` as const;
  if (tProjects.has(titleKey)) title = tProjects(titleKey);
  if (tProjects.has(taglineKey)) description = tProjects(taglineKey);
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("work");
  const tProjects = await getTranslations("projects");
  const tr = (key: string, fallback: string) => {
    const path = `items.${slug}.${key}` as never;
    return tProjects.has(path) ? (tProjects(path) as string) : fallback;
  };
  const trRelated = (s: string, key: string, fallback: string) => {
    const path = `items.${s}.${key}` as never;
    return tProjects.has(path) ? (tProjects(path) as string) : fallback;
  };
  const demoSubtitle = (s: string): string | null => {
    const path = `demoSubtitle.${s}` as never;
    return t.has(path) ? (t(path) as string) : null;
  };

  const title = tr("title", project.title);
  const tagline = tr("tagline", project.tagline);
  const category = tr("category", project.category);
  const problem = tr("problem", project.problem);
  const challenge = tr("challenge", project.challenge);
  const summary = tr("summary", project.summary);

  return (
    <article className="container-tight py-16">
      <Link
        href="/work"
        className="text-fg-muted hover:text-fg inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("allWork")}
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="mono-label">{category}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{title}</h1>
        <p className="text-fg-muted mt-4 text-lg">{tagline}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
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
          <h2 className="section-title">{t("architectureTitle")}</h2>
          <p className="text-fg-subtle mt-2 text-sm">{t("architectureNote")}</p>
          <div className="card mt-6 p-6">
            <XmaiArchitecture />
          </div>
        </section>
      )}

      {DEMO_RENDERERS[project.slug] && (
        <section className="mt-12">
          <h2 className="section-title">{t("demoTitle")}</h2>
          {demoSubtitle(project.slug) && (
            <p className="text-fg-muted mt-2 text-sm">{demoSubtitle(project.slug)}</p>
          )}
          <div className="mt-6">{DEMO_RENDERERS[project.slug]!()}</div>
        </section>
      )}

      <section className="mt-12 grid gap-10 lg:grid-cols-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{t("problemHeading")}</h2>
          <p className="text-fg-muted mt-3">{problem}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{t("challengeHeading")}</h2>
          <p className="text-fg-muted mt-3">{challenge}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{t("overviewHeading")}</h2>
          <p className="text-fg-muted mt-3">{summary}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">{t("approachHeading")}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {project.approach.map((step, i) => (
            <li key={i} className="card p-4">
              <span className="text-accent-cyan font-mono text-[11px]">
                {t("step")} {i + 1}
              </span>
              <p className="text-fg-muted mt-2 text-sm">{tr(`approach.${i}`, step)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-base font-semibold tracking-tight">{t("stackHeading")}</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s}>
                <SkillChip name={s} accent="cyan" />
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-base font-semibold tracking-tight">{t("lessonsHeading")}</h2>
          <ul className="text-fg-muted mt-3 list-disc space-y-2 pl-4 text-sm">
            <li>{t("lesson1")}</li>
            <li>{t("lesson2")}</li>
            <li>{t("lesson3")}</li>
          </ul>
        </div>
      </section>

      {project.links && project.links.length > 0 && (
        <section className="mt-10">
          <h2 className="text-base font-semibold tracking-tight">{t("linksHeading")}</h2>
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
          <h2 className="text-base font-semibold tracking-tight">{t("relatedHeading")}</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.related.map((rslug) => {
              const r = getProject(rslug);
              if (!r) return null;
              return (
                <li key={rslug}>
                  <Link href={`/work/${r.slug}`} className="card card-hover block p-4">
                    <p className="text-fg-subtle font-mono text-[11px]">
                      {trRelated(rslug, "category", r.category)}
                    </p>
                    <h3 className="mt-1 font-semibold">{trRelated(rslug, "title", r.title)}</h3>
                    <p className="text-fg-muted mt-1 text-sm">
                      {trRelated(rslug, "tagline", r.tagline)}
                    </p>
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
