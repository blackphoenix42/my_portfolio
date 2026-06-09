import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Flame } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RouteUnlock } from "@/components/eggs/route-unlock";

export const metadata: Metadata = {
  title: "Phoenix",
  description: "Why this codename exists.",
  robots: { index: false, follow: false },
};

export default async function PhoenixPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eggs.phoenixPage");

  return (
    <div className="container-tight relative grid min-h-[70vh] place-items-center py-20">
      <RouteUnlock egg="phoenix-route" />
      <div
        aria-hidden
        className="bg-accent-amber/20 pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full blur-[120px]"
      />
      <article className="max-w-xl text-center">
        <Flame className="text-accent-amber mx-auto h-12 w-12 animate-pulse" aria-hidden />
        <h1 className="text-display-2 mt-6 font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-fg-muted mt-4 text-lg">{t("body")}</p>
        <p className="text-fg-subtle mt-6 font-mono text-xs">{t("quote")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/secret" className="btn-primary text-xs">
            {t("trophyCta")}
          </Link>
          <Link href="/" className="btn-ghost text-xs">
            {t("homeCta")}
          </Link>
        </div>
      </article>
    </div>
  );
}
