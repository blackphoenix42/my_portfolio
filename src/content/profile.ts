export const SITE = {
  name: "Ayush Yadav",
  role: "R&D Software Engineer II",
  company: "Cadence Design Systems",
  tagline: "Faster systems. Reliable AI tooling. Measured engineering impact.",
  description:
    "Ayush Yadav — R&D Software Engineer II at Cadence with 4.5+ years of experience in C++, Python and AI-driven automation. Xcelium performance, RTL optimization and engineering infrastructure across Apple, Google, Samsung and NVIDIA workloads.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://binaryphoenix.vercel.app",
  email: "aayush.sang@gmail.com",
  github: "https://github.com/blackphoenix42",
  linkedin: "https://linkedin.com/in/ayushyadav",
  codechef: "https://codechef.com/users/blackphoenix42",
  codeforces: "https://codeforces.com/profile/BinaryPhoenix10",
  leetcode: "https://leetcode.com/u/BinaryPhoenix/",
  hackerrank: "https://www.hackerrank.com/profile/BinaryPhoenix",
  location: "India",
  resumePath: "/assets/resume/Ayush_Yadav_Resume_2026-10.pdf",
  showPhone: process.env.NEXT_PUBLIC_SHOW_PHONE === "true",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
} as const;

// Owner-supplied voice introduction, October 2026.
export const VOICE_INTRO =
  "Hi, I’m Ayush Yadav, an R&D Software Engineer with 4.5+ years of experience building high-performance systems in C++, Python, and AI-driven automation. At Cadence, I work on Xcelium and large-scale RTL optimization, improving simulation performance, developer productivity, and engineering workflows. I enjoy solving complex systems problems at the intersection of software, performance, and hardware.";

export const TAGLINES = [
  "Performance-critical C++ × distributed systems × agentic AI.",
  "Production wins on Apple, Google, Samsung and NVIDIA workloads.",
  "From low-level profiling to AI-assisted developer tooling at scale.",
  "Owning problems end-to-end — measure, design, ship, operate.",
] as const;
