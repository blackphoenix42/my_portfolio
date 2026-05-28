import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE } from "@/content/profile";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const routes = [
    "",
    "/work",
    "/experience",
    "/skills",
    "/competitive-programming",
    "/feeds",
    "/about",
    "/contact",
    "/lab",
  ];

  function urlsFor(path: string) {
    // localePrefix: "as-needed" → English at root, others prefixed.
    return routing.locales.map((l) => {
      const u = l === routing.defaultLocale ? `${base}${path || "/"}` : `${base}/${l}${path || ""}`;
      return { url: u, lastModified: now };
    });
  }

  const staticUrls = routes.flatMap(urlsFor);
  const projectUrls = projects.flatMap((p) => urlsFor(`/work/${p.slug}`));
  return [...staticUrls, ...projectUrls];
}
