import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AboutSection } from "@/components/about-section";
import { honors, languages } from "@/content/extras";
import { CertPreview } from "@/components/certs/cert-preview";
import { slugify } from "@/lib/utils";
import {
  Award,
  PenTool,
  HandHeart,
  Users,
  GraduationCap,
  Languages as LanguagesIcon,
  FileText,
  Trophy,
  Sparkles,
  BookOpen,
  Cpu,
  Brain,
  Code2,
  HeartHandshake,
} from "lucide-react";
import { Github as GithubIcon, Youtube } from "@/components/icons/brand";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const BEYOND = [
  {
    keyTitle: "writingTitle",
    keyBody: "writingBody",
    keyCta: "writingCta",
    icon: PenTool,
    accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
    href: "https://binaryphoenix01.medium.com",
  },
  {
    keyTitle: "teachingTitle",
    keyBody: "teachingBody",
    keyCta: "teachingCta",
    icon: Youtube,
    accent: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
    href: "https://www.youtube.com/channel/UCcINlOM-rC1_8yiRGH_iFBg?sub_confirmation=1",
  },
  {
    keyTitle: "openSourceTitle",
    keyBody: "openSourceBody",
    keyCta: "openSourceCta",
    icon: GithubIcon,
    accent: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
    href: "https://github.com/blackphoenix42",
  },
  {
    keyTitle: "mentorshipTitle",
    keyBody: "mentorshipBody",
    icon: HandHeart,
    accent: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
  },
  {
    keyTitle: "crowdsourceTitle",
    keyBody: "crowdsourceBody",
    keyCta: "crowdsourceCta",
    icon: Sparkles,
    accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
    href: "https://crowdsource.google.com/",
  },
  {
    keyTitle: "nssTitle",
    keyBody: "nssBody",
    icon: HeartHandshake,
    accent: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
  },
  {
    keyTitle: "clubTitle",
    keyBody: "clubBody",
    icon: Users,
    accent: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
  },
  {
    keyTitle: "houseTitle",
    keyBody: "houseBody",
    icon: GraduationCap,
    accent: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
  },
  {
    keyTitle: "cpTitle",
    keyBody: "cpBody",
    keyCta: "viewProfiles",
    icon: Code2,
    accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
    href: "/competitive-programming",
  },
] as const;

const accentRing: Record<string, string> = {
  cyan: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
  violet: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
  emerald: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
  amber: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
};

type CertItem = { label: string; href: string };
type CertCategory = {
  key: string;
  icon: typeof Cpu;
  items: CertItem[];
};

