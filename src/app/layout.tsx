import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/content/profile";
import { routing } from "@/i18n/routing";

// Self-hosted via `next/font/local` from `public/fonts/`. The .woff2 files
// are committed to the repo so the build never reaches out to Google Fonts
// (GDPR-safe, deterministic across CI / corporate proxies / offline boxes).
// To refresh the files, re-download from rsms.me/inter and JetBrains/JetBrainsMono.
//
// We deliberately ship only the upright Inter variable axis — italics are
// not used anywhere in the UI today, and InterVariable-Italic alone is
// ~380 KiB on the wire. If italics are reintroduced, drop the file back
// into /public/fonts/ and add a second `src` entry with `style: "italic"`.
const fontSans = localFont({
  src: [
    {
      path: "../../public/fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-sans-loaded",
  preload: true,
  // Generate a size-adjusted Arial fallback so the swap from system font to
  // Inter doesn't shift text metrics (the biggest source of font-driven CLS).
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});
const fontMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mono-loaded",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
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
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-connect to image CDNs we hit on /work (GitHub avatars + logo
            fallbacks). Saves ~150ms on the first repo card paint. */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body className="bg-bg text-fg min-h-dvh antialiased" suppressHydrationWarning>
        {/* 🜂 You found one. Try `help()` in this console, or the Konami code
            on the page. Trail of three haikus hidden across the site; if you
            collect them all, /secret holds a trophy room. — phoenix */}
        {children}
        {/* Vercel Analytics: cookie-less, GDPR-exempt page-view + custom-event tracking. */}
        <Analytics />
        {/* Vercel Speed Insights: real-user Web Vitals (LCP, CLS, INP, TTFB, FCP). */}
        <SpeedInsights />
      </body>
    </html>
  );
}
