import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE } from "@/content/profile";

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
    "/privacy",
  ];

  const staticUrls = routes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
  }));
  const projectUrls = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
  }));
  return [...staticUrls, ...projectUrls];
}
