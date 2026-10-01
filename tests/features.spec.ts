import { test, expect } from "@playwright/test";

// New feature surfaces: /now, /system-design, Engineer Mode, and the
// client-side "Ask Ayush" assistant.

test.describe("/now page", () => {
  test("renders the current-focus snapshot", async ({ page }) => {
    await page.goto("/now");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("What I'm doing now");
    await expect(page.getByRole("heading", { name: "Current focus" })).toBeVisible();
  });
});

test.describe("/system-design page", () => {
  test("renders the whiteboard gallery and detail route", async ({ page }) => {
    await page.goto("/system-design");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("System Design");
    await page.getByRole("link", { name: "URL Shortener", exact: true }).click();
    await expect(page.getByRole("tab", { name: "High-level design" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "URL Shortener" })).toBeVisible();
  });
});

test.describe("Engineer Mode", () => {
  test("the `n` shortcut reveals the engineer banner and deep-tech sections", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("n");
    await expect(page.getByText(/engineer mode/i).first()).toBeVisible();

    // Explicit enablement is scoped to this visit; re-enable after a full load.
    await page.goto("/work/maestro");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("n");
    await expect(page.getByRole("heading", { name: "Technical deep-dive", level: 2 })).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("Ask Ayush", () => {
  test("opens, accepts a question and returns a bot response", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /ask ayush/i }).click();
    const dialog = page.getByRole("dialog", { name: /ask ayush/i });
    await expect(dialog).toBeVisible();

    const input = dialog.getByPlaceholder(/ask a question/i);
    await input.fill("What does Ayush do at Cadence?");
    await dialog.getByRole("button", { name: /send/i }).click();

    await expect(dialog.getByText("Sources:", { exact: false })).toBeVisible();
    await expect(dialog.locator(".whitespace-pre-wrap").last()).toContainText("Cadence");
  });

  test("Escape closes the non-modal panel and returns focus to the launcher", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /ask ayush/i }).click();
    const dialog = page.getByRole("dialog", { name: /ask ayush/i });
    await expect(dialog.getByPlaceholder(/ask a question/i)).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: /ask ayush/i })).toBeFocused();
  });
});
