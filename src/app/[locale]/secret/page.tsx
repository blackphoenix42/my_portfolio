import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { TrophyRoom } from "@/components/eggs/trophy-room";

// Hidden from the sitemap and robots — only discoverable by people who
// already know about the eggs (or who found one and were redirected here).
export const metadata: Metadata = {
  title: "Secret",
  description: "A trophy room of small surprises.",
  robots: { index: false, follow: false },
};

export default async function SecretPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("eggs"); // ensures messages are loaded server-side
  return <TrophyRoom />;
}
