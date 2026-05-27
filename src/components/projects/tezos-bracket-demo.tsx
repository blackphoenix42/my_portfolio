"use client";

import { useEffect, useState } from "react";
import { Trophy, RotateCcw } from "lucide-react";

type Team = string;
const TEAMS: Team[] = ["Phoenix", "Tezos", "Nova", "Atlas", "Pulse", "Quanta", "Helix", "Orbit"];

function simulateRound(round: Team[]): Team[] {
  const next: Team[] = [];
  for (let i = 0; i < round.length; i += 2) {
    // pseudo-deterministic winner: team whose name hash is larger
    const a = round[i]!;
    const b = round[i + 1]!;
    const ha = [...a].reduce((s, c) => s + c.charCodeAt(0), 0);
    const hb = [...b].reduce((s, c) => s + c.charCodeAt(0), 0);
    next.push(ha >= hb ? a : b);
  }
  return next;
}

export function TezosBracketDemo() {
  const [rounds, setRounds] = useState<Team[][]>([TEAMS]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (rounds[rounds.length - 1]!.length === 1) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => {
      setRounds((rs) => [...rs, simulateRound(rs[rs.length - 1]!)]);
    }, 700);
    return () => clearTimeout(id);
  }, [running, rounds]);

  const champion = rounds[rounds.length - 1]!.length === 1 ? rounds[rounds.length - 1]![0] : null;
  const isFinal = rounds[rounds.length - 1]!.length === 1;

  return (
    <div className="card overflow-hidden">
      <div className="border-border bg-bg-sunken/60 text-fg-subtle flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
        <span>tpl · pvp bracket · deterministic sim</span>
        <span>
          round {rounds.length} / {Math.log2(TEAMS.length) + 1}
        </span>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr,220px]">
        <div className="flex items-stretch gap-3 overflow-x-auto">
          {rounds.map((round, ri) => (
            <div key={ri} className="flex min-w-[110px] flex-col justify-around gap-2">
              <p className="text-fg-subtle font-mono text-[10px]">
                {ri === rounds.length - 1 && round.length === 1 ? "champion" : `round ${ri + 1}`}
              </p>
              {round.map((t, ti) => (
                <div
                  key={`${ri}-${ti}-${t}`}
                  className="border-border bg-bg-elev text-fg rounded-md border px-2.5 py-1.5 font-mono text-xs"
                >
                  {t}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <button
            type="button"
            disabled={running || isFinal}
            onClick={() => setRunning(true)}
            className="btn-primary w-full text-xs disabled:opacity-50"
          >
            <Trophy className="h-3.5 w-3.5" /> Play bracket
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setRounds([TEAMS]);
            }}
            className="btn-secondary w-full text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          {champion && (
            <p className="border-accent-amber/40 bg-accent-amber/10 text-accent-amber rounded-md border p-2 text-center font-mono text-xs">
              🏆 {champion}
            </p>
          )}
          <p className="text-fg-subtle text-[11px]">
            Illustrative on-chain bracket — winners are derived deterministically (no real wallet).
          </p>
        </div>
      </div>
    </div>
  );
}
