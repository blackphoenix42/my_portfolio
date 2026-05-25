import { test, expect } from "@playwright/test";

test("homepage renders core hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "performance-critical systems",
  );
  await expect(page.getByRole("link", { name: /Explore My Impact/i })).toBeVisible();
});

test("primary navigation works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Work", exact: true }).first().click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("heading", { name: "Case studies" })).toBeVisible();
});

test("project detail loads", async ({ page }) => {
  await page.goto("/work/xmai");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("XMAI");
});
