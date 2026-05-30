import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import en from "../../../../messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: { href: string; children?: ReactNode } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { GreetingChip } from "@/components/layout/greeting-chip";

function renderChip() {
  return render(
    <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
      <GreetingChip />
    </NextIntlClientProvider>,
  );
}

describe("<GreetingChip />", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Pin to 08:30 local so the morning bucket is exercised.
    const fixed = new Date();
    fixed.setHours(8, 30, 0, 0);
    vi.setSystemTime(fixed);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
    vi.useRealTimers();
  });

  it("renders a toggle button with the localized greeting in its aria-label", async () => {
    renderChip();
    const button = await screen.findByRole("button", { name: /good morning/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("auto-opens on every visit", async () => {
    renderChip();
    await screen.findByRole("button", { name: /good morning/i });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("toggles the popover when the button is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderChip();
    const button = await screen.findByRole("button", { name: /good morning/i });
    await user.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
    expect(screen.getByText(/happy to have you here/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore the portfolio/i })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.queryByText(/where you are/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/thanks for stopping by/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/weather/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /dismiss greeting/i }));
    await waitFor(() => expect(button).toHaveAttribute("aria-expanded", "false"));
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderChip();
    const button = await screen.findByRole("button", { name: /good morning/i });
    await user.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(button).toHaveAttribute("aria-expanded", "false"));
  });

  it("does not request geolocation or render weather ambience", async () => {
    const getCurrentPosition = vi.fn();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    renderChip();

    await screen.findByRole("button", { name: /good morning/i });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(getCurrentPosition).not.toHaveBeenCalled();
    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
    expect(screen.queryByTestId("weather-ambient")).not.toBeInTheDocument();
    expect(screen.queryByText(/weather/i)).not.toBeInTheDocument();
  });
});