const certCategories: CertCategory[] = [
  {
    key: "cloud",
    icon: Cpu,
    items: [
      {
        label: "Google Cloud — 30 Days Completion",
        href: "/assets/certs/Cloud/google%20cloud%20quests.pdf",
      },
      {
        label: "GCP Participation Certificate",
        href: "/assets/certs/Cloud/Participation%20Certificate.pdf",
      },
      {
        label: "AWS Fundamentals (Coursera)",
        href: "/assets/certs/Coursera/AWS%20Fundamentals%204C8HWTE9UNNE.pdf",
      },
    ],
  },
  {
    key: "codechef",
    icon: Trophy,
    items: [
      { label: "Adobe Contest", href: "/assets/certs/Codechef/Adobe%20-%203a22575.pdf" },
      {
        label: "Amazon Contest",
        href: "/assets/certs/Codechef/codechef%20amazon%20-%20d51d6b0.pdf",
      },
      { label: "Google Contest", href: "/assets/certs/Codechef/Google.pdf" },
      {
        label: "Microsoft Coding Interview",
        href: "/assets/certs/Codechef/Microsoft%20Coding%20Interview%20Questions.pdf",
      },
    ],
  },
  {
    key: "hackerrank",
    icon: Award,
    items: [
      {
        label: "Software Engineer",
        href: "/assets/certs/Hackerrank/software_engineer%20certificate.pdf",
      },
      {
        label: "Problem Solving — Intermediate",
        href: "/assets/certs/Hackerrank/problem_solving_intermediate%20certificate.pdf",
      },
      {
        label: "REST API — Intermediate",
        href: "/assets/certs/Hackerrank/rest_api_intermediate%20certificate.pdf",
      },
      {
        label: "Frontend (React)",
        href: "/assets/certs/Hackerrank/frontend_developer_react%20certificate.pdf",
      },
      { label: "SQL — Advanced", href: "/assets/certs/Hackerrank/sql_advanced%20certificate.pdf" },
      {
        label: "Node.js — Intermediate",
        href: "/assets/certs/Hackerrank/nodejs_intermediate%20certificate.pdf",
      },
      {
        label: "JavaScript — Intermediate",
        href: "/assets/certs/Hackerrank/javascript_intermediate%20certificate.pdf",
      },
      {
        label: "Golang — Intermediate",
        href: "/assets/certs/Hackerrank/golang_intermediate%20certificate.pdf",
      },
    ],
  },
  {
    key: "forage",
    icon: BookOpen,
    items: [
      {
        label: "JP Morgan Chase — SWE Virtual",
        href: "/assets/certs/Forage/JP%20Morgan%20Chase%20-%20LADZWdt9LD5RwSTZh.pdf",
      },
      {
        label: "Flipkart D2C Participation",
        href: "/assets/certs/participation/Flipkart%20D2C%20Participation.pdf",
      },
      { label: "freeCodeCamp — JavaScript", href: "/assets/certs/FCC/Javascript.png" },
    ],
  },
  {
    key: "niit",
    icon: GraduationCap,
    items: [
      { label: "Core Java", href: "/assets/certs/NIIT/Core%20Java.jpeg" },
      { label: "Advanced Java", href: "/assets/certs/NIIT/Advance%20Java.jpeg" },
      { label: "Python", href: "/assets/certs/NIIT/Python.jpeg" },
    ],
  },
  {
    key: "udemy",
    icon: Brain,
    items: [
      {
        label: "React Hooks + Redux",
        href: "/assets/certs/Udemy/React_Hook_Redux%20UC-7b8d51a9-446a-4a14-ad77-e9e02ccff699.jpg",
      },
      {
        label: "Web Chat using React",
        href: "/assets/certs/Udemy/Web%20Chat%20using%20React%20UC-1054d52f-17e3-4553-b329-ae633638873a.jpg",
      },
      {
        label: "YAML",
        href: "/assets/certs/Udemy/YAML-%20UC-60ae3418-ec28-47df-8c13-18662b3c8c0a.jpg",
      },
      {
        label: "SEO",
        href: "/assets/certs/Udemy/SEO---UC-e0ca4260-cebd-46ad-b652-f4c39e3279bc.pdf",
      },
    ],
  },
];

