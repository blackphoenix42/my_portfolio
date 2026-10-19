"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MAX_CHATS, type Chat } from "@/lib/chatbot/sessions";

function titleFor(chat: Chat, index: number, untitled: (n: number) => string): string {
  const first = chat.messages.find((m) => m.role === "user")?.text.trim();
  if (!first) return untitled(index + 1);
  return first.length > 56 ? `${first.slice(0, 56)}…` : first;
}

type ChatListMenuProps = {
  chats: Chat[];
  activeId: string;
  disabled?: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: () => void;
};

export function ChatListMenu({
  chats,
  activeId,
  disabled,
  onSelect,
  onNew,
  onDelete,
}: ChatListMenuProps) {
  const t = useTranslations("chatbot.chats");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const activeIndex = Math.max(
    0,
    chats.findIndex((c) => c.id === activeId),
  );
  const activeTitle = titleFor(chats[activeIndex]!, activeIndex, (n) =>
    t("untitled", { number: n }),
  );
  const canAdd = chats.length < MAX_CHATS;
  const canDelete = chats.length > 1;

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-1 gap-1.5">
      <button
        type="button"
        disabled={disabled}
        aria-label={t("select")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "border-border bg-bg-sunken/80 hover:border-accent-cyan/35 hover:bg-bg-sunken inline-flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors",
          open && "border-accent-cyan/40 ring-accent-cyan/15 ring-2",
          disabled && "opacity-50",
        )}
      >
        <span className="bg-accent-cyan/10 text-accent-cyan inline-grid h-7 w-7 shrink-0 place-items-center rounded-md">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-fg-subtle block font-mono text-[10px] tracking-wider uppercase">
            {t("label")}
          </span>
          <span className="text-fg block truncate text-xs font-medium">{activeTitle}</span>
        </span>
        <ChevronDown
          className={cn(
            "text-fg-subtle h-3.5 w-3.5 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <button
        type="button"
        className="border-border bg-bg-sunken/80 text-fg-muted hover:border-accent-cyan/40 hover:text-fg inline-flex h-auto shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs disabled:opacity-40"
        disabled={disabled || !canAdd}
        onClick={onNew}
        title={t("new")}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">{t("new")}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label={t("select")}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="border-border bg-bg-elev absolute top-[calc(100%+0.35rem)] left-0 z-20 w-full min-w-[16rem] overflow-hidden rounded-xl border shadow-lg"
          >
            <div className="border-border/70 flex items-center justify-between border-b px-3 py-2">
              <p className="mono-label">{t("conversations")}</p>
              <p className="text-fg-subtle font-mono text-[10px]">
                {t("capacity", { current: chats.length, max: MAX_CHATS })}
              </p>
            </div>
            <ul className="max-h-56 overflow-y-auto p-1">
              {chats.map((chat, index) => {
                const selected = chat.id === activeId;
                const title = titleFor(chat, index, (n) => t("untitled", { number: n }));
                const count = chat.messages.length;
                return (
                  <li key={chat.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                        selected
                          ? "bg-accent-cyan/10 text-fg"
                          : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
                      )}
                      onClick={() => {
                        onSelect(chat.id);
                        setOpen(false);
                      }}
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                          selected
                            ? "border-accent-cyan/50 bg-accent-cyan/20 text-accent-cyan"
                            : "border-border/80",
                        )}
                      >
                        {selected && <Check className="h-2.5 w-2.5" aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium">{title}</span>
                        <span className="text-fg-subtle mt-0.5 block font-mono text-[10px]">
                          {count === 0 ? t("empty") : t("messageCount", { count })}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {canDelete && (
              <div className="border-border/70 border-t p-1">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onDelete();
                    setOpen(false);
                  }}
                  className="text-fg-muted hover:bg-accent-amber/10 hover:text-accent-amber flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  {t("delete")}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
