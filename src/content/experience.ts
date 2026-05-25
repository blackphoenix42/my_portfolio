export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: {
    title: string;
    detail: string;
    tags: string[];
  }[];
};

export const experiences: Experience[] = [
  {
    company: "Cadence Design Systems",
    role: "R&D Software Engineer II",
    location: "Noida, India",
    start: "Jul 2022",
    end: "Present",
    summary:
      "Working at the intersection of low-level performance engineering, EDA simulation technology and AI-assisted developer tooling.",
    highlights: [
      {
        title: "XMAI — Agentic AI Profiler",
        detail:
          "Built an AI-assisted EDA profiler using LLMs, RAG, vector embeddings, MCP and Cadence JEDAI to accelerate failure analysis and optimization workflows.",
        tags: ["LLMs", "RAG", "MCP", "Embeddings", "C++"],
      },
      {
        title: "Xcelium Logic Simulator Optimization",
        detail:
          "Optimized the Xcelium logic simulator using low-level C++, scalable profiling and runtime analysis — improving simulation throughput by 18–19% on large customer workloads.",
        tags: ["C++", "Profiling", "Runtime"],
      },
      {
        title: "Xform Engine RTL Transformations",
        detail:
          "Implemented RTL transformations in the Xform Engine, improving runtime performance by 13–14% for designs from Apple, Google, Samsung and NVIDIA.",
        tags: ["RTL", "Compilers", "SystemVerilog"],
      },
      {
        title: "Performance-Analysis Library",
        detail:
          "Built and presented a C++ performance-analysis library at Cadence India Conference enabling Top-N profiling and structured diagnostics — reduced debug RCA time by ~40%.",
        tags: ["C++", "Library Design", "Diagnostics"],
      },
      {
        title: "Corporate VP / MD Recognition",
        detail:
          "Received Corporate VP / MD recognition for performance wins contributing to a multi-million-dollar Samsung deal.",
        tags: ["Impact", "Recognition"],
      },
    ],
  },
];

export const education = {
  school: "Netaji Subhas University of Technology (East Campus)",
  degree: "B.Tech, Computer Science and Engineering",
  start: "Aug 2018",
  end: "May 2022",
  cgpa: "8.4 / 10",
};
