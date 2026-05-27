import type { Metadata } from "next";
import Link from "next/link";
import { AboutSection } from "@/components/about-section";
import { honors, languages } from "@/content/extras";
import { CertPreview } from "@/components/certs/cert-preview";
import {
  Award,
  PenTool,
  Youtube,
  Github as GithubIcon,
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

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ayush Yadav — engineer focused on performance, AI tooling and interactive products.",
};

const beyondTopics = [
  {
    title: "Writing on Medium",
    icon: PenTool,
    accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
    body: "Long-form essays on systems performance, AI tooling and frontend craft. Writing forces me to formalize patterns I'd otherwise leave as tacit knowledge — and it pays it forward to engineers walking the same paths.",
    href: "https://binaryphoenix01.medium.com",
    cta: "binaryphoenix01.medium.com",
  },
  {
    title: "Teaching on YouTube",
    icon: Youtube,
    accent: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
    body: "Explainers on programming, problem-solving and engineering process. Recording forces clear thinking — the best feedback is when someone says a concept finally clicked.",
    href: "https://www.youtube.com/channel/UCcINlOM-rC1_8yiRGH_iFBg?sub_confirmation=1",
    cta: "YouTube channel",
  },
  {
    title: "Open Source Maintainer",
    icon: GithubIcon,
    accent: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
    body: "I maintain and contribute to open-source projects across visualization, AI tooling and developer experience under @blackphoenix42 — algorithm visualizers, profiling tools and small UX experiments shipped to a real audience.",
    href: "https://github.com/blackphoenix42",
    cta: "github.com/blackphoenix42",
  },
  {
    title: "Mentorship & Community",
    icon: HandHeart,
    accent: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
    body: "Mentored 100+ students across software engineering and competitive programming — code reviews, mock interviews, system-design walk-throughs and DSA progressions tuned to where each person is.",
  },
  {
    title: "Google Crowdsource — Level 8",
    icon: Sparkles,
    accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
    body: "Reached Level 8 in Google's Crowdsource program across image labeling, translation and validation tasks — small, repeated contributions that compound into useful training data.",
    href: "https://crowdsource.google.com/",
    cta: "Crowdsource",
  },
  {
    title: "NSS Volunteer",
    icon: HeartHandshake,
    accent: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
    body: "Participated in NSS drives and awareness campaigns at NSUT — community service that grounded technical work in lived experience and broadened the people I learn from.",
  },
  {
    title: "Programming Club Leadership",
    icon: Users,
    accent: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
    body: "Head of Programming at Dynamix Club, Ramjas School — ran DSA sessions, mock contests and mentored juniors, learning early that leadership is mostly clearing blockers for the team.",
  },
  {
    title: "House Captain — Jupiter House",
    icon: GraduationCap,
    accent: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
    body: "Captained Jupiter House at Ramjas School — organized inter-house tournaments, anchored school events and represented the house in council activities.",
  },
  {
    title: "Competitive Programming",
    icon: Code2,
    accent: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
    body: "Active across CodeChef (6★), Codeforces Master, LeetCode Knight and HackerRank 6★. CP is where reflexes for complexity, invariants and edge-case thinking get sharpened.",
    href: "/competitive-programming",
    cta: "View profiles",
  },
];

const accentRing: Record<string, string> = {
  cyan: "text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5",
  violet: "text-accent-violet border-accent-violet/30 bg-accent-violet/5",
  emerald: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/5",
  amber: "text-accent-amber border-accent-amber/30 bg-accent-amber/5",
};

type CertItem = { label: string; href: string };
type CertCategory = {
  title: string;
  icon: typeof Cpu;
  items: CertItem[];
};

const certCategories: CertCategory[] = [
  {
    title: "Cloud",
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
    title: "Coding Contests · CodeChef",
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
    title: "HackerRank",
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
    title: "Forage Virtual Programs",
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
    title: "NIIT",
    icon: GraduationCap,
    items: [
      { label: "Core Java", href: "/assets/certs/NIIT/Core%20Java.jpeg" },
      { label: "Advanced Java", href: "/assets/certs/NIIT/Advance%20Java.jpeg" },
      { label: "Python", href: "/assets/certs/NIIT/Python.jpeg" },
    ],
  },
  {
    title: "Udemy",
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
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ about</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">About</h1>
      </header>

      <AboutSection />

      <section className="section border-t border-border/60" aria-label="Beyond the day job">
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <Award className="h-3.5 w-3.5" /> / beyond the day job
            </p>
            <h2 className="section-title mt-2">What I do outside work</h2>
            <p className="mt-2 max-w-2xl text-fg-muted">
              Writing, teaching, open-source, mentorship and community work that complement my
              engineering practice — each pursued for its own reasons.
            </p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beyondTopics.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.title} className="card card-hover group p-5">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${t.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t.body}</p>
                  {t.href && (
                    <a
                      href={t.href}
                      target={t.href.startsWith("http") ? "_blank" : undefined}
                      rel={t.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-accent-cyan hover:text-fg"
                    >
                      {t.cta} ↗
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border/60" aria-label="Honors and awards">
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5" /> / honors &amp; awards
            </p>
            <h2 className="section-title mt-2">Recognition</h2>
            <p className="mt-2 max-w-2xl text-fg-muted">
              Grants, competition wins and program recognitions from school through fellowship work.
            </p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {honors.map((h) => {
              const Icon = h.icon;
              return (
                <li key={h.title} className="card p-5">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${accentRing[h.accent]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight">{h.title}</h3>
                  <p className="mt-1 font-mono text-[11px] text-fg-subtle">
                    {h.org} · {h.date}
                    {h.amount ? ` · ${h.amount}` : ""}
                  </p>
                  {h.detail && (
                    <p className="mt-2 text-xs leading-relaxed text-fg-muted">{h.detail}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border/60" aria-label="Languages">
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <LanguagesIcon className="h-3.5 w-3.5" /> / languages
            </p>
            <h2 className="section-title mt-2">Languages</h2>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {languages.map((l) => (
              <li key={l.name} className="card flex items-center gap-4 p-4">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-lg border border-accent-violet/30 bg-accent-violet/5 text-2xl font-semibold text-accent-violet ${l.scriptClass ?? ""}`}
                  aria-hidden
                >
                  {l.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-fg">{l.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-fg-subtle">{l.level}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border/60" aria-label="Certifications">
        <div className="container-tight">
          <header className="mb-8">
            <p className="mono-label inline-flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> / certifications
            </p>
            <h2 className="section-title mt-2">Certificates</h2>
            <p className="mt-2 max-w-2xl text-fg-muted">
              Selected certificates across cloud, contests, frameworks and structured learning.
              Click any preview to open the original.
            </p>
          </header>
          <div className="space-y-12">
            {certCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg border border-accent-violet/30 bg-accent-violet/5 text-accent-violet">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight">{cat.title}</h3>
                    <span className="ml-auto font-mono text-[11px] text-fg-subtle">
                      {cat.items.length}
                    </span>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {cat.items.map((it) => (
                      <li key={it.label}>
                        <CertPreview href={it.href} label={it.label} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-xs text-fg-subtle">
            Internship and program certificates appear next to their respective roles in{" "}
            <Link href="/experience" className="underline">
              experience
            </Link>
            . See{" "}
            <Link href="/competitive-programming" className="underline">
              competitive programming
            </Link>{" "}
            for contest profiles and ratings.
          </p>
        </div>
      </section>
    </div>
  );
}
