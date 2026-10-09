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
    slug: "maestro",
    title: "MAESTRO — Multi-Agent Ticket Resolution",
    tagline:
      "A Cadence multi-agent system that helps engineers resolve simulation tickets end-to-end — with people in control at the high-risk steps.",
    category: "Agentic AI × Engineering Workflow",
    categories: ["AI", "Systems"],
    status: "professional",
    tags: ["Multi-Agent", "LLMs", "Orchestration", "Human-in-the-loop", "EDA"],
    quirkyTags: ["favorite", "research", "ai"],
    summary:
      "MAESTRO is a Cadence multi-agent platform for engineering-ticket resolution on Xcelium workflows. It coordinates specialist AI agents under human oversight so tickets move from triage toward a verified fix with clearer handoffs and less repeated context-gathering. Measured on an internal evaluation set, it cut ticket-resolution time by 45% and root-cause-analysis time by 55%. Built with team Mindsmiths for the Cadence AI Buildathon 2026 and selected for trade-secret protection — implementation details stay internal.",
    problem:
      "Simulator tickets often bounce across R&D, validation and documentation. Context lives in many places, handoffs re-gather the same evidence, and under pressure important steps get skipped while backlog items age.",
    challenge:
      "Coordinate agent assistance across a ticket’s lifecycle without giving up engineer control, without inventing unsupported conclusions, and without publishing proprietary workflow internals.",
    approach: [
      "Framed the product as orchestration plus human gates: agents propose and gather evidence; engineers approve risky transitions.",
      "Optimized for grounded answers — conclusions tied to retrieved engineering evidence rather than free-form speculation.",
      "Designed for everyday IDE use so the assistive flow meets engineers where they already work.",
      "Measured outcomes on an internal ticket sample and treated the system as proprietary Cadence IP after Buildathon recognition.",
    ],
    impact: [
      { label: "Ticket resolution", value: "45% faster" },
      { label: "Root-cause analysis", value: "55% faster" },
      { label: "IP status", value: "Trade secret" },
    ],
    stack: ["LLMs", "AI Agents", "Python", "Human-in-the-loop"],
    engineering: {
      architecture: false,
      algorithms: [
        {
          name: "Human-gated orchestration",
          note: "High-level pattern only: specialist agents collaborate under explicit engineer approval at risky steps. Proprietary phase/agent inventories are omitted.",
        },
        {
          name: "Evidence-first assistance",
          note: "Prefer retrieved engineering context over unsupported model guesses before advancing work.",
        },
      ],
      performance: [
        "45% faster ticket resolution and 55% faster root-cause analysis on the internal evaluation sample.",
        "Recognized as proprietary IP and selected for trade-secret protection — deeper design notes are not published here.",
      ],
      writeup: [
        "Public materials stay at outcome and product intent. MAESTRO’s detailed workflow, tooling integrations and internal architecture are Cadence confidential.",
        "The durable lesson for public writing: multi-agent systems earn trust with human control and evidence checks, not by dumping prompts into production.",
      ],
    },
    related: ["xcelium-ai-agents", "regression-triage"],
  },
  {
    slug: "xcelium-ai-agents",
    title: "ChipStack Xcelium AI Agents — Performance & Memory",
    tagline:
      "Multi-agent LLM workflows that profile Xcelium simulations, diagnose runtime and memory bottlenecks, and apply and verify the fixes.",
    category: "Agentic AI × EDA Performance",
    categories: ["AI", "Systems"],
    status: "professional",
    tags: [
      "Python",
      "OpenAI Agents SDK",
      "Multi-Agent",
      "LLM Evaluation",
      "Xcelium",
      "SystemVerilog",
    ],
    quirkyTags: ["favorite", "hardest-bug", "ai", "systems"],
    summary:
      "A multi-agent LLM system for Cadence ChipStack AI that profiles Xcelium SystemVerilog simulations, diagnoses runtime and memory bottlenecks, and recommends, applies and verifies fixes — compiler flags, RTL recodes, garbage-collection and memory tuning — from an interactive terminal UI. It spans a performance agent, a memory agent, a shared workflow framework and a regression framework: ~37K lines of Python and 650+ tests.",
    problem:
      "Simulation performance and memory work is expert-heavy: engineers read profiler output, correlate hotspots with RTL, choose flags or recodes, then re-run and compare. Early agent versions routed every mechanical step through LLM tool calls, which made them slow — and let reports quote numbers the parser never produced.",
    challenge:
      "Build agents that go from profiler data to a verified fix with no manual steps, while staying fast, grounded in parsed data, resumable across sessions and testable even though no two runs are identical.",
    approach: [
      "Built an 8-agent performance pipeline — intake, planning, a parallel compiler-flag audit / hardware clustering / pattern extraction, a 3-tier RTL recode, apply, then re-run and compare.",
      "Built the memory agent: heap snapshots and call-stack profiling, peak detection, shared-library attribution with C++ demangling, RTL file-and-line citations, and garbage-collection experiments with before/after comparison.",
      "Re-architected both agents deterministic-first: intake, simulation runs and profile parsing moved out of LLM tool loops into Python, keeping the model for reasoning and fallback.",
      "Architected a shared framework on the OpenAI Agents SDK: graph-based orchestration of agent nodes, schema-versioned state with checkpoint/resume, strict structured outputs, recovery from malformed JSON and per-node fallback routing.",
      "Eliminated hallucinated figures by rendering report numbers in Python and giving the reporting agents no tools, so every number traces back to parsed profile data.",
      "Designed a proof-of-concept regression framework that drives the real terminal UI over a pseudo-terminal: one YAML entry per testcase, and a checklist-based LLM judge that compares each report with a reviewed golden.",
    ],
    impact: [
      { label: "Simulation speedup", value: "31.3%" },
      { label: "End-to-end run", value: "1.93× faster" },
      { label: "Analysis phase", value: "3.9× faster" },
      { label: "Codebase", value: "~37K lines · 650+ tests" },
    ],
    stack: [
      "Python",
      "OpenAI Agents SDK",
      "Pydantic",
      "Jinja2",
      "pytest",
      "YAML",
      "Xcelium",
      "SystemVerilog",
    ],
    engineering: {
      architecture: true,
      algorithms: [
        {
          name: "3-tier RTL recode",
          note: "A deterministic pattern-database match runs first, then a spec-driven LLM recode from a pluggable optimization registry, then a general LLM fallback — each tier only runs when the one before cannot help.",
        },
        {
          name: "Hardware-type hotspot clustering",
          note: "Hotspots are grouped by hardware element type so one recode propagates to every peer in the cluster.",
        },
        {
          name: "Truncated-JSON recovery",
          note: "A LIFO bracket stack completes cut-off LLM output, 7+ observed wrapper formats are unwrapped, and a repair pass runs before any corrective retry.",
        },
        {
          name: "Checklist LLM-as-judge",
          note: "Instead of asking for a similarity score, the judge answers five narrow yes/no questions; the score is the fraction answered yes, so it is repeatable and names exactly what regressed.",
        },
      ],
      performance: [
        "31.3% simulation speedup on a validated benchmark run.",
        "Deterministic-first rework, measured on a benchmark design: end-to-end 148.3 s → 76.8 s (1.93×) and analysis 71.1 s → 18.0 s (3.9×, five model turns → one).",
        "First prompt in under 3 ms instead of ~47 s, by asking intake questions in Python before any model turn.",
        "Judge input compacted by 71% through path normalization and JSON truncation.",
      ],
      writeup: [
        "The memory analysis step took 71 s, but the parsing inside it took 84 ms — the rest was the model deciding to call tools and retyping data between them. Running the parsing in Python and giving the analyser zero tools made it 3.9× faster and hallucination-proof: an agent with no tools cannot fetch a number that isn't in the parsed data.",
        "Exact comparison fails every run of a non-deterministic agent, and a holistic similarity prompt still scores a regressed report around 90%. A five-question checklist judge scored a planted regression at 60% and named exactly the two corrupted aspects.",
      ],
    },
    related: ["maestro", "xcelium-optimization"],
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
    related: ["xcelium-ai-agents", "regression-triage"],
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
    related: ["postureiq", "maestro"],
  },
  {
    slug: "regression-triage",
    title: "Xcelium Regression Triage & Regold System",
    tagline:
      "A ~16K-line system that turns thousands of regression failures into safe, verified actions — regold, filter, waive or escalate.",
    category: "Developer Tooling × Automation",
    categories: ["Systems", "AI"],
    status: "professional",
    tags: ["Bash", "Python", "TF-IDF", "Clustering", "LLM Review", "Perforce"],
    quirkyTags: ["hardest-bug", "systems"],
    summary:
      "After a simulator change, regression campaigns return hundreds to thousands of failing test/mode combinations, and each one needs a decision. This ~16K-line system automates triage, regolds, waivers and verification using rule-based classification, TF-IDF clustering, historical learning and an optional LLM review. It has processed 2,120 failures across 79 runs — 73% of them in runs by other engineers.",
    problem:
      "Every failing test needs one of several actions: update the golden file, add a diff filter, ignore or waive it, repair the workspace, or escalate. The evidence changes from run to run (addresses, PIDs, timestamps, paths), one root cause produces dozens of near-identical failures, and a wrong regold silently blinds the suite to a real defect.",
    challenge:
      "Automate the decision safely: recognise the same fault across runs, never let a crash or tool error become the new golden, handle modes that compare against different golden files, verify every change per mode and learn from past campaigns — while staying resumable and undoable.",
    approach: [
      "Normalised regression and nightly failure lists into test, bank and mode sets, then re-ran each mode in parallel with per-file locks, dry-run, resume and undo.",
      "Canonicalised evidence into run-stable signatures by masking addresses, numbers, paths, PIDs and timestamps, so repeats of one fault share a fingerprint.",
      "Categorised every failure with rules, a weighted vote over recent runs and saved human corrections, then grouped similar failures with TF-IDF and agglomerative clustering.",
      "Gated disposition by class: only diff-class failures can ever reach a golden file — crashes, timeouts and tool errors always go to root-cause analysis.",
      "Verified every regold with a per-mode rerun, and emitted diff filters, IGNORE files or waivers where a regold was not the right answer.",
      "Added an optional LLM review (JEDAI) that checks each diff against the pending code change and flags tests that must not be regolded — advisory only, it can never relax the gate.",
    ],
    impact: [
      { label: "Failures processed", value: "2,120" },
      { label: "Regression runs", value: "79" },
      { label: "Run by other engineers", value: "73%" },
      { label: "Codebase", value: "~16K lines" },
    ],
    stack: ["Bash", "Python", "scikit-learn", "Perforce", "LLMs", "Xcelium"],
    engineering: {
      architecture: true,
      algorithms: [
        {
          name: "Run-stable failure signatures",
          note: "Error text, diff lines and backtraces are masked and hashed separately, so two copies of the same fault land on the same fingerprint even when addresses and timestamps differ.",
        },
        {
          name: "Precedence-ordered categorisation",
          note: "A live human correction beats saved corrections, which beat a weighted historical vote, which beats the rule-based class.",
        },
        {
          name: "Within-class TF-IDF clustering",
          note: "Failures are clustered only inside their class — strictest for crashes — so one root cause is reviewed once instead of dozens of times.",
        },
      ],
      performance: [
        "2,120 failures handled across 79 runs; 73% of them in runs by engineers other than the author.",
        "148 crash and tool-error failures kept away from golden files by the class gate.",
        "Parallel execution sized to CPU and memory, with per-testcase and per-golden-file locks.",
      ],
      writeup: [
        "Mistakes here are lopsided: accepting a real regression as golden blinds the suite to that defect for good, while refusing a valid change only costs time. So a deterministic control plane stays in charge, and the LLM is strictly an advisor.",
      ],
    },
    related: ["perforce-replay", "maestro"],
  },
  {
    slug: "perforce-replay",
    title: "Cross-Stream Perforce Replay",
    tagline:
      "Backport a multi-changelist fix to any release stream in one command — syncing only the paths those changelists touch.",
    category: "Developer Tooling × Release Engineering",
    categories: ["Systems"],
    status: "professional",
    tags: ["Perforce", "Bash", "Release Engineering", "Backports", "Automation"],
    quirkyTags: ["systems"],
    summary:
      "A fix on the development stream usually has to be reproduced on every supported release stream, often as several changelists — the source change, its regolds and a new test. This tooling derives each changelist's source stream, selectively syncs only the paths the changelists touch, merges them in order and reports exactly which files still need a manual resolve, automating multi-CL backports across Xcelium release branches.",
    problem:
      "Backports were done by hand, one changelist at a time, in hand-prepared workspaces. Partial client views meant missing paths surfaced one failure at a time, a full sync was too expensive, the origin stream of each changelist was often unknown, and auto-resolve reported one aggregate status that hid the files it declined to merge.",
    challenge:
      "Derive every operand from changelist metadata — the origin stream, which paths must exist in the workspace, and the merge order — so the engineer supplies only changelist numbers and a target branch.",
    approach: [
      "Detected the source stream of every changelist from its files, so one run can mix changelists from different streams, and printed the map before merging.",
      "Built the sync plan from only the files and directories those changelists touch, instead of syncing the whole tree.",
      "Repaired workspace faults automatically — extending the client view for out-of-view paths and recovering clobbered writable files — then retried.",
      "Merged changelists in ascending order, each from its own stream at its own revision, so any failure points at exactly one changelist.",
      "Ran a single auto-resolve at the end and listed the declined files for manual resolve; nothing is ever submitted automatically.",
      "Optionally created a disposable target workspace with only the project configuration synced, and reported the teardown command.",
    ],
    impact: [
      { label: "Input", value: "CL numbers + target" },
      { label: "Sync scope", value: "Touched paths only" },
      { label: "Mixed-origin CLs", value: "Supported" },
      { label: "Tooling", value: "~1.6K lines" },
    ],
    stack: ["Perforce", "Bash", "csh", "Linux"],
    engineering: {
      architecture: true,
      algorithms: [
        {
          name: "Changelist-derived working set",
          note: "The paths that must exist in the workspace are derived from the changelists themselves rather than declared up front in a client view.",
        },
        {
          name: "Ordered point-in-time integration",
          note: "Changelists merge in ascending order, each from its own origin stream at exactly its own revision, so unrelated work in between is never carried across.",
        },
        {
          name: "Resolve partitioning",
          note: "One auto-resolve after all merges, split into 'merged cleanly' and 'declined', so the files that need a human are always named.",
        },
      ],
      performance: [
        "A recorded run replayed two changelists — six source files, a new three-file testcase and 32 golden files — to a release stream in one call, and named the 32 files that needed a manual resolve.",
        "Only changelist-touched paths are synced, so a replay never pays for a full-tree sync.",
      ],
      writeup: [
        "Most backport tooling reads a path and throws away everything else. Here the path, the operation, the origin stream and the changelist number together define the working copy that has to exist before the merge can even start.",
      ],
    },
    related: ["regression-triage", "xcelium-optimization"],
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
