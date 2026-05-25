import type { Metadata } from "next";
import { CPCommandCenter } from "@/components/competitive-programming/cp-command-center";

export const metadata: Metadata = {
  title: "Competitive Programming",
  description:
    "Years of competitive programming across CodeChef, Codeforces, LeetCode and HackerRank.",
};

export default function CPPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ competitive programming</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">
          Competitive programming
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Sustained problem-solving across the major platforms — sharpening data structures,
          algorithms and the kind of disciplined thinking that pays off in performance engineering.
        </p>
      </header>
      <CPCommandCenter />
    </div>
  );
}
