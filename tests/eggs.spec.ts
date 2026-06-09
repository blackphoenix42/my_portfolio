import { test, expect } from "@playwright/test";

test.describe("easter eggs", () => {
  test("/secret renders the trophy room and unlocks the visit egg", async ({ page }) => {
    await page.goto("/secret");
    await expect(page.getByText(/trophy room|secret/i).first()).toBeVisible();
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("phoenix:eggs:v1");
      return Boolean(raw && raw.includes("trophy-room-visit"));
    });
  });

  test("/phoenix is reachable and unlocks the route egg", async ({ page }) => {
    await page.goto("/phoenix");
    await expect(page.locator("body")).toBeVisible();
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("phoenix:eggs:v1");
      return Boolean(raw && raw.includes("phoenix-route"));
    });
  });

  test("/credits is reachable and unlocks the route egg", async ({ page }) => {
    await page.goto("/credits");
    await expect(page.locator("body")).toBeVisible();
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("phoenix:eggs:v1");
      return Boolean(raw && raw.includes("credits-route"));
    });
  });

  test("404 page mounts the Phoenix Run mini-game", async ({ page }) => {
    // A non-existent project slug triggers notFound() inside the slug page,
    // which routes to the nearest not-found boundary — the locale's
    // not-found.tsx (where <PhoenixRun /> is mounted).
    await page.goto("/work/this-project-does-not-exist-zzz");
    await expect(page.locator("canvas, [data-egg='dino-game-fallback']").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("arbitrary unmatched URL also mounts Phoenix Run", async ({ page }) => {
    // Verifies the [locale]/[...rest] catch-all routes truly random paths
    // through the locale not-found.tsx (with the full egg layer) instead of
    // the bare root not-found.tsx.
    await page.goto("/totally-made-up-route-zzzz");
    await expect(page.locator("canvas, [data-egg='dino-game-fallback']").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("?via=og deep link unlocks the OG-QR egg", async ({ page }) => {
    await page.goto("/secret?via=og");
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("phoenix:eggs:v1");
      return Boolean(raw && raw.includes("og-qr-scan"));
    });
  });

  test("typing 'phoenix' anywhere unlocks the phoenix-type egg", async ({ page }) => {
    await page.goto("/");
    await page.locator("body").click();
    await page.keyboard.type("phoenix");
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("phoenix:eggs:v1");
      return Boolean(raw && raw.includes("phoenix-type"));
    });
  });

  test("/robots.txt is served with the egg-flavored ASCII header", async ({ page }) => {
    const res = await page.goto("/robots.txt");
    expect(res?.status()).toBe(200);
    const body = (await page.content()) || "";
    expect(body).toContain("hello, crawler");
    expect(body.toLowerCase()).toContain("user-agent: *");
  });

  test("/humans.txt visit then returning to site unlocks humans-txt egg", async ({ page }) => {
    // Hit /humans.txt first (sets it as the referrer in the same tab).
    await page.goto("/humans.txt");
    // Navigate back to the app; the referrer detection in global-listeners
    // should flip humans-txt on.
    await page.goto("/");
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("phoenix:eggs:v1");
      return Boolean(raw && raw.includes("humans-txt"));
    });
  });
});
