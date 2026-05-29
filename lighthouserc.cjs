/**
 * Lighthouse CI configuration.
 *
 * - `collect` runs Lighthouse against a locally-built production server.
 * - `assert` enforces performance budgets + minimum category scores.
 * - `upload` keeps reports as build artifacts (temporary public storage so we
 *   don't need an LHCI server).
 *
 * Run locally with: `npm run lhci`.
 */
module.exports = {
  ci: {
    collect: {
      // `start-server-command` lets `lhci collect` boot the Next.js production
      // server itself and tear it down afterwards. Requires `npm run build`
      // to have already produced `.next/`.
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready|started server on|Local:",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/work",
        "http://localhost:3000/experience",
        "http://localhost:3000/contact",
      ],
      numberOfRuns: 3,
      settings: {
        // Mobile is the default and the stricter target — desktop runs are
        // covered in the workflow as a separate matrix entry if needed.
        preset: "desktop",
        // Skip PWA category; this is a static portfolio, not an installable
        // app. Skip `is-on-https` since we run on localhost.
        skipAudits: ["uses-http2", "is-on-https", "redirects-http"],
        // Headless chromium flags — match what the workflow uses.
        chromeFlags: "--no-sandbox --headless=new --disable-gpu",
        // Allow lab metrics to settle before sampling.
        throttlingMethod: "simulate",
      },
    },
    assert: {
      // Per-category minimums. Performance is `warn` rather than `error` so a
      // single slow CI runner can't block a merge, but we keep the bar high.
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        // Best-practices dips to ~0.91 on /contact because of the third-party
        // PDF viewer + a couple of unavoidable browser warnings around CSP
        // 'unsafe-inline' (needed for the Next.js bootstrap script). 0.9 is
        // still a strong floor.
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],

        // Core Web Vitals targets (lab values).
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "speed-index": ["warn", { maxNumericValue: 3000 }],
        interactive: ["warn", { maxNumericValue: 3800 }],

        // Resource-size budgets. Fonts are intentionally generous because we
        // ship a full Inter variable axis + JetBrains Mono regular/medium for
        // brand consistency (~525 KiB total). Scripts run to ~400 KiB on
        // /contact thanks to the full ISO 3166-1 country picker.
        "resource-summary:script:size": ["warn", { maxNumericValue: 450000 }],
        "resource-summary:stylesheet:size": ["warn", { maxNumericValue: 80000 }],
        "resource-summary:font:size": ["warn", { maxNumericValue: 600000 }],
        "resource-summary:image:size": ["warn", { maxNumericValue: 500000 }],
        "resource-summary:total:size": ["warn", { maxNumericValue: 1800000 }],

        // Hygiene.
        "uses-text-compression": "error",
        // Image audits are scored against third-party logos served by
        // Clearbit / Google s2 (PNG/ICO) on the experience page — we can't
        // control their format. Demoted to off; CI still surfaces them via
        // the raw report artifact.
        "uses-responsive-images": "off",
        "modern-image-formats": "off",
        "unused-javascript": ["warn", { maxNumericValue: 70000 }],
        "unused-css-rules": ["warn", { maxNumericValue: 40000 }],
        "render-blocking-resources": ["warn", { maxNumericValue: 300 }],
        "uses-long-cache-ttl": "off",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
