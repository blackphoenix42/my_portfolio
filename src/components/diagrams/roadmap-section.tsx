import { BookOpen, Hammer, LineChart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ConceptLabs } from "@/components/concept-labs";

const APPROACH = [
  { key: "learn" as const, icon: BookOpen },
  { key: "build" as const, icon: Hammer },
  { key: "validate" as const, icon: LineChart },
];

/** Single roadmap surface: concept cards + learn/build/validate approach. */
export async function RoadmapSection() {
  const t = await getTranslations("competitiveProgramming");
  return (
    <section
      id="roadmap"
      className="section border-border/60 scroll-mt-24 border-t"
      aria-label={t("roadmapAria")}
    >
      <div className="container-tight">
        <header className="mb-8 max-w-2xl">
          <p className="mono-label">{t("roadmapTag")}</p>
          <h2 className="section-title mt-2">{t("roadmapHeading")}</h2>
          <p className="text-fg-muted mt-2">{t("roadmapIntro")}</p>
        </header>

        <ConceptLabs embedded />

        <ol className="border-border/60 mt-8 grid gap-0 overflow-hidden rounded-xl border md:grid-cols-3">
          {APPROACH.map(({ key, icon: Icon }, index) => (
            <li
              key={key}
              className="border-border/60 bg-bg-elev/40 relative p-5 md:border-r md:last:border-r-0"
            >
              <div className="flex items-center gap-3">
                <span className="border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan inline-flex h-9 w-9 items-center justify-center rounded-md border font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon className="text-fg-muted h-4 w-4" aria-hidden />
                <h3 className="text-sm font-semibold tracking-tight">
                  {t(`approach.${key}.title`)}
                </h3>
              </div>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                {t(`approach.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
