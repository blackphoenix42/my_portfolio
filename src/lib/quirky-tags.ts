// Quirky project filters — a playful, subjective dimension distinct from the
// technical `tags` (stack) and the unused `categories`. Labels are translated
// at render time via the `quirkyTags` i18n namespace; these ids are the keys.

export const QUIRKY_TAGS = [
  "favorite",
  "late-night",
  "hardest-bug",
  "most-fun",
  "open-source",
  "research",
  "ai",
  "systems",
] as const;

export type QuirkyTag = (typeof QUIRKY_TAGS)[number];

export const ALL_QUIRKY_FILTER = "all" as const;
export type QuirkyFilter = QuirkyTag | typeof ALL_QUIRKY_FILTER;

/** Type guard for arbitrary strings (e.g. query params). */
export function isQuirkyTag(value: string): value is QuirkyTag {
  return (QUIRKY_TAGS as readonly string[]).includes(value);
}

/**
 * Filter a list of items by a quirky tag. `"all"` (or anything not a known tag)
 * returns the list unchanged. Pure + dependency-free so it is unit-testable and
 * counts toward the src/lib coverage gate.
 */
export function filterByQuirkyTag<T extends { quirkyTags?: readonly string[] }>(
  items: readonly T[],
  filter: string,
): T[] {
  if (filter === ALL_QUIRKY_FILTER || !isQuirkyTag(filter)) {
    return [...items];
  }
  return items.filter((item) => item.quirkyTags?.includes(filter));
}

/** The set of quirky tags actually present across the supplied items. */
export function availableQuirkyTags<T extends { quirkyTags?: readonly string[] }>(
  items: readonly T[],
): QuirkyTag[] {
  const present = new Set<string>();
  for (const item of items) {
    for (const tag of item.quirkyTags ?? []) present.add(tag);
  }
  return QUIRKY_TAGS.filter((tag) => present.has(tag));
}
