"use client";

import { useEngineerMode } from "@/components/layout/engineer-mode";

export function EngineerAware({
  engineer,
  full,
}: {
  engineer: React.ReactNode;
  full: React.ReactNode;
}) {
  const { engineer: on } = useEngineerMode();
  return <>{on ? engineer : full}</>;
}
