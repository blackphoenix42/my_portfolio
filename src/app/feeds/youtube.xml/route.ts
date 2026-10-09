import { FEED_SOURCES, fetchRawFeed } from "@/lib/feeds";

export const revalidate = 900;

export async function GET() {
  const body = await fetchRawFeed("youtube");
  if (!body) {
    return new Response("Feed temporarily unavailable", { status: 502 });
  }
  return new Response(body, {
    headers: {
      "Content-Type": FEED_SOURCES.youtube.contentType,
      "Content-Disposition": "inline",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
