import type { QuirkyTag } from "@/lib/quirky-tags";

// Engineer Mode deep-tech block. Surfaced only when Engineer Mode is enabled.
// NOTE: drafted from each project's public `approach`/`impact` facts — no
// proprietary code and no literal source. Refine the wording as desired.
export type ProjectEngineering = {
  /** Whether a slug-keyed architecture whiteboard exists (see diagram-slugs.ts). */
  architecture?: boolean;
  algorithms?: { name: string; note: string }[];
  performance?: string[];
  writeup?: string[];
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  categories: string[]; // for filtering
  status: "professional" | "open-source" | "concept";
  cover?: string;
  tags: string[];
  /** Playful, subjective filter dimensions (see src/lib/quirky-tags.ts). */
  quirkyTags?: QuirkyTag[];
  summary: string;
  problem: string;
  challenge: string;
  approach: string[];
  impact: { label: string; value: string }[];
  stack: string[];
  engineering?: ProjectEngineering;
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
    quirkyTags: ["favorite", "hardest-bug", "research", "ai"],
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
    engineering: {
      architecture: true,
      algorithms: [
        {
          name: "Vector similarity retrieval (RAG)",
          note: "Approximate nearest-neighbour search over embedded design context, signals and runtime traces surfaces the most relevant artifacts for a given hotspot before any LLM is invoked.",
        },
        {
          name: "Agent prompt routing",
          note: "A routing layer dispatches hotspot triage, recommendation synthesis and explainability to separate tool-enabled agent prompts.",
        },
        {
          name: "Canonical event/signal modeling",
          note: "Heterogeneous simulation logs and artifacts are normalized into one event/signal schema so retrieval and reasoning operate on a single representation.",
        },
      ],
      performance: [
        "~40% reduction in debug root-cause-analysis time on large SoC simulations.",
        "Auto-analyze-on-failure removes manual artifact correlation from the critical path.",
        "Embeddings are precomputed and indexed so retrieval stays interactive at simulation scale.",
      ],
      writeup: [
        "XMAI treats failure analysis as a retrieval problem first and a reasoning problem second: artifacts are parsed into a canonical model, embedded and indexed before any LLM runs, which keeps agents grounded in real signals instead of free-associating.",
        "CLI, TUI, GUI and the MCP server share one core, so the diagnostic experience is consistent whether a human or another tool drives it.",
      ],
    },
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
    quirkyTags: ["favorite", "hardest-bug", "systems"],
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
    engineering: {
      algorithms: [
        {
          name: "Top-N hotspot profiling",
          note: "A reusable C++ performance-analysis library ranks the hottest call paths so optimization effort targets the highest-leverage code (presented at Cadence India Conference).",
        },
        {
          name: "RTL transformation passes",
          note: "The Xform Engine reshapes designs into more simulator-friendly forms before execution.",
        },
      ],
      performance: [
        "+18–19% simulation throughput on representative customer workloads.",
        "+13–14% RTL transform runtime improvement.",
        "Hotspots isolated with Valgrind, AddressSanitizer and runtime profilers; changes kept small and low-risk for production.",
        "Validated against Apple, Google, Samsung and NVIDIA designs.",
      ],
      writeup: [
        "Performance work on an industrial simulator is dominated by measurement discipline: a structured Top-N profiling library made hot paths visible and repeatable so every change could be attributed to a concrete win.",
        "Optimizations shipped as small, low-risk C++ changes validated on representative real-world designs rather than micro-benchmarks.",
      ],
    },
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
    quirkyTags: ["late-night", "most-fun", "open-source", "ai"],
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
    engineering: {
      algorithms: [
        {
          name: "Step-based execution model",
          note: "Every algorithm emits a uniform stream of inspectable steps, enabling deterministic replay and scrubbing across 60+ algorithms.",
        },
        {
          name: "Deterministic replay",
          note: "Given the same input and seed, a run reproduces exactly — essential for teaching and reliable video export.",
        },
        {
          name: "Multi-modal search",
          note: "Exact, fuzzy, phonetic and semantic search over the algorithm catalogue for fast discovery.",
        },
      ],
      performance: [
        "Canvas renderers with reduced-motion-aware animations keep visualizations GPU-friendly.",
        "In-browser FFmpeg-WASM export avoids any server round-trip for video.",
        "Held to WCAG 2.1 AA with Sentry, Web Vitals, Playwright and CI quality gates.",
      ],
      writeup: [
        "The unifying idea is a single step model: by forcing every algorithm to express itself as a sequence of inspectable steps, replay, export and AI explanations all become generic features instead of per-algorithm work.",
      ],
    },
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
    quirkyTags: ["most-fun", "ai"],
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
    engineering: {
      algorithms: [
        {
          name: "Pose estimation (BlazePose)",
          note: "Real-time landmark inference from the webcam feed via MediaPipe/BlazePose.",
        },
        {
          name: "Kalman filtering & temporal smoothing",
          note: "Noisy per-frame landmarks are stabilized so coaching feedback doesn't jitter or fire false corrections.",
        },
        {
          name: "Rep-quality scoring",
          note: "Range-of-motion, tempo and symmetry are combined into a single actionable form score.",
        },
      ],
      performance: [
        "60 FPS capture → infer → render loop.",
        ">95% reported accuracy with confidence gating and adaptive thresholds.",
        "FPS, latency and error telemetry instrumented for repeatable analysis.",
      ],
      writeup: [
        "The hard part of pose coaching isn't detection but trust: confidence gating, Kalman smoothing and 3D landmark checks turn noisy per-frame estimates into stable, actionable feedback.",
      ],
    },
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
    quirkyTags: ["late-night", "systems"],
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
    engineering: {
      algorithms: [
        {
          name: "Movement-history data modeling",
          note: "Location samples are modeled in MongoDB for flexible movement-trail queries.",
        },
        {
          name: "Trail replay",
          note: "Recorded sessions are replayed as visual paths for inspection and spot-checking.",
        },
      ],
      performance: [
        "Lightweight mobile surface focused on capture and replay rather than a heavyweight GIS stack.",
      ],
      writeup: [
        "The design keeps the data model simple — location events in a flexible NoSQL schema — so movement history can be captured, stored and replayed without GIS overhead.",
      ],
    },
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
    quirkyTags: ["most-fun", "open-source", "ai"],
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
    engineering: {
      algorithms: [
        {
          name: "Bounding-box rendering",
          note: "Clarifai face predictions are normalized and drawn as overlays on the source image.",
        },
      ],
      performance: [
        "A clean Express boundary keeps the React frontend responsive while isolating the ML API.",
      ],
      writeup: [
        "API integration details sit behind an Express boundary so the presentation layer stays simple and the third-party ML dependency can change without touching the UI.",
      ],
    },
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
    quirkyTags: ["late-night", "most-fun", "open-source"],
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
    engineering: {
      algorithms: [
        {
          name: "Bracket gameplay flows",
          note: "PvP gameplay is modeled as bracket-style progressions backed by on-chain state.",
        },
        {
          name: "Resilient contract-call patterns",
          note: "Rate-limited RPC handling and safer key flows wrap wallet interactions for a smoother player experience.",
        },
      ],
      performance: [
        "IPFS/Pinata for NFT metadata keeps on-chain payloads small.",
        "Rate-limited RPC and resilient contract calls smooth play on a non-EVM chain.",
      ],
      writeup: [
        "The engineering challenge was hiding chain complexity: game mechanics map onto Tezos primitives (SmartPy contracts, Taquito, IPFS) while the React frontend presents a familiar game UX.",
      ],
    },
    links: [{ label: "GitHub", href: "https://github.com/blackphoenix42/tpl-frontend" }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
