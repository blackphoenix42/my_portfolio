import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CommandMenu } from "@/components/layout/command-menu";
import { RecruiterModeProvider } from "@/components/layout/recruiter-mode";
import { RecruiterBanner } from "@/components/layout/recruiter-banner";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { ScrollFab } from "@/components/layout/scroll-fab";
import { SITE } from "@/content/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Performance Engineer, Agentic AI & R&D Software Engineer`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Ayush Yadav",
    "R&D Software Engineer",
    "Cadence Design Systems",
    "Performance Engineering",
    "C++",
    "EDA",
    "Xcelium",
    "RTL",
    "Agentic AI",
    "LLM",
    "RAG",
    "MCP",
    "Vector Embeddings",
    "Distributed Systems",
    "Competitive Programming",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: `${SITE.name} — Performance Engineering × Agentic AI`,
    description: SITE.description,
    siteName: SITE.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name} portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Performance Engineering × Agentic AI`,
    description: SITE.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg text-fg min-h-dvh antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="focus:bg-bg-elev focus:text-fg focus:ring-accent-cyan sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:outline-none"
        >
          Skip to content
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
      </body>
    </html>
  );
}
