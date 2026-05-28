import type { Metadata } from "next";
import { ArrowUpRight, Cpu, Layers, Activity, Coins } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projects } from "@/content/projects";
import {
  XmaiPipeline,
  FlamegraphMini,
  AlgoMini,
  ChainBracket,
  PostureMini,
  TrackMini,
  BrainMini,
} from "@/components/diagrams/case-study-thumbs";
import { GithubWorkbench } from "@/components/github/github-workbench";
import { fetchFeaturedRepos } from "@/lib/github";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("work");
  return { title: t("title"), description: t("description") };
}

const Icons: Record<string, React.ComponentType<{ className?: string }>> = {
  xmai: Cpu,
  "xcelium-optimization": Activity,
  algolens: Layers,
  postureiq: Activity,
  "track-person-app": Layers,
  "smart-brain": Cpu,
  "tezos-premier-league": Coins,
};

const Thumbs: Record<string, () => React.ReactElement> = {
  xmai: () => <XmaiPipeline />,
  "xcelium-optimization": () => <FlamegraphMini />,
  algolens: () => <AlgoMini />,
  postureiq: () => <PostureMini />,
  "track-person-app": () => <TrackMini />,
  "smart-brain": () => <BrainMini />,
  "tezos-premier-league": () => <ChainBracket />,
};

export const revalidate = 3600;

export default async function WorkIndexPage() {
  const t = await getTranslations("work");
  const tCommon = await getTranslations("common");
  const tProjects = await getTranslations("projects");
  const repos = await fetchFeaturedRepos();

  const tr = (slug: string, key: string, fallback: string) => {
    const path = `items.${slug}.${key}` as never;
    return tProjects.has(path) ? (tProjects(path) as string) : fallback;
  };

  return (
    <div className="container-tight py-20">
      <header className="mb-10 max-w-2xl">
        <p className="mono-label">{t("tag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageTitle")}</h1>
        <p className="text-fg-muted mt-3">{t("pageIntro")}</p>
      </header>

      <section aria-label={t("featuredAria")} className="mb-20">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mono-label">{t("featuredTag")}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{t("featuredHeading")}</h2>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => {
            const Icon = Icons[p.slug] ?? Cpu;
            const Thumb = Thumbs[p.slug];
            const title = tr(p.slug, "title", p.title);
            const tagline = tr(p.slug, "tagline", p.tagline);
            const category = tr(p.slug, "category", p.category);
            return (
              <article key={p.slug} className="card card-hover group overflow-hidden">
                <div className="border-border bg-bg-sunken/60 relative h-44 overflow-hidden border-b">
                  {Thumb ? (
                    <Thumb />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <Icon className="text-accent-cyan/70 h-14 w-14" />
                    </div>
                  )}
                  <div className="border-border bg-bg-elev/80 text-fg-muted absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] backdrop-blur">
                    <Icon className="h-3 w-3" /> {category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="text-fg-muted mt-2 line-clamp-3 text-sm">{tagline}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 6).map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/work/${p.slug}`}
                      className="text-accent-cyan group-hover:text-fg inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      {t("readMore")} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    {p.status === "professional" && (
                      <span className="chip text-accent-amber">{tCommon("professional")}</span>
                    )}
                    {p.status === "open-source" && (
                      <span className="chip text-accent-emerald">{tCommon("openSource")}</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-label={t("workbenchAria")}>
        <GithubWorkbench repos={repos} />
      </section>
    </div>
  );
}
