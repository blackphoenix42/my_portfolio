// Flat skills categorization for the /skills explorer. The cluster view
// in @/content/skills.ts is preserved for case-study related context.

export type FlatCategory = {
  id: string;
  label: string;
  accent: "cyan" | "violet" | "emerald" | "amber";
  skills: string[];
};

export const flatSkillCategories: FlatCategory[] = [
  {
    id: "languages",
    label: "Programming Languages",
    accent: "amber",
    skills: ["C++", "C", "Python", "TypeScript", "JavaScript", "Java", "Go", "Bash"],
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "emerald",
    skills: [
      "React",
      "Tailwind CSS",
      "Redux Toolkit",
      "RTK Query",
      "React Native",
      "Canvas",
      "Konva",
      "Web Workers",
      "Storybook",
      "Accessibility",
      "i18n/RTL",
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    accent: "cyan",
    skills: ["Node.js", "Express", "REST", "gRPC", "GraphQL", "WebSockets", "Micronaut", "OpenAPI"],
  },
  {
    id: "data",
    label: "Databases & Storage",
    accent: "cyan",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase"],
  },
  {
    id: "messaging",
    label: "Messaging & Streaming",
    accent: "violet",
    skills: ["Kafka", "RabbitMQ", "WebSockets"],
  },
  {
    id: "ai",
    label: "AI / ML",
    accent: "violet",
    skills: [
      "LLMs",
      "RAG",
      "Vector Embeddings",
      "AI Agents",
      "MCP",
      "Computer Vision",
      "OpenCV",
      "MediaPipe",
      "NumPy",
      "Deep Learning",
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    accent: "cyan",
    skills: [
      "AWS",
      "GCP",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "GitHub Actions",
      "Jenkins",
      "Terraform",
      "Heroku",
    ],
  },
  {
    id: "performance",
    label: "Performance & Systems",
    accent: "amber",
    skills: [
      "Profiling",
      "Valgrind",
      "AddressSanitizer",
      "GDB",
      "SystemVerilog",
      "RTL",
      "Perforce",
      "CMake",
    ],
  },
  {
    id: "security",
    label: "Reliability & Security",
    accent: "amber",
    skills: [
      "OAuth 2.0",
      "OIDC",
      "PKCE",
      "JWT",
      "CSP",
      "Rate Limiting",
      "SLOs",
      "Secret Management",
      "ECDSA",
    ],
  },
  {
    id: "testing",
    label: "Testing & QA",
    accent: "emerald",
    skills: ["Playwright", "Jest", "Vitest", "Postman"],
  },
  {
    id: "observability",
    label: "Observability",
    accent: "violet",
    skills: ["Sentry", "Web Vitals", "PostHog", "Prometheus", "Grafana"],
  },
  {
    id: "tooling",
    label: "Tooling",
    accent: "cyan",
    skills: ["Linux", "Git", "VS Code", "Nginx"],
  },
];
