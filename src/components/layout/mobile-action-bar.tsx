"use client";

import Link from "next/link";
import { FileDown, Mail } from "lucide-react";
import { Github } from "@/components/icons/brand";
import { SITE } from "@/content/profile";

export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 z-30 flex justify-center px-3 md:hidden"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="border-border bg-bg-elev/90 flex w-full max-w-sm items-center justify-around rounded-full border px-2 py-1.5 shadow-lg backdrop-blur">
        <a
          href={SITE.resumePath}
          download
          className="text-fg-muted hover:text-fg inline-flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]"
          aria-label="Download résumé"
        >
          <FileDown className="h-4 w-4" />
          Résumé
        </a>
        <Link
          href={SITE.github}
          className="text-fg-muted hover:text-fg inline-flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Link>
        <Link
          href="/contact"
          className="text-fg-muted hover:text-fg inline-flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]"
          aria-label="Contact"
        >
          <Mail className="h-4 w-4" />
          Contact
        </Link>
      </div>
    </div>
  );
}
