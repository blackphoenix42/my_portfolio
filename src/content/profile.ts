export const SITE = {
  name: "Ayush Yadav",
  role: "R&D Software Engineer II",
  company: "Cadence Design Systems",
  tagline: "Engineering intelligence into performance-critical systems.",
  description:
    "Portfolio of Ayush Yadav, R&D Software Engineer at Cadence specializing in C++ performance optimization, EDA, distributed systems, cloud-native backends, agentic AI and accessible React/TypeScript products.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayushyadav.dev",
  email: "aayush.sang@gmail.com",
  github: "https://github.com/blackphoenix42",
  linkedin: "https://linkedin.com/in/ayushyadav",
  codechef: "https://codechef.com/users/blackphoenix42",
  codeforces: "https://codeforces.com/profile/BinaryPhoenix10",
  leetcode: "https://leetcode.com/u/BinaryPhoenix/",
  hackerrank: "https://www.hackerrank.com/profile/BinaryPhoenix",
  location: "India",
  resumePath: "/assets/resume/Resume.pdf",
  showPhone: process.env.NEXT_PUBLIC_SHOW_PHONE === "true",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
} as const;

export const TAGLINES = [
  "Building faster simulators, smarter profilers and intelligent developer tools.",
  "Performance Engineering × Agentic AI × Product Craft.",
  "From low-level C++ optimization to AI-powered engineering workflows.",
  "Turning system bottlenecks into measurable breakthroughs.",
] as const;
