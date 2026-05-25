"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ArrowUpRight, Command as CmdIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { RecruiterToggle } from "@/components/layout/recruiter-toggle";
import { SITE } from "@/content/profile";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/competitive-programming", label: "CP" },
  { href: "/lab", label: "Roadmap" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
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
          ? "border-b border-border/70 bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center gap-2"
          aria-label="Ayush Yadav — Home"
        >
          <Logo />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-fg">Ayush Yadav</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
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
                    {item.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-accent-cyan/30 bg-accent-cyan/10"
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
            className="hidden items-center gap-2 rounded-md border border-border bg-bg-elev/60 px-2.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-accent-cyan/40 hover:text-fg lg:inline-flex"
            aria-label="Open command menu"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="ml-1 rounded bg-bg-sunken px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <RecruiterToggle />
          <ThemeToggle />
          <a href={SITE.resumePath} download className="btn-primary hidden text-xs sm:inline-flex">
            Résumé
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-elev/40 text-fg-muted transition-colors hover:text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
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
              className="fixed inset-0 top-16 z-30 bg-bg/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              key="sheet"
              aria-label="Mobile"
              className="fixed inset-x-0 top-16 z-40 border-b border-border bg-bg-elev/95 backdrop-blur-md md:hidden"
              initial={reduce ? { opacity: 0 } : { y: -12, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container-tight py-3">
                <p className="mono-label mb-2 px-2">Navigate</p>
                <ul className="grid grid-cols-2 gap-1">
                  {NAV.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex min-h-[44px] items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors",
                            active
                              ? "border-accent-cyan/40 bg-accent-cyan/10 text-fg"
                              : "border-border/60 bg-bg-sunken/40 text-fg-muted hover:border-accent-cyan/30 hover:text-fg",
                          )}
                        >
                          <span>{item.label}</span>
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
                    Download Résumé
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new CustomEvent("open-command-menu"));
                    }}
                    className="btn-secondary text-xs"
                  >
                    <CmdIcon className="h-3.5 w-3.5" /> Search
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
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="transition-transform group-hover:-rotate-6 group-hover:scale-110"
    >
      <defs>
        <linearGradient id="phx-flame" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="80%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="hsl(var(--accent-violet))" />
        </linearGradient>
        <linearGradient id="phx-wing" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M5 18 Q10 12 16 14"
        stroke="url(#phx-wing)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M27 18 Q22 12 16 14"
        stroke="url(#phx-wing)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M16 4 C 13 9 11 11 11 15 C 11 17 12.2 18.5 13.6 19.2 C 12.8 19.8 12.4 20.7 12.4 21.6 C 12.4 24 14 26 16 26 C 18 26 19.6 24 19.6 21.6 C 19.6 20.7 19.2 19.8 18.4 19.2 C 19.8 18.5 21 17 21 15 C 21 11 19 9 16 4 Z"
        fill="url(#phx-flame)"
      />
      <path
        d="M16 9 C 14.5 12 13.5 13.5 13.5 15.5 C 13.5 17 14.5 18 16 18 C 17.5 18 18.5 17 18.5 15.5 C 18.5 13.5 17.5 12 16 9 Z"
        fill="#fde68a"
        opacity="0.55"
      />
    </svg>
  );
}
