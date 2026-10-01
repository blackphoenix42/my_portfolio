// Uses the same automatic fetchers as /feeds; no manually edited activity data.
import { fetchMediumFeed, fetchYouTubeFeed, fetchGithubActivity } from "../src/lib/feeds.ts";

const results = await Promise.allSettled([
  fetchMediumFeed("@binaryphoenix01", 3),
  fetchYouTubeFeed("UCcINlOM-rC1_8yiRGH_iFBg", 3),
  fetchGithubActivity("blackphoenix42", 4),
]);
for (const [index, result] of results.entries()) {
  const name = ["Medium", "YouTube", "GitHub"][index];
  if (result.status === "rejected") {
    console.error(`${name}: fetch or parsing failed`);
    process.exitCode = 1;
  } else {
    console.log(
      `${name}: ${result.value.length} items; newest: ${result.value[0]?.date ?? "none"}`,
    );
    if (!result.value.length)
      console.warn(`${name}: upstream unavailable or no public items; check the source XML.`);
  }
}
