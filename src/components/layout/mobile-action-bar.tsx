"use client";

import Link from "next/link";
import { FileDown, Github, Mail } from "lucide-react";
import { SITE } from "@/content/profile";

export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 z-30 flex justify-center px-3 md:hidden"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex w-full max-w-sm items-center justify-around rounded-full border border-border bg-bg-elev/90 px-2 py-1.5 shadow-lg backdrop-blur">
        <a
          href={SITE.resumePath}
          download
          className="inline-flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] text-fg-muted hover:text-fg"
          aria-label="Download résumé"
        >
          <FileDown className="h-4 w-4" />
          Résumé
        </a>
        <Link
          href={SITE.github}
          className="inline-flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] text-fg-muted hover:text-fg"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Link>
        <Link
          href="/contact"
          className="inline-flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] text-fg-muted hover:text-fg"
          aria-label="Contact"
        >
          <Mail className="h-4 w-4" />
          Contact
        </Link>
      </div>
    </div>
  );
}
