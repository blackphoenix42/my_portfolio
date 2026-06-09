"use client";

import { Command } from "cmdk";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Briefcase,
  Code2,
  Mail,
  FileDown,
  User,
  Cpu,
  Layers,
  Beaker,
  TerminalSquare,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/icons/brand";
import { SITE } from "@/content/profile";
import { projects } from "@/content/projects";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { isAnyOverlayOpen } from "@/components/eggs/overlay-state";

const NAV_ITEMS = [
  { id: "home", key: "home", icon: User, href: "/" },
  { id: "about", key: "about", icon: User, href: "/about" },
  { id: "work", key: "workNav", icon: Layers, href: "/work" },
  { id: "skills", key: "skills", icon: Cpu, href: "/skills" },
  { id: "experience", key: "experience", icon: Briefcase, href: "/experience" },
  { id: "cp", key: "cp", icon: Code2, href: "/competitive-programming" },
  { id: "lab", key: "roadmap", icon: Beaker, href: "/competitive-programming#roadmap" },
  { id: "contact", key: "contact", icon: Mail, href: "/contact" },
] as const;

export function CommandMenu() {
  const t = useTranslations("command");
  const tProjects = useTranslations("projects");
  const trProject = (slug: string, fallback: string) => {
    const path = `items.${slug}.title` as never;
    return tProjects.has(path) ? tProjects(path) : fallback;
  };
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Don't pop the palette under a fullscreen egg overlay.
        if (isAnyOverlayOpen()) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onOpen as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
      />
      <div className="border-border bg-bg-elev relative z-10 w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl">
        <Command label={t("title")} shouldFilter>
          <div className="border-border flex items-center gap-2 border-b px-3">
            <Search className="text-fg-subtle h-4 w-4" />
            <Command.Input
              ref={inputRef}
              placeholder={t("searchPlaceholder")}
              className="text-fg placeholder:text-fg-subtle h-12 w-full bg-transparent text-sm outline-none"
            />
            <kbd className="bg-bg-sunken text-fg-subtle rounded px-1.5 py-0.5 font-mono text-[10px]">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="text-fg-subtle px-3 py-4 text-sm">
              {t("noResults")}
            </Command.Empty>
            <Command.Group
              heading={t("navigate")}
              className="[&_[cmdk-group-heading]]:text-fg-subtle px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.id}
                    onSelect={() => go(item.href)}
                    className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
                  >
                    <Icon className="text-fg-subtle h-4 w-4" />
                    <span>{t(`items.${item.key}`)}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
            <Command.Group
              heading={t("work")}
              className="[&_[cmdk-group-heading]]:text-fg-subtle px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  onSelect={() => go(`/work/${p.slug}`)}
                  className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
                >
                  <Layers className="text-fg-subtle h-4 w-4" />
                  <span>{trProject(p.slug, p.title)}</span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group
              heading={t("actions")}
              className="[&_[cmdk-group-heading]]:text-fg-subtle px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
            >
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  window.open(SITE.resumePath, "_blank");
                }}
                className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <FileDown className="text-fg-subtle h-4 w-4" />
                {t("downloadResume")}
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  navigator.clipboard.writeText(SITE.email);
                }}
                className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <Mail className="text-fg-subtle h-4 w-4" />
                {t("copyEmail")}
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  window.open(SITE.github, "_blank");
                }}
                className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <Github className="text-fg-subtle h-4 w-4" />
                {t("openGitHub")}
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-terminal-mode"));
                }}
                className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <TerminalSquare className="text-fg-subtle h-4 w-4" />
                {t("openTerminal")}
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-matrix-rain"));
                }}
                className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <Sparkles className="text-fg-subtle h-4 w-4" />
                {t("openMatrix")}
              </Command.Item>
              <Command.Item
                onSelect={() => go("/secret")}
                className="aria-selected:bg-bg-sunken aria-selected:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
              >
                <Sparkles className="text-fg-subtle h-4 w-4" />
                {t("openSecret")}
              </Command.Item>
            </Command.Group>
          </Command.List>
          <div className="border-border bg-bg-sunken/40 text-fg-subtle flex items-center justify-between gap-2 border-t px-3 py-1.5 font-mono text-[10px]">
            <span>
              {t("footerHint")} <span className="text-fg-muted">{t("footerHintMode")}</span>
            </span>
            <span className="hidden sm:inline">{t("footerHintKeys")}</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
