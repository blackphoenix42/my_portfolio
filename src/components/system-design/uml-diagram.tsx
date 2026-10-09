"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

type NodeKind = "actor" | "component" | "store" | "queue" | "gateway";

type DiagramNode = {
  id: string;
  component: number;
  kind: NodeKind;
  x: number;
  y: number;
  stereotype?: string;
};

type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** Horizontal elbow bias in px to separate parallel edges. */
  bend?: number;
};

type Zone = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Diagram = {
  width: number;
  height: number;
  zones: Zone[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

const NW = 148;
const NH = 56;
const GAP_X = 36;
const GAP_Y = 28;

function col(zoneX: number, index: number, pad = 28) {
  return zoneX + pad + index * (NW + GAP_X);
}
function midCol(zoneX: number, pad = 28) {
  return zoneX + pad + (NW + GAP_X) / 2;
}
function row(zoneY: number, index: number, pad = 44) {
  return zoneY + pad + index * (NH + GAP_Y);
}

const DIAGRAMS: Record<string, Diagram> = {
  "url-shortener": {
    width: 1180,
    height: 620,
    zones: [
      { id: "edge", label: "Edge", x: 16, y: 28, w: 220, h: 560 },
      { id: "control", label: "Control plane", x: 252, y: 28, w: 380, h: 260 },
      { id: "data", label: "Data plane", x: 252, y: 308, w: 520, h: 280 },
      { id: "async", label: "Async", x: 800, y: 28, w: 360, h: 560 },
    ],
    nodes: [
      { id: "clients", component: 0, kind: "actor", x: col(16, 0, 36), y: row(28, 0) },
      { id: "cdn", component: 1, kind: "gateway", x: col(16, 0, 36), y: row(28, 2) },
      { id: "gw", component: 2, kind: "gateway", x: col(16, 0, 36), y: row(28, 4) },
      { id: "write", component: 3, kind: "component", x: col(252, 0), y: row(28, 0) },
      { id: "alloc", component: 5, kind: "component", x: col(252, 1), y: row(28, 0) },
      { id: "redir", component: 4, kind: "component", x: midCol(252), y: row(28, 2) },
      { id: "cache", component: 6, kind: "store", x: col(252, 0), y: row(308, 1) },
      { id: "db", component: 7, kind: "store", x: col(252, 1), y: row(308, 1) },
      { id: "bus", component: 8, kind: "queue", x: col(800, 0, 90), y: row(28, 2) },
    ],
    edges: [
      { from: "clients", to: "cdn", label: "GET /{code}", bend: -12 },
      { from: "clients", to: "gw", label: "POST /links", dashed: true, bend: 18 },
      { from: "cdn", to: "redir", label: "origin miss", bend: -8 },
      { from: "gw", to: "write", label: "create", bend: 10 },
      { from: "write", to: "alloc", label: "next id", bend: -6 },
      { from: "write", to: "db", label: "INSERT", bend: 14 },
      { from: "write", to: "cache", label: "SET", dashed: true, bend: -16 },
      { from: "redir", to: "cache", label: "GET", bend: 8 },
      { from: "cache", to: "db", label: "miss → fill", dashed: true, bend: 0 },
      { from: "redir", to: "bus", label: "emit", bend: -20 },
    ],
  },
  "rate-limiter": {
    width: 1180,
    height: 580,
    zones: [
      { id: "svc", label: "Request path", x: 16, y: 28, w: 240, h: 520 },
      { id: "limit", label: "Limiter plane", x: 276, y: 28, w: 520, h: 520 },
      { id: "ops", label: "Control / obs", x: 816, y: 28, w: 340, h: 520 },
    ],
    nodes: [
      { id: "caller", component: 0, kind: "component", x: col(16, 0, 40), y: row(28, 0) },
      { id: "sdk", component: 1, kind: "component", x: col(16, 0, 40), y: row(28, 2) },
      { id: "shed", component: 5, kind: "component", x: col(16, 0, 40), y: row(28, 4) },
      { id: "policy", component: 2, kind: "component", x: col(276, 0, 40), y: row(28, 0) },
      { id: "lua", component: 4, kind: "component", x: col(276, 1, 40), y: row(28, 2) },
      { id: "redis", component: 3, kind: "store", x: col(276, 0, 40), y: row(28, 4) },
      { id: "metrics", component: 6, kind: "component", x: col(816, 0, 80), y: row(28, 1) },
      { id: "admin", component: 7, kind: "component", x: col(816, 0, 80), y: row(28, 3) },
    ],
    edges: [
      { from: "caller", to: "sdk", label: "before work" },
      { from: "sdk", to: "policy", label: "resolve tier", bend: -10 },
      { from: "sdk", to: "lua", label: "check(cost)", bend: 12 },
      { from: "lua", to: "redis", label: "EVAL", bend: -8 },
      { from: "redis", to: "lua", label: "tokens", dashed: true, bend: 16 },
      { from: "lua", to: "sdk", label: "allow|429", bend: -18 },
      { from: "sdk", to: "shed", label: "Redis down?", dashed: true },
      { from: "sdk", to: "metrics", label: "allow/deny", bend: 10 },
      { from: "admin", to: "policy", label: "PUT policy", dashed: true, bend: -14 },
      { from: "admin", to: "redis", label: "purge", dashed: true, bend: 14 },
    ],
  },
  "job-scheduler": {
    width: 1220,
    height: 640,
    zones: [
      { id: "in", label: "Ingress", x: 16, y: 28, w: 240, h: 580 },
      { id: "core", label: "Scheduling core", x: 276, y: 28, w: 560, h: 580 },
      { id: "exec", label: "Execution", x: 856, y: 28, w: 340, h: 580 },
    ],
    nodes: [
      { id: "api", component: 0, kind: "component", x: col(16, 0, 40), y: row(28, 0) },
      { id: "cron", component: 7, kind: "component", x: col(16, 0, 40), y: row(28, 2) },
      { id: "ops", component: 8, kind: "component", x: col(16, 0, 40), y: row(28, 4) },
      { id: "sched", component: 1, kind: "component", x: col(276, 0, 36), y: row(28, 0) },
      { id: "ready", component: 2, kind: "queue", x: col(276, 1, 36), y: row(28, 0) },
      { id: "store", component: 4, kind: "store", x: col(276, 0, 36), y: row(28, 2) },
      { id: "payload", component: 5, kind: "store", x: col(276, 1, 36), y: row(28, 2) },
      { id: "dlq", component: 6, kind: "queue", x: midCol(276, 36), y: row(28, 4) },
      { id: "workers", component: 3, kind: "component", x: col(856, 0, 80), y: row(28, 2) },
    ],
    edges: [
      { from: "api", to: "store", label: "INSERT", bend: -10 },
      { from: "api", to: "payload", label: "blob", dashed: true, bend: 12 },
      { from: "api", to: "ready", label: "if due", bend: -16 },
      { from: "cron", to: "sched", label: "next fire", bend: 8 },
      { from: "sched", to: "ready", label: "promote" },
      { from: "sched", to: "store", label: "due scan", bend: 14 },
      { from: "ready", to: "workers", label: "claim+lease", bend: -8 },
      { from: "workers", to: "store", label: "heartbeat/ack", bend: 16 },
      { from: "workers", to: "payload", label: "fetch", bend: -12 },
      { from: "workers", to: "dlq", label: "exhausted", dashed: true, bend: 10 },
      { from: "ops", to: "store", label: "cancel/requeue", dashed: true, bend: -14 },
    ],
  },
  "log-analytics": {
    width: 1220,
    height: 640,
    zones: [
      { id: "collect", label: "Collect", x: 16, y: 28, w: 240, h: 580 },
      { id: "stream", label: "Stream", x: 276, y: 28, w: 360, h: 580 },
      { id: "serve", label: "Serve & tier", x: 656, y: 28, w: 540, h: 580 },
    ],
    nodes: [
      { id: "agents", component: 0, kind: "actor", x: col(16, 0, 40), y: row(28, 1) },
      { id: "gw", component: 1, kind: "gateway", x: col(16, 0, 40), y: row(28, 3) },
      { id: "kafka", component: 2, kind: "queue", x: col(276, 0, 90), y: row(28, 0) },
      { id: "proc", component: 3, kind: "component", x: col(276, 0, 90), y: row(28, 2) },
      { id: "quar", component: 8, kind: "queue", x: col(276, 0, 90), y: row(28, 4) },
      { id: "hot", component: 4, kind: "store", x: col(656, 0, 40), y: row(28, 0) },
      { id: "cold", component: 5, kind: "store", x: col(656, 1, 40), y: row(28, 0) },
      { id: "query", component: 6, kind: "component", x: midCol(656, 40), y: row(28, 2) },
      { id: "tier", component: 7, kind: "component", x: midCol(656, 40), y: row(28, 4) },
    ],
    edges: [
      { from: "agents", to: "gw", label: "batch+retry" },
      { from: "gw", to: "kafka", label: "produce", bend: -10 },
      { from: "kafka", to: "proc", label: "consume" },
      { from: "proc", to: "hot", label: "bulk index", bend: -12 },
      { from: "proc", to: "cold", label: "archive", bend: 12 },
      { from: "proc", to: "quar", label: "poison", dashed: true },
      { from: "query", to: "hot", label: "search", bend: -10 },
      { from: "query", to: "cold", label: "rehydrate", dashed: true, bend: 10 },
      { from: "tier", to: "hot", label: "compact", bend: -14 },
      { from: "tier", to: "cold", label: "age-out", bend: 14 },
    ],
  },
  "sim-regression-dashboard": {
    width: 1220,
    height: 640,
    zones: [
      { id: "farm", label: "Farm / CI", x: 16, y: 28, w: 220, h: 580 },
      { id: "ingest", label: "Ingest & classify", x: 256, y: 28, w: 480, h: 580 },
      { id: "ux", label: "Products", x: 756, y: 28, w: 440, h: 580 },
    ],
    nodes: [
      { id: "farm", component: 0, kind: "actor", x: col(16, 0, 36), y: row(28, 2) },
      { id: "ingest", component: 1, kind: "gateway", x: col(256, 0, 36), y: row(28, 0) },
      { id: "norm", component: 2, kind: "component", x: col(256, 1, 36), y: row(28, 0) },
      { id: "results", component: 3, kind: "store", x: col(256, 0, 36), y: row(28, 2) },
      { id: "sig", component: 4, kind: "component", x: col(256, 1, 36), y: row(28, 2) },
      { id: "flake", component: 5, kind: "component", x: midCol(256, 36), y: row(28, 4) },
      { id: "art", component: 6, kind: "store", x: col(756, 0, 120), y: row(28, 0) },
      { id: "diff", component: 7, kind: "component", x: col(756, 0, 120), y: row(28, 2) },
      { id: "ui", component: 8, kind: "component", x: col(756, 0, 120), y: row(28, 4) },
    ],
    edges: [
      { from: "farm", to: "ingest", label: "runs+results", bend: -10 },
      { from: "ingest", to: "norm", label: "stabilize" },
      { from: "norm", to: "results", label: "upsert", bend: 12 },
      { from: "norm", to: "sig", label: "fingerprint", bend: -8 },
      { from: "sig", to: "flake", label: "classify", bend: 10 },
      { from: "farm", to: "art", label: "artifacts", dashed: true, bend: -16 },
      { from: "results", to: "diff", label: "baseline", bend: 8 },
      { from: "flake", to: "diff", label: "labels", dashed: true, bend: -12 },
      { from: "diff", to: "ui", label: "diff sets" },
      { from: "art", to: "ui", label: "deep links", dashed: true, bend: 14 },
    ],
  },
  "waveform-compression": {
    width: 1220,
    height: 600,
    zones: [
      { id: "cap", label: "Capture", x: 16, y: 28, w: 260, h: 540 },
      { id: "enc", label: "Encode & seal", x: 296, y: 28, w: 460, h: 540 },
      { id: "read", label: "Store & replay", x: 776, y: 28, w: 420, h: 540 },
    ],
    nodes: [
      { id: "probe", component: 0, kind: "actor", x: col(16, 0, 50), y: row(28, 1) },
      { id: "buf", component: 1, kind: "component", x: col(16, 0, 50), y: row(28, 3) },
      { id: "delta", component: 2, kind: "component", x: col(296, 0, 40), y: row(28, 0) },
      { id: "dict", component: 3, kind: "component", x: col(296, 1, 40), y: row(28, 0) },
      { id: "writer", component: 4, kind: "component", x: midCol(296, 40), y: row(28, 2) },
      { id: "idx", component: 5, kind: "store", x: midCol(296, 40), y: row(28, 4) },
      { id: "files", component: 6, kind: "store", x: col(776, 0, 110), y: row(28, 0) },
      { id: "reader", component: 7, kind: "component", x: col(776, 0, 110), y: row(28, 2) },
      { id: "verify", component: 8, kind: "component", x: col(776, 0, 110), y: row(28, 4) },
    ],
    edges: [
      { from: "probe", to: "buf", label: "transitions" },
      { from: "buf", to: "delta", label: "batch", bend: -10 },
      { from: "delta", to: "dict", label: "codes" },
      { from: "dict", to: "writer", label: "pack", bend: 10 },
      { from: "writer", to: "files", label: "seal+fsync", bend: -12 },
      { from: "writer", to: "idx", label: "index" },
      { from: "reader", to: "idx", label: "seek", bend: 12 },
      { from: "reader", to: "files", label: "slice", bend: -8 },
      { from: "verify", to: "files", label: "CRC", dashed: true, bend: 14 },
    ],
  },
};

function nodeCenter(n: DiagramNode) {
  return { x: n.x + NW / 2, y: n.y + NH / 2 };
}

/** Orthogonal path with optional bend offset so parallel edges don't stack. */
function elbowPath(from: DiagramNode, to: DiagramNode, bend = 0) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const sameCol = Math.abs(dx) < NW * 0.6;
  const sameRow = Math.abs(dy) < NH * 0.6;

  let d: string;
  let mx: number;
  let my: number;

  if (sameCol || sameRow) {
    const cx = (a.x + b.x) / 2 + bend;
    const cy = (a.y + b.y) / 2 - bend * 0.35;
    d = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
    mx = cx;
    my = cy - 8;
  } else {
    const midX = a.x + dx * 0.55 + bend;
    d = `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
    mx = midX;
    my = (a.y + b.y) / 2 - 6;
  }
  return { d, mx, my };
}

function NodeShape({ node, title }: { node: DiagramNode; title: string }) {
  const { x, y, kind, stereotype } = node;
  const label = title.length > 20 ? `${title.slice(0, 19)}…` : title;

  if (kind === "actor") {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={NW}
          height={NH}
          rx="8"
          fill="currentColor"
          fillOpacity="0.04"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeDasharray="3 3"
        />
        <circle
          cx={x + NW / 2}
          cy={y + 16}
          r="8"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
        />
        <line x1={x + NW / 2} y1={y + 24} x2={x + NW / 2} y2={y + 34} stroke="currentColor" />
        <line
          x1={x + NW / 2 - 10}
          y1={y + 28}
          x2={x + NW / 2 + 10}
          y2={y + 28}
          stroke="currentColor"
        />
        <line x1={x + NW / 2} y1={y + 34} x2={x + NW / 2 - 8} y2={y + 44} stroke="currentColor" />
        <line x1={x + NW / 2} y1={y + 34} x2={x + NW / 2 + 8} y2={y + 44} stroke="currentColor" />
        <text
          x={x + NW / 2}
          y={y + NH - 6}
          textAnchor="middle"
          className="fill-current text-[10px] font-medium"
        >
          {label}
        </text>
      </g>
    );
  }

  if (kind === "store") {
    return (
      <g>
        <ellipse
          cx={x + NW / 2}
          cy={y + 10}
          rx={NW / 2 - 2}
          ry="9"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
        />
        <path
          d={`M ${x + 2} ${y + 10} V ${y + NH - 10} A ${NW / 2 - 2} 9 0 0 0 ${x + NW - 2} ${y + NH - 10} V ${y + 10}`}
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
        />
        <ellipse
          cx={x + NW / 2}
          cy={y + NH - 10}
          rx={NW / 2 - 2}
          ry="9"
          fill="none"
          stroke="currentColor"
        />
        <text
          x={x + NW / 2}
          y={y + NH / 2 + 4}
          textAnchor="middle"
          className="fill-current text-[11px] font-medium"
        >
          {label}
        </text>
      </g>
    );
  }

  if (kind === "queue") {
    const points = `${x + 18},${y} ${x + NW},${y} ${x + NW - 18},${y + NH} ${x},${y + NH}`;
    return (
      <g>
        <polygon points={points} fill="currentColor" fillOpacity="0.1" stroke="currentColor" />
        <text
          x={x + NW / 2}
          y={y + 16}
          textAnchor="middle"
          className="fill-current text-[9px] opacity-70"
        >
          {stereotype ?? "«queue»"}
        </text>
        <text
          x={x + NW / 2}
          y={y + NH / 2 + 10}
          textAnchor="middle"
          className="fill-current text-[11px] font-medium"
        >
          {label}
        </text>
      </g>
    );
  }

  const isGw = kind === "gateway";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NW}
        height={NH}
        rx={isGw ? 4 : 8}
        fill="currentColor"
        fillOpacity={isGw ? 0.14 : 0.08}
        stroke="currentColor"
        strokeWidth={isGw ? 1.75 : 1.25}
      />
      {isGw && (
        <rect
          x={x + 6}
          y={y + 8}
          width="6"
          height={NH - 16}
          rx="1"
          fill="currentColor"
          fillOpacity="0.35"
        />
      )}
      <text
        x={x + NW / 2}
        y={y + 16}
        textAnchor="middle"
        className="fill-current text-[9px] opacity-70"
      >
        {stereotype ?? (isGw ? "«gateway»" : "«service»")}
      </text>
      <text
        x={x + NW / 2}
        y={y + NH / 2 + 12}
        textAnchor="middle"
        className="fill-current text-[11px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}

export function UmlDiagram({ slug }: { slug: string }) {
  const t = useTranslations("systemDesign");
  const reduce = useReducedMotion();
  const diagram = DIAGRAMS[slug];

  if (!diagram) return null;

  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));

  return (
    <div className="border-border bg-bg-sunken/50 text-fg-muted overflow-x-auto rounded-xl border p-3 sm:p-4">
      <p className="text-fg-subtle mb-3 font-mono text-[10px] tracking-wider uppercase">
        {t("umlCaption")}
      </p>
      <svg
        viewBox={`0 0 ${diagram.width} ${diagram.height}`}
        className="text-accent-cyan/90 h-auto w-full min-w-[900px]"
        role="img"
        aria-label={t("uml")}
      >
        <defs>
          <marker
            id={`uml-arrow-${slug}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
          <marker
            id={`uml-arrow-dashed-${slug}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity="0.7" />
          </marker>
        </defs>

        {diagram.zones.map((z) => (
          <g key={z.id}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx="12"
              fill="currentColor"
              fillOpacity="0.03"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
            />
            <text
              x={z.x + 14}
              y={z.y + 20}
              className="fill-current text-[11px] font-semibold tracking-wide uppercase opacity-55"
            >
              {z.label}
            </text>
          </g>
        ))}

        {diagram.edges.map((e, i) => {
          const from = byId.get(e.from);
          const to = byId.get(e.to);
          if (!from || !to) return null;
          const p = elbowPath(from, to, e.bend ?? (i % 2 === 0 ? -8 : 8));
          const labelW = Math.max(28, (e.label?.length ?? 0) * 5.2 + 10);
          return (
            <g key={`${e.from}-${e.to}-${i}`}>
              <motion.path
                d={p.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeOpacity={e.dashed ? 0.4 : 0.7}
                strokeDasharray={e.dashed ? "5 4" : undefined}
                markerEnd={`url(#uml-arrow${e.dashed ? "-dashed" : ""}-${slug})`}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.025, ease: "easeOut" }}
              />
              {e.label && (
                <g>
                  <rect
                    x={p.mx - labelW / 2}
                    y={p.my - 9}
                    width={labelW}
                    height={14}
                    rx="3"
                    fill="currentColor"
                    fillOpacity="0.08"
                    stroke="currentColor"
                    strokeOpacity="0.15"
                  />
                  <text
                    x={p.mx}
                    y={p.my + 2}
                    textAnchor="middle"
                    className="fill-current text-[9px] opacity-90"
                  >
                    {e.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {diagram.nodes.map((node, index) => {
          const title = t(`systems.${slug}.components.${node.component}.name` as never);
          return (
            <motion.g
              key={node.id}
              className="text-fg"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.035, duration: 0.25 }}
            >
              <NodeShape node={node} title={title} />
            </motion.g>
          );
        })}
      </svg>
      <ul className="text-fg-subtle mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px]">
        <li>■ «service»</li>
        <li>▮ «gateway»</li>
        <li>⛁ store</li>
        <li>⬡ «queue»</li>
        <li>☺ actor</li>
        <li>— sync · - - async/degraded</li>
      </ul>
    </div>
  );
}
