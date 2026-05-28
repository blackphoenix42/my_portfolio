"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { useEffect, type ReactNode } from "react";

type Props = {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
};

// Filter MISSING_MESSAGE noise emitted by next-intl on the client.
// We can't pass `onError` directly to NextIntlClientProvider from any
// render path that crosses the RSC serialization boundary (Next 16 rejects
// function props on Client Components), so we patch `console.error` once
// on mount to swallow only next-intl's missing-message reports.
function useSilenceMissingMessage() {
  useEffect(() => {
    const original = console.error;
    console.error = (...args: unknown[]) => {
      const first = args[0];
      if (typeof first === "string" && first.includes("MISSING_MESSAGE")) return;
      if (
        first &&
        typeof first === "object" &&
        "code" in first &&
        (first as { code?: string }).code === "MISSING_MESSAGE"
      ) {
        return;
      }
      original.apply(console, args as Parameters<typeof console.error>);
    };
    return () => {
      console.error = original;
    };
  }, []);
}

export function IntlClientProvider({ locale, messages, children }: Props) {
  useSilenceMissingMessage();
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
