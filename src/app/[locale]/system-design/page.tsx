import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DesignGallery } from "@/components/system-design/design-gallery";
import { SITE } from "@/content/profile";
export const revalidate = 3600;
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("systemDesign");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: { canonical: SITE.url + "/system-design" },
  };
}
export default async function SystemDesignPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("systemDesign");
  return (
    <div className="container-tight py-16">
      <h1 className="text-display-2 mb-8 font-semibold">{t("pageTitle")}</h1>
      <DesignGallery />
    </div>
  );
}
