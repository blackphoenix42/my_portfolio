import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CareerTimeline } from "@/components/experience/career-timeline";
import { CompanyLogo } from "@/components/experience/company-logo";
import { educationHistory, internships } from "@/content/experience";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("experience");
  return { title: t("title"), description: t("description") };
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("experience");
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">{t("tag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageTitle")}</h1>
      </header>
      <CareerTimeline />
      <CareerTimeline
        items={internships}
        eyebrow={t("internshipsEyebrow")}
        title={t("internshipsTitle")}
        ariaLabel={t("internshipsAria")}
      />
      <section className="container-tight pt-16 pb-20">
        <h2 className="section-title">{t("educationHeading")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {educationHistory.map((education) => (
            <div key={education.school} className="card flex gap-4 p-6">
              <CompanyLogo
                name={education.school}
                className="border-border bg-bg-elev h-14 w-14 shrink-0 rounded-md border p-1.5"
              />
              <div className="min-w-0">
                <p className="text-accent-cyan font-mono text-xs">
                  {education.start} — {education.end}
                </p>
                <h3 className="mt-1 text-lg leading-snug font-semibold">{education.school}</h3>
                <p className="text-fg-muted mt-1">{education.degree}</p>
                <p className="text-fg-subtle mt-1 font-mono text-xs">
                  {t("score")} {education.cgpa}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
