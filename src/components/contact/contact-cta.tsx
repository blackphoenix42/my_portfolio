"use client";

import { Mail, FileDown, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Github, Linkedin } from "@/components/icons/brand";
import { SITE } from "@/content/profile";
import { Link } from "@/i18n/navigation";

export function ContactCTA() {
  const t = useTranslations("contactCta");
  const tCommon = useTranslations("common");
  return (
    <section className="section" aria-label={t("eyebrow")}>
      <div className="container-tight">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div
            className="bg-accent-violet/20 absolute -top-32 -right-32 h-80 w-80 rounded-full blur-3xl"
            aria-hidden
          />
          <div
            className="bg-accent-cyan/20 absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mono-label">{t("eyebrow")}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("heading")}
              </h2>
              <p className="text-fg-muted mt-4 max-w-lg">{t("subheading")}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/contact" className="btn-primary">
                  {t("cta")} <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={SITE.resumePath} download className="btn-secondary">
                  <FileDown className="h-4 w-4" /> {t("downloadResume")}
                </a>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              <ContactLink
                icon={Mail}
                label={tCommon("email")}
                value={SITE.email}
                href={`mailto:${SITE.email}`}
              />
              <ContactLink
                icon={Linkedin}
                label={tCommon("linkedin")}
                value={t("linkedinHandle")}
                href={SITE.linkedin}
              />
              <ContactLink
                icon={Github}
                label={tCommon("github")}
                value={t("githubHandle")}
                href={SITE.github}
              />
              <ContactLink
                icon={FileDown}
                label={tCommon("resume")}
                value={t("resumeValue")}
                href={SITE.resumePath}
                download
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  icon: Icon,
  label,
  value,
  href,
  download,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  download?: boolean;
}) {
  return (
    <li>
      <a href={href} download={download} className="card card-hover flex items-center gap-3 p-3">
        <span className="border-border bg-bg-sunken text-fg-muted rounded-md border p-2">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="text-fg-subtle block font-mono text-[10px] tracking-widest uppercase">
            {label}
          </span>
          <span className="text-fg block truncate text-sm">{value}</span>
        </span>
      </a>
    </li>
  );
}
