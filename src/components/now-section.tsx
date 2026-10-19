import { Compass, BookOpen, Hammer, GraduationCap, Sparkles, Target } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NOW, type NowSectionId } from "@/content/now";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<NowSectionId, typeof Compass> = {
  focus: Target,
  learning: GraduationCap,
  building: Hammer,
  reading: BookOpen,
  sharpening: Sparkles,
};

const SECTION_TONE: Record<NowSectionId, { icon: string; rail: string; chip: string }> = {
  focus: {
    icon: "text-accent-cyan",
    rail: "border-l-accent-cyan",
    chip: "border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan",
  },
  learning: {
    icon: "text-accent-violet",
    rail: "border-l-accent-violet",
    chip: "border-accent-violet/25 bg-accent-violet/10 text-accent-violet",
  },
  building: {
    icon: "text-accent-emerald",
    rail: "border-l-accent-emerald",
    chip: "border-accent-emerald/25 bg-accent-emerald/10 text-accent-emerald",
  },
  reading: {
    icon: "text-accent-amber",
    rail: "border-l-accent-amber",
    chip: "border-accent-amber/25 bg-accent-amber/10 text-accent-amber",
  },
  sharpening: {
    icon: "text-accent-cyan",
    rail: "border-l-accent-cyan",
    chip: "border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan",
  },
};

const SECTION_LAYOUT: Record<NowSectionId, string> = {
  focus: "sm:col-span-2 lg:col-span-12",
  learning: "lg:col-span-4",
  building: "lg:col-span-4",
  reading: "lg:col-span-4",
  sharpening: "sm:col-span-2 lg:col-span-12",
};

type NowSectionProps = {
  locale: string;
  /** When true, omit the page-scale title so the hub H1 is not repeated. */
  embedded?: boolean;
};

export async function NowSection({ locale, embedded = false }: NowSectionProps) {
  const t = await getTranslations("now");

  const item = (id: string, index: number, fallback: string): string => {
    const path = `sections.${id}.${index}` as never;
    return t.has(path) ? (t(path) as string) : fallback;
  };
  const sectionTitle = (id: string): string => {
    const path = `sectionTitles.${id}` as never;
    return t.has(path) ? (t(path) as string) : id;
  };

  const formatted = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(NOW.updated));

  return (
    <section
      id="now"
      className={cn(
        "scroll-mt-24",
        embedded ? "section border-border/60 border-t" : "container-tight py-16",
      )}
      aria-label={embedded ? t("hubHeading") : t("pageHeading")}
    >
      <div className={embedded ? "container-tight" : undefined}>
        <header className="max-w-2xl">
          <p className="mono-label inline-flex items-center gap-2">
            <Compass className="h-3.5 w-3.5" /> {t("tag")}
          </p>
          {embedded ? (
            <>
              <h2 className="section-title mt-2">{t("hubHeading")}</h2>
              <p className="text-fg-muted mt-3">{t("hubIntro")}</p>
            </>
          ) : (
            <>
              <h2 className="text-display-2 mt-2 font-semibold tracking-tight">
                {t("pageHeading")}
              </h2>
              <p className="text-fg-muted mt-3">{t("pageIntro")}</p>
            </>
          )}
          <p className="text-fg-subtle mt-4 font-mono text-xs">
            {t("updatedLabel", { date: formatted })} · {NOW.location}
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {NOW.sections.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            const tone = SECTION_TONE[section.id];
            const featured = section.id === "focus";
            return (
              <article
                key={section.id}
                className={cn(
                  "card overflow-hidden",
                  SECTION_LAYOUT[section.id],
                  featured && "bg-bg-elev/80",
                )}
              >
                <div
                  className={cn(
                    "border-border/60 flex items-center gap-2 border-b px-5 py-3",
                    featured && "bg-bg-sunken/40",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-md border",
                      tone.chip,
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", tone.icon)} aria-hidden />
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight">
                    {sectionTitle(section.id)}
                  </h3>
                  <span className="text-fg-subtle ml-auto font-mono text-[10px] tracking-wider uppercase">
                    {String(section.items.length).padStart(2, "0")}
                  </span>
                </div>

                <ul
                  className={cn(
                    "p-5",
                    featured
                      ? "grid gap-3 sm:grid-cols-3"
                      : section.id === "sharpening"
                        ? "grid gap-3 sm:grid-cols-2"
                        : "space-y-3",
                  )}
                >
                  {section.items.map((fallback, i) => (
                    <li key={i} className={cn("border-l-2 pl-3", tone.rail)}>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          featured ? "text-fg" : "text-fg-muted",
                        )}
                      >
                        {item(section.id, i, fallback)}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {!embedded && (
          <p className="text-fg-subtle mt-10 max-w-2xl text-sm">
            {t.rich("inspiredBy", {
              a: (chunks) => (
                <a
                  href="https://nownownow.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-cyan underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        )}
      </div>
    </section>
  );
}
