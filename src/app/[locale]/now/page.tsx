import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NowSection } from "@/components/now-section";
import { SITE } from "@/content/profile";
export const revalidate = 3600;
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("now");
  return {
    title: t("pageTitle"),
    alternates: { canonical: SITE.url + "/competitive-programming" },
  };
}
export default async function NowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("now");
  return (
    <>
      <h1 className="sr-only">{t("pageHeading")}</h1>
      <NowSection locale={locale} />
    </>
  );
}
