import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { ActivityFeeds } from "@/components/feeds/activity-feeds";

export const metadata: Metadata = {
  title: "Feeds · Live activity",
  description:
    "Live activity feeds — latest posts from Medium, videos from YouTube and recent GitHub activity, refreshed hourly.",
};

export const revalidate = 3600;

export default function FeedsPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label inline-flex items-center gap-2">
          <Rss className="h-3.5 w-3.5" /> / feeds
        </p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">Live activity</h1>
        <p className="text-fg-muted mt-3 max-w-2xl">
          Live signals from where I work in public — recent Medium posts, YouTube uploads and GitHub
          events. Pulled server-side from RSS / public APIs and cached at the edge for an hour.
        </p>
      </header>
      <ActivityFeeds hideHeader />
    </div>
  );
}
