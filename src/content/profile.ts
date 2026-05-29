export const SITE = {
  name: "Ayush Yadav",
  role: "R&D Software Engineer II",
  company: "Cadence Design Systems",
  tagline: "Engineering intelligence into performance-critical systems.",
  description:
    "Ayush Yadav — R&D Software Engineer at Cadence. C++ performance, distributed systems, agentic AI and developer tooling. Production wins on Apple, Google, Samsung and NVIDIA workloads.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://binaryphoenix.vercel.app",
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
  "Performance-critical C++ × distributed systems × agentic AI.",
  "Production wins on Apple, Google, Samsung and NVIDIA workloads.",
  "From low-level profiling to AI-assisted developer tooling at scale.",
  "Owning problems end-to-end — measure, design, ship, operate.",
] as const;
