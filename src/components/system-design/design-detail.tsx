"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { getSystemDesign } from "@/content/system-design";
import { SystemWhiteboard } from "./system-whiteboard";
import { cn } from "@/lib/utils";

const TABS = ["demo", "hld", "lld", "decisions"] as const;
export function DesignDetail({ slug }: { slug: string }) {
  const t = useTranslations("systemDesign");
  const [tab, setTab] = useState<(typeof TABS)[number]>("demo");
  const id = useId();
  const item = getSystemDesign(slug)!;
  const text = (key: string) => t(`systems.${slug}.${key}` as never);
  return (
    <>
      <div role="tablist" aria-label={t("detailTabs")} className="my-8 flex flex-wrap gap-2">
        {TABS.map((key, i) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${id}-${key}`}
            aria-controls={`${id}-panel`}
            aria-selected={tab === key}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(e) => {
              const next =
                e.key === "ArrowRight"
                  ? (i + 1) % TABS.length
                  : e.key === "ArrowLeft"
                    ? (i + TABS.length - 1) % TABS.length
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? TABS.length - 1
                        : -1;
              if (next >= 0) {
                e.preventDefault();
                setTab(TABS[next]!);
                document.getElementById(`${id}-${TABS[next]}`)?.focus();
              }
            }}
            className={cn("chip px-4 py-2", tab === key && "border-accent-cyan text-accent-cyan")}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${tab}`}
        tabIndex={0}
        className="card p-5 sm:p-8"
      >
        {tab === "demo" && (
          <>
            <p className="text-fg-muted mb-6 text-sm">{t("demoScope")}</p>
            <SystemWhiteboard slug={slug} />
          </>
        )}
        {tab === "hld" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">{t("requirements")}</h2>
              <ul className="text-fg-muted mt-3 list-disc space-y-2 pl-5">
                {item.requirements.map((_, i) => (
                  <li key={i}>{text(`requirements.${i}`)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t("components")}</h2>
              <ol className="mt-4 grid gap-4 sm:grid-cols-2">
                {item.components.map((_, i) => (
                  <li key={i} className="border-border rounded-lg border p-4">
                    <h3 className="text-accent-cyan font-semibold">
                      {text(`components.${i}.name`)}
                    </h3>
                    <p className="text-fg-muted mt-2 text-sm">{text(`components.${i}.role`)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        {tab === "lld" && (
          <div className="space-y-6">
            {["dataModel", "api", "execution"].map((key) => (
              <section key={key}>
                <h2 className="text-lg font-semibold">{t(`lldLabels.${key}`)}</h2>
                <p className="text-fg-muted mt-3 text-sm leading-relaxed whitespace-pre-line">
                  {text(`lld.${key}`)}
                </p>
              </section>
            ))}
          </div>
        )}
        {tab === "decisions" && (
          <>
            <h2 className="text-lg font-semibold">{t("tradeoffs")}</h2>
            <ul className="text-fg-muted mt-4 list-disc space-y-3 pl-5">
              {item.tradeoffs.map((_, i) => (
                <li key={i}>{text(`tradeoffs.${i}`)}</li>
              ))}
            </ul>
            <h2 className="mt-8 text-lg font-semibold">{t("failureModes")}</h2>
            <p className="text-fg-muted mt-3 text-sm">{text("lld.failures")}</p>
          </>
        )}
      </div>
    </>
  );
}
