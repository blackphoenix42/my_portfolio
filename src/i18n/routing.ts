import { defineRouting } from "next-intl/routing";

/**
 * Supported locales for the portfolio.
 * - en: English (default, source of truth)
 * - hi: Hindi (हिन्दी)
 * - ja: Japanese (日本語)
 * - sa: Sanskrit (संस्कृतम्) — best-effort, may be approximate
 * - zh: Simplified Chinese (中文)
 * - ru: Russian (Русский)
 */
export const routing = defineRouting({
  locales: ["en", "hi", "ja", "sa", "zh", "ru"] as const,
  defaultLocale: "en",
  // Hide /en in URLs but prefix all other locales: /about, /hi/about, /ja/about, ...
  localePrefix: "as-needed",
  // Detect from Accept-Language on first visit, persist in cookie.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
