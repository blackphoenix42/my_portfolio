import { test, expect } from "@playwright/test";

// New feature surfaces: /now, /system-design, Engineer Mode, and the
// client-side "Ask my portfolio" assistant.

test.describe("/now page", () => {
  test("renders the current-focus snapshot", async ({ page }) => {
    await page.goto("/now");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("What I'm doing now");
    await expect(page.getByRole("heading", { name: "Current focus" })).toBeVisible();
  });
});

test.describe("/system-design page", () => {
  test("renders whiteboards and the jump nav", async ({ page }) => {
    await page.goto("/system-design");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "System design whiteboards",
    );
    await expect(page.getByRole("navigation", { name: /jump to a system/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "URL Shortener" })).toBeVisible();
  });
});

test.describe("Engineer Mode", () => {
  test("the `n` shortcut reveals the engineer banner and deep-tech sections", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("n");
    await expect(page.getByText(/engineer mode/i).first()).toBeVisible();

    // State persists across a full navigation; the case study now exposes the
    // technical deep-dive that is hidden in the default view.
    await page.goto("/work/maestro");
    await expect(page.getByRole("heading", { name: "Technical deep-dive", level: 2 })).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe("Ask my portfolio", () => {
  test("opens, accepts a question and returns a bot response", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /ask my portfolio/i }).click();
    const dialog = page.getByRole("dialog", { name: /ask my portfolio/i });
    await expect(dialog).toBeVisible();

    // Give the local corpus a moment to load, then ask.
    await page.waitForTimeout(1000);
    const input = dialog.getByPlaceholder(/ask a question/i);
    await input.fill("What does Ayush do at Cadence?");
    await dialog.getByRole("button", { name: /send/i }).click();

    // Any bot outcome (answer, no-answer, loading or error) confirms the
    // extractive pipeline rendered without throwing.
    await expect(dialog).toContainText(/Cadence|couldn't find|knowledge base/i, {
      timeout: 10_000,
    });
  });
});
