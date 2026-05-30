import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../../../messages/en.json";
import { quotes } from "@/content/quotes";
import { QuoteCard } from "@/components/quotes/quote-card";

function renderQuoteCard() {
  return render(
    <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
      <QuoteCard placement="footer" showTone />
    </NextIntlClientProvider>,
  );
}

describe("<QuoteCard />", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders a subtle 30-second refresh hint", () => {
    renderQuoteCard();
    expect(screen.getByLabelText("Programming quote")).toBeInTheDocument();
    expect(screen.getByText("Wait 30s for a new motivational or funny quote")).toBeInTheDocument();
  });

  it("rotates to the next quote after 30 seconds", async () => {
    renderQuoteCard();
    expect(screen.getByText(quotes[0]!.text)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });

    expect(screen.getByText(quotes[1]!.text)).toBeInTheDocument();
  });
});
