import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "hsl(var(--bg))",
          elev: "hsl(var(--bg-elev))",
          sunken: "hsl(var(--bg-sunken))",
        },
        fg: {
          DEFAULT: "hsl(var(--fg))",
          muted: "hsl(var(--fg-muted))",
          subtle: "hsl(var(--fg-subtle))",
        },
        border: "hsl(var(--border))",
        line: "hsl(var(--line))",
        accent: {
          cyan: "hsl(var(--accent-cyan))",
          violet: "hsl(var(--accent-violet))",
          emerald: "hsl(var(--accent-emerald))",
          amber: "hsl(var(--accent-amber))",
        },
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-1": [
          "clamp(2.75rem, 6vw, 5.25rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em" },
        ],
        "display-2": [
          "clamp(2rem, 4vw, 3.5rem)",
          { lineHeight: "1.06", letterSpacing: "-0.025em" },
        ],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, hsl(var(--line)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--line)) 1px, transparent 1px)",
        noise:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow": "spin 16s linear infinite",
        dash: "dash 14s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      keyframes: {
        dash: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-200" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [animate],
};

export default config;
