export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  categories: string[]; // for filtering
  status: "professional" | "open-source" | "concept";
  cover?: string;
  tags: string[];
  summary: string;
  problem: string;
  challenge: string;
  approach: string[];
  impact: { label: string; value: string }[];
  stack: string[];
  links?: { label: string; href: string }[];
  related?: string[];
};

export const projects: Project[] = [
  {
    slug: "xmai",
    title: "XMAI — Agentic AI Profiler",
    tagline:
      "An AI-assisted profiler that transforms complex simulation artifacts into actionable optimization guidance.",
    category: "AI × EDA × Developer Tooling",
    categories: ["AI", "Systems"],
    status: "professional",
    tags: ["LLMs", "RAG", "MCP", "C++", "Embeddings", "EDA", "Agents"],
    summary:
      "XMAI is an AI-assisted EDA profiler designed to accelerate failure analysis and runtime optimization for large-scale simulation workloads. It combines retrieval-augmented generation, tool-enabled agents and graph-compatible RTL representations into a coherent diagnostic experience.",
    problem:
      "Engineers analyzing large SoC simulations spend significant time correlating logs, profiles and RTL artifacts to localize bottlenecks. The signal is buried across heterogeneous sources, and root-cause analysis is slow.",
    challenge:
      "Build a profiler that ingests simulation artifacts at scale, retrieves the most relevant context, reasons about hotspots using LLMs, and emits trustworthy RTL-level optimization recommendations — across CLI, TUI, GUI and MCP server interfaces.",
    approach: [
      "Parse simulation logs and structured artifacts into a canonical event/signal model.",
      "Generate embeddings for design context, signals and runtime traces; index in a vector store for retrieval.",
      "Orchestrate tool-enabled agents with prompt routing for hotspot triage, recommendation synthesis and explainability.",
      "Expose surfaces via CLI, TUI, GUI and a Model Context Protocol (MCP) server with an auto-analyze-on-failure workflow.",
      "Contribute composable building blocks to ChipStack AI — C++ APIs, JEDAI embedding-upload flows and agent primitives.",
    ],
    impact: [
      { label: "Debug RCA time", value: "~40% reduction" },
      { label: "Workflow surfaces", value: "CLI · TUI · GUI · MCP" },
      { label: "Domain", value: "Large SoC simulations" },
    ],
    stack: ["C++", "Python", "LLMs", "RAG", "MCP", "Vector DB", "Cadence JEDAI"],
    related: ["xcelium-optimization", "algolens"],
  },
  {
    slug: "xcelium-optimization",
    title: "Xcelium Logic Simulator — Performance Engineering",
    tagline:
      "Low-level optimization work delivering measurable throughput improvements on large real-world workloads.",
    category: "Systems Performance",
    categories: ["Systems"],
    status: "professional",
    tags: ["C++", "Profiling", "Runtime", "Simulation", "SystemVerilog"],
    summary:
      "A multi-quarter performance engineering effort on Cadence's Xcelium logic simulator, focused on profiling-driven optimization, RTL transformations and structured diagnostics for production customer workloads.",
    problem:
      "Customer designs of increasing scale stress simulator throughput. Even small inefficiencies in hot paths compound across millions of simulation events, costing engineering hours and infrastructure.",
    challenge:
      "Identify high-leverage bottlenecks across an industrial simulation engine, reason rigorously about runtime behavior, and ship low-risk C++ changes that move the needle on production workloads.",
    approach: [
      "Built a reusable C++ performance-analysis library enabling Top-N profiling and structured diagnostics, presented at Cadence India Conference.",
      "Used Valgrind, AddressSanitizer and runtime profilers to isolate hotspots in critical simulation paths.",
      "Implemented RTL transformations in the Xform Engine that reshape designs into more simulator-friendly forms.",
      "Validated improvements against designs from Apple, Google, Samsung and NVIDIA on representative workloads.",
    ],
    impact: [
      { label: "Simulation throughput", value: "+18–19%" },
      { label: "RTL transform runtime", value: "+13–14%" },
      { label: "Debug RCA time", value: "~40% faster" },
      { label: "Customer-impacting", value: "Multi-million-$ Samsung deal" },
    ],
    stack: ["C++", "SystemVerilog", "Valgrind", "AddressSanitizer", "Perforce"],
    related: ["xmai"],
  },
  {
    slug: "algolens",
    title: "AlgoLens — Interactive DSA Platform",
    tagline:
      "An interactive environment where algorithms become inspectable, replayable and understandable.",
    category: "Education × Visual Computing × GenAI",
    categories: ["Frontend", "AI"],
    status: "open-source",
    tags: ["TypeScript", "React", "Canvas", "Accessibility", "GenAI", "FFmpeg-WASM"],
    summary:
      "AlgoLens is an interactive algorithm visualizer supporting 60+ algorithms with real-time step-through, deterministic replay, FFmpeg-WASM export, GenAI explanations and rich search.",
    problem:
      "Algorithm learning resources tend to be static. Understanding behavior under different inputs, replaying state and exporting visuals for teaching are awkward at best.",
    challenge:
      "Build a fluid, accessible, GPU-friendly visualization engine that handles 60+ algorithms with a unified step model, deterministic replay, video export and AI-assisted understanding — held to product-grade quality bars.",
    approach: [
      "Designed a step-based execution model with deterministic replay across all algorithms.",
      "Built Canvas-based renderers with smooth, reduced-motion-aware animations.",
      "Integrated FFmpeg-WASM for in-browser video export of execution traces.",
      "Layered GenAI for natural-language explanations and complexity analysis.",
      "Implemented exact, fuzzy, phonetic and semantic search for algorithm discovery.",
      "Hardened with WCAG 2.1 AA, Sentry, Web Vitals, Playwright, Storybook, Percy and CI quality gates.",
    ],
    impact: [
      { label: "Algorithms", value: "60+ visualized" },
      { label: "Quality", value: "WCAG 2.1 AA" },
      { label: "Engineering", value: "Sentry · Playwright · Percy · CI" },
    ],
    stack: ["TypeScript", "React", "Canvas", "FFmpeg-WASM", "Playwright", "Storybook", "Sentry"],
    links: [{ label: "GitHub", href: "https://github.com/blackphoenix42/algolens" }],
    related: ["xmai", "postureiq"],
  },
  {
    slug: "postureiq",
    title: "PostureIQ — Real-Time ML Posture Analysis",
    tagline:
      "A 60 FPS computer-vision coaching system that scores exercise form with deterministic feedback loops.",
    category: "Computer Vision × ML Product",
    categories: ["AI", "Frontend"],
    status: "open-source",
    tags: ["Python", "OpenCV", "MediaPipe", "BlazePose", "NumPy", "Kalman"],
    summary:
      "PostureIQ is an ML-powered posture and form-coaching system built around real-time pose estimation, temporal smoothing, confidence gating and rep-quality scoring for exercise feedback.",
    problem:
      "Exercise-form feedback is usually delayed, subjective or dependent on a trainer being present. A useful assistant needs to infer pose continuously and provide clear feedback without jitter or false positives.",
    challenge:
      "Maintain real-time capture, inference and rendering while making noisy pose landmarks stable enough for actionable coaching and automated quality scoring.",
    approach: [
      "Built a deterministic capture-to-infer-to-render loop with OpenCV and MediaPipe/BlazePose.",
      "Added temporal smoothing, Kalman filtering, confidence gating, adaptive thresholds and 3D landmark checks to reduce noisy corrections.",
      "Implemented rep-quality scoring around ROM, tempo and symmetry with audio/visual feedback cues.",
      "Instrumented FPS, latency and error telemetry with dashboards for repeatable performance analysis.",
      "Added pytest coverage, golden traces and a CLI for reproducible validation runs.",
    ],
    impact: [
      { label: "Frame rate", value: "60 FPS" },
      { label: "Accuracy", value: ">95%" },
      { label: "Quality", value: "pytest · golden traces · CLI" },
    ],
    stack: ["Python", "OpenCV", "MediaPipe", "BlazePose", "NumPy", "pytest"],
    related: ["algolens"],
  },
  {
    slug: "track-person-app",
    title: "Track Person App — Movement Tracking & Visualization",
    tagline:
      "A React Native movement-tracking app for capturing and visualizing person-location trails.",
    category: "Mobile × Data Visualization",
    categories: ["Frontend"],
    status: "open-source",
    tags: ["React Native", "MongoDB", "NoSQL", "Tracking", "Visualization"],
    summary:
      "A mobile-first tracking and visualization project that stores movement events in MongoDB and renders location history for inspection.",
    problem:
      "Movement data is hard to reason about from raw coordinates alone; users need a visual trail and a clean data model for location events.",
    challenge:
      "Design a lightweight mobile interface and persistence model that can capture, store and replay movement history without turning the app into a heavyweight GIS tool.",
    approach: [
      "Built the mobile surface in React Native around a simple capture and replay workflow.",
      "Modeled location samples in MongoDB for flexible movement-history queries.",
      "Added visualization views for scanning movement paths and spot-checking recorded sessions.",
    ],
    impact: [
      { label: "Platform", value: "React Native" },
      { label: "Storage", value: "MongoDB" },
    ],
    stack: ["React Native", "MongoDB", "JavaScript", "NoSQL"],
  },
  {
    slug: "smart-brain",
    title: "Smart Brain — Face Detection App",
    tagline:
      "A full-stack face-detection app integrating Clarifai inference with an Express/React product surface.",
    category: "Full-Stack × Computer Vision",
    categories: ["AI", "Frontend"],
    status: "open-source",
    tags: ["React", "Express", "Clarifai API", "JavaScript", "Node.js"],
    summary:
      "Smart Brain is a full-stack application that sends image URLs to Clarifai, receives face-detection predictions and renders bounding boxes in a React interface.",
    problem:
      "Computer-vision APIs are powerful but abstract; a useful learning project needs to make the request/response loop visible and interactive.",
    challenge:
      "Integrate a third-party ML API with a clean backend boundary while keeping the frontend responsive and easy to understand.",
    approach: [
      "Built an Express API layer for Clarifai requests and response normalization.",
      "Created React UI flows for image submission, prediction rendering and result feedback.",
      "Modeled the app so API integration details remain isolated from the presentation layer.",
    ],
    impact: [
      { label: "ML API", value: "Clarifai" },
      { label: "Stack", value: "React · Express" },
    ],
    stack: ["React", "Express", "Node.js", "Clarifai API", "JavaScript"],
  },
  {
    slug: "tezos-premier-league",
    title: "Tezos Premier League — Decentralized Gaming",
    tagline:
      "A decentralized gaming initiative recognized with a $10,000 award for further development.",
    category: "Web3 × Product Engineering",
    categories: ["Blockchain", "Frontend"],
    status: "open-source",
    tags: ["Tezos", "Smart Contracts", "React", "Web3", "NFT", "IPFS"],
    summary:
      "A blockchain-based PvP gaming project and NFT marketplace on the Tezos network. The work was selected for a $10,000 award to support continued development.",
    problem:
      "Designing engaging on-chain gaming experiences while keeping the user experience approachable on a non-EVM ecosystem.",
    challenge:
      "Translate game mechanics into Tezos primitives and deliver a usable frontend that hides chain complexity from players.",
    approach: [
      "Designed product flows around bracket-style gameplay.",
      "Built a React frontend integrating with Tezos infrastructure, Taquito and SmartPy contracts.",
      "Used Pinata/IPFS for NFT metadata and added safer key-handling flows around wallet interactions.",
      "Added rate-limited RPC handling and resilient contract-call patterns for a smoother player experience.",
      "Iterated on UX based on player feedback from early access.",
    ],
    impact: [
      { label: "Recognition", value: "$10,000 award" },
      { label: "Ecosystem", value: "Tezos blockchain" },
    ],
    stack: ["React", "Tezos", "SmartPy", "Taquito", "Pinata/IPFS", "ECDSA"],
    links: [{ label: "GitHub", href: "https://github.com/blackphoenix42/tpl-frontend" }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
