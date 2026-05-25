"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const EXAMPLES = [
  {
    q: "Why is sim throughput dropping after rev 14a82c?",
    a: "Found a 2.1× slowdown in `tlm_uvm_phase_run`. Retrieval cites diff #2189 (line 412) introducing a per-cycle vector copy. Suggested fix: hoist the `std::vector<bit>` allocation outside the loop. Confidence 0.91.",
  },
  {
    q: "Compile time for top.sv regressed — what changed?",
    a: "Elaboration jumped 22%. Trace points at new SystemVerilog package import added in commit 9c1f. RAG snippet shows pkg recompiles 3 deps. Recommendation: split into header-only iface and impl unit.",
  },
  {
    q: "Find similar performance bugs from history.",
    a: "Top match: bug #4412 (2024-08) — same `tlm_uvm_phase_run` hotspot, fixed by inlining `do_record`. Cosine sim 0.87.",
  },
];

export function XmaiPipelineDemo() {
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const ask = (i: number) => {
    setIdx(i);
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(EXAMPLES[i]!.a);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg-sunken/60 px-4 py-2 font-mono text-xs text-fg-subtle">
        <span>xmai · agent shell · simulated</span>
        <span>rag · gpt-4 · profiler tool</span>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr,260px]">
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-bg-sunken/40 p-3 font-mono text-xs text-fg">
            <span className="text-accent-cyan">$</span> {EXAMPLES[idx]!.q}
          </div>
          <div className="min-h-[120px] rounded-md border border-border bg-bg-elev p-3 text-sm leading-relaxed text-fg-muted">
            {loading ? (
              <span className="inline-flex items-center gap-2 font-mono text-xs text-accent-violet">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                retrieving traces · embedding · calling agent…
              </span>
            ) : (
              (response ?? EXAMPLES[idx]!.a)
            )}
          </div>
          <p className="text-[11px] text-fg-subtle">
            Illustrative — responses are canned but pipeline (retrieve → embed → agent → answer)
            mirrors XMAI's real flow.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
            Try a prompt
          </p>
          {EXAMPLES.map((e, i) => (
            <button
              key={i}
              type="button"
              onClick={() => ask(i)}
              className={`flex w-full items-start gap-2 rounded-md border p-2 text-left text-xs transition-colors ${
                i === idx
                  ? "border-accent-cyan/40 bg-accent-cyan/5 text-fg"
                  : "border-border text-fg-muted hover:border-accent-cyan/30 hover:text-fg"
              }`}
            >
              <Send className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="line-clamp-2">{e.q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
