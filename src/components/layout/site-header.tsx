"use client";

import Image from "next/image";
import { Menu, X, Search, ArrowUpRight, Command as CmdIcon, Rss } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SettingsMenu } from "@/components/layout/settings-menu";
import { RecruiterToggle } from "@/components/layout/recruiter-toggle";
import { SITE } from "@/content/profile";
import { Link, usePathname } from "@/i18n/navigation";
import { GreetingChip } from "./greeting-chip";

const NAV = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/work", labelKey: "work" },
  { href: "/skills", labelKey: "skills" },
  { href: "/experience", labelKey: "experience" },
  { href: "/competitive-programming", labelKey: "craft" },
  { href: "/contact", labelKey: "contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tHeader = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-200",
        scrolled
          ? "border-border/70 bg-bg/80 border-b backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center gap-2"
          aria-label={tHeader("ariaLogoHome", { name: SITE.name })}
        >
          <Logo />
          <span className="flex flex-col leading-none">
            <span className="text-fg text-sm font-semibold tracking-tight">{SITE.name}</span>
          </span>
        </Link>
        <GreetingChip />

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="relative flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative z-10 inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-colors",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="border-accent-cyan/30 bg-accent-cyan/10 absolute inset-0 rounded-full border"
                      transition={
                        reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-menu"))}
            className="border-border bg-bg-elev/60 text-fg-muted hover:border-accent-cyan/40 hover:text-fg hidden items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors lg:inline-flex"
            aria-label={t("openCommandMenu")}
          >
            <Search className="h-3.5 w-3.5" />
            <span>{tCommon("search")}</span>
            <kbd className="bg-bg-sunken ml-1 rounded px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <Link
            href="/feeds"
            aria-label={t("liveFeedsLabel")}
            title={t("liveFeeds")}
            className="border-border bg-bg-elev/40 text-fg-muted hover:border-accent-amber/40 hover:text-accent-amber hidden h-9 w-9 items-center justify-center rounded-md border transition-colors sm:inline-flex"
          >
            <Rss className="h-4 w-4" />
          </Link>
          <RecruiterToggle />
          <SettingsMenu />
          <a href={SITE.resumePath} download className="btn-primary hidden text-xs sm:inline-flex">
            {tCommon("resume")}
          </a>
          <button
            type="button"
            className="border-border bg-bg-elev/40 text-fg-muted hover:text-fg inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors md:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="bg-bg/60 fixed inset-0 top-16 z-30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              key="sheet"
              aria-label={t("primary")}
              className="border-border bg-bg-elev/95 fixed inset-x-0 top-16 z-40 border-b backdrop-blur-md md:hidden"
              initial={reduce ? { opacity: 0 } : { y: -12, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container-tight py-3">
                <p className="mono-label mb-2 px-2">{t("navigate")}</p>
                <ul className="grid grid-cols-2 gap-1">
                  {NAV.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex min-h-11 items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors",
                            active
                              ? "border-accent-cyan/40 bg-accent-cyan/10 text-fg"
                              : "border-border/60 bg-bg-sunken/40 text-fg-muted hover:border-accent-cyan/30 hover:text-fg",
                          )}
                        >
                          <span>{t(item.labelKey)}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 flex gap-2 px-1">
                  <a
                    href={SITE.resumePath}
                    download
                    onClick={() => setOpen(false)}
                    className="btn-primary flex-1 text-xs"
                  >
                    {tCommon("downloadResume")}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new CustomEvent("open-command-menu"));
                    }}
                    className="btn-secondary text-xs"
                  >
                    <CmdIcon className="h-3.5 w-3.5" /> {tCommon("search")}
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function Logo() {
  return (
    <span
      aria-hidden="true"
      className="border-border bg-bg-sunken/60 relative inline-flex h-8 w-8 overflow-hidden rounded-md border transition-transform group-hover:scale-110 group-hover:-rotate-6"
    >
      <Image
        src="/assets/logos/phoenix.jpg"
        alt=""
        fill
        sizes="32px"
        className="object-cover"
        priority
      />
    </span>
  );
}
