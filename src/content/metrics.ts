export type Metric = {
  value: string;
  label: string;
  detail: string;
  accent: "cyan" | "violet" | "emerald" | "amber";
};

export const metrics: Metric[] = [
  {
    value: "18–19%",
    label: "Simulation throughput",
    detail: "Improvement on large customer workloads in Xcelium Logic Simulator.",
    accent: "cyan",
  },
  {
    value: "13–14%",
    label: "RTL transform runtime",
    detail: "Xform Engine gains on designs from Apple, Google, Samsung, NVIDIA.",
    accent: "violet",
  },
  {
    value: "~40%",
    label: "Debug RCA time",
    detail: "Reduction via Top-N profiling and structured diagnostics library.",
    accent: "emerald",
  },
  {
    value: "$10K",
    label: "Tezos award",
    detail: "Grant to expand a decentralized gaming application on Tezos.",
    accent: "amber",
  },
  {
    value: "60+",
    label: "Algorithms",
    detail: "Interactive, step-throughable visualizations in AlgoLens.",
    accent: "cyan",
  },
  {
    value: "Top 1%",
    label: "LeetCode global",
    detail: "Knight tier · Codeforces Master · CodeChef 6-Star (AIR 29).",
    accent: "violet",
  },
];
