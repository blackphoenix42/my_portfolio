import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ayush Yadav — engineer focused on performance, AI tooling and interactive products.",
};

export default function AboutPage() {
  return (
    <div>
      <header className="container-tight pt-16">
        <p className="mono-label">/ about</p>
        <h1 className="mt-2 text-display-2 font-semibold tracking-tight">About</h1>
      </header>
      <AboutSection />
    </div>
  );
}
