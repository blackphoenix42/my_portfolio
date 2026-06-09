import { ImageResponse } from "next/og";
import qrcode from "qrcode-generator";

/**
 * Render the matrix-rain QR egg into the OG card. The QR encodes a deep
 * link into the trophy room with a marker query (`?via=og`) so that scanning
 * it from a social preview unlocks the `og-qr-scan` easter egg.
 */
function buildQrCells(text: string): { cells: boolean[][]; size: number } {
  // High error-correction ("H", ~30% recovery) so the code still scans from a
  // compressed social thumbnail or at an angle.
  const qr = qrcode(0, "H");
  qr.addData(text);
  qr.make();
  const size = qr.getModuleCount();
  const cells: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(qr.isDark(r, c));
    }
    cells.push(row);
  }
  return { cells, size };
}

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
  const { cells, size: qrSize } = buildQrCells("https://binaryphoenix.vercel.app/secret?via=og");
  const cellPx = 4;
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
            display: "flex",
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
          }}
        >
          <div style={{ display: "flex" }}>Performance Engineering ×</div>
          <div
            style={{
              display: "flex",
              background: "linear-gradient(90deg,#22d3ee,#a78bfa,#34d399)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Agentic AI
          </div>
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
        <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              color: "#9fb0c9",
            }}
          >
            <span style={{ fontSize: 18 }}>ayushyadav.dev</span>
            <span style={{ fontSize: 14, color: "#22d3ee" }}>🜂 scan → /secret</span>
          </span>
          {/* High-contrast QR on a white card with a real quiet zone so phone
              cameras lock on instantly (cyan-on-dark looked nice but rarely
              scanned). */}
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
              padding: 12,
              borderRadius: 12,
              boxShadow: "0 0 0 1px rgba(159,176,201,0.25)",
            }}
            aria-hidden
          >
            {cells.map((row, r) => (
              <span key={r} style={{ display: "flex" }}>
                {row.map((on, c) => (
                  <span
                    key={c}
                    style={{
                      width: cellPx,
                      height: cellPx,
                      background: on ? "#0b1020" : "#ffffff",
                      display: "flex",
                    }}
                  />
                ))}
              </span>
            ))}
            <span style={{ height: 0, width: qrSize * cellPx, display: "flex" }} />
          </span>
        </span>
      </div>
    </div>,
    { ...size },
  );
}
