import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ActivityFeeds } from "@/components/feeds/activity-feeds";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("feeds");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export const revalidate = 3600;

export default async function FeedsPage() {
  const t = await getTranslations("feeds");
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label inline-flex items-center gap-2">
          <Rss className="h-3.5 w-3.5" /> {t("tag")}
        </p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageHeading")}</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">{t("pageIntro")}</p>
      </header>
      <ActivityFeeds hideHeader />
    </div>
  );
}
