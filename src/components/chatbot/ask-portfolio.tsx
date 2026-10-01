"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, Send, Settings, Sparkles, Square, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/content/profile";
import { cn } from "@/lib/utils";
import type { Corpus, RankedChunk } from "@/lib/chatbot/retrieval";
import { buildChatMessages, cleanModelText, selectContext, toHistory } from "@/lib/chatbot/llm";
import bundledCorpus from "../../../public/chatbot/corpus.json";
import { generationBudget } from "@/lib/chatbot/settings";
import { ChatSettingsPanel } from "./chat-settings";
import { useLocalLlm, type LocalLlmState } from "./use-local-llm";
import {
  CHATS_KEY,
  MAX_CHATS,
  parseSessions,
  updateChat,
  type Message,
} from "@/lib/chatbot/sessions";

// The build script guarantees numeric sparse vectors; JSON inference adds
// optional keys when it unions differently shaped chunk vectors.
const corpus = bundledCorpus as unknown as Corpus;

type Source = { source: string; href?: string };

const SUGGESTION_KEYS = ["q0", "q1", "q2", "q3"] as const;
/** Always offered to the model so greetings and vague questions still get grounded replies. */
const BASELINE_CHUNK_ID = "profile";

function toSources(results: RankedChunk[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const { chunk } of results) {
    if (seen.has(chunk.source)) continue;
    seen.add(chunk.source);
    out.push({ source: chunk.source, href: chunk.href });
  }
  return out;
}

