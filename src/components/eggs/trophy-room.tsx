"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, Sparkles, Lock, RotateCcw, Share2, Copy, Mail, Flame } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { EGG_IDS, EGG_META, decodeShareHash, encodeShareHash, type EggId } from "@/lib/eggs";
import { SITE } from "@/content/profile";
import { useEggs } from "./egg-provider";

/**
 * Trophy room — the home of `/secret`. Lists every egg in the registry,
 * showing unlocked ones with their title and hint and locked ones as a
 * vague silhouette + clue. Also surfaces:
 *
 *  - Share URL (`?eggs=…`) that encodes only the unlocked-bitmap + scores.
 *    Reading a friend's share URL never mutates progress.
 *  - Reset button (with confirm) — clears everything to zero.
 *  - Completionist mailto when every egg is found.
 */
export function TrophyRoom() {
  const t = useTranslations("eggs");
  const tCat = useTranslations("eggs.catalogue");
  const locale = useLocale();
  const { progress, reset, unlock } = useEggs();
  const [copied, setCopied] = useState(false);
  const [friend, setFriend] = useState<{
    unlocked: EggId[];
    dinoHighScore: number;
    featherHighScore: number;
  } | null>(null);

  // Visiting /secret itself unlocks an egg.
  useEffect(() => {
    unlock("trophy-room-visit");
  }, [unlock]);

  // Parse `?eggs=…` if present. Also unlock the OG-QR egg when the URL
  // carries the `via=og` marker — the QR encoded into the social preview
  // image points here, so a scan unlocks the egg.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get("eggs");
    if (hash) {
      const parsed = decodeShareHash(hash);
      if (parsed) setFriend(parsed);
    }
    if (params.get("via") === "og") {
      unlock("og-qr-scan");
    }
  }, [unlock]);

  // Completionist check — triggers once everything else is unlocked.
  useEffect(() => {
    const required = EGG_IDS.filter((id) => id !== "completionist");
    if (required.every((id) => progress.unlocked.includes(id))) {
      unlock("completionist");
    }
  }, [progress.unlocked, unlock]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    u.search = `?eggs=${encodeShareHash(progress)}`;
    return u.toString();
  }, [progress]);

  const groups = useMemo(() => {
    const byTier: Record<number, EggId[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    for (const id of EGG_IDS) byTier[EGG_META[id].tier]?.push(id);
    return byTier;
  }, []);

  const total = EGG_IDS.length;
  const found = progress.unlocked.length;
  const pct = Math.round((found / total) * 100);
  const isComplete = found >= total;

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  function onReset() {
    if (typeof window === "undefined") return;
    if (window.confirm(t("trophy.resetConfirm"))) reset();
  }

  return (
    <div className="container-tight relative py-16 sm:py-20" lang={locale}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="bg-accent-amber/10 pointer-events-none absolute top-12 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full blur-3xl"
      />

      <header className="max-w-2xl">
        <p className="mono-label inline-flex items-center gap-2">
          <Trophy className="h-3 w-3" /> {t("trophy.tag")}
        </p>
        <h1 className="text-display-2 mt-3 font-semibold tracking-tight">{t("trophy.heading")}</h1>
        <p className="text-fg-muted mt-4 text-lg">{t("trophy.subheading")}</p>
      </header>

      {/* Progress + share controls */}
      <section
        aria-labelledby="trophy-progress"
        className="card mt-8 grid gap-4 p-5 sm:grid-cols-[1fr,auto] sm:items-center"
      >
        <div>
          <h2 id="trophy-progress" className="text-fg text-sm font-semibold">
            {t("trophy.progress", { found, total })}
          </h2>
          <div
            className="bg-bg-sunken mt-2 h-2 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("trophy.progress", { found, total })}
          >
            <div
              className="from-accent-amber via-accent-cyan to-accent-violet h-full bg-gradient-to-r transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-fg-subtle mt-2 font-mono text-[11px]">
            {t("trophy.scoreLine", {
              dino: progress.dinoHighScore,
              feather: progress.featherHighScore,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyShare}
            className="btn-ghost inline-flex items-center gap-1.5 text-xs"
          >
            {copied ? <Copy className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? t("trophy.copied") : t("trophy.share")}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn-ghost text-fg-muted hover:text-accent-amber inline-flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("trophy.reset")}
          </button>
        </div>
      </section>

      {/* Friend share preview */}
      {friend && (
        <aside
          role="note"
          aria-label={t("trophy.friendLabel")}
          className="border-accent-cyan/30 bg-accent-cyan/5 mt-6 rounded-xl border p-4"
        >
          <p className="text-fg text-sm font-semibold">
            {t("trophy.friendHeading", { count: friend.unlocked.length, total })}
          </p>
          <p className="text-fg-muted mt-1 text-xs">
            {t("trophy.friendSubheading", {
              dino: friend.dinoHighScore,
              feather: friend.featherHighScore,
            })}
          </p>
        </aside>
      )}

      {/* Completionist reward */}
      {isComplete && (
        <aside
          role="note"
          aria-label={t("trophy.completeLabel")}
          className="border-accent-amber/40 from-accent-amber/15 via-accent-violet/10 mt-6 rounded-xl border bg-gradient-to-r to-transparent p-5"
        >
          <p className="text-accent-amber inline-flex items-center gap-2 text-sm font-semibold">
            <Flame className="h-4 w-4" /> {t("trophy.completeHeading")}
          </p>
          <p className="text-fg mt-2 text-sm">{t("trophy.completeBody")}</p>
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(t("trophy.completeMailSubject"))}&body=${encodeURIComponent(t("trophy.completeMailBody"))}`}
            className="btn-primary mt-3 inline-flex items-center gap-1.5 text-xs"
          >
            <Mail className="h-3.5 w-3.5" />
            {t("trophy.completeMailCta")}
          </a>
        </aside>
      )}

      {/* Tiers */}
      <section className="mt-10 space-y-10">
        {[1, 2, 3, 4, 5].map((tier) => {
          const ids = groups[tier] ?? [];
          if (ids.length === 0) return null;
          return (
            <div key={tier}>
              <h2 className="text-fg mono-label inline-flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> {t("trophy.tier", { tier })}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {ids.map((id) => {
                  const found = progress.unlocked.includes(id);
                  const titleKey = `${id}.title` as never;
                  const hintKey = `${id}.hint` as never;
                  const clueKey = `${id}.clue` as never;
                  return (
                    <li
                      key={id}
                      className={
                        found
                          ? "card border-accent-amber/30 bg-accent-amber/5 p-4"
                          : "card border-border/60 bg-bg-sunken/40 p-4"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            found
                              ? "border-accent-amber/40 bg-accent-amber/15 text-accent-amber grid h-8 w-8 shrink-0 place-items-center rounded-md border"
                              : "border-border bg-bg-sunken text-fg-subtle grid h-8 w-8 shrink-0 place-items-center rounded-md border"
                          }
                          aria-hidden
                        >
                          {found ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={
                              found
                                ? "text-fg text-sm font-semibold"
                                : "text-fg-muted text-sm font-medium"
                            }
                          >
                            {found
                              ? tCat.has(titleKey)
                                ? tCat(titleKey)
                                : id
                              : t("trophy.locked")}
                          </p>
                          <p className="text-fg-muted mt-1 text-xs">
                            {found
                              ? tCat.has(hintKey)
                                ? tCat(hintKey)
                                : ""
                              : tCat.has(clueKey)
                                ? tCat(clueKey)
                                : t("trophy.lockedClue")}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
