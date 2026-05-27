export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  certificateUrl?: string;
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
    company: "Game Geeks",
    role: "Blockchain Engineer (Tezos Premier League)",
    location: "Remote",
    start: "Aug 2021",
    end: "Dec 2021",
    summary:
      "Designed and shipped Tezos Premier League — a PvP blockchain gaming product and NFT marketplace recognized with a $10,000 grant from Tezos India for continued development.",
    certificateUrl: "/assets/experience-certs/Tezos%20Fellowship%20Certificate.pdf",
    highlights: [
      {
        title: "Tezos Premier League — Product Lead",
        detail:
          "Owned the end-to-end product design for a bracket-style PvP gaming dApp on Tezos, translating game mechanics into on-chain primitives and approachable UX.",
        tags: ["Tezos", "Product", "Game Design"],
      },
      {
        title: "$10,000 Tezos India Grant",
        detail:
          "Won a $10,000 grant from Tezos India to extend the platform after a demo evaluated for product innovation, technical quality and ecosystem fit.",
        tags: ["Grant", "Recognition", "Web3"],
      },
      {
        title: "NFT Marketplace & Smart Contracts",
        detail:
          "Designed an NFT marketplace with Pinata/IPFS storage, SmartPy contracts, Taquito integrations and rate-limited RPC handling for resilient on-chain calls.",
        tags: ["SmartPy", "Taquito", "IPFS", "NFT"],
      },
    ],
  },
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
      {
        title: "Scalable Frontend Architecture",
        detail:
          "Established reusable component, theming and routing patterns that let multiple feature teams ship in parallel without stepping on each other.",
        tags: ["Frontend", "Architecture", "DX"],
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
    certificateUrl: "/assets/experience-certs/SWOC.pdf",
    highlights: [
      {
        title: "UniAuth Identity Provider",
        detail:
          "Implemented UniAuth with OAuth 2.0, OIDC, PKCE, refresh-token rotation, scoped JWTs and a written threat model across Python, TypeScript, Django, Flask and Go services.",
        tags: ["OAuth 2.0", "OIDC", "JWT", "Django", "Go"],
      },
      {
        title: "Polyglot Service Plumbing",
        detail:
          "Wired the identity flow across TypeScript front-end, Django/Flask Python services and a Go authorization service with consistent error and audit semantics.",
        tags: ["TypeScript", "Python", "Go"],
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
    certificateUrl: "/assets/experience-certs/DWOC.pdf",
    highlights: [
      {
        title: "Dockerized Log Analytics",
        detail:
          "Dockerized a full-stack log analyzer (Django REST + Celery + Redis + Elasticsearch), added GitHub Actions CI/CD and structured cardinality-safe logs.",
        tags: ["Docker", "Elasticsearch", "Celery", "Redis", "GitHub Actions"],
      },
      {
        title: "CI/CD Pipeline",
        detail:
          "Built reproducible GitHub Actions workflows covering lint, tests, image build and deploy with cached layers and trace context for faster investigations.",
        tags: ["CI/CD", "DevEx"],
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
    certificateUrl: "/assets/experience-certs/Tezos%20Fellowship%20Certificate.pdf",
    highlights: [
      {
        title: "PvP Gaming dApp & NFT Marketplace",
        detail:
          "Shipped a Tezos-based PvP gaming dApp with safer key handling, resilient contract calls, Pinata/IPFS storage, Taquito integrations and SmartPy contracts.",
        tags: ["Tezos", "SmartPy", "Taquito", "IPFS", "ECDSA"],
      },
      {
        title: "PLAY Token Marketplace",
        detail:
          "Designed matchmaking and a PLAY-token-driven marketplace flow so players could buy, sell and use in-game assets across matches.",
        tags: ["NFT", "Marketplace", "Web3"],
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
    certificateUrl: "/assets/experience-certs/PSOC.pdf",
    highlights: [
      {
        title: "WebRTC Conferencing Platform",
        detail:
          "Led a 5-member team to deliver a video conferencing app, tuning ICE signaling and congestion behavior to cut join time and stalls by roughly 30%.",
        tags: ["WebRTC", "React", "Firebase", "Socket.io", "PeerJS"],
      },
      {
        title: "Team Leadership",
        detail:
          "Coordinated a 5-person team across design, frontend, signaling and infra — running standups, code reviews and a release checklist for predictable shipping.",
        tags: ["Leadership", "Process"],
      },
    ],
  },
  {
    company: "Trotbee Private Limited",
    role: "Back End Developer Intern (Fenmo App)",
    location: "Delhi, India",
    start: "Jun 2021",
    end: "Jul 2021",
    summary:
      "Backend internship on the Fenmo App as part of a 2-member team — building MVC OTP services and S3-backed video APIs, with a 15% latency reduction across hot paths.",
    certificateUrl: "/assets/experience-certs/Fenmo%20App%2C%20Trotbee%20Private%20Limited%20.png",
    highlights: [
      {
        title: "Fenmo MVC OTP & Video APIs",
        detail:
          "As one of a 2-member team, built MVC-structured OTP onboarding and S3-backed video upload/playback APIs with idempotent endpoints, retries with backoff and observability hooks.",
        tags: ["Java", "Micronaut", "AWS S3", "PostgreSQL", "OpenAPI"],
      },
      {
        title: "15% Latency Reduction",
        detail:
          "Reduced end-to-end API latency by ~15% through query tuning, payload trimming and pre-warmed connections, validated with load tests.",
        tags: ["Performance", "AWS EC2"],
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
      "Full-stack internship building an encrypted real-time chat app with React/Redux, Sequelize/Postgres, Socket.io and Bcrypt-secured auth.",
    highlights: [
      {
        title: "Encrypted Real-Time Chat",
        detail:
          "Built a full-stack chat app with React/Redux frontend, Sequelize + PostgreSQL persistence, Socket.io real-time delivery and Bcrypt-hashed credentials.",
        tags: ["React", "Redux", "Sequelize", "PostgreSQL", "Socket.io", "Bcrypt"],
      },
      {
        title: "Context-Based Messaging",
        detail:
          "Modeled context-based message channels with latency/error SLOs, dashboards and runbooks to reduce MTTR on production incidents.",
        tags: ["TLS", "SLOs", "Observability"],
      },
    ],
  },
  {
    company: "Dynamix Club",
    role: "Head of Programming",
    location: "Ramjas School, Delhi",
    start: "Apr 2016",
    end: "Mar 2017",
    summary:
      "Led the programming wing of Dynamix Club — running competitive-programming sessions, mentoring juniors and representing the school at inter-school coding events.",
    highlights: [
      {
        title: "Programming Wing Leadership",
        detail:
          "Designed weekly DSA / problem-solving sessions for club members, curated a progression from basics to contest-grade topics and ran internal mock contests.",
        tags: ["DSA", "Mentorship", "CP"],
      },
      {
        title: "Inter-school Competitions",
        detail:
          "Represented the school at multiple inter-school programming and tech events including Force Fest, Digilogous, BVEST and Virtual Fiesta — winning podium finishes.",
        tags: ["Competitions", "Public Speaking"],
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
