import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

/**
 * Catch-all for any path under the [locale] segment that doesn't match a
 * concrete route. Throws `notFound()` so Next renders the locale-aware
 * `[locale]/not-found.tsx` (which has the full egg layer — Phoenix Run,
 * console banner, providers, i18n) instead of the bare root `not-found.tsx`.
 *
 * More specific routes (e.g. `[locale]/work/[slug]/page.tsx`) win over this
 * catch-all in the App Router's segment matcher, so existing pages are
 * unaffected.
 */
export default async function CatchAll({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;
  if (hasLocale(routing.locales, locale)) {
    setRequestLocale(locale);
  }
  notFound();
}
