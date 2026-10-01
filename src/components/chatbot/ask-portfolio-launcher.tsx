"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";
import { isAnyOverlayOpen } from "@/components/eggs/overlay-state";

// The panel and its bundled corpus only load once the user opens the assistant.
const AskPortfolio = dynamic(
  () => import("./ask-portfolio").then((m) => ({ default: m.AskPortfolio })),
  { ssr: false },
);

export function AskPortfolioLauncher() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);
  const [settingsRequest, setSettingsRequest] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onSettings = () => {
      setSettingsRequest((n) => n + 1);
      setOpen(true);
    };
    window.addEventListener("open-ask-portfolio", onOpen as EventListener);
    window.addEventListener("open-chat-settings", onSettings);
    return () => {
      window.removeEventListener("open-ask-portfolio", onOpen as EventListener);
      window.removeEventListener("open-chat-settings", onSettings);
    };
  }, []);

  // The panel is non-modal, so hand focus back to where it came from on close.
  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      {!open && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            if (isAnyOverlayOpen()) return;
            setOpen(true);
          }}
          aria-label={t("open")}
          title={t("open")}
          className="border-accent-cyan/40 bg-bg-elev/90 text-accent-cyan hover:border-accent-cyan hover:bg-bg-elev pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-colors"
        >
          <Bot className="h-5 w-5" />
        </button>
      )}
      <AnimatePresence>
        {open && (
          <AskPortfolio
            settingsRequest={settingsRequest}
            onClose={() => {
              setOpen(false);
              setSettingsRequest(0);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
