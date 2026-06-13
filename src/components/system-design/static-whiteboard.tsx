"use client";

import { ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { getSystemDesign } from "@/content/system-design";

// Static diagram for systems whose interactive whiteboard is not built yet.
// Renders the component flow from content + a "coming soon" badge.
export function StaticWhiteboard({ slug }: { slug: string }) {
  const t = useTranslations("systemDesign");
  const item = getSystemDesign(slug);
  if (!item) return null;
  return (
    <div className="space-y-4">
      <span className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase">
        <Clock className="h-3 w-3" /> {t("comingSoon")}
      </span>
      <div className="border-border bg-bg-sunken/40 flex flex-wrap items-center gap-2 rounded-lg border p-4">
        {item.components.map((c, i) => (
          <div key={c.name} className="flex items-center gap-2">
            <span className="border-border bg-bg-elev/70 text-fg-muted rounded-md border px-3 py-2 text-center font-mono text-[11px]">
              {c.name}
            </span>
            {i < item.components.length - 1 && (
              <ArrowRight className="text-fg-subtle h-3.5 w-3.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
