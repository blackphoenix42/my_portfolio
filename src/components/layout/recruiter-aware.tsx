"use client";

import { useRecruiterMode } from "@/components/layout/recruiter-mode";

export function RecruiterAware({
  recruiter,
  full,
}: {
  recruiter: React.ReactNode;
  full: React.ReactNode;
}) {
  const { recruiter: on } = useRecruiterMode();
  return <>{on ? recruiter : full}</>;
}
