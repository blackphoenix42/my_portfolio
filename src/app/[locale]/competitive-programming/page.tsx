import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { ConceptLabs } from "@/components/concept-labs";
import { RoadmapDiagram } from "@/components/diagrams/roadmap-diagram";
import { NowSection } from "@/components/now-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("competitiveProgramming");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export const revalidate = 3600;

export default async function CPPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("competitiveProgramming");
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">{t("craftTag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">{t("pageIntro")}</p>
      </header>
      <CPCommandCenter />
      <NowSection locale={locale} />
      <section
        id="roadmap"
        className="section border-border/60 scroll-mt-24 border-t"
        aria-label={t("roadmapAria")}
      >
        <div className="container-tight">
          <header className="mb-6">
            <p className="mono-label">{t("roadmapTag")}</p>
            <h2 className="section-title mt-2">{t("roadmapHeading")}</h2>
            <p className="text-fg-muted mt-2 max-w-2xl">{t("roadmapIntro")}</p>
          </header>
          <RoadmapDiagram />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["learn", "build", "validate"].map((key) => (
              <article key={key} className="card p-5">
                <h3 className="text-base font-semibold">{t(`approach.${key}.title`)}</h3>
                <p className="text-fg-muted mt-2 text-sm">{t(`approach.${key}.body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ConceptLabs />
    </div>
  );
}
