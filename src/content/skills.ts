export type SkillCluster = {
  id: string;
  name: string;
  blurb: string;
  accent: "cyan" | "violet" | "emerald" | "amber";
  skills: { name: string; level?: "core" | "strong" | "familiar" | "exploring" }[];
  relatedProjects?: string[];
};

export const clusters: SkillCluster[] = [
  {
    id: "performance",
    name: "Performance Core",
    blurb: "Low-level engineering for simulation, profiling and runtime optimization.",
    accent: "amber",
    skills: [
      { name: "C++", level: "core" },
      { name: "Profiling", level: "core" },
      { name: "Valgrind", level: "strong" },
      { name: "AddressSanitizer", level: "strong" },
      { name: "SystemVerilog", level: "strong" },
      { name: "RTL", level: "strong" },
      { name: "Undo Debugger", level: "familiar" },
      { name: "Perforce", level: "strong" },
    ],
    relatedProjects: ["xcelium-optimization", "xmai"],
  },
  {
    id: "intelligent",
    name: "Intelligent Systems",
    blurb: "Agentic AI, retrieval and embeddings applied to engineering workflows.",
    accent: "violet",
    skills: [
      { name: "LLMs", level: "core" },
      { name: "RAG", level: "core" },
      { name: "Vector Embeddings", level: "core" },
      { name: "AI Agents", level: "strong" },
      { name: "MCP", level: "strong" },
      { name: "Graph Neural Networks", level: "familiar" },
      { name: "Deep Learning", level: "familiar" },
    ],
    relatedProjects: ["xmai", "algolens"],
  },
  {
    id: "backend",
    name: "Distributed Backend",
    blurb: "Service architecture, streaming and storage for scalable systems.",
    accent: "cyan",
    skills: [
      { name: "Go", level: "strong" },
      { name: "Python", level: "strong" },
      { name: "REST", level: "core" },
      { name: "gRPC", level: "strong" },
      { name: "GraphQL", level: "familiar" },
      { name: "Kafka", level: "familiar" },
      { name: "Redis", level: "strong" },
      { name: "PostgreSQL", level: "strong" },
      { name: "MongoDB", level: "strong" },
    ],
  },
  {
    id: "product",
    name: "Product Engineering",
    blurb: "Polished, accessible product surfaces with rigorous quality gates.",
    accent: "emerald",
    skills: [
      { name: "React", level: "core" },
      { name: "TypeScript", level: "core" },
      { name: "Redux", level: "strong" },
      { name: "Tailwind CSS", level: "core" },
      { name: "Canvas", level: "strong" },
      { name: "Accessibility", level: "strong" },
      { name: "Playwright", level: "strong" },
      { name: "Storybook", level: "strong" },
    ],
    relatedProjects: ["algolens"],
  },
  {
    id: "infra",
    name: "Infrastructure",
    blurb: "Cloud, containers and developer-experience plumbing.",
    accent: "cyan",
    skills: [
      { name: "AWS", level: "strong" },
      { name: "GCP", level: "strong" },
      { name: "Docker", level: "core" },
      { name: "CI/CD", level: "core" },
      { name: "Linux", level: "core" },
      { name: "Git", level: "core" },
      { name: "Bash", level: "strong" },
    ],
  },
];
