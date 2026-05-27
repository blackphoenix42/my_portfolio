"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Logo slugs whose source artwork uses dark text/marks and need a light background
// in dark/phoenix themes to remain readable.
const DARK_TEXT_LOGOS = new Set<string>([
  "Cadence Design Systems",
  "Tezos India",
  "Codeforces",
  "LeetCode",
  "HackerRank",
  "Programming Club Summer of Code",
  "Miri Infotech",
  "Script Winter of Code",
  "Delta Winter of Code",
]);

// Local logo files in /public/assets/logos. Preferred over network sources.
const LOCAL: Record<string, string> = {
  "Cadence Design Systems": "/assets/logos/cadence.svg",
  "Omikron Technologies": "/assets/logos/omikron.jpg",
  "Script Winter of Code": "/assets/logos/swoc.png",
  "Delta Winter of Code": "/assets/logos/dwoc.png",
  "Tezos India": "/assets/logos/tezos.png",
  "Programming Club Summer of Code": "/assets/logos/pclub.png",
  Trotbee: "/assets/logos/fenmo.jpg",
  "Trotbee Private Limited": "/assets/logos/fenmo.jpg",
  Fenmo: "/assets/logos/fenmo.jpg",
  "Miri Infotech": "/assets/logos/miri-infotech.png",
  "Netaji Subhas University of Technology (East Campus)": "/assets/logos/nsut.png",
  NSUT: "/assets/logos/nsut.png",
  "Ramjas School, R. K. Puram": "/assets/logos/ramjas.jpg",
  "Ramjas International School, R. K. Puram": "/assets/logos/ramjas.jpg",
  "Dynamix Club": "/assets/logos/dynamix.jpg",
  "Game Geeks": "/assets/logos/game-geeks.jpeg",
  CodeChef: "/assets/logos/codechef.png",
  Codeforces: "/assets/logos/codeforces.svg",
  HackerRank: "/assets/logos/hackerrank.png",
  LeetCode: "/assets/logos/leetcode.png",
  Phoenix: "/assets/logos/phoenix.jpg",
};

// Network fallback domains (Clearbit + Google s2 favicons).
const DOMAINS: Record<string, string> = {
  "Cadence Design Systems": "cadence.com",
  "Omikron Technologies": "omikrontech.com",
  "Script Winter of Code": "script.foundation",
  "Delta Winter of Code": "deltawoc.com",
  "Tezos India": "tezosindia.foundation",
  "Programming Club Summer of Code": "pclub.in",
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
  const hasLocal = !!LOCAL[name];
  const hasDomain = !!DOMAINS[name];
  const initialStage: 0 | 1 | 2 | 3 = hasLocal ? 0 : hasDomain ? 1 : 3;
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(initialStage);

  if (stage === 3) {
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

  let src = "";
  if (stage === 0 && hasLocal) src = LOCAL[name]!;
  else if (stage === 1 && hasDomain) src = `https://logo.clearbit.com/${DOMAINS[name]}`;
  else if (stage === 2 && hasDomain)
    src = `https://www.google.com/s2/favicons?sz=128&domain=${DOMAINS[name]}`;

  const needsLightBg = DARK_TEXT_LOGOS.has(name);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      onError={() =>
        setStage((s) => {
          if (s === 0) return hasDomain ? 1 : 3;
          if (s === 1) return 2;
          return 3;
        })
      }
      className={cn("object-contain", needsLightBg && "rounded-[3px] bg-white p-0.5", className)}
    />
  );
}
