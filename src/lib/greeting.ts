/**
 * Time-of-day bucket used by the header greeting chip. Buckets are
 * deliberately chunky (four windows that cover the whole 24h clock) so the
 * salutation feels natural in every supported locale.
 */
export type GreetingBucket = "morning" | "afternoon" | "evening" | "night";

/**
 * Map a 0-23 hour into a greeting bucket.
 *
 * - 05:00-11:59 -> morning
 * - 12:00-16:59 -> afternoon
 * - 17:00-20:59 -> evening
 * - 21:00-04:59 -> night
 *
 * Out-of-range hours fall back to `night` so the function is total.
 */
export function getGreetingBucket(hour: number): GreetingBucket {
  if (!Number.isFinite(hour)) return "night";
  const hourOfDay = ((Math.floor(hour) % 24) + 24) % 24;
  if (hourOfDay >= 5 && hourOfDay < 12) return "morning";
  if (hourOfDay >= 12 && hourOfDay < 17) return "afternoon";
  if (hourOfDay >= 17 && hourOfDay < 21) return "evening";
  return "night";
}

/**
 * Read the bucket directly from a `Date`. Defaults to "now" so callers can
 * stay terse: `getGreetingBucketFromDate()`.
 */
export function getGreetingBucketFromDate(date: Date = new Date()): GreetingBucket {
  return getGreetingBucket(date.getHours());
}
