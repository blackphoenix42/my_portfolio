"use client";

import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Github, Linkedin } from "@/components/icons/brand";
import { SITE } from "@/content/profile";
import { Link } from "@/i18n/navigation";

const PRINCIPLE_KEYS = ["profile", "gap", "trust", "performance"] as const;
const PRINCIPLE_DOTS: Record<(typeof PRINCIPLE_KEYS)[number], string> = {
  profile: "bg-accent-cyan",
  gap: "bg-accent-violet",
  trust: "bg-accent-emerald",
  performance: "bg-accent-amber",
};

export function AboutSection() {
  const t = useTranslations("aboutSection");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  return (
    <section className="section" aria-label={t("heading")}>
      <div className="container-tight grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="mono-label">{t("eyebrow")}</p>
          <h2 className="section-title mt-2">{t("heading")}</h2>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <span
                aria-hidden
                className="from-accent-amber/30 via-accent-violet/20 to-accent-cyan/30 absolute -inset-1 rounded-2xl bg-gradient-to-br blur-md"
              />
              <Image
                src="/assets/profile/my_pic.jpg"
                alt={SITE.name}
                width={160}
                height={200}
                className="border-border relative h-40 w-32 rounded-2xl border object-cover shadow-md sm:h-48 sm:w-40"
                priority
              />
            </div>
            <div className="text-fg-muted space-y-4">
              <p>
                {t.rich("bio1", {
                  name: SITE.name,
                  company: SITE.company,
                  strong: (chunks) => <span className="text-fg font-medium">{chunks}</span>,
                })}
              </p>
              <p>{t("bio2")}</p>
            </div>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="card p-6">
            <p className="mono-label">{t("principlesEyebrow")}</p>
            <ul className="mt-4 space-y-3 text-sm">
              {PRINCIPLE_KEYS.map((k) => (
                <li key={k} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${PRINCIPLE_DOTS[k]}`}
                  />
                  <span className="text-fg-muted">
                    <span className="text-fg font-medium">{t(`principles.${k}.title`)}</span>{" "}
                    {t(`principles.${k}.body`)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/contact" className="btn-primary text-xs">
                {t("getInTouch")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href={`mailto:${SITE.email}`} className="btn-ghost text-xs">
                <Mail className="h-3.5 w-3.5" /> {tCommon("email")}
              </a>
              <a href={SITE.github} className="btn-ghost text-xs">
                <Github className="h-3.5 w-3.5" /> {tCommon("github")}
              </a>
              <a href={SITE.linkedin} className="btn-ghost text-xs">
                <Linkedin className="h-3.5 w-3.5" /> {tCommon("linkedin")}
              </a>
            </div>
            <span className="sr-only">{tNav("contact")}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
