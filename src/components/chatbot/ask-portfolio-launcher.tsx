"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";
import { isAnyOverlayOpen } from "@/components/eggs/overlay-state";

// The panel (and the corpus fetch) only load once the user opens the assistant.
const AskPortfolio = dynamic(
  () => import("./ask-portfolio").then((m) => ({ default: m.AskPortfolio })),
  { ssr: false },
);

export function AskPortfolioLauncher() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("open-ask-portfolio", onOpen as EventListener);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-ask-portfolio", onOpen as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => {
            if (isAnyOverlayOpen()) return;
            setOpen(true);
          }}
          aria-label={t("open")}
          title={t("open")}
          className="border-accent-cyan/40 bg-bg-elev/90 text-accent-cyan hover:border-accent-cyan hover:bg-bg-elev fixed bottom-4 left-4 z-[70] hidden h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-colors md:inline-flex"
        >
          <Bot className="h-5 w-5" />
        </button>
      )}
      <AnimatePresence>{open && <AskPortfolio onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