export function AskPortfolio({
  onClose,
  settingsRequest = 0,
}: {
  onClose: () => void;
  settingsRequest?: number;
}) {
  const t = useTranslations("chatbot");
  const reduce = useReducedMotion();
  const llm = useLocalLlm();
  const [settingsOpen, setSettingsOpen] = useState(settingsRequest > 0);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState(() => {
    try {
      return parseSessions(sessionStorage.getItem(CHATS_KEY));
    } catch {
      return parseSessions(null);
    }
  });
  const activeChat = sessions.chats.find((c) => c.id === sessions.activeId)!;
  const messages = activeChat.messages;
  const setMessages = (update: (previous: Message[]) => Message[]) => {
    const chatId = sessions.activeId;
    setSessions((previous) => ({
      ...previous,
      chats: previous.chats.map((c) => (c.id === chatId ? updateChat(c, update(c.messages)) : c)),
    }));
  };
  const [chatNotice, setChatNotice] = useState<"contextCleared" | "chatCleared" | null>(null);
  const [generating, setGenerating] = useState(false);
  const mounted = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const nextId = useRef(
    Math.max(0, ...sessions.chats.flatMap((c) => c.messages.map((m) => m.id + 1))),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settingsRequest) setSettingsOpen(true);
  }, [settingsRequest]);
  useEffect(() => {
    try {
      sessionStorage.setItem(CHATS_KEY, JSON.stringify(sessions));
    } catch {
      /* Full/blocked storage leaves chats usable in memory. */
    }
  }, [sessions]);

  const resetChat = (contextOnly: boolean) => {
    if (generating) return;
    setSessions((previous) => ({
      ...previous,
      chats: previous.chats.map((c) =>
        c.id === previous.activeId
          ? {
              ...c,
              messages: contextOnly ? c.messages : [],
              contextStart: contextOnly ? c.messages.length : 0,
            }
          : c,
      ),
    }));
    setInput("");
    setChatNotice(contextOnly ? "contextCleared" : "chatCleared");
  };

  useEffect(() => {
    mounted.current = true;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const lexicalAnswer = (query: string, id: number, data: Corpus): Message => {
    const history = messagesRef.current
      .slice(activeChat.contextStart)
      .filter((m) => m.role === "user")
      .slice(-1)
      .map((m) => ({ role: "user" as const, content: m.text }));
    const results = selectContext(query, history, data, 2);
    if (results.length === 0) return { id, role: "bot", mode: "lexical", text: t("noAnswer") };
    return {
      id,
      role: "bot",
      mode: "lexical",
      text: results.map((r) => r.chunk.text).join("\n\n"),
      sources: toSources(results),
    };
  };

  const askAi = async (query: string, data: Corpus) => {
    const history = toHistory(messagesRef.current.slice(activeChat.contextStart));
    const budget = generationBudget(llm.settings);
    const ranked = selectContext(query, history, data, budget.contextChunks);
    const context = ranked.map((r) => r.chunk);
    const baseline = data.chunks.find((c) => c.id === BASELINE_CHUNK_ID);
    if (baseline && !context.some((c) => c.id === baseline.id)) context.push(baseline);
    const prompt = buildChatMessages({
      name: SITE.name,
      question: query,
      context,
      history,
      maxContextChars: budget.maxContextChars,
      length: llm.settings.length,
    });

    const userId = nextId.current++;
    const botId = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text: query },
      {
        id: botId,
        role: "bot",
        mode: "ai",
        text: "",
        streaming: true,
        // Include the grounding selected for this question and its follow-up context.
        sources: toSources(ranked),
      },
    ]);
    setGenerating(true);

    let text = "";
    let frame = 0;
    let timedOut = false;
    const patch = (next: Partial<Message>) => {
      if (mounted.current)
        setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, ...next } : m)));
    };
    const engine = llm.runtime.current;
    // A cached download does not guarantee fast inference. Bound a stalled
    // prefill and return the existing grounded quick answer instead.
    const firstTokenDeadline = setTimeout(() => {
      if (!mounted.current || text) return;
      timedOut = true;
      // Show the fallback immediately, even if the worker takes time to stop.
      patch({ ...lexicalAnswer(query, botId, data), streaming: false });
      setGenerating(false);
      if (llm.runtime.current === engine) llm.fail();
    }, 8000);
    try {
      if (!engine) throw new Error("No active runtime");
      for await (const delta of engine.stream(prompt, budget.maxTokens)) {
        if (timedOut || !mounted.current) return;
        clearTimeout(firstTokenDeadline);
        text += delta;
        // Coalesce token updates into one render per frame.
        if (!frame) {
          frame = requestAnimationFrame(() => {
            frame = 0;
            patch({ text });
          });
        }
      }
      cancelAnimationFrame(frame);
      if (timedOut) return;
      if (cleanModelText(text)) patch({ text: cleanModelText(text), streaming: false });
      else patch({ ...lexicalAnswer(query, botId, data), streaming: false });
    } catch {
      cancelAnimationFrame(frame);
      if (!mounted.current || timedOut) return;
      const fallback = lexicalAnswer(query, botId, data);
      setMessages((prev) => prev.map((m) => (m.id === botId ? fallback : m)));
      if (llm.runtime.current === engine) llm.fail();
    } finally {
      clearTimeout(firstTokenDeadline);
      if (mounted.current && !timedOut) setGenerating(false);
    }
  };

  const ask = (raw: string) => {
    const query = raw.trim();
    if (!query || generating) return;
    setInput("");
    setChatNotice(null);
    if (llm.state.status === "ready") {
      void askAi(query, corpus);
      return;
    }
    const userMsg: Message = { id: nextId.current++, role: "user", text: query };
    const botMsg = lexicalAnswer(query, nextId.current++, corpus);
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const aiReady = llm.state.status === "ready";

  return (
    <motion.div
      role="dialog"
      aria-label={t("title")}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          if (settingsOpen) setSettingsOpen(false);
          else onClose();
        }
      }}
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-border bg-bg-elev pointer-events-auto fixed right-4 bottom-4 z-[80] flex h-[min(36rem,calc(100dvh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border shadow-2xl"
    >
      <header className="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="bg-accent-cyan/15 text-accent-cyan inline-flex h-7 w-7 items-center justify-center rounded-full">
            {aiReady ? <Sparkles className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">{t("title")}</p>
            <p className="text-fg-subtle text-[10px]">
              {aiReady ? t("ai.subtitle") : t("subtitle")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-label={t("settings.open")}
            title={t("settings.open")}
            aria-pressed={settingsOpen}
            className="text-fg-subtle hover:bg-bg-sunken hover:text-fg rounded-md p-2"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="text-fg-subtle hover:bg-bg-sunken hover:text-fg rounded-md p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <AiStatus
        state={llm.state}
        reduce={reduce === true}
        onDisable={() => llm.update({ engine: "quick" })}
      />
      {settingsOpen ? (
        <ChatSettingsPanel
          settings={llm.settings}
          device={llm.device}
          state={llm.state}
          onChange={llm.update}
          removal={llm.removal}
          onRemove={llm.removeModels}
          busy={generating}
          onBack={() => {
            setSettingsOpen(false);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        />
      ) : (
        <>
          <div className="border-border space-y-2 border-b px-3 py-2">
            <div className="flex gap-2">
              <select
                aria-label={t("chats.select")}
                value={sessions.activeId}
                disabled={generating}
                className="border-border bg-bg-sunken min-w-0 flex-1 rounded border p-1 text-xs"
                onChange={(e) => {
                  setSessions((s) => ({ ...s, activeId: e.target.value }));
                  setInput("");
                  setChatNotice(null);
                }}
              >
                {sessions.chats.map((chat, i) => (
                  <option key={chat.id} value={chat.id}>
                    {chat.messages.find((m) => m.role === "user")?.text.slice(0, 45) ||
                      t("chats.untitled", { number: i + 1 })}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn-secondary px-2 py-1 text-xs"
                disabled={generating || sessions.chats.length >= MAX_CHATS}
                onClick={() => {
                  const id = crypto.randomUUID();
                  setSessions((s) => ({
                    activeId: id,
                    chats: [...s.chats, { id, messages: [], contextStart: 0 }],
                  }));
                  setInput("");
                  setChatNotice(null);
                }}
              >
                {t("chats.new")}
              </button>
            </div>
            <div className="text-fg-subtle flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <button
                type="button"
                disabled={generating || messages.length === 0}
                onClick={() => resetChat(true)}
                className="hover:text-fg disabled:opacity-40"
              >
                {t("chats.clearContext")}
              </button>
              <button
                type="button"
                disabled={generating || messages.length === 0}
                onClick={() => resetChat(false)}
                className="hover:text-fg disabled:opacity-40"
              >
                {t("chats.clearChat")}
              </button>
              <button
                type="button"
                disabled={generating || sessions.chats.length < 2}
                className="hover:text-fg disabled:opacity-40"
                onClick={() => {
                  setSessions((s) => {
                    const chats = s.chats.filter((c) => c.id !== s.activeId);
                    return { chats, activeId: chats[0]!.id };
                  });
                  setInput("");
                  setChatNotice(null);
                }}
              >
                {t("chats.delete")}
              </button>
            </div>
            {chatNotice && (
              <p role="status" className="text-accent-cyan text-[11px]">
                {t(`chats.${chatNotice}`)}
              </p>
            )}
          </div>
          <div
            ref={listRef}
            aria-live="polite"
            aria-busy={generating}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
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
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "bg-accent-cyan/15 text-fg max-w-[85%] rounded-lg rounded-br-sm px-3 py-2 text-sm"
                      : "bg-bg-sunken/70 text-fg-muted max-w-[90%] rounded-lg rounded-bl-sm px-3 py-2 text-sm"
                  }
                >
                  <span className="mb-1 flex items-center gap-1 opacity-60">
                    {m.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    {m.mode === "ai" && (
                      <span className="text-accent-cyan font-mono text-[9px] tracking-widest uppercase">
                        {t("ai.badge")}
                      </span>
                    )}
                  </span>
                  {m.streaming && !m.text ? (
                    <p className={cn("text-fg-subtle", !reduce && "animate-pulse")}>
                      {t("ai.thinking")}
                    </p>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                  {!m.streaming && m.sources && m.sources.length > 0 && (
                    <p className="text-fg-subtle mt-2 font-mono text-[10px]">
                      {t("sourcesLabel")}:{" "}
                      {m.sources.map((s, i) => (
                        <span key={s.source}>
                          {i > 0 && " · "}
                          {s.href ? (
                            <Link href={s.href} className="hover:text-accent-cyan underline">
                              {s.source}
                            </Link>
                          ) : (
                            s.source
                          )}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              className="border-border bg-bg-sunken/60 text-fg focus:border-accent-cyan/60 min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none"
            />
            {generating ? (
              <button
                type="button"
                onClick={() => llm.runtime.current?.interrupt()}
                aria-label={t("ai.stop")}
                title={t("ai.stop")}
                className="btn-ghost px-3 py-2"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                aria-label={t("send")}
                className="btn-primary px-3 py-2"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>
          <p className="text-fg-subtle border-border border-t px-3 py-1.5 text-center text-[10px]">
            {aiReady ? t("ai.disclaimer") : t("disclaimer")}
          </p>
        </>
      )}
    </motion.div>
  );
}

function AiStatus({
  state,
  reduce,
  onDisable,
}: {
  state: LocalLlmState;
  reduce: boolean;
  onDisable: () => void;
}) {
  const t = useTranslations("chatbot");
  if (state.status === "off") return null;
  const percent =
    state.status === "loading" && state.progress.phase === "download"
      ? Math.max(0, Math.min(100, Math.round(state.progress.fraction * 100)))
      : 0;
  return (
    <div
      role="status"
      className="border-border text-fg-subtle shrink-0 space-y-1 border-b px-4 py-2 text-[11px]"
    >
      <div className="flex items-center justify-between gap-2">
        <span>
          {state.status === "ready"
            ? t("settings.active", { engine: t(`settings.engines.${state.engine}.label`) })
            : state.status === "fallback"
              ? t("settings.fallback")
              : state.progress.phase === "warmup"
                ? t("settings.warmup")
                : t("settings.loading", { percent })}
        </span>
        {(state.status === "ready" || state.status === "loading") && (
          <button
            type="button"
            className="text-accent-cyan shrink-0 hover:underline"
            onClick={onDisable}
          >
            {t(state.status === "loading" ? "settings.cancel" : "settings.turnOff")}
          </button>
        )}
      </div>
      {state.status === "loading" && state.progress.phase === "download" && (
        <div
          role="progressbar"
          aria-label={t("ai.progressLabel")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="bg-bg-sunken h-1 overflow-hidden rounded-full"
        >
          <div
            className={cn("bg-accent-cyan h-full", !reduce && "transition-[width] duration-300")}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
      {state.status === "loading" && <p>{t("ai.loadingHint")}</p>}
    </div>
  );
}
