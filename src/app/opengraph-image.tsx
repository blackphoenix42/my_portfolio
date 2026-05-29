import { ImageResponse } from "next/og";

// Stays on the Edge runtime because Satori (the renderer behind
// `ImageResponse`) enforces a much stricter CSS subset on the Node runtime
// — every multi-child `<div>` would need `display: "flex"`. The Edge
// runtime is the documented home for `next/og` and Vercel still caches the
// rendered image at the CDN. The "Using edge runtime…" build message is
// informational: it just notes that this single route can't be statically
// generated, which is the correct trade-off for a dynamic image.
export const runtime = "edge";
export const alt = "Ayush Yadav — Performance Engineering × Agentic AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background:
          "radial-gradient(at 20% 10%, rgba(34,211,238,0.15), transparent 50%), radial-gradient(at 80% 90%, rgba(167,139,250,0.18), transparent 50%), #06080f",
        color: "#e6edf7",
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "monospace",
          fontSize: 18,
          color: "#8aa0bf",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#22d3ee",
          }}
        />
        R&amp;D Software Engineer II · Cadence Design Systems
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 500, color: "#9fb0c9" }}>Ayush Yadav</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
          Performance Engineering ×<br />
          <span
            style={{
              background: "linear-gradient(90deg,#22d3ee,#a78bfa,#34d399)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Agentic AI
          </span>
        </div>
        <div style={{ fontSize: 26, color: "#a9b8d1", maxWidth: 980 }}>
          C++ performance, EDA simulation, LLM/RAG tooling and interactive developer products.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 18,
          color: "#7d8ea8",
        }}
      >
        <span>github.com/blackphoenix42</span>
        <span>ayushyadav.dev</span>
      </div>
    </div>,
    { ...size },
  );
}
