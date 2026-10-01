export type Metric = {
  id: "throughput" | "rtl" | "rca" | "ticketResolution" | "agentSpeedup" | "regression";
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
    label: "RTL parsing speedup",
    detail:
      "Cumulative Xform Engine parsing gains across Apple, Google, Samsung and NVIDIA designs.",
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
    id: "ticketResolution",
    value: "45%",
    label: "Faster ticket resolution",
    detail: "MAESTRO, measured across 22 Jira tickets; RCA time reduced by 55%.",
    accent: "amber",
  },
  {
    id: "agentSpeedup",
    value: "31.3%",
    label: "AI-assisted simulation speedup",
    detail: "Xcelium optimization agents on a validated benchmark; results are workload-specific.",
    accent: "cyan",
  },
  {
    id: "regression",
    value: "2,120",
    label: "Regression failures processed",
    detail: "Across 79 runs; 73% of failures were processed in runs by other engineers.",
    accent: "violet",
  },
];
