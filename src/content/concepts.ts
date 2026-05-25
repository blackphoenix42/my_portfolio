export type Concept = {
  slug: string;
  name: string;
  pitch: string;
  description: string;
  stack: string[];
  accent: "cyan" | "violet" | "emerald" | "amber";
};

export const concepts: Concept[] = [
  {
    slug: "tracemind",
    name: "TraceMind",
    pitch:
      "AI-powered distributed tracing assistant for diagnosing production latency regressions.",
    description:
      "An assistant that ingests OpenTelemetry traces and metrics, builds a queryable trace knowledge graph, and uses LLM reasoning to triage latency regressions and propose hypotheses with evidence.",
    stack: ["Go", "OpenTelemetry", "Kafka", "ClickHouse", "LLM / RAG", "React"],
    accent: "cyan",
  },
  {
    slug: "silicongraph",
    name: "SiliconGraph",
    pitch:
      "Interactive graph explorer for debugging RTL dependency chains and optimization opportunities.",
    description:
      "A WebAssembly-powered explorer that lets engineers traverse RTL dependency graphs, highlight optimization candidates and run what-if transformations directly in the browser.",
    stack: ["C++", "WebAssembly", "TypeScript", "WebGL", "Graph Viz"],
    accent: "violet",
  },
  {
    slug: "infralens",
    name: "InfraLens",
    pitch:
      "Visual system-design playground for experimenting with queues, caches, sharding and failure scenarios.",
    description:
      "A live system-design sandbox where you compose services, queues, caches and failure modes, then watch traffic, backpressure and consistency play out in real time.",
    stack: ["Go", "Redis", "PostgreSQL", "WebSockets", "React", "Canvas"],
    accent: "emerald",
  },
];
