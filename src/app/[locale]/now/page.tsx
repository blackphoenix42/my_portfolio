import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NowHub } from "@/components/now/now-hub";
import { SITE } from "@/content/profile";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("competitiveProgramming");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: { canonical: SITE.url + "/now" },
  };
}

export default async function NowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NowHub locale={locale} />;
}
