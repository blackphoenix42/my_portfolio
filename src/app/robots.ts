import type { MetadataRoute } from "next";
import { SITE } from "@/content/profile";

const base = SITE.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow everything to public crawlers — the site is intentionally indexable.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
