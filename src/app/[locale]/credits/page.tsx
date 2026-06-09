import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RouteUnlock } from "@/components/eggs/route-unlock";

export const metadata: Metadata = {
  title: "Credits",
  description: "People and projects this site stands on.",
  robots: { index: false, follow: false },
};

const CREDITS: { name: string; href: string }[] = [
  { name: "Next.js", href: "https://nextjs.org" },
  { name: "React", href: "https://react.dev" },
  { name: "TypeScript", href: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "next-intl", href: "https://next-intl.dev" },
  { name: "framer-motion", href: "https://www.framer.com/motion/" },
  { name: "Radix UI", href: "https://www.radix-ui.com" },
  { name: "Lucide", href: "https://lucide.dev" },
  { name: "Vitest", href: "https://vitest.dev" },
  { name: "Playwright", href: "https://playwright.dev" },
  { name: "Resend", href: "https://resend.com" },
  { name: "Vercel", href: "https://vercel.com" },
];

export default async function CreditsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eggs.creditsPage");

  return (
    <div className="container-tight py-16 sm:py-20">
      <RouteUnlock egg="credits-route" />
      <header className="max-w-xl">
        <p className="mono-label inline-flex items-center gap-2">
          <Heart className="text-accent-amber h-3 w-3" /> {t("tag")}
        </p>
        <h1 className="text-display-2 mt-3 font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-fg-muted mt-4 text-lg">{t("body")}</p>
      </header>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CREDITS.map((c) => (
          <li key={c.name}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover block p-3 text-center text-sm"
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-fg-subtle mt-10 font-mono text-xs">{t("found")}</p>
      <Link href="/secret" className="btn-ghost mt-4 text-xs">
        {t("trophyCta")}
      </Link>
    </div>
  );
}
