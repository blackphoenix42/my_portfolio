import { fetchRecentCommitMessages } from "@/lib/feeds";
import { DEFAULT_COMMIT_RAIN_WINDOW } from "@/lib/commit-rain-window";
import { ContributionRain } from "./contribution-rain";

/**
 * Prefetches the default window for first paint / offline fallback.
 * The client re-fetches `/api/commits?window=…` using the visitor's Site settings.
 */
export async function ContributionRainHost() {
  const lines = await fetchRecentCommitMessages("blackphoenix42", {
    limit: 100,
    window: DEFAULT_COMMIT_RAIN_WINDOW,
  });
  return <ContributionRain initialMessages={lines} />;
}
