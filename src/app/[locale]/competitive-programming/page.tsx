import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { ConceptLabs } from "@/components/concept-labs";
import { RoadmapDiagram } from "@/components/diagrams/roadmap-diagram";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("competitiveProgramming");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export const revalidate = 3600;

export default async function CPPage() {
  const t = await getTranslations("competitiveProgramming");
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">{t("craftTag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">{t("pageIntro")}</p>
      </header>
      <CPCommandCenter />
      <section className="section border-border/60 border-t" aria-label={t("roadmapAria")}>
        <div className="container-tight">
          <header className="mb-6">
            <p className="mono-label">{t("roadmapTag")}</p>
            <h2 className="section-title mt-2">{t("roadmapHeading")}</h2>
            <p className="text-fg-muted mt-2 max-w-2xl">{t("roadmapIntro")}</p>
          </header>
          <RoadmapDiagram />
        </div>
      </section>
      <ConceptLabs />
    </div>
  );
}
