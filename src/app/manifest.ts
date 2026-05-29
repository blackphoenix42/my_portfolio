import type { MetadataRoute } from "next";
import { SITE } from "@/content/profile";

// Web App Manifest. Lets the site be installed as a PWA on Android/desktop
// Chrome, and gives the OS theme integration the same accent palette as the
// dark + phoenix CSS variables in globals.css.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.role}`,
    short_name: SITE.name.split(" ")[0] ?? "Portfolio",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1e",
    theme_color: "#0a0f1e",
    orientation: "portrait",
    icons: [
      { src: "/icon.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any" },
      { src: "/apple-icon.jpg", sizes: "512x512", type: "image/jpeg", purpose: "maskable" },
    ],
  };
}
