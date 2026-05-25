"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Domain mapping for known companies / schools. Clearbit Logo API:
//   https://logo.clearbit.com/<domain>
// Falls back to a colored monogram if the logo fails to load.
const DOMAINS: Record<string, string> = {
  "Cadence Design Systems": "cadence.com",
  "Omikron Technologies": "omikrontech.com",
  "Script Winter of Code": "script.foundation",
  "Delta Winter of Code": "deltawoc.com",
  "Tezos India": "tezosindia.foundation",
  "Programming Club Summer of Code": "iitkanpur.org.in",
  "Trotbee Private Limited": "trotbee.com",
  "Miri Infotech": "miritech.com",
  "Netaji Subhas University of Technology (East Campus)": "nsut.ac.in",
  "Ramjas School, R. K. Puram": "ramjasschoolrkpuram.com",
};

function initials(name: string) {
  return name
    .replace(/[^A-Za-z ]+/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function CompanyLogo({ name, className }: { name: string; className?: string }) {
  const domain = DOMAINS[name];
  const [failed, setFailed] = useState(false);

  if (domain && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 font-mono text-[10px] font-semibold text-fg",
        className,
      )}
    >
      {initials(name) || "•"}
    </div>
  );
}
