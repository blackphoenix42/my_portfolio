import { NextResponse } from "next/server";
import { fetchRecentCommitMessages } from "@/lib/feeds";
import { COMMIT_RAIN_WINDOWS, parseCommitRainWindow } from "@/lib/commit-rain-window";
import { mergeServerCommitCache } from "@/lib/commit-rain-server-cache";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const revalidate = 900;

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

/**
 * GET /api/commits?window=week|month|year|all
 * Returns public GitHub commit lines for the decorative commit rain.
 */
export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`commits:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rateLimited" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const url = new URL(req.url);
  const window = parseCommitRainWindow(url.searchParams.get("window"));
  const fresh = await fetchRecentCommitMessages("blackphoenix42", {
    limit: 100,
    window,
  });
  const lines = mergeServerCommitCache(window, fresh);

  return NextResponse.json(
    { window, windows: COMMIT_RAIN_WINDOWS, lines, count: lines.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}
