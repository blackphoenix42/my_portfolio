import { test, expect, type Page } from "@playwright/test";

async function openChat(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Ask Ayush", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Ask Ayush" });
  await expect(dialog.getByPlaceholder("Ask a question…")).toBeVisible();
  return dialog;
}

test("answers immediately with the separate corpus endpoint unavailable and AI off", async ({
  page,
}) => {
  await page.route("**/chatbot/corpus.json", (route) => route.fulfill({ status: 503 }));
  const modelRequests: string[] = [];
  page.on("request", (request) => {
    if (/huggingface|hf\.co|web-llm.*wasm|wllama\.wasm/.test(request.url()))
      modelRequests.push(request.url());
  });
  const dialog = await openChat(page);
  await dialog.getByPlaceholder("Ask a question…").fill("What does Ayush do at Cadence?");
  await dialog.getByRole("button", { name: "Send", exact: true }).click();
  await expect(dialog.getByText("Sources:", { exact: false })).toBeVisible();
  await expect(dialog.locator(".whitespace-pre-wrap").last()).toContainText("Cadence");
  await expect(dialog).not.toContainText(/failed to load|knowledge base|try again later/i);
  expect(modelRequests).toEqual([]);
});

for (const width of [390, 1280]) {
  test(`launcher stays above the scroll arrows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const launcher = page.getByRole("button", { name: "Ask Ayush", exact: true });
    await expect(launcher).toBeVisible();
    const down = page.getByRole("button", { name: "Scroll to bottom" });
    await expect(down).toBeVisible();
    const botBox = (await launcher.boundingBox())!;
    const downBox = (await down.boundingBox())!;
    expect(botBox.y + botBox.height).toBeLessThan(downBox.y);
    expect(botBox.x).toBe(downBox.x);
    await page.evaluate(() =>
      window.scrollTo({
        top: (document.documentElement.scrollHeight - innerHeight) / 2,
        behavior: "instant",
      }),
    );
    const up = page.getByRole("button", { name: "Scroll to top" });
    await expect(up).toBeVisible();
    await expect(down).toBeVisible();
    const middleBot = (await launcher.boundingBox())!;
    expect(middleBot.y + middleBot.height).toBeLessThan((await up.boundingBox())!.y);
    await launcher.click();
    const dialog = page.getByRole("dialog", { name: "Ask Ayush" });
    await dialog.getByRole("button", { name: "Open assistant settings" }).click();
    await expect(dialog.getByRole("heading", { name: "Assistant settings" })).toBeVisible();
    const panelBox = (await dialog.boundingBox())!;
    expect(panelBox.width).toBeLessThanOrEqual(width);
    expect(panelBox.y).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: `test-results/chat-settings-${width}.png` });
  });
}

test("settings explain options and persist preferences without enabling AI", async ({ page }) => {
  const dialog = await openChat(page);
  await dialog.getByRole("button", { name: "Open assistant settings" }).click();
  await expect(
    dialog.getByRole("radio", { name: "Quick answers · AI off", exact: true }),
  ).toBeChecked();
  await expect(dialog.getByRole("radio", { name: "Device GPU", exact: true })).toBeVisible();
  await expect(dialog.getByRole("radio", { name: "Device CPU", exact: true })).toBeVisible();
  await expect(dialog).toContainText("705 MB");
  await expect(dialog).toContainText("429 MB");
  await expect(dialog).toContainText("Recommended for this device");
  await dialog.getByRole("combobox", { name: /AI answer length/ }).selectOption("detailed");
  await dialog.getByRole("combobox", { name: /AI context/ }).selectOption("thorough");
  await dialog.getByRole("checkbox", { name: /Keep AI ready/ }).check();
  await dialog.getByRole("button", { name: "Close assistant" }).click();
  await page.getByRole("button", { name: "Ask Ayush", exact: true }).click();
  await dialog.getByRole("button", { name: "Open assistant settings" }).click();
  await expect(dialog.getByRole("combobox", { name: /AI answer length/ })).toHaveValue("detailed");
  await expect(dialog.getByRole("combobox", { name: /AI context/ })).toHaveValue("thorough");
  await expect(dialog.getByRole("checkbox", { name: /Keep AI ready/ })).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(dialog.getByPlaceholder("Ask a question…")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("failed CPU download returns to useful quick answers without an error banner", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "deviceMemory", { value: 8, configurable: true }),
  );
  await page.route("https://huggingface.co/**", (route) => route.abort());
  const dialog = await openChat(page);
  await dialog.getByRole("button", { name: "Open assistant settings" }).click();
  await dialog.getByRole("radio", { name: "Device CPU", exact: true }).check();
  await expect(dialog.getByRole("status")).toContainText("Quick answers are active", {
    timeout: 20_000,
  });
  await expect(
    dialog.getByRole("radio", { name: "Quick answers · AI off", exact: true }),
  ).toBeChecked();
  await dialog.getByRole("button", { name: "Back to chat" }).click();
  await dialog.getByPlaceholder("Ask a question…").fill("Tell me about MAESTRO");
  await dialog.getByRole("button", { name: "Send", exact: true }).click();
  await expect(dialog.getByText("Sources:", { exact: false })).toBeVisible();
  await expect(dialog.locator(".whitespace-pre-wrap").last()).toContainText("MAESTRO");
  await expect(dialog).not.toContainText(/error|failed|knowledge base/i);
});

test("unavailable GPU is explained and cannot be enabled", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "gpu", { value: undefined, configurable: true }),
  );
  const dialog = await openChat(page);
  await dialog.getByRole("button", { name: "Open assistant settings" }).click();
  await expect(dialog.getByRole("radio", { name: "Device GPU", exact: true })).toBeDisabled();
  await expect(dialog).toContainText("GPU AI is unavailable in this browser");
});

test("independent chats survive closing; context and transcript clear separately", async ({
  page,
}) => {
  const dialog = await openChat(page);
  await dialog.getByPlaceholder("Ask a question…").fill("Tell me about MAESTRO");
  await dialog.getByRole("button", { name: "Send", exact: true }).click();
  await expect(dialog.locator(".whitespace-pre-wrap")).toHaveCount(2);
  await dialog.getByRole("button", { name: "New chat", exact: true }).click();
  await expect(dialog.locator(".whitespace-pre-wrap")).toHaveCount(0);
  await dialog.getByPlaceholder("Ask a question…").fill("Tell me about C++");
  await dialog.getByRole("button", { name: "Send", exact: true }).click();
  await dialog.getByRole("combobox", { name: "Choose a chat" }).selectOption({ index: 0 });
  await expect(dialog.locator(".whitespace-pre-wrap").first()).toHaveText("Tell me about MAESTRO");
  await dialog.getByRole("button", { name: "Clear context", exact: true }).click();
  await expect(dialog.locator(".whitespace-pre-wrap")).toHaveCount(2);
  const saved = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("phoenix:chat:sessions")!),
  );
  expect(saved.chats[0].contextStart).toBe(2);
  expect(saved.chats[1].contextStart).toBe(0);
  await dialog.getByRole("button", { name: "Close assistant" }).click();
  await page.getByRole("button", { name: "Ask Ayush", exact: true }).click();
  await expect(dialog.locator(".whitespace-pre-wrap").first()).toHaveText("Tell me about MAESTRO");
  await dialog.getByRole("button", { name: "Clear chat", exact: true }).click();
  await expect(dialog.locator(".whitespace-pre-wrap")).toHaveCount(0);
  await dialog.getByRole("combobox", { name: "Choose a chat" }).selectOption({ index: 1 });
  await expect(dialog.locator(".whitespace-pre-wrap").first()).toHaveText("Tell me about C++");
});

test("site settings and chatbot share preferences; model removal clears only model caches", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await (await caches.open("webllm/model")).put("/fake-model", new Response("model"));
    await (await caches.open("unrelated-cache")).put("/keep", new Response("keep"));
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle("cache", { create: true });
    const file = await dir.getFileHandle("cpu-test.gguf", { create: true });
    const writer = await file.createWritable();
    await writer.write("test model");
    await writer.close();
  });
  await page.getByRole("button", { name: "Open site settings" }).click();
  await page.getByRole("menuitem", { name: "Ask Ayush settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Ask Ayush" });
  await expect(dialog.getByRole("heading", { name: "Assistant settings" })).toBeVisible();
  await dialog.getByRole("combobox", { name: /AI answer length/ }).selectOption("detailed");
  await dialog.getByRole("button", { name: "Remove downloaded models", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Downloaded models removed", {
    timeout: 20_000,
  });
  expect(await page.evaluate(() => caches.keys())).toEqual(["unrelated-cache"]);
  expect(
    await page.evaluate(async () => {
      const dir = await (await navigator.storage.getDirectory()).getDirectoryHandle("cache");
      try {
        await dir.getFileHandle("cpu-test.gguf");
        return true;
      } catch {
        return false;
      }
    }),
  ).toBe(false);
  await dialog.getByRole("button", { name: "Back to chat" }).click();
  await dialog.getByRole("button", { name: "Open assistant settings" }).click();
  await expect(dialog.getByRole("combobox", { name: /AI answer length/ })).toHaveValue("detailed");
  await expect(
    dialog.getByRole("radio", { name: "Quick answers · AI off", exact: true }),
  ).toBeChecked();
});
