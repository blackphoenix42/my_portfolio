"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  EGG_STORAGE_KEY,
  emptyProgress,
  sanitizeProgress,
  withUnlocked,
  type EggId,
  type EggProgress,
} from "@/lib/eggs";

type Ctx = {
  progress: EggProgress;
  unlock: (id: EggId) => void;
  reset: () => void;
  recordLocaleVisit: (locale: string) => void;
  recordHaiku: (key: string) => void;
  setDinoHighScore: (score: number) => void;
  setFeatherHighScore: (score: number) => void;
  /** Most recent unlock id, for the toast. Cleared after consumption. */
  lastUnlock: EggId | null;
  consumeLastUnlock: () => void;
};

const EggContext = createContext<Ctx | null>(null);

function readStorage(): EggProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(EGG_STORAGE_KEY);
    if (!raw) return emptyProgress();
    return sanitizeProgress(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

function writeStorage(p: EggProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EGG_STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function EggProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<EggProgress>(emptyProgress);
  const [lastUnlock, setLastUnlock] = useState<EggId | null>(null);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setProgress(readStorage());
    hydrated.current = true;
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    writeStorage(progress);
  }, [progress]);

  const unlock = useCallback((id: EggId) => {
    setProgress((prev) => {
      if (prev.unlocked.includes(id)) return prev;
      const next = withUnlocked(prev, id);
      // Dispatch toast.
      setLastUnlock(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setProgress(emptyProgress());
    setLastUnlock(null);
  }, []);

  const recordLocaleVisit = useCallback((locale: string) => {
    if (!/^[a-z]{2}$/.test(locale)) return;
    setProgress((prev) => {
      if (prev.visitedLocales.includes(locale)) return prev;
      return { ...prev, visitedLocales: [...prev.visitedLocales, locale] };
    });
  }, []);

  const recordHaiku = useCallback((key: string) => {
    setProgress((prev) => {
      if (prev.foundHaikus.includes(key)) return prev;
      return { ...prev, foundHaikus: [...prev.foundHaikus, key] };
    });
  }, []);

  const setDinoHighScore = useCallback((score: number) => {
    setProgress((prev) =>
      score > prev.dinoHighScore ? { ...prev, dinoHighScore: Math.floor(score) } : prev,
    );
  }, []);

  const setFeatherHighScore = useCallback((score: number) => {
    setProgress((prev) =>
      score > prev.featherHighScore ? { ...prev, featherHighScore: Math.floor(score) } : prev,
    );
  }, []);

  const consumeLastUnlock = useCallback(() => setLastUnlock(null), []);

  const ctx = useMemo<Ctx>(
    () => ({
      progress,
      unlock,
      reset,
      recordLocaleVisit,
      recordHaiku,
      setDinoHighScore,
      setFeatherHighScore,
      lastUnlock,
      consumeLastUnlock,
    }),
    [
      progress,
      unlock,
      reset,
      recordLocaleVisit,
      recordHaiku,
      setDinoHighScore,
      setFeatherHighScore,
      lastUnlock,
      consumeLastUnlock,
    ],
  );

  return <EggContext.Provider value={ctx}>{children}</EggContext.Provider>;
}

export function useEggs(): Ctx {
  const ctx = useContext(EggContext);
  if (!ctx) {
    // Safe no-op fallback for tests / pages that render the provider tree
    // partially (Storybook, etc.). Never throws — eggs are optional.
    const noop: Ctx = {
      progress: emptyProgress(),
      unlock: () => {},
      reset: () => {},
      recordLocaleVisit: () => {},
      recordHaiku: () => {},
      setDinoHighScore: () => {},
      setFeatherHighScore: () => {},
      lastUnlock: null,
      consumeLastUnlock: () => {},
    };
    return noop;
  }
  return ctx;
}
