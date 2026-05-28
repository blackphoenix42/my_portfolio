import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Load locale messages with English fallback for any missing keys.
  const [base, overlay] = await Promise.all([
    import(`../../messages/en.json`).then((m) => m.default),
    locale === "en"
      ? Promise.resolve({})
      : import(`../../messages/${locale}.json`).then((m) => m.default).catch(() => ({})),
  ]);

  return {
    locale,
    messages: deepMerge(base, overlay),
    timeZone: "UTC",
    now: new Date(),
  };
});

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function deepMerge<T extends Record<string, Json>>(base: T, overlay: Partial<T>): T {
  const out: Record<string, Json> = { ...base };
  for (const [k, v] of Object.entries(overlay)) {
    const b = out[k];
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      b &&
      typeof b === "object" &&
      !Array.isArray(b)
    ) {
      out[k] = deepMerge(b as Record<string, Json>, v as Record<string, Json>);
    } else if (v !== undefined) {
      out[k] = v as Json;
    }
  }
  return out as T;
}
