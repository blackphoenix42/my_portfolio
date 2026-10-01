import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { systemDesigns, getSystemDesign } from "@/content/system-design";
import { DesignDetail } from "@/components/system-design/design-detail";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/content/profile";

export const revalidate = 3600;
export function generateStaticParams() {
  return systemDesigns.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getSystemDesign(slug)) return {};
  const t = await getTranslations({ locale, namespace: "systemDesign" });
  return {
    title: t(`systems.${slug}.title`),
    description: t(`systems.${slug}.tagline`),
    alternates: { canonical: `${SITE.url}/system-design/${slug}` },
  };
}
export default async function SystemDesignDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!getSystemDesign(slug)) notFound();
  const t = await getTranslations("systemDesign");
  return (
    <div className="container-tight py-16">
      <Link href="/work#system-design" className="text-accent-cyan text-sm">
        {t("backToWork")}
      </Link>
      <header className="mt-6 max-w-2xl">
        <p className="mono-label">{t("tag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold">{t(`systems.${slug}.title`)}</h1>
        <p className="text-fg-muted mt-3">{t(`systems.${slug}.tagline`)}</p>
      </header>
      <DesignDetail slug={slug} />
    </div>
  );
}
