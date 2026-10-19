"use client";

import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Github, Linkedin } from "@/components/icons/brand";
import { SITE } from "@/content/profile";
import { Link } from "@/i18n/navigation";
import { IntroPlayer } from "@/components/audio/intro-player";

export function AboutSection() {
  const t = useTranslations("aboutSection");
  const tCommon = useTranslations("common");
  return (
    <section className="section" aria-label={t("heading")}>
      <div className="container-tight">
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
          <div className="text-fg-muted max-w-2xl space-y-4">
            <p>
              {t.rich("bio1", {
                name: SITE.name,
                company: SITE.company,
                strong: (chunks) => <span className="text-fg font-medium">{chunks}</span>,
              })}
            </p>
            <p>{t("bio2")}</p>
            <IntroPlayer className="pt-1" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/contact" className="btn-primary text-xs">
                {t("getInTouch")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href={`mailto:${SITE.email}`} className="btn-ghost text-xs">
                <Mail className="h-3.5 w-3.5" /> {tCommon("email")}
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs"
              >
                <Github className="h-3.5 w-3.5" /> {tCommon("github")}
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs"
              >
                <Linkedin className="h-3.5 w-3.5" /> {tCommon("linkedin")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
