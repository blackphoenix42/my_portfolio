"use client";

import { useEffect } from "react";
import { useEggs } from "./egg-provider";

/**
 * Tracks "haiku" easter eggs: a hidden HTML comment on three different pages
 * (home / about / work). Each carries an invisible span tagged
 * `data-haiku="<key>"` that this hook detects on the active page. After all
 * three keys are recorded, the `haiku-trail` egg unlocks.
 */
export function HaikuRecorder() {
  const { recordHaiku, progress, unlock } = useEggs();

  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLElement>("[data-haiku]"))
      .map((el) => el.dataset.haiku ?? "")
      .filter(Boolean);
    for (const f of found) recordHaiku(f);
  }, [recordHaiku]);

  useEffect(() => {
    if (progress.foundHaikus.length >= 3) {
      unlock("haiku-trail");
    }
  }, [progress.foundHaikus, unlock]);

  return null;
}

/**
 * Records the `css-selection` egg when the user selects the hidden span in
 * the hero (revealed only via `::selection` color). We listen for
 * `selectionchange` and check whether the selection range intersects the
 * tagged element.
 */
export function SelectionWatcher() {
  const { unlock } = useEggs();

  useEffect(() => {
    const onSelect = () => {
      const sel = document.getSelection();
      if (!sel || sel.isCollapsed) return;
      const node = sel.anchorNode;
      if (!node) return;
      const el = node.nodeType === 1 ? (node as Element) : node.parentElement;
      if (el?.closest("[data-selection-egg]")) {
        unlock("css-selection");
      }
    };
    document.addEventListener("selectionchange", onSelect);
    return () => document.removeEventListener("selectionchange", onSelect);
  }, [unlock]);

  return null;
}