export default function AboutPage() {
  const t = useTranslations("about");
  const tHonors = useTranslations("honorsData");
  const tLanguages = useTranslations("languagesData");
  const tCerts = useTranslations("certsData");
  const trHonor = (slug: string, key: "title" | "org" | "detail", fallback: string) => {
    const path = `${slug}.${key}` as never;
    return tHonors.has(path) ? tHonors(path) : fallback;
  };
  const trLang = (slug: string, key: "name" | "level", fallback: string) => {
    const path = `${slug}.${key}` as never;
    return tLanguages.has(path) ? tLanguages(path) : fallback;
  };
  const trCert = (slug: string, fallback: string) => {
    return tCerts.has(slug as never) ? tCerts(slug as never) : fallback;
  };
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">{t("tag")}</p>
        <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("pageTitle")}</h1>
      </header>

      <AboutSection />

      <section className="section border-border/60 border-t" aria-label={t("beyondAriaLabel")}>
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <Award className="h-3.5 w-3.5" /> {t("beyondTag")}
            </p>
            <h2 className="section-title mt-2">{t("beyondTitle")}</h2>
            <p className="text-fg-muted mt-2 max-w-2xl">{t("beyondIntro")}</p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BEYOND.map((item) => {
              const Icon = item.icon;
              const title = t(item.keyTitle);
              const body = t(item.keyBody);
              const ctaKey = "keyCta" in item ? item.keyCta : undefined;
              const cta = ctaKey ? t(ctaKey) : null;
              const href = "href" in item ? item.href : undefined;
              return (
                <li key={item.keyTitle} className="card card-hover group p-5">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${item.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                  <p className="text-fg-muted mt-2 text-sm leading-relaxed">{body}</p>
                  {href && cta && (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-accent-cyan hover:text-fg mt-3 inline-flex items-center gap-1 text-xs"
                    >
                      {cta} ↗
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section border-border/60 border-t" aria-label={t("honorsAriaLabel")}>
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5" /> {t("honorsTag")}
            </p>
            <h2 className="section-title mt-2">{t("honorsTitle")}</h2>
            <p className="text-fg-muted mt-2 max-w-2xl">{t("honorsIntro")}</p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {honors.map((h) => {
              const Icon = h.icon;
              const slug = slugify(h.title);
              return (
                <li key={h.title} className="card p-5">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${accentRing[h.accent]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight">
                    {trHonor(slug, "title", h.title)}
                  </h3>
                  <p className="text-fg-subtle mt-1 font-mono text-[11px]">
                    {trHonor(slug, "org", h.org)} · {h.date}
                    {h.amount ? ` · ${h.amount}` : ""}
                  </p>
                  {h.detail && (
                    <p className="text-fg-muted mt-2 text-xs leading-relaxed">
                      {trHonor(slug, "detail", h.detail)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section border-border/60 border-t" aria-label={t("languagesAriaLabel")}>
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <LanguagesIcon className="h-3.5 w-3.5" /> {t("languagesTag")}
            </p>
            <h2 className="section-title mt-2">{t("languagesTitle")}</h2>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {languages.map((l) => {
              const slug = slugify(l.name);
              return (
                <li key={l.name} className="card flex items-center gap-4 p-4">
                  <div
                    className={`border-accent-violet/30 bg-accent-violet/5 text-accent-violet grid h-12 w-12 place-items-center rounded-lg border text-2xl font-semibold ${l.scriptClass ?? ""}`}
                    aria-hidden
                  >
                    {l.icon}
                  </div>
                  <div>
                    <p className="text-fg text-sm font-semibold">{trLang(slug, "name", l.name)}</p>
                    <p className="text-fg-subtle mt-0.5 font-mono text-[11px]">
                      {trLang(slug, "level", l.level)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section border-border/60 border-t" aria-label={t("certsAriaLabel")}>
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> {t("certsTag")}
            </p>
            <h2 className="section-title mt-2">{t("certsTitle")}</h2>
            <p className="text-fg-muted mt-2 max-w-2xl">{t("certsIntro")}</p>
          </header>
          <div className="space-y-12">
            {certCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="border-accent-violet/30 bg-accent-violet/5 text-accent-violet grid h-9 w-9 place-items-center rounded-lg border">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {t(`certCategories.${cat.key}`)}
                    </h3>
                    <span className="text-fg-subtle ml-auto font-mono text-[11px]">
                      {cat.items.length}
                    </span>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {cat.items.map((it) => (
                      <li key={it.label}>
                        <CertPreview href={it.href} label={trCert(slugify(it.label), it.label)} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="text-fg-subtle mt-8 text-xs">
            {t("certsFooterPrefix")}{" "}
            <Link href="/experience" className="underline">
              {t("experienceLink")}
            </Link>
            {t("certsFooterMiddle")}{" "}
            <Link href="/competitive-programming" className="underline">
              {t("cpLink")}
            </Link>{" "}
            {t("certsFooterSuffix")}
          </p>
        </div>
      </section>
    </div>
  );
}
