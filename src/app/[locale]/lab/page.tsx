import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default async function LabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as (typeof routing.locales)[number])
    : routing.defaultLocale;
  redirect({ href: "/competitive-programming", locale: safeLocale });
}
