// Derek-Sivers-style /now content — a snapshot of current focus.
//
// CONTENT INTEGRITY: keep this truthful. Items below are drafted from known,
// public facts (current role + project areas). Anything marked PLACEHOLDER is a
// reasonable default you should confirm or personalize. Update the `updated`
// date whenever you revise this page.
export const NOW = {
  // ISO date the page was last meaningfully updated.
  updated: "2026-10-01",
  location: "India",
  /**
   * Each section maps to an i18n group under the `now` namespace. The `items`
   * here are English fallbacks; translations live in messages/*.json.
   */
  sections: [
    {
      id: "focus",
      // What I'm spending most working hours on right now.
      items: [
        "R&D software engineering at Cadence — performance work on the Xcelium logic simulator.",
        "Building multi-agent AI systems — MAESTRO for end-to-end ticket resolution and ChipStack Xcelium agents for simulation performance and memory optimization.",
        "Sharpening C++ performance instincts: profiling, hot-path analysis and low-risk optimization.",
      ],
    },
    {
      id: "learning",
      // PLACEHOLDER: confirm / personalize these learning threads.
      items: [
        "Retrieval-augmented generation and agent orchestration patterns for developer tooling.",
        "Distributed systems design — consistency, partitioning and back-pressure trade-offs.",
        "Vector databases and embedding pipelines at production scale.",
      ],
    },
    {
      id: "building",
      items: [
        "This portfolio — system-design whiteboards and Ask Ayush with independent conversations and optional on-device AI.",
        "AlgoLens — an interactive DSA visualizer (open source).",
      ],
    },
    {
      id: "reading",
      // PLACEHOLDER: swap in what you're actually reading.
      items: [
        "Papers and write-ups on LLM tool use and agent reliability.",
        "Classic systems-performance literature (measure-first culture).",
      ],
    },
    {
      id: "sharpening",
      items: [
        "Competitive programming — keeping DSA fundamentals fast and sharp.",
        "Writing more: turning debugging war-stories into shareable notes.",
      ],
    },
  ],
} as const;

export type NowSectionId = (typeof NOW.sections)[number]["id"];
