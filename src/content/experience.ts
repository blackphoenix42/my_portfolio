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
      "Performance R&D on Xcelium Logic Simulator, combining low-level C++ optimization, EDA diagnostics, distributed-workload analysis and AI-assisted developer tooling.",
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
          "Engineered low-level C++ and simulator-architecture optimizations that improved overall throughput by 18–19% on large customer workloads and helped secure a strategic Samsung performance win.",
        tags: ["C++", "Profiling", "Runtime"],
      },
      {
        title: "Xform Engine RTL Transformations",
        detail:
          "Implemented RTL transformations in the Xform Engine, delivering 13–14% cumulative parsing/runtime gains across designs from Apple, Google, Samsung and NVIDIA.",
        tags: ["RTL", "Compilers", "SystemVerilog"],
      },
      {
        title: "Performance-Analysis Library",
        detail:
          "Built reusable C++ diagnostics APIs and a structured-log pipeline across Compile, Elab and Sim; added Top-N profiling, graph-based attribution and Fenwick counters, reducing RCA time by ~40%.",
        tags: ["C++", "Library Design", "Diagnostics"],
      },
      {
        title: "Corporate VP / MD Recognition",
        detail:
          "Presented performance findings at Cadence India Conference and received multiple awards, Corporate VP recognition and All-Hands spotlighting for Samsung-deal performance work.",
        tags: ["Impact", "Recognition"],
      },
    ],
  },
];

export const internships: Experience[] = [
  {
    company: "Omikron Technologies",
    role: "Software Engineer Intern",
    location: "Delhi, India",
    start: "Apr 2022",
    end: "Jun 2022",
    summary:
      "Product engineering internship focused on modular single-page applications, release quality and accessibility-minded frontend delivery.",
    highlights: [
      {
        title: "Modular SPA Delivery",
        detail:
          "Built modular React/TypeScript SPAs with Redux Toolkit, RTK Query, per-PR CI, test-pyramid coverage and accessibility gates to reduce change-failure risk.",
        tags: ["React", "TypeScript", "Redux Toolkit", "Jest", "Web Vitals"],
      },
    ],
  },
  {
    company: "Script Winter of Code",
    role: "Developer",
    location: "Delhi, India",
    start: "Dec 2021",
    end: "Feb 2022",
    summary:
      "Open-source contribution program focused on authentication, identity-provider workflows and secure API design.",
    highlights: [
      {
        title: "UniAuth Identity Provider",
        detail:
          "Implemented UniAuth with OAuth 2.0, OIDC, PKCE, refresh-token rotation, scoped JWTs and a written threat model across Python, TypeScript, Django, Flask and Go services.",
        tags: ["OAuth 2.0", "OIDC", "JWT", "Django", "Go"],
      },
    ],
  },
  {
    company: "Delta Winter of Code",
    role: "Developer",
    location: "Delhi, India",
    start: "Nov 2021",
    end: "Jan 2022",
    summary:
      "Open-source contribution program focused on log analytics, containerization and CI/CD automation.",
    highlights: [
      {
        title: "Dockerized Log Analytics",
        detail:
          "Dockerized a full-stack log analyzer, added GitHub Actions CI/CD, structured cardinality-safe logs and trace context for faster investigation workflows.",
        tags: ["Docker", "Elasticsearch", "Celery", "Redis", "GitHub Actions"],
      },
    ],
  },
  {
    company: "Tezos India",
    role: "Fellow",
    location: "Delhi, India",
    start: "Aug 2021",
    end: "Oct 2021",
    summary:
      "Blockchain fellowship where a decentralized gaming product and NFT marketplace earned a $10,000 grant for continued development.",
    highlights: [
      {
        title: "PvP Gaming dApp & NFT Marketplace",
        detail:
          "Shipped a Tezos-based PvP gaming dApp with safer key handling, resilient contract calls, Pinata/IPFS storage, Taquito integrations and SmartPy contracts.",
        tags: ["Tezos", "SmartPy", "Taquito", "IPFS", "ECDSA"],
      },
    ],
  },
  {
    company: "Programming Club Summer of Code",
    role: "Developer",
    location: "Delhi, India",
    start: "Jul 2021",
    end: "Aug 2021",
    summary:
      "Led a small engineering team building real-time collaboration software with WebRTC and browser-first product architecture.",
    highlights: [
      {
        title: "WebRTC Conferencing Platform",
        detail:
          "Led a 5-member team to deliver a video conferencing app, tuning ICE signaling and congestion behavior to cut join time and stalls by roughly 30%.",
        tags: ["WebRTC", "React", "Firebase", "Socket.io", "PeerJS"],
      },
    ],
  },
  {
    company: "Trotbee Private Limited",
    role: "Back End Developer Intern",
    location: "Delhi, India",
    start: "Jun 2021",
    end: "Jul 2021",
    summary:
      "Backend internship focused on Java APIs, OTP services, reliability controls and AWS-hosted service delivery.",
    highlights: [
      {
        title: "OTP Microservice & REST APIs",
        detail:
          "Built REST APIs and an OTP microservice with idempotent endpoints, retries with backoff, observability hooks and OpenAPI documentation, improving response paths by ~15%.",
        tags: ["Java", "Micronaut", "AWS EC2", "PostgreSQL", "OpenAPI"],
      },
    ],
  },
  {
    company: "Miri Infotech",
    role: "Software Development Engineer Intern",
    location: "Noida, India",
    start: "Feb 2021",
    end: "Apr 2021",
    summary:
      "Full-stack internship building encrypted real-time communication workflows with React, PostgreSQL and Socket.io.",
    highlights: [
      {
        title: "Encrypted Real-Time Chat",
        detail:
          "Built a full-stack chat app with context-based messaging, encryption, latency/error SLOs, dashboards and runbooks to reduce MTTR.",
        tags: ["React", "Redux", "PostgreSQL", "Socket.io", "TLS"],
      },
    ],
  },
];

export const education = {
  school: "Netaji Subhas University of Technology (East Campus)",
  degree: "B.Tech, Computer Science and Engineering",
  start: "Aug 2018",
  end: "May 2022",
  cgpa: "8.32 / 10",
};

export const educationHistory = [
  education,
  {
    school: "Ramjas School, R. K. Puram",
    degree: "Computer Science Stream",
    start: "Mar 2016",
    end: "Mar 2017",
    cgpa: "93.2%",
  },
] as const;
