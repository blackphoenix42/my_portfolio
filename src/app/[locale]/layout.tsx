import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { IntlClientProvider } from "@/components/layout/intl-client-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CommandMenu } from "@/components/layout/command-menu";
import { RecruiterModeProvider } from "@/components/layout/recruiter-mode";
import { RecruiterBanner } from "@/components/layout/recruiter-banner";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { ScrollFab } from "@/components/layout/scroll-fab";
import { routing } from "@/i18n/routing";
import { SITE } from "@/content/profile";
import { getMessages, getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    jobTitle: SITE.role,
    worksFor: { "@type": "Organization", name: SITE.company },
    sameAs: [
      SITE.github,
      SITE.linkedin,
      SITE.codechef,
      SITE.codeforces,
      SITE.leetcode,
      SITE.hackerrank,
    ],
  };

  return (
    <IntlClientProvider messages={messages} locale={locale}>
      <a
        href="#main"
        className="focus:bg-bg-elev focus:text-fg focus:ring-accent-cyan sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:outline-none"
      >
        {t("skipToContent")}
      </a>
      <ThemeProvider
        attribute="class"
        defaultTheme="phoenix"
        enableSystem={false}
        themes={["light", "dark", "phoenix"]}
      >
        <RecruiterModeProvider>
          <SiteHeader />
          <RecruiterBanner />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <CommandMenu />
          <MobileActionBar />
          <ScrollFab />
        </RecruiterModeProvider>
      </ThemeProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </IntlClientProvider>
  );
}
