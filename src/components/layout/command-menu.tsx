"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  Code2,
  Mail,
  FileDown,
  User,
  Cpu,
  Github,
  Layers,
  Beaker,
} from "lucide-react";
import { SITE } from "@/content/profile";
import { projects } from "@/content/projects";

const groups = [
  {
    heading: "Navigate",
    items: [
      { id: "home", label: "Home", icon: User, href: "/" },
      { id: "work", label: "Work", icon: Layers, href: "/work" },
      { id: "experience", label: "Experience", icon: Briefcase, href: "/experience" },
      { id: "skills", label: "Skills", icon: Cpu, href: "/skills" },
      { id: "cp", label: "Competitive Programming", icon: Code2, href: "/competitive-programming" },
      { id: "lab", label: "Concept Lab", icon: Beaker, href: "/lab" },
      { id: "about", label: "About", icon: User, href: "/about" },
      { id: "contact", label: "Contact", icon: Mail, href: "/contact" },
    ],
  },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg-elev shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Menu">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 text-fg-subtle" />
            <Command.Input
              autoFocus
              placeholder="Search projects, skills, pages…"
              className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
            <kbd className="rounded bg-bg-sunken px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-4 text-sm text-fg-subtle">No results.</Command.Empty>
            {groups.map((g) => (
              <Command.Group
                key={g.heading}
                heading={g.heading}
                className="px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-fg-subtle"
              >
                {g.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.id}
                      onSelect={() => go(item.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-bg-sunken aria-selected:text-fg"
                    >
                      <Icon className="h-4 w-4 text-fg-subtle" />
                      <span>{item.label}</span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
            <Command.Group
              heading="Projects"
              className="px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-fg-subtle"
            >
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  onSelect={() => go(`/work/${p.slug}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-bg-sunken aria-selected:text-fg"
                >
                  <Layers className="h-4 w-4 text-fg-subtle" />
                  <span>{p.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group
              heading="Actions"
              className="px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-fg-subtle"
            >
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  window.open(SITE.resumePath, "_blank");
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-bg-sunken aria-selected:text-fg"
              >
                <FileDown className="h-4 w-4 text-fg-subtle" />
                Download Résumé
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  navigator.clipboard.writeText(SITE.email);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-bg-sunken aria-selected:text-fg"
              >
                <Mail className="h-4 w-4 text-fg-subtle" />
                Copy Email
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  window.open(SITE.github, "_blank");
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-bg-sunken aria-selected:text-fg"
              >
                <Github className="h-4 w-4 text-fg-subtle" />
                Open GitHub
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
