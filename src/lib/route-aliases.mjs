/**
 * Canonical path → alternate sources that permanently redirect here.
 * Consumed by next.config.mjs and mirrored in docs/ENDPOINTS.md.
 *
 * Rules:
 * - Canonical paths are the only ones in the sitemap / nav.
 * - Alternates are typos, synonyms, and legacy short forms.
 * - Do not add locale prefixes (localePrefix: "never").
 */

/** @typedef {{ source: string, destination: string, permanent?: boolean }} AliasRedirect */

/** Top-level page aliases (no dynamic segments). */
export const PAGE_ALIASES = {
  "/about": ["/me", "/bio", "/profile", "/about-me", "/aboutme"],
  "/work": ["/projects", "/project", "/portfolio", "/case-studies", "/casestudies", "/works"],
  "/skills": ["/skill", "/stack", "/tech", "/technology", "/technologies", "/arsenal"],
  "/experience": ["/exp", "/career", "/jobs", "/timeline", "/work-history", "/workhistory"],
  "/now": ["/currently", "/atm", "/today", "/status", "/doing"],
  "/competitive-programming": [
    "/cp",
    "/competitive",
    "/coding",
    "/leetcode",
    "/codeforces",
    "/practice",
    "/plans",
    "/practice-and-plans",
    "/practiceandplans",
    "/craft",
  ],
  "/system-design": [
    "/sysdesign",
    "/systemdesign",
    "/system_design",
    "/sys-design",
    "/sys_design",
    "/sd",
    "/design",
    "/architecture",
    "/hld",
    "/lld",
    "/whiteboards",
  ],
  "/feeds": ["/feed", "/rss", "/atom", "/activity", "/updates", "/blog-feed"],
  "/contact": ["/hire", "/email", "/reach", "/get-in-touch", "/getintouch", "/connect"],
  "/privacy": ["/policy", "/privacy-policy", "/privacypolicy", "/legal"],
  "/secret": ["/secrets", "/trophy", "/trophies", "/easter-eggs", "/eastereggs"],
  "/credits": ["/credit", "/thanks", "/acknowledgements", "/acknowledgments"],
  "/phoenix": ["/bird", "/mascot"],
};

/** Dynamic slug aliases: canonical parent + map of canonicalSlug → alternates. */
export const SLUG_ALIASES = {
  "/work": {
    maestro: ["xmai", "maestero", "mastero"],
  },
  "/system-design": {
    "url-shortener": ["urlshortener", "shortener", "url-short", "bitly", "short-url", "shorturl"],
    "rate-limiter": ["ratelimiter", "rate-limit", "ratelimit", "throttle", "throttling"],
    "job-scheduler": [
      "jobscheduler",
      "job-queue",
      "jobqueue",
      "scheduler",
      "task-queue",
      "taskqueue",
    ],
    "log-analytics": ["loganalytics", "logs", "log-pipeline", "observability-logs", "elk"],
    "sim-regression-dashboard": [
      "sim-regression",
      "simregression",
      "regression-dashboard",
      "regression",
      "sim-dash",
    ],
    "waveform-compression": [
      "waveform",
      "waveforms",
      "waveformcompression",
      "vcd",
      "fsdb",
      "wave-compress",
    ],
  },
};

/**
 * Expand PAGE_ALIASES + SLUG_ALIASES into Next.js `redirects()` entries.
 * @returns {AliasRedirect[]}
 */
export function buildAliasRedirects() {
  /** @type {AliasRedirect[]} */
  const out = [];

  for (const [destination, sources] of Object.entries(PAGE_ALIASES)) {
    for (const source of sources) {
      out.push({ source, destination, permanent: true });
    }
  }

  for (const [parent, slugMap] of Object.entries(SLUG_ALIASES)) {
    for (const [canonicalSlug, alts] of Object.entries(slugMap)) {
      const destination = `${parent}/${canonicalSlug}`;
      for (const alt of alts) {
        out.push({ source: `${parent}/${alt}`, destination, permanent: true });
        // Also accept short parent aliases + alt slug, e.g. /sysdesign/shortener
        const parentAlts = PAGE_ALIASES[parent] ?? [];
        for (const parentAlt of parentAlts) {
          out.push({
            source: `${parentAlt}/${alt}`,
            destination,
            permanent: true,
          });
          out.push({
            source: `${parentAlt}/${canonicalSlug}`,
            destination,
            permanent: true,
          });
        }
      }
    }
  }

  // Deduplicate by source (first wins).
  const seen = new Set();
  return out.filter((r) => {
    if (seen.has(r.source)) return false;
    seen.add(r.source);
    return true;
  });
}
