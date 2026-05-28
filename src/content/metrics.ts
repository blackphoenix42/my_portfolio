export type Metric = {
  id: "throughput" | "rtl" | "rca" | "tezos" | "algorithms" | "leetcode";
  value: string;
  /** English fallback label. Components prefer the i18n key `metrics.items.{id}.label`. */
  label: string;
  /** English fallback detail. Components prefer the i18n key `metrics.items.{id}.detail`. */
  detail: string;
  accent: "cyan" | "violet" | "emerald" | "amber";
};

export const metrics: Metric[] = [
  {
    id: "throughput",
    value: "18–19%",
    label: "Simulation throughput",
    detail: "Improvement on large customer workloads in Xcelium Logic Simulator.",
    accent: "cyan",
  },
  {
    id: "rtl",
    value: "13–14%",
    label: "RTL transform runtime",
    detail: "Xform Engine gains on designs from Apple, Google, Samsung, NVIDIA.",
    accent: "violet",
  },
  {
    id: "rca",
    value: "~40%",
    label: "Debug RCA time",
    detail: "Reduction via Top-N profiling and structured diagnostics library.",
    accent: "emerald",
  },
  {
    id: "tezos",
    value: "$10K",
    label: "Tezos award",
    detail: "Grant to expand a decentralized gaming application on Tezos.",
    accent: "amber",
  },
  {
    id: "algorithms",
    value: "60+",
    label: "Algorithms",
    detail: "Interactive, step-throughable visualizations in AlgoLens.",
    accent: "cyan",
  },
  {
    id: "leetcode",
    value: "Top 1%",
    label: "LeetCode global",
    detail: "Knight tier · Codeforces Master · CodeChef 6-Star (AIR 29).",
    accent: "violet",
  },
];
