import { test, expect } from "@playwright/test";

test("homepage renders core hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "performance-critical systems",
  );
  await expect(page.getByRole("link", { name: /View Projects/i })).toBeVisible();
});

test("primary navigation works", async ({ page }) => {
  await page.goto("/");
  // Wait until the client bundle is settled so the Next.js router has bound
  // its click interception.
  await page.waitForLoadState("networkidle");
  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  const workLink = primaryNav.getByRole("link", { name: "Work", exact: true });
  await Promise.all([
    page.waitForURL(/\/work$/, { waitUntil: "commit", timeout: 15_000 }),
    workLink.click(),
  ]);
  await expect(page.getByRole("heading", { level: 1, name: "Work" })).toBeVisible();
});

test("project detail loads", async ({ page }) => {
  await page.goto("/work/xmai");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("XMAI");
});
