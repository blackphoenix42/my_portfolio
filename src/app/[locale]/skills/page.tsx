import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EngineeringSpectrum } from "@/components/skills/engineering-spectrum";
import { SkillsExplorer } from "@/components/skills/skills-explorer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("skills");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("skills");
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">{t("tag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">{t("pageIntro")}</p>
      </header>
      <SkillsExplorer />
      <section className="border-border/60 border-t">
        <EngineeringSpectrum hideHeader />
      </section>
    </div>
  );
}
