"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, Send, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { retrieve, type Corpus, type RankedChunk } from "@/lib/chatbot/retrieval";

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
  sources?: { title: string; source: string }[];
};

const SUGGESTION_KEYS = ["q0", "q1", "q2", "q3"] as const;

export function AskPortfolio({ onClose }: { onClose: () => void }) {
  const t = useTranslations("chatbot");
  const reduce = useReducedMotion();
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/chatbot/corpus.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("not ok"))))
      .then((data: Corpus) => {
        if (!cancelled) setCorpus(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const ask = (raw: string) => {
    const query = raw.trim();
    if (!query) return;
    const userMsg: Message = { id: nextId.current++, role: "user", text: query };
    let botMsg: Message;
    if (!corpus) {
      botMsg = { id: nextId.current++, role: "bot", text: t("loading") };
    } else {
      const results: RankedChunk[] = retrieve(query, corpus, 2);
      if (results.length === 0) {
        botMsg = { id: nextId.current++, role: "bot", text: t("noAnswer") };
      } else {
        botMsg = {
          id: nextId.current++,
          role: "bot",
          text: results.map((r) => r.chunk.text).join("\n\n"),
          sources: results.map((r) => ({ title: r.chunk.title, source: r.chunk.source })),
        };
      }
    }
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-border bg-bg-elev fixed right-4 bottom-4 z-[80] flex h-[min(32rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border shadow-2xl"
    >
      <header className="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="bg-accent-cyan/15 text-accent-cyan inline-flex h-7 w-7 items-center justify-center rounded-full">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">{t("title")}</p>
            <p className="text-fg-subtle text-[10px]">{t("subtitle")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="text-fg-subtle hover:bg-bg-sunken hover:text-fg rounded-md p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-fg-muted text-sm">{t("intro")}</p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTION_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => ask(t(`suggestions.${k}`))}
                  className="border-border text-fg-muted hover:border-accent-cyan/40 hover:text-fg rounded-md border px-3 py-1.5 text-left text-xs"
                >
                  {t(`suggestions.${k}`)}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "bg-accent-cyan/15 text-fg max-w-[85%] rounded-lg rounded-br-sm px-3 py-2 text-sm"
                  : "bg-bg-sunken/70 text-fg-muted max-w-[90%] rounded-lg rounded-bl-sm px-3 py-2 text-sm"
              }
            >
              <span className="mb-1 flex items-center gap-1 opacity-60">
                {m.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
              </span>
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <p className="text-fg-subtle mt-2 font-mono text-[10px]">
                  {t("sourcesLabel")}: {m.sources.map((s) => s.source).join(" · ")}
                </p>
              )}
            </div>
          </div>
        ))}
        {error && <p className="text-accent-amber text-xs">{t("error")}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="border-border flex items-center gap-2 border-t px-3 py-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="border-border bg-bg-sunken/60 text-fg focus:border-accent-cyan/60 min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          aria-label={t("send")}
          className="btn-primary px-3 py-2"
          disabled={!input.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      <p className="text-fg-subtle border-border border-t px-3 py-1.5 text-center text-[10px]">
        {t("disclaimer")}
      </p>
    </motion.div>
  );
}
