"use client";

import { ArrowLeft, Command as CmdIcon, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function NotFoundActions({
  backLabel,
  searchLabel,
  homeLabel,
}: {
  backLabel: string;
  searchLabel: string;
  homeLabel: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/" className="btn-primary">
        <Home className="h-4 w-4" /> {homeLabel}
      </Link>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-command-menu"))}
        className="btn-secondary"
      >
        <CmdIcon className="h-4 w-4" /> {searchLabel}
        <kbd className="bg-bg-sunken ml-1 rounded px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </button>
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? window.history.back() : null)}
        className="btn-ghost text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </button>
    </div>
  );
}
