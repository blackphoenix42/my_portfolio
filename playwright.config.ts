import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Pre-dismiss the cookie banner so it never intercepts clicks in tests
    // that aren't specifically about the banner itself.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: "http://localhost:3000",
          localStorage: [{ name: "cookie-consent-v1", value: "1" }],
        },
      ],
    },
  },
  webServer: {
    // Use the production build for stable, pre-compiled routes. Avoids the
    // first-compile timing races seen under Next 16 Turbopack + parallel workers.
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
