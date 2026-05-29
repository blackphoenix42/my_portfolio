import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Shield, Cookie, BarChart3, BadgeCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/content/profile";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${SITE.url}/privacy` },
  };
}

// Privacy content is static; revalidate weekly so it stays fresh enough
// without forcing a per-request render.
export const revalidate = 604_800;

const THIRD_PARTY_ROWS = ["vercel", "resend", "vercelAnalytics", "github"] as const;

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <article className="container-tight py-16">
      <header className="max-w-2xl">
        <p className="mono-label inline-flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" /> {t("tag")}
        </p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-fg-subtle mt-3 font-mono text-xs">
          {t("lastUpdated", { date: "May 2026" })}
        </p>
        <p className="text-fg-muted mt-4">
          {t.rich("intro", {
            site: SITE.url.replace(/^https?:\/\//, ""),
            strong: (chunks) => <strong className="text-fg font-medium">{chunks}</strong>,
          })}
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <SectionCard icon={Cookie} accent="amber" title={t("sections.collect.cookiesTitle")}>
          {t.rich("sections.collect.cookiesBody", {
            code: (chunks) => (
              <code className="bg-bg-sunken rounded px-1 font-mono text-[11px]">{chunks}</code>
            ),
          })}
        </SectionCard>

        <SectionCard icon={BarChart3} accent="violet" title={t("sections.collect.analyticsTitle")}>
          {t.rich("sections.collect.analyticsBody", {
            strong: (chunks) => <strong className="text-fg font-medium">{chunks}</strong>,
          })}
        </SectionCard>
      </section>

      <section className="mt-12">
        <h2 className="section-title">{t("sections.collect.title")}</h2>
        <dl className="text-fg-muted mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-fg text-sm font-semibold">{t("sections.collect.logsTitle")}</dt>
            <dd className="mt-2 text-sm leading-relaxed">{t("sections.collect.logsBody")}</dd>
          </div>
          <div>
            <dt className="text-fg text-sm font-semibold">{t("sections.collect.contactTitle")}</dt>
            <dd className="mt-2 text-sm leading-relaxed">
              {t.rich("sections.collect.contactBody", {
                code: (chunks) => (
                  <code className="bg-bg-sunken rounded px-1 font-mono text-[11px]">{chunks}</code>
                ),
              })}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="section-title">{t("sections.donot.title")}</h2>
        <ul className="text-fg-muted mt-4 grid gap-3 sm:grid-cols-2">
          {(["sell", "ads", "fingerprint", "fonts"] as const).map((k) => (
            <li key={k} className="card flex items-start gap-3 p-4 text-sm">
              <BadgeCheck className="text-accent-emerald mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {t.rich(`sections.donot.items.${k}`, {
                  code: (chunks) => (
                    <code className="bg-bg-sunken rounded px-1 font-mono text-[11px]">
                      {chunks}
                    </code>
                  ),
                })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="section-title">{t("sections.thirdParty.title")}</h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="text-fg-muted w-full text-left text-sm">
            <thead className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase">
              <tr className="border-border/60 border-b">
                <th className="px-4 py-3">{t("sections.thirdParty.headers.service")}</th>
                <th className="px-4 py-3">{t("sections.thirdParty.headers.purpose")}</th>
                <th className="px-4 py-3">{t("sections.thirdParty.headers.data")}</th>
              </tr>
            </thead>
            <tbody>
              {THIRD_PARTY_ROWS.map((row) => (
                <tr key={row} className="border-border/40 border-b last:border-b-0">
                  <td className="text-fg px-4 py-3 font-medium">
                    {t(`sections.thirdParty.rows.${row}.service`)}
                  </td>
                  <td className="px-4 py-3">{t(`sections.thirdParty.rows.${row}.purpose`)}</td>
                  <td className="px-4 py-3 text-xs">{t(`sections.thirdParty.rows.${row}.data`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-base font-semibold tracking-tight">{t("sections.rights.title")}</h3>
          <p className="text-fg-muted mt-2 text-sm">{t("sections.rights.body")}</p>
        </div>
        <div className="card p-5">
          <h3 className="text-base font-semibold tracking-tight">{t("sections.contact.title")}</h3>
          <p className="text-fg-muted mt-2 text-sm">
            {t.rich("sections.contact.body", {
              link: (chunks) => (
                <Link
                  href="/contact"
                  className="text-accent-cyan hover:text-fg underline-offset-4 hover:underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </section>
    </article>
  );
}

function SectionCard({
  icon: Icon,
  accent,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent: "amber" | "violet" | "emerald" | "cyan";
  title: string;
  children: React.ReactNode;
}) {
  const accentRing: Record<typeof accent, string> = {
    amber: "border-accent-amber/30 bg-accent-amber/5 text-accent-amber",
    violet: "border-accent-violet/30 bg-accent-violet/5 text-accent-violet",
    emerald: "border-accent-emerald/30 bg-accent-emerald/5 text-accent-emerald",
    cyan: "border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan",
  };
  return (
    <div className="card p-5">
      <div
        className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border ${accentRing[accent]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-fg-muted mt-2 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
