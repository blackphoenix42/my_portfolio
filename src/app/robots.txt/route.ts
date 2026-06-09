import { SITE } from "@/content/profile";

const base = SITE.url.replace(/\/$/, "");

// We render robots.txt by hand (instead of using the MetadataRoute helper)
// so we can include a small ASCII comment for any human curious enough to
// open it. The actual robots directives are unchanged: indexable, with the
// API routes blocked from crawlers.
const body = `# /robots.txt
#
#       ⟁  hello, crawler.
#
#   This site is intentionally indexable; humans are welcome at /humans.txt
#   and the source lives at https://github.com/blackphoenix42.
#
#   If you're a human reading this: that counts as an egg. Head back to the
#   site and your trophy room at /secret will quietly mark it as unlocked.

User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${base}/sitemap.xml
Host: ${base}
`;

export function GET() {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export const dynamic = "force-static";
