"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "@/i18n/navigation";
import { SITE } from "@/content/profile";
import { projects } from "@/content/projects";
import { clusters } from "@/content/skills";
import { useEggs } from "./egg-provider";
import { setOverlayOpen } from "./overlay-state";
import { PHOENIX_BANNER } from "./phoenix-art";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

// Tab-completion vocabularies.
const COMMANDS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "contact",
  "cv",
  "resume",
  "theme",
  "ls",
  "cat",
  "pwd",
  "date",
  "echo",
  "history",
  "neofetch",
  "sudo",
  "secrets",
  "clear",
  "exit",
];
const FILES = [
  "about.md",
  ".secret",
  "resume.pdf",
  "projects/",
  "skills/",
  "experience/",
  "contact/",
];
const THEMES = ["light", "dark", "phoenix"];

function commonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0] ?? "";
  for (const item of items) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/** Bash-style Tab completion: returns the (possibly) extended input plus the
 *  list of candidates to echo when the completion is ambiguous. */
function completeInput(value: string): { value: string; list: string[] } {
  const text = value.replace(/^\s+/, "");
  const parts = text.split(/\s+/);
  const completingArg = /\s/.test(text);

  if (!completingArg) {
    const frag = parts[0] ?? "";
    const matches = COMMANDS.filter((c) => c.startsWith(frag));
    if (matches.length === 1) return { value: `${matches[0]} `, list: [] };
    if (matches.length > 1) return { value: commonPrefix(matches), list: matches };
    return { value, list: [] };
  }

  const head = parts[0];
  const last = parts[parts.length - 1] ?? "";
  const pool = head === "theme" ? THEMES : head === "cat" || head === "ls" ? FILES : [];
  const matches = pool.filter((x) => x.startsWith(last));
  const rebuild = (token: string) => [...parts.slice(0, -1), token].join(" ");
  if (matches.length === 1) return { value: `${rebuild(matches[0] ?? "")} `, list: [] };
  if (matches.length > 1) return { value: rebuild(commonPrefix(matches)), list: matches };
  return { value, list: [] };
}

/**
 * Fullscreen retro terminal overlay. Pure cosmetic; no real shell.
 *
 * Commands: help, whoami, skills, projects, projects --list, contact, cv,
 * theme [light|dark|phoenix], ls, cat about.md, date, echo, history,
 * neofetch, sudo, secrets, clear, exit.
 *
 * Triggered by typing "terminal" anywhere or selecting it from the command
 * menu. Unlocks the `terminal-mode` egg on first open. Esc closes.
 * Up/Down arrows scroll command history.
 */
