"use client";

export function XmaiArchitecture() {
  const cols = [
    { label: "Sim Logs &\nArtifacts", x: 40 },
    { label: "Parse &\nSignal Extract", x: 200 },
    { label: "Embed &\nRetrieval", x: 360 },
    { label: "Tool-Enabled\nAgent", x: 520 },
    { label: "Hotspots", x: 680 },
    { label: "RTL\nRecommendations", x: 840 },
  ];
  return (
    <svg
      viewBox="0 0 960 320"
      className="h-auto w-full"
      role="img"
      aria-label="XMAI conceptual architecture diagram"
    >
      <defs>
        <linearGradient id="lane" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--accent-cyan))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--accent-violet))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="40" y1="160" x2="920" y2="160" stroke="url(#lane)" strokeWidth="1.5" />
      {cols.map((c, i) => (
        <g key={c.label} transform={`translate(${c.x}, 160)`}>
          <rect
            x={-48}
            y={-30}
            width={96}
            height={60}
            rx={8}
            fill="hsl(var(--bg-elev))"
            stroke={i % 2 === 0 ? "hsl(var(--accent-cyan))" : "hsl(var(--accent-violet))"}
            strokeOpacity={0.5}
          />
          <text
            textAnchor="middle"
            dy="-2"
            style={{ fontSize: 11, fill: "hsl(var(--fg))", fontFamily: "var(--font-mono)" }}
          >
            {c.label.split("\n").map((line, idx) => (
              <tspan key={idx} x="0" dy={idx === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      {/* Below: tool-call branches */}
      <g>
        {["MCP Server", "CLI", "TUI", "GUI"].map((s, i) => (
          <g key={s} transform={`translate(${280 + i * 120}, 260)`}>
            <line x1="0" y1="-50" x2="0" y2="0" stroke="hsl(var(--border))" />
            <rect
              x={-40}
              y={0}
              width={80}
              height={26}
              rx={4}
              fill="hsl(var(--bg-sunken))"
              stroke="hsl(var(--border))"
            />
            <text
              textAnchor="middle"
              dy="16"
              style={{ fontSize: 10, fill: "hsl(var(--fg-muted))", fontFamily: "var(--font-mono)" }}
            >
              {s}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
