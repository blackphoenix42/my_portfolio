import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { projects } from "@/content/projects";
import { WorkGrid, type WorkCard } from "@/components/projects/work-grid";
import { GithubWorkbench } from "@/components/github/github-workbench";
import { fetchFeaturedRepos } from "@/lib/github";
import { availableQuirkyTags } from "@/lib/quirky-tags";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("work");
  return { title: t("title"), description: t("description") };
}

export const revalidate = 3600;

export default async function WorkIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const tCommon = await getTranslations("common");
  const tProjects = await getTranslations("projects");
  const tQuirky = await getTranslations("quirkyTags");
  const repos = await fetchFeaturedRepos();

  const tr = (slug: string, key: string, fallback: string) => {
    const path = `items.${slug}.${key}` as never;
    return tProjects.has(path) ? (tProjects(path) as string) : fallback;
  };

  const cards: WorkCard[] = projects.map((p) => ({
    slug: p.slug,
    title: tr(p.slug, "title", p.title),
    tagline: tr(p.slug, "tagline", p.tagline),
    category: tr(p.slug, "category", p.category),
    tags: p.tags.slice(0, 6),
    status: p.status,
    quirkyTags: [...(p.quirkyTags ?? [])],
  }));

  // Translate only the quirky-tag labels actually present in the data.
  const quirkyLabels: Record<string, string> = {};
  for (const tag of availableQuirkyTags(projects)) {
    quirkyLabels[tag] = tQuirky(`labels.${tag}` as never);
  }

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

        <WorkGrid
          cards={cards}
          labels={{
            readMore: t("readMore"),
            professional: tCommon("professional"),
            openSource: tCommon("openSource"),
            filter: tQuirky("filterLabel"),
          }}
          quirkyLabels={quirkyLabels}
          allLabel={tQuirky("all")}
        />
      </section>

      <section aria-label={t("workbenchAria")}>
        <GithubWorkbench repos={repos} />
      </section>
      {/* Haiku 3 of 3 — "becomes a phoenix" */}
      <span hidden aria-hidden data-haiku="work" />
    </div>
  );
}
