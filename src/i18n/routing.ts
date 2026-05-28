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
  // URLs never carry a locale segment — every page lives at the same path in
  // every language. The active locale is resolved from the `NEXT_LOCALE` cookie
  // and the `Accept-Language` header, persisted via the language switcher.
  localePrefix: "never",
  // Detect from Accept-Language on first visit, persist in cookie.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
