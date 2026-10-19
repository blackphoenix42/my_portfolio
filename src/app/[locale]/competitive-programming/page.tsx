import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Legacy hub URL — canonical surface is `/now`. */
export default async function CompetitiveProgrammingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as (typeof routing.locales)[number])
    : routing.defaultLocale;
  redirect({ href: "/now", locale: safeLocale });
}
