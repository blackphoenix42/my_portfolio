import { getTranslations } from "next-intl/server";
import { getSystemDesign, systemDesignNotes } from "@/content/system-design";
import { SystemWhiteboard } from "./system-whiteboard";
import { UmlDiagram } from "./uml-diagram";

export async function DesignDetail({ slug }: { slug: string }) {
  const t = await getTranslations("systemDesign");
  const item = getSystemDesign(slug)!;
  const notes = systemDesignNotes[slug]!;
  const text = (key: string) => t(`systems.${slug}.${key}` as never);

  return (
    <div className="mt-10 space-y-12">
      <section aria-labelledby="demo-heading" className="card p-5 sm:p-8">
        <h2 id="demo-heading" className="text-xl font-semibold">
          {t("tabs.demo")}
        </h2>
        <p className="text-fg-muted mt-3 mb-6 text-sm">{t("demoScope")}</p>
        <SystemWhiteboard slug={slug} />
      </section>

      <section aria-labelledby="hld-heading" className="card space-y-8 p-5 sm:p-8">
        <h2 id="hld-heading" className="text-xl font-semibold">
          {t("tabs.hld")}
        </h2>
        <div>
          <h3 className="text-lg font-semibold">{t("requirements")}</h3>
          <ul className="text-fg-muted mt-3 list-disc space-y-2 pl-5">
            {item.requirements.map((_, index) => (
              <li key={index}>{text(`requirements.${index}`)}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t("components")}</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {item.components.map((_, index) => (
              <li key={index} className="border-border rounded-lg border p-4">
                <h4 className="text-accent-cyan font-semibold">
                  {text(`components.${index}.name`)}
                </h4>
                <p className="text-fg-muted mt-2 text-sm">{text(`components.${index}.role`)}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t("uml")}</h3>
          <div className="mt-4">
            <UmlDiagram slug={slug} />
          </div>
        </div>
      </section>

      <section aria-labelledby="lld-heading" className="card space-y-6 p-5 sm:p-8">
        <h2 id="lld-heading" className="text-xl font-semibold">
          {t("tabs.lld")}
        </h2>
        {(["dataModel", "api", "execution"] as const).map((key) => (
          <div key={key}>
            <h3 className="text-lg font-semibold">{t(`lldLabels.${key}`)}</h3>
            <pre className="text-fg-muted mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {text(`lld.${key}`) || notes[key]}
            </pre>
          </div>
        ))}
        <div>
          <h3 className="text-lg font-semibold">{t("lldLabels.pseudocode")}</h3>
          <pre className="border-border bg-bg-sunken text-fg mt-3 overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {text("lld.pseudocode") || notes.pseudocode}
          </pre>
        </div>
      </section>

      <section aria-labelledby="decisions-heading" className="card p-5 sm:p-8">
        <h2 id="decisions-heading" className="text-xl font-semibold">
          {t("tabs.decisions")}
        </h2>
        <h3 className="mt-6 text-lg font-semibold">{t("tradeoffs")}</h3>
        <ul className="text-fg-muted mt-4 list-disc space-y-3 pl-5">
          {item.tradeoffs.map((_, index) => (
            <li key={index}>{text(`tradeoffs.${index}`)}</li>
          ))}
        </ul>
        <h3 className="mt-8 text-lg font-semibold">{t("failureModes")}</h3>
        <pre className="text-fg-muted mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">
          {text("lld.failures") || notes.failures}
        </pre>
      </section>
    </div>
  );
}
