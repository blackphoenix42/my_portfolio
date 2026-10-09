import { test, expect } from "@playwright/test";

test("mobile Work hydrates with reduced motion and stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work");
  await page.getByRole("button", { name: "See more projects" }).click();
  await expect(page.getByRole("button", { name: "Show top four" })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("Work expands previews and opens stacked design detail", async ({ page }) => {
  await page.goto("/work");
  const projects = page.getByRole("region", { name: "Featured projects", exact: true });
  await expect(projects.locator("article")).toHaveCount(4);
  await projects.getByRole("button", { name: "See more projects" }).click();
  expect(await projects.locator("article").count()).toBeGreaterThan(4);
  const designs = page.getByRole("region", { name: "System design whiteboards", exact: true });
  await expect(designs.locator("article")).toHaveCount(4);
  await designs.getByRole("button", { name: "See more whiteboards" }).click();
  await expect(designs.locator("article")).toHaveCount(6);
  await designs.getByRole("link", { name: "Log Analytics Pipeline", exact: true }).click();
  await expect(page).toHaveURL(/\/system-design\/log-analytics$/);
  await expect(page.getByRole("heading", { name: "Architecture demo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "High-level design" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Architecture diagram" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Low-level design" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Data model", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pseudocode" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Trade-offs & failures" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Failure modes & recovery" })).toBeVisible();
  await expect(page.getByText("Stage 1 of 9")).toBeVisible();
  await page.getByRole("button", { name: "Next stage" }).click();
  await expect(page.getByText("Stage 2 of 9")).toBeVisible();
});

test("applied skills and consolidated plans are available without footer clutter", async ({
  page,
}) => {
  await page.goto("/skills");
  await page
    .getByRole("group", { name: "Applied engineering", exact: true })
    .getByRole("button", { name: /Performance Core/ })
    .click();
  await expect(page.getByRole("heading", { name: "Applied in", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Xcelium Logic Simulator/ })).toBeVisible();
  await page.goto("/competitive-programming");
  await expect(page.getByRole("heading", { name: "Current focus", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Delivery timeline · 2027" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ship a small working slice" })).toBeVisible();
  await expect(
    page.locator("footer").getByRole("link", { name: /Now|System design/i }),
  ).toHaveCount(0);
});

test("Engineer Mode is off by default and enabled in site settings", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("engineer-mode", "1"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-engineer", "0");
  await page.getByRole("button", { name: "Open site settings" }).click();
  const toggle = page.getByRole("menuitemcheckbox", { name: /Engineer mode/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-engineer", "1");
});

test("feeds expose their original XML in new tabs", async ({ page }) => {
  await page.goto("/feeds");
  const links = page.getByRole("link", { name: "Open XML feed" });
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(links).toHaveAttribute("href", /\/feeds\/(medium\.xml|youtube\.xml|github\.atom)/);
  await expect(links.nth(0)).toHaveAttribute("href", "/feeds/medium.xml");
  await expect(links.nth(1)).toHaveAttribute("href", "/feeds/youtube.xml");
  await expect(links.nth(2)).toHaveAttribute("href", "/feeds/github.atom");
});
