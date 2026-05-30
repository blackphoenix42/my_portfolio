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
    sessionStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Pin to 08:30 local so the morning bucket is exercised.
    const fixed = new Date();
    fixed.setHours(8, 30, 0, 0);
    vi.setSystemTime(fixed);
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it("renders a toggle button with the localized greeting in its aria-label", async () => {
    renderChip();
    const button = await screen.findByRole("button", { name: /good morning/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("auto-opens once per session and marks sessionStorage", async () => {
    renderChip();
    await screen.findByRole("button", { name: /good morning/i });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(sessionStorage.getItem("greeting-seen-v1")).toBe("1");
  });

  it("does not auto-open when the session flag is already set", async () => {
    sessionStorage.setItem("greeting-seen-v1", "1");
    renderChip();
    await screen.findByRole("button", { name: /good morning/i });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("toggles the popover when the button is clicked", async () => {
    sessionStorage.setItem("greeting-seen-v1", "1");
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
    await user.click(screen.getByRole("button", { name: /dismiss greeting/i }));
    await waitFor(() => expect(button).toHaveAttribute("aria-expanded", "false"));
  });

  it("closes when Escape is pressed", async () => {
    sessionStorage.setItem("greeting-seen-v1", "1");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderChip();
    const button = await screen.findByRole("button", { name: /good morning/i });
    await user.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(button).toHaveAttribute("aria-expanded", "false"));
  });
});
