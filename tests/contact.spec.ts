import { test, expect } from "@playwright/test";

test("contact form validates required fields", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /Send message/i }).click();
  // HTML5 required will block submission — but Zod fallback also runs on partial fills:
  await page.getByLabel("Name *").fill("Recruiter Test");
  await page.getByLabel("Email *").fill("not-an-email");
  await page.getByLabel("Subject *").fill("Hi");
  await page.getByLabel("Message *").fill("short");
  await page.getByRole("button", { name: /Send message/i }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
});

test("contact form happy path (dev mode without RESEND_API_KEY soft-succeeds)", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Name *").fill("Recruiter Test");
  await page.getByLabel("Email *").fill("recruiter@example.com");
  await page.getByLabel("Subject *").fill("Exploring senior engineer roles");
  await page
    .getByLabel("Message *")
    .fill(
      "Hi Ayush, I'd love to chat about a senior performance engineering role on our infrastructure team. Could we set up a 30-minute conversation next week?",
    );
  await page.getByRole("button", { name: /Send message/i }).click();
  await expect(page.getByRole("heading", { name: /Message sent\./i })).toBeVisible({
    timeout: 15_000,
  });
});
