import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Routes that ship to production and should pass WCAG 2.1 A + AA.
const ROUTES = [
  "/",
  "/about",
  "/work",
  "/experience",
  "/skills",
  "/competitive-programming",
  "/contact",
];

for (const route of ROUTES) {
  test(`a11y: ${route} has no WCAG 2.1 A/AA violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect.soft(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
