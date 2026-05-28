import { test, expect } from "@playwright/test";

test.describe("i18n", () => {
  test("Hindi locale renders Hindi nav", async ({ page }) => {
    await page.goto("/hi");
    await expect(page.getByRole("link", { name: "होम", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });

  test("Japanese locale renders Japanese nav", async ({ page }) => {
    await page.goto("/ja");
    await expect(page.getByRole("link", { name: "ホーム", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });

  test("Chinese locale renders Chinese nav", async ({ page }) => {
    await page.goto("/zh");
    await expect(page.getByRole("link", { name: "首页", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");
  });

  test("Russian locale renders Russian nav", async ({ page }) => {
    await page.goto("/ru");
    await expect(page.getByRole("link", { name: "Главная", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  });

  test("Sanskrit locale renders Sanskrit nav", async ({ page }) => {
    await page.goto("/sa");
    await expect(page.getByRole("link", { name: "मुख्यपृष्ठम्", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "sa");
  });

  test("default locale has no prefix and renders English", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "Home", exact: true }).first()).toBeVisible();
  });

  test("language switcher lists all six languages", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: /language|switch language/i }).first();
    await trigger.click();
    for (const name of ["English", "हिन्दी", "日本語", "संस्कृतम्", "中文", "Русский"]) {
      await expect(page.getByRole("menuitemradio", { name, exact: true })).toBeVisible();
    }
  });

  test("switching language navigates to localized route", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: /language|switch language/i }).first();
    await trigger.click();
    await Promise.all([
      page.waitForURL(/\/hi(\/|$)/, { timeout: 15_000 }),
      page.getByRole("menuitemradio", { name: "हिन्दी", exact: true }).click(),
    ]);
    // After a full reload the html lang attribute reflects the new locale
    // (Root layout reads the locale on each request).
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });

  test("non-default locale page exposes data-scroll-behavior", async ({ page }) => {
    await page.goto("/hi");
    await expect(page.locator("html")).toHaveAttribute("data-scroll-behavior", "smooth");
  });

  test("footer renders translated mono-label in Hindi with whitespace", async ({ page }) => {
    await page.goto("/hi");
    // Make sure the rendered text contains a separator between "बनाया गया" and the stack.
    const footer = page.locator("footer").first();
    const text = await footer.innerText();
    expect(text).toContain("बनाया गया");
    expect(text).toContain("Next.js");
    // No glued-together rendering of "गयाNext.js".
    expect(text).not.toMatch(/गयाNext\.js/);
  });
});
