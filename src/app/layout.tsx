import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { SITE } from "@/content/profile";
import { routing } from "@/i18n/routing";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // getLocale() throws ENVIRONMENT_FALLBACK for non-localized routes
  // (sitemap, robots, opengraph-image, /icon.jpg, API routes, /_not-found).
  // Fall back to the default locale so the root <html lang> stays valid.
  let locale: string = routing.defaultLocale;
  try {
    locale = await getLocale();
  } catch {
    // No request locale context — keep the default.
  }
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-fg min-h-dvh antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
