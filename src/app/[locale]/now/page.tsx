import type { Metadata } from "next";
import { Compass, BookOpen, Hammer, GraduationCap, Sparkles, Target } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NOW } from "@/content/now";
import { SITE } from "@/content/profile";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("now");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: { canonical: `${SITE.url.replace(/\/$/, "")}/now` },
  };
}

export const revalidate = 3600;

const SECTION_ICONS: Record<string, typeof Compass> = {
  focus: Target,
  learning: GraduationCap,
  building: Hammer,
  reading: BookOpen,
  sharpening: Sparkles,
};

export default async function NowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("now");

  // Item strings prefer i18n (now.sections.<id>.<index>) and fall back to the
  // English content in now.ts.
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
    <div className="container-tight py-16">
      <header className="max-w-2xl">
        <p className="mono-label inline-flex items-center gap-2">
          <Compass className="h-3.5 w-3.5" /> {t("tag")}
        </p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3">{t("pageIntro")}</p>
        <p className="text-fg-subtle mt-4 font-mono text-xs">
          {t("updatedLabel", { date: formatted })} · {NOW.location}
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {NOW.sections.map((section) => {
          const Icon = SECTION_ICONS[section.id] ?? Compass;
          return (
            <section key={section.id} className="card p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                <Icon className="text-accent-cyan h-4 w-4" />
                {sectionTitle(section.id)}
              </h2>
              <ul className="text-fg-muted mt-4 space-y-2 text-sm">
                {section.items.map((fallback, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent-cyan mt-0.5" aria-hidden>
                      ·
                    </span>
                    <span>{item(section.id, i, fallback)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

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
    </div>
  );
}
