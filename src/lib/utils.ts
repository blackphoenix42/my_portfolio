import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export const accentRing: Record<string, string> = {
  cyan: "ring-accent-cyan/40 text-accent-cyan",
  violet: "ring-accent-violet/40 text-accent-violet",
  emerald: "ring-accent-emerald/40 text-accent-emerald",
  amber: "ring-accent-amber/40 text-accent-amber",
};

export const accentText: Record<string, string> = {
  cyan: "text-accent-cyan",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
  amber: "text-accent-amber",
};

export const accentBg: Record<string, string> = {
  cyan: "bg-accent-cyan/10 border-accent-cyan/30",
  violet: "bg-accent-violet/10 border-accent-violet/30",
  emerald: "bg-accent-emerald/10 border-accent-emerald/30",
  amber: "bg-accent-amber/10 border-accent-amber/30",
};
