import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  Briefcase,
  Code2,
  Cpu,
  Layers,
  Mail,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NotFoundActions } from "@/components/layout/not-found-actions";
import { PhoenixRun } from "@/components/eggs/phoenix-run";
import { PHOENIX_BANNER } from "@/components/eggs/phoenix-art";
import { QrTag } from "@/components/eggs/qr-tag";
import { SITE } from "@/content/profile";

const SUGGESTIONS = [
  { href: "/", icon: Sparkles, key: "home" },
  { href: "/work", icon: Layers, key: "work" },
  { href: "/skills", icon: Cpu, key: "skills" },
  { href: "/experience", icon: Briefcase, key: "experience" },
  { href: "/about", icon: User, key: "about" },
  { href: "/competitive-programming", icon: Code2, key: "cp" },
  { href: "/contact", icon: Mail, key: "contact" },
] as const;

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");
  const tCommand = await getTranslations("command");

  return (
    <div className="container-tight relative grid min-h-[80vh] place-items-center py-20">
      {/* Decorative ambient glows */}
      <div
        aria-hidden
        className="bg-accent-cyan/10 pointer-events-none absolute top-1/4 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-accent-violet/10 pointer-events-none absolute -z-10 h-64 w-80 translate-x-1/3 translate-y-1/4 rounded-full blur-3xl"
      />

      <div className="grid w-full gap-10 lg:grid-cols-[1fr,360px] lg:items-center">
        <header className="max-w-xl">
          <p className="mono-label">{t("tag")}</p>
          <h1 className="text-display-2 mt-3 font-semibold tracking-tight">
            <span className="text-accent-cyan inline-block animate-pulse font-mono">404</span>{" "}
            {t("heading")}
          </h1>
          <p className="text-fg-muted mt-4 text-lg">{t("subheading")}</p>

          <NotFoundActions
            backLabel={t("back")}
            searchLabel={t("search")}
            homeLabel={tNav("home")}
          />

          <p className="text-fg-subtle mt-6 font-mono text-[11px]">
            <span className="text-accent-emerald">tip</span> ·{" "}
            <kbd className="border-border bg-bg-sunken rounded border px-1.5 py-0.5">⌘</kbd>{" "}
            <kbd className="border-border bg-bg-sunken rounded border px-1.5 py-0.5">K</kbd>{" "}
            {t("kbdHint")}
          </p>

          <pre
            aria-label={t("asciiLabel")}
            className="mt-10 max-w-full overflow-x-auto bg-gradient-to-b from-amber-200 via-orange-500 to-red-700 bg-clip-text font-mono text-[5px] leading-tight font-semibold text-transparent select-none sm:text-[7px] md:text-[9px]"
          >
            {PHOENIX_BANNER.join("\n")}
          </pre>
        </header>

        <aside>
          <p className="mono-label inline-flex items-center gap-2">
            <Search className="h-3 w-3" />
            {t("suggestionsLabel")}
          </p>
          <ul className="mt-3 grid gap-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="card card-hover group flex items-center gap-3 p-3 text-sm"
                  >
                    <span className="border-border bg-bg-sunken text-fg-muted grid h-8 w-8 place-items-center rounded-md border">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-fg group-hover:text-accent-cyan flex-1">
                      {tCommand(`items.${s.key === "work" ? "workNav" : s.key}` as never)}
                    </span>
                    <ArrowLeft className="text-fg-subtle h-3.5 w-3.5 rotate-180" />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Scan-to-continue QR instead of yet another link — open the site
              on a phone (or just keep one nearby for the share preview). */}
          <div className="card mt-4 flex items-center gap-4 p-4">
            <QrTag
              value={SITE.url}
              size={92}
              label={t("qrLabel")}
              className="shrink-0 rounded-md"
            />
            <div className="min-w-0">
              <p className="text-fg text-sm font-medium">{t("qrTitle")}</p>
              <p className="text-fg-muted mt-1 text-xs">{t("qrCaption")}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Easter-egg: Phoenix Run endless runner. Doubles as a 404 distraction;
          score ≥ 500 unlocks `dino-score-5`, and collecting five golden
          feathers unlocks `feather-score-5`. */}
      <PhoenixRun />
    </div>
  );
}
