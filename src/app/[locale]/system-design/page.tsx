import type { Metadata } from "next";
import { Network } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { systemDesigns } from "@/content/system-design";
import { SystemWhiteboard } from "@/components/system-design/system-whiteboard";
import { SITE } from "@/content/profile";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("systemDesign");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: { canonical: `${SITE.url.replace(/\/$/, "")}/system-design` },
  };
}

export const revalidate = 3600;

export default async function SystemDesignPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("systemDesign");

  // Per-system title/tagline prefer i18n, fall back to content English.
  const sys = (slug: string, key: string, fallback: string): string => {
    const path = `systems.${slug}.${key}` as never;
    return t.has(path) ? (t(path) as string) : fallback;
  };

  return (
    <div className="container-tight py-16">
      <header className="max-w-2xl">
        <p className="mono-label inline-flex items-center gap-2">
          <Network className="h-3.5 w-3.5" /> {t("tag")}
        </p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3">{t("pageIntro")}</p>
      </header>

      <nav aria-label={t("jumpTo")} className="mt-8 flex flex-wrap gap-2">
        {systemDesigns.map((s) => (
          <a
            key={s.slug}
            href={`#${s.slug}`}
            className="border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg rounded-full border px-3 py-1 font-mono text-[11px]"
          >
            {sys(s.slug, "title", s.title)}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {systemDesigns.map((s) => (
          <section key={s.slug} id={s.slug} className="scroll-mt-24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="section-title">{sys(s.slug, "title", s.title)}</h2>
              {s.interactive ? (
                <span className="border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                  {t("interactive")}
                </span>
              ) : (
                <span className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                  {t("comingSoon")}
                </span>
              )}
            </div>
            <p className="text-fg-muted mt-2 max-w-2xl">{sys(s.slug, "tagline", s.tagline)}</p>

            <div className="card mt-6 p-6">
              <SystemWhiteboard slug={s.slug} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="card p-5">
                <h3 className="mono-label mb-3">{t("requirements")}</h3>
                <ul className="text-fg-muted list-disc space-y-1.5 pl-4 text-sm">
                  {s.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="mono-label mb-3">{t("components")}</h3>
                <ul className="space-y-2 text-sm">
                  {s.components.map((c) => (
                    <li key={c.name}>
                      <span className="text-fg font-semibold">{c.name}</span>
                      <span className="text-fg-muted"> — {c.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="mono-label mb-3">{t("tradeoffs")}</h3>
                <ul className="text-fg-muted list-disc space-y-1.5 pl-4 text-sm">
                  {s.tradeoffs.map((tr, i) => (
                    <li key={i}>{tr}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
