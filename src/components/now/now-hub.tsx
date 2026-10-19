import { getTranslations } from "next-intl/server";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";
import { RoadmapSection } from "@/components/diagrams/roadmap-section";
import { NowSection } from "@/components/now-section";

/** Full Now hub: CP command center, focus snapshot, and one 2027 roadmap. */
export async function NowHub({ locale }: { locale: string }) {
  const t = await getTranslations("competitiveProgramming");
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">{t("craftTag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">{t("pageIntro")}</p>
      </header>
      <CPCommandCenter />
      <NowSection locale={locale} embedded />
      <RoadmapSection />
    </div>
  );
}
