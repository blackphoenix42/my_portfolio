"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRecruiterMode } from "./recruiter-mode";

type Ctx = { engineer: boolean; setEngineer: (v: boolean) => void; toggle: () => void };
const EngineerCtx = createContext<Ctx | null>(null);

// Must be nested INSIDE RecruiterModeProvider so the two audience modes can be
// kept mutually exclusive: enabling Engineer Mode here turns Recruiter Mode off.
// The reverse guard lives in the recruiter entry points (toggle + `r` shortcut),
// which call `setEngineer(false)` when they switch recruiter on.
export function EngineerModeProvider({ children }: { children: React.ReactNode }) {
  const [engineer, setEngineerState] = useState(false);
  const { setRecruiter } = useRecruiterMode();

  useEffect(() => {
    const stored = localStorage.getItem("engineer-mode");
    if (stored === "1") setEngineerState(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.engineer = engineer ? "1" : "0";
    localStorage.setItem("engineer-mode", engineer ? "1" : "0");
  }, [engineer]);

  const setEngineer = useCallback(
    (v: boolean) => {
      setEngineerState(v);
      if (v) setRecruiter(false);
    },
    [setRecruiter],
  );

  const toggle = useCallback(() => setEngineer(!engineer), [engineer, setEngineer]);

  return (
    <EngineerCtx.Provider value={{ engineer, setEngineer, toggle }}>
      {children}
    </EngineerCtx.Provider>
  );
}

export function useEngineerMode() {
  const ctx = useContext(EngineerCtx);
  if (!ctx) throw new Error("EngineerMode must be used inside provider");
  return ctx;
}
