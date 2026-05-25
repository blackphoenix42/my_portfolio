"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Ctx = { recruiter: boolean; setRecruiter: (v: boolean) => void; toggle: () => void };
const RecruiterCtx = createContext<Ctx | null>(null);

export function RecruiterModeProvider({ children }: { children: React.ReactNode }) {
  const [recruiter, setRecruiter] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recruiter-mode");
    if (stored === "1") setRecruiter(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.recruiter = recruiter ? "1" : "0";
    localStorage.setItem("recruiter-mode", recruiter ? "1" : "0");
  }, [recruiter]);

  return (
    <RecruiterCtx.Provider
      value={{ recruiter, setRecruiter, toggle: () => setRecruiter((v) => !v) }}
    >
      {children}
    </RecruiterCtx.Provider>
  );
}

export function useRecruiterMode() {
  const ctx = useContext(RecruiterCtx);
  if (!ctx) throw new Error("RecruiterMode must be used inside provider");
  return ctx;
}
