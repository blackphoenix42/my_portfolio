import { test, expect } from "@playwright/test";

// With `localePrefix: "never"` the URL never changes — every locale lives at
// the same path. These tests assert that switching language updates the
// rendered text and the `<html lang>` attribute, but leaves the URL alone.

test.describe("i18n", () => {
  test("default locale renders English at root", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "Home", exact: true }).first()).toBeVisible();
  });

  test("Accept-Language: hi serves Hindi content at the same URL", async ({ browser }) => {
    const context = await browser.newContext({ locale: "hi-IN" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(page.getByRole("link", { name: "होम", exact: true })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/");
    await context.close();
  });

  test("Accept-Language: ja serves Japanese content at the same URL", async ({ browser }) => {
    const context = await browser.newContext({ locale: "ja-JP" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByRole("link", { name: "ホーム", exact: true })).toBeVisible();
    await context.close();
  });

  test("NEXT_LOCALE cookie wins over Accept-Language", async ({ browser }) => {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { Cookie: "NEXT_LOCALE=zh" },
    });
    await context.addCookies([{ name: "NEXT_LOCALE", value: "zh", url: "http://localhost:3000" }]);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");
    await expect(page.getByRole("link", { name: "首页", exact: true })).toBeVisible();
    await context.close();
  });

  test("language switcher lists all six languages", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Open the consolidated settings menu, then enter the Language submenu.
    await page
      .getByRole("button", { name: /site settings/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /language/i }).click();
    for (const name of ["English", "हिन्दी", "日本語", "संस्कृतम्", "中文", "Русский"]) {
      await expect(page.getByRole("menuitemradio", { name, exact: true })).toBeVisible();
    }
  });

  test("switching language preserves the URL and updates content", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    const originalPath = new URL(page.url()).pathname;

    await page
      .getByRole("button", { name: /site settings/i })
      .first()
      .click();
    await page.getByRole("menuitem", { name: /language/i }).click();
    await page.getByRole("menuitemradio", { name: "हिन्दी", exact: true }).click();

    // URL should not change, but the page must re-render in Hindi.
    await expect(page.locator("html")).toHaveAttribute("lang", "hi", { timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe(originalPath);
  });

  test("footer renders translated label without glued-together text", async ({ browser }) => {
    const context = await browser.newContext({ locale: "hi-IN" });
    const page = await context.newPage();
    await page.goto("/");
    const footer = page.locator("footer").first();
    const text = await footer.innerText();
    expect(text).toContain("Next.js");
    // No glued-together rendering of "गयाNext.js".
    expect(text).not.toMatch(/गयाNext\.js/);
    await context.close();
  });

  test("data-scroll-behavior is set regardless of detected locale", async ({ browser }) => {
    const context = await browser.newContext({ locale: "hi-IN" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-scroll-behavior", "smooth");
    await context.close();
  });
});