export function TerminalMode() {
  const t = useTranslations("eggs.terminal");
  const { unlock } = useEggs();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const greeting = useMemo<Line[]>(
    () => [
      { kind: "out", text: t("greet", { name: SITE.name }) },
      { kind: "out", text: t("greetHint") },
    ],
    [t],
  );

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-terminal-mode", onOpen);
    return () => window.removeEventListener("open-terminal-mode", onOpen);
  }, []);

  // Tell global listeners to back off while we're open.
  useEffect(() => {
    setOverlayOpen("terminal", open);
    return () => setOverlayOpen("terminal", false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    unlock("terminal-mode");
    setLines(greeting);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, greeting, unlock]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  // Esc closes (handled here so it doesn't depend on the keyboard-shortcuts layer).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      const [head, ...args] = cmd.split(/\s+/);
      const next: Line[] = [{ kind: "in", text: `phoenix $ ${cmd}` }];
      setHistory((prev) => [...prev, cmd].slice(-50));
      setHistIdx(-1);

      switch ((head ?? "").toLowerCase()) {
        case "help":
          next.push({ kind: "out", text: t("help") });
          break;
        case "whoami":
          next.push(
            { kind: "ok", text: SITE.name },
            { kind: "out", text: `${SITE.role} · ${SITE.company}` },
            { kind: "out", text: SITE.tagline },
          );
          break;
        case "skills": {
          for (const c of clusters) {
            next.push({
              kind: "out",
              text: `${c.name.padEnd(22)} ${c.skills.map((s) => s.name).join(", ")}`,
            });
          }
          break;
        }
        case "projects": {
          if (args[0] === "--list") {
            for (const p of projects) {
              next.push({ kind: "out", text: `${p.slug.padEnd(26)} ${p.title}` });
            }
          } else {
            next.push({ kind: "out", text: t("projectsHint") });
            for (const p of projects.slice(0, 5)) {
              next.push({ kind: "out", text: `· ${p.title}` });
            }
          }
          break;
        }
        case "contact":
          next.push({ kind: "ok", text: t("opening", { what: "/contact" }) });
          setOpen(false);
          router.push("/contact");
          break;
        case "cv":
        case "resume":
          next.push({ kind: "ok", text: t("opening", { what: SITE.resumePath }) });
          window.open(SITE.resumePath, "_blank", "noopener");
          break;
        case "theme": {
          const arg = (args[0] ?? "").toLowerCase();
          if (arg === "light" || arg === "dark" || arg === "phoenix") {
            setTheme(arg);
            next.push({ kind: "ok", text: t("themeSet", { theme: arg }) });
          } else {
            next.push({ kind: "err", text: t("themeUsage") });
          }
          break;
        }
        case "ls":
          next.push({
            kind: "out",
            text: "about.md  projects/  skills/  experience/  contact/  resume.pdf  .secret",
          });
          break;
        case "cat": {
          const target = (args[0] ?? "").toLowerCase();
          if (target === "about.md") {
            next.push(
              { kind: "ok", text: `# ${SITE.name}` },
              { kind: "out", text: `_${SITE.role} · ${SITE.company}_` },
              { kind: "out", text: "" },
              { kind: "out", text: SITE.tagline },
              { kind: "out", text: `email: ${SITE.email}` },
            );
          } else if (target === ".secret") {
            next.push({
              kind: "ok",
              text: "🜂 you found a secret. type `secrets` to see the trophy room.",
            });
          } else {
            next.push({ kind: "err", text: `cat: ${target || "missing operand"}: no such file` });
          }
          break;
        }
        case "date":
          next.push({ kind: "out", text: new Date().toString() });
          break;
        case "echo":
          next.push({ kind: "out", text: args.join(" ") });
          break;
        case "history":
          for (let i = 0; i < history.length; i++) {
            next.push({ kind: "out", text: `${String(i + 1).padStart(4)}  ${history[i]}` });
          }
          break;
        case "neofetch": {
          const info = [
            "phoenix@portfolio",
            "─────────────────",
            `Host:   ${SITE.name}`,
            "OS:     binaryphoenix.vercel.app",
            "Shell:  phoenix-shell 1.0",
            "Theme:  phoenix · dark · light",
            "Stack:  Next.js 16 · React 19 · TS 6",
            "Uptime: since 2025",
          ];
          PHOENIX_BANNER.forEach((line, i) => {
            const meta = info[i] ?? "";
            next.push({ kind: i === 0 ? "ok" : "out", text: meta ? `${line}   ${meta}` : line });
          });
          break;
        }
        case "pwd":
          next.push({ kind: "out", text: "/home/phoenix" });
          break;
        case "sudo":
          next.push({
            kind: "err",
            text: "phoenix is not in the sudoers file. This incident will not be reported.",
          });
          break;
        case "secrets":
          next.push({ kind: "ok", text: t("opening", { what: "/secret" }) });
          setOpen(false);
          router.push("/secret");
          break;
        case "clear":
          setLines(greeting);
          return;
        case "exit":
          setOpen(false);
          return;
        default:
          next.push({ kind: "err", text: t("unknown", { cmd: head ?? "" }) });
      }
      setLines((prev) => [...prev, ...next]);
    },
    [t, router, setTheme, greeting, history],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/85 p-4 backdrop-blur"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="border-accent-cyan/30 bg-bg-sunken/95 w-full max-w-3xl overflow-hidden rounded-xl border shadow-2xl">
        <header className="border-accent-cyan/20 bg-bg-elev/80 flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="bg-accent-amber h-3 w-3 rounded-full" aria-hidden />
            <span className="bg-accent-emerald h-3 w-3 rounded-full" aria-hidden />
            <span className="bg-accent-cyan h-3 w-3 rounded-full" aria-hidden />
            <span className="text-fg-muted ml-3 font-mono text-xs">{t("title")}</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="text-fg-subtle hover:bg-bg-sunken hover:text-fg rounded p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[60vh] cursor-text overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
        >
          {lines.map((l, i) => (
            <pre
              key={i}
              className={
                l.kind === "in"
                  ? "text-accent-cyan whitespace-pre-wrap"
                  : l.kind === "err"
                    ? "text-accent-amber whitespace-pre-wrap"
                    : l.kind === "ok"
                      ? "text-accent-emerald whitespace-pre-wrap"
                      : "text-fg-muted whitespace-pre-wrap"
              }
            >
              {l.text}
            </pre>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
            className="mt-1 flex items-center gap-2"
          >
            <span className="text-accent-cyan select-none">phoenix $</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const { value, list } = completeInput(input);
                  if (value !== input) setInput(value);
                  if (list.length > 1) {
                    setLines((prev) => [...prev, { kind: "out", text: list.join("  ") }]);
                  }
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (history.length === 0) return;
                  const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
                  setHistIdx(idx);
                  setInput(history[idx] ?? "");
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (histIdx === -1) return;
                  const idx = histIdx + 1;
                  if (idx >= history.length) {
                    setHistIdx(-1);
                    setInput("");
                  } else {
                    setHistIdx(idx);
                    setInput(history[idx] ?? "");
                  }
                }
              }}
              spellCheck={false}
              autoComplete="off"
              aria-label={t("inputLabel")}
              className="text-fg flex-1 bg-transparent outline-none"
            />
          </form>
        </div>
        <footer className="border-accent-cyan/20 text-fg-subtle bg-bg-elev/60 flex items-center justify-between border-t px-4 py-1.5 font-mono text-[10px]">
          <span>{t("footerHint")}</span>
          <span className="text-fg-subtle/70">{t("footerCmds")}</span>
        </footer>
      </div>
    </div>
  );
}
