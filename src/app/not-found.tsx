import type { Metadata } from "next";
import Link from "next/link";

// Root-level 404 — catches requests that don't fall inside the [locale]
// segment (e.g. `/_not-found`, malformed URLs that bypass the proxy, etc.).
// The locale-aware 404 at `src/app/[locale]/not-found.tsx` is the rich
// version used for every in-app navigation miss. This file exists solely to
// override Next's built-in `next-error-h1` chrome with something on-brand.
export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-bg text-fg min-h-dvh antialiased"
        style={{
          background: "#06080f",
          color: "#e6edf7",
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          margin: 0,
          padding: "1rem",
        }}
      >
        <main style={{ textAlign: "center", maxWidth: 480 }}>
          <p
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, monospace',
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#7d8ea8",
              margin: 0,
            }}
          >
            / 404
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: "0.75rem 0 0",
            }}
          >
            <span style={{ color: "#22d3ee", fontFamily: "ui-monospace, monospace" }}>404</span>{" "}
            Lost in the codebase?
          </h1>
          <p style={{ marginTop: "1rem", color: "#a9b8d1", fontSize: "1rem" }}>
            The page you&apos;re looking for doesn&apos;t exist, was renamed, or never did. Head
            back to the homepage and we&apos;ll get you sorted.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: "1.5rem",
              background: "#e6edf7",
              color: "#06080f",
              padding: "0.625rem 1rem",
              borderRadius: 6,
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </main>
      </body>
    </html>
  );
}
