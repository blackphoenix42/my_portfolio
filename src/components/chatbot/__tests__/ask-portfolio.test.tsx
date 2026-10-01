import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, it, vi } from "vitest";
import messages from "../../../../messages/en.json";
import { parseSettings } from "@/lib/chatbot/settings";
import { AskPortfolio } from "../ask-portfolio";
import { useLocalLlm } from "../use-local-llm";

vi.mock("../use-local-llm", () => ({ useLocalLlm: vi.fn() }));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("shows a quick answer at the deadline and ignores late tokens after clearing", async () => {
  vi.useFakeTimers();
  sessionStorage.clear();
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: vi.fn() });
  let release!: () => void;
  const stalled = new Promise<void>((resolve) => {
    release = resolve;
  });
  const engine = {
    load: vi.fn(),
    unload: vi.fn(),
    interrupt: vi.fn(),
    scheduleUnload: vi.fn(),
    stream: async function* () {
      await stalled;
      yield "late unwanted response";
    },
  };
  const fail = vi.fn();
  vi.mocked(useLocalLlm).mockReturnValue({
    settings: parseSettings(null),
    device: null,
    state: { status: "ready", engine: "gpu" },
    runtime: { current: engine },
    update: vi.fn(),
    fail,
    removal: "idle",
    removeModels: vi.fn(),
  });
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <AskPortfolio onClose={vi.fn()} />
    </NextIntlClientProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText("Ask a question…"), {
    target: { value: "Tell me about MAESTRO" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(screen.getByRole("button", { name: "Clear chat" })).toBeDisabled();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(8000);
  });
  expect(fail).toHaveBeenCalledOnce();
  expect(screen.getByText(/Sources:/)).toBeVisible();
  expect(screen.getByRole("button", { name: "Clear chat" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Clear chat" }));
  await act(async () => {
    release();
  });
  expect(screen.queryByText("late unwanted response")).not.toBeInTheDocument();
  expect(screen.queryByText(/Sources:/)).not.toBeInTheDocument();
});
