"use client";

import { useEffect } from "react";
import { useEggs } from "./egg-provider";

/**
 * Tiny client-only component used by the hidden `/phoenix` and `/credits`
 * pages to unlock their respective eggs on mount.
 */
export function RouteUnlock({ egg }: { egg: "phoenix-route" | "credits-route" }) {
  const { unlock } = useEggs();
  useEffect(() => {
    unlock(egg);
  }, [unlock, egg]);
  return null;
}
