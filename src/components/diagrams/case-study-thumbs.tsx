"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const A = "hsl(var(--accent-cyan))";
const V = "hsl(var(--accent-violet))";
const E = "hsl(var(--accent-emerald))";
const M = "hsl(var(--accent-amber))";
const BG = "hsl(var(--bg-elev))";
const BG_S = "hsl(var(--bg-sunken))";
const BD = "hsl(var(--border))";
const FG_S = "hsl(var(--fg-subtle))";
const FG_M = "hsl(var(--fg-muted))";
const FG = "hsl(var(--fg))";

/* -------------------------------------------------------------------------- */
/*  XMAI — hero-style flow with named stages                                   */
/* -------------------------------------------------------------------------- */
export function XmaiPipeline() {
  const reduce = useReducedMotion();
  const nodes = [
    { x: 60, label: "artifacts", c: A },
    { x: 180, label: "retrieve", c: A },
    { x: 300, label: "agent", c: V },
    { x: 420, label: "rtl", c: E },
  ];
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <defs>
        <linearGradient id="xm-edge" x1="0" x2="1">
          <stop offset="0%" stopColor={A} stopOpacity="0" />
          <stop offset="50%" stopColor={V} stopOpacity="0.9" />
          <stop offset="100%" stopColor={E} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="60" y1="100" x2="420" y2="100" stroke="url(#xm-edge)" strokeWidth="1.5" />
      {!reduce && (
        <motion.circle
          initial={false}
          r="4"
          fill={V}
          cy={100}
          animate={{ cx: [60, 420], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}
      {nodes.map((n, i) => (
        <g key={n.label} transform={`translate(${n.x},100)`}>
          <motion.circle
            initial={false}
            r="22"
            fill={BG}
            stroke={n.c}
            strokeWidth="1.5"
            animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
            style={{ transformOrigin: "center" }}
          />
          <circle r="5" fill={n.c} />
          <text
            y="44"
            textAnchor="middle"
            style={{ fontSize: 11, fill: FG_M, fontFamily: "var(--font-mono)" }}
          >
            {n.label}
          </text>
        </g>
      ))}
      <text x="60" y="32" style={{ fontSize: 11, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        xmai · profiler → retrieval → agent → rtl
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  XCELIUM — developer @ screen, throughput surges                            */
/* -------------------------------------------------------------------------- */
export function FlamegraphMini() {
  const reduce = useReducedMotion();
  const pts = [
    [110, 130],
    [150, 128],
    [190, 130],
    [225, 122],
    [255, 90],
    [285, 70],
    [320, 55],
    [355, 48],
    [395, 42],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <g transform="translate(20,60)">
        <rect x="0" y="0" width="58" height="40" rx="3" fill={BG} stroke={BD} />
        <rect x="3" y="3" width="52" height="32" rx="1" fill={BG_S} />
        {[8, 14, 20, 26].map((y, i) => (
          <line
            key={i}
            x1="6"
            y1={y}
            x2={6 + (12 + i * 6)}
            y2={y}
            stroke={i === 2 ? E : A}
            strokeWidth="1.5"
          />
        ))}
        <rect x="20" y="40" width="18" height="3" fill={BD} />
        <rect x="14" y="43" width="30" height="2" rx="1" fill={BD} />
        <circle cx="29" cy="60" r="6" fill={M} />
        <path d="M 18 80 Q 29 70 40 80 L 40 90 L 18 90 Z" fill={V} />
        <motion.g
          initial={false}
          animate={reduce ? undefined : { opacity: [0, 1, 1, 0], y: [0, -6, -6, -10] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.7, 1] }}
        >
          <circle cx="58" cy="-8" r="10" fill={M} opacity="0.9" />
          <text
            x="58"
            y="-5"
            textAnchor="middle"
            style={{ fontSize: 10, fontWeight: 700, fill: BG_S, fontFamily: "var(--font-mono)" }}
          >
            !
          </text>
        </motion.g>
      </g>
      <g>
        <line x1="100" y1="160" x2="430" y2="160" stroke={BD} />
        <line x1="100" y1="160" x2="100" y2="30" stroke={BD} />
        <text x="100" y="180" style={{ fontSize: 9, fill: FG_S, fontFamily: "var(--font-mono)" }}>
          time
        </text>
        <text
          x="92"
          y="35"
          textAnchor="end"
          style={{ fontSize: 9, fill: FG_S, fontFamily: "var(--font-mono)" }}
        >
          tput
        </text>
        <motion.path
          d={d}
          stroke={E}
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: [0, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }}
        />
        <motion.circle
          initial={false}
          cx={395}
          cy={42}
          r="6"
          fill={M}
          animate={reduce ? undefined : { scale: [1, 1.6, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ transformOrigin: "395px 42px" }}
        />
        <text
          x={395}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 10, fontWeight: 600, fill: M, fontFamily: "var(--font-mono)" }}
        >
          +19%
        </text>
      </g>
      <text x="20" y="190" style={{ fontSize: 10, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        xcelium · ship optimization · throughput surge
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  ALGOLENS — bubble-sort live array                                          */
/* -------------------------------------------------------------------------- */
export function AlgoMini() {
  const reduce = useReducedMotion();
  const initial = [35, 80, 50, 110, 70, 30, 95, 55, 75, 45];
  const [bars, setBars] = useState(initial);
  const [swap, setSwap] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setSwap((prev) => {
        const next = (prev + 1) % (bars.length - 1);
        setBars((arr) => {
          // single bubble-sort step at `prev`
          const a = arr.slice();
          if (a[prev]! > a[prev + 1]!) {
            const t = a[prev]!;
            a[prev] = a[prev + 1]!;
            a[prev + 1] = t;
          }
          // when pass completes, reshuffle to keep motion going
          if (next === 0) {
            return initial.slice().sort(() => Math.random() - 0.5);
          }
          return a;
        });
        return next;
      });
    }, 900);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <defs>
        <marker id="algo-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={V} />
        </marker>
      </defs>
      <text x="40" y="22" style={{ fontSize: 11, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        algolens · bubble sort · comparing [{swap}, {swap + 1}]
      </text>
      <line x1="40" y1="170" x2="440" y2="170" stroke={BD} />
      {bars.map((h, i) => {
        const isActive = i === swap || i === swap + 1;
        return (
          <g key={i}>
            <motion.rect
              initial={false}
              x={50 + i * 38}
              width={28}
              rx={2}
              animate={{
                y: 170 - h,
                height: h,
                fill: isActive ? M : A,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              opacity={isActive ? 1 : 0.85}
            />
            <motion.text
              initial={false}
              x={50 + i * 38 + 14}
              y={186}
              textAnchor="middle"
              animate={{ opacity: isActive ? 1 : 0.6 }}
              style={{ fontSize: 9, fill: FG_S, fontFamily: "var(--font-mono)" }}
            >
              {h}
            </motion.text>
          </g>
        );
      })}
      <motion.path
        initial={false}
        animate={{
          d: `M ${50 + swap * 38 + 14} 36 Q ${50 + swap * 38 + 33} 14 ${50 + (swap + 1) * 38 + 14} 36`,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        stroke={V}
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#algo-arrow)"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  POSTUREIQ — exercise figure + pose overlay + coaching                      */
/* -------------------------------------------------------------------------- */
export function PostureMini() {
  const reduce = useReducedMotion();
  const [reps, setReps] = useState(12);
  const [form, setForm] = useState(92);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setReps((r) => r + 1);
      setForm(() => 88 + Math.floor(Math.random() * 9)); // 88-96
    }, 2400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <text x="40" y="22" style={{ fontSize: 11, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        postureiq · live pose tracking · 60 fps
      </text>
      <line x1="40" y1="180" x2="440" y2="180" stroke={BD} strokeDasharray="3 4" />
      {/* squat figure: feet stay planted, knees track outward, hips drop, torso leans */}
      <g transform="translate(205,0)">
        {/* head */}
        <motion.circle
          initial={false}
          cx="60"
          r="11"
          fill={BG}
          stroke={A}
          strokeWidth="1.8"
          animate={reduce ? undefined : { cy: [56, 92, 56] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          initial={false}
          cx="60"
          r="2"
          fill={A}
          animate={reduce ? undefined : { cy: [56, 92, 56] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* spine (head → hips); slight forward lean at bottom */}
        <motion.line
          initial={false}
          stroke={V}
          strokeWidth="3"
          animate={
            reduce
              ? undefined
              : {
                  x1: [60, 56, 60],
                  y1: [67, 103, 67],
                  x2: [60, 60, 60],
                  y2: [120, 146, 120],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* arms: hang at sides → swing forward for balance at bottom */}
        <motion.line
          initial={false}
          stroke={E}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  x1: [60, 56, 60],
                  y1: [80, 116, 80],
                  x2: [42, 30, 42],
                  y2: [108, 110, 108],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          initial={false}
          stroke={E}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  x1: [60, 56, 60],
                  y1: [80, 116, 80],
                  x2: [78, 90, 78],
                  y2: [108, 110, 108],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* pelvis line */}
        <motion.line
          initial={false}
          stroke={A}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  y1: [120, 146, 120],
                  y2: [120, 146, 120],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          x1="46"
          x2="74"
        />
        {/* upper leg L (hip → knee) — knee moves outward & forward at bottom */}
        <motion.line
          initial={false}
          stroke={M}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  x1: [46, 46, 46],
                  y1: [120, 146, 120],
                  x2: [40, 26, 40],
                  y2: [150, 158, 150],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* upper leg R */}
        <motion.line
          initial={false}
          stroke={M}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  x1: [74, 74, 74],
                  y1: [120, 146, 120],
                  x2: [80, 94, 80],
                  y2: [150, 158, 150],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* lower leg L (knee → ankle) — ankle planted */}
        <motion.line
          initial={false}
          stroke={M}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  x1: [40, 26, 40],
                  y1: [150, 158, 150],
                  x2: [38, 38, 38],
                  y2: [178, 178, 178],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* lower leg R */}
        <motion.line
          initial={false}
          stroke={M}
          strokeWidth="2.5"
          animate={
            reduce
              ? undefined
              : {
                  x1: [80, 94, 80],
                  y1: [150, 158, 150],
                  x2: [82, 82, 82],
                  y2: [178, 178, 178],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* feet: planted */}
        <line x1="30" y1="178" x2="46" y2="178" stroke={A} strokeWidth="3" />
        <line x1="74" y1="178" x2="90" y2="178" stroke={A} strokeWidth="3" />
        {/* pose-estimation landmarks — track the moving knees + hips */}
        <motion.circle
          initial={false}
          r="2.6"
          fill={E}
          animate={reduce ? undefined : { cx: [40, 26, 40], cy: [150, 158, 150] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          initial={false}
          r="2.6"
          fill={E}
          animate={reduce ? undefined : { cx: [80, 94, 80], cy: [150, 158, 150] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          initial={false}
          cx="46"
          r="2.6"
          fill={E}
          animate={reduce ? undefined : { cy: [120, 146, 120] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          initial={false}
          cx="74"
          r="2.6"
          fill={E}
          animate={reduce ? undefined : { cy: [120, 146, 120] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="38" cy="178" r="2.6" fill={E} />
        <circle cx="82" cy="178" r="2.6" fill={E} />
      </g>
      <g>
        <rect x="40" y="50" width="120" height="92" rx="6" fill={BG} stroke={BD} />
        <text x="50" y="68" style={{ fontSize: 10, fill: FG_S, fontFamily: "var(--font-mono)" }}>
          form
        </text>
        <motion.text
          x="50"
          y="92"
          key={form}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: 24, fontWeight: 700, fill: E }}
        >
          {form}
        </motion.text>
        <text x="50" y="112" style={{ fontSize: 10, fill: FG_M, fontFamily: "var(--font-mono)" }}>
          ✓ back straight
        </text>
        <text x="50" y="128" style={{ fontSize: 10, fill: M, fontFamily: "var(--font-mono)" }}>
          ! drop hips lower
        </text>
      </g>
      <g>
        <rect x="370" y="50" width="70" height="44" rx="6" fill={BG} stroke={M} />
        <text
          x="405"
          y="68"
          textAnchor="middle"
          style={{ fontSize: 9, fill: FG_S, fontFamily: "var(--font-mono)" }}
        >
          REPS
        </text>
        <motion.text
          x="405"
          y="88"
          key={reps}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          textAnchor="middle"
          style={{ fontSize: 18, fontWeight: 700, fill: M, fontFamily: "var(--font-mono)" }}
        >
          {reps}
        </motion.text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  TRACK PERSON — stylized map with route + live person                       */
/* -------------------------------------------------------------------------- */
export function TrackMini() {
  const reduce = useReducedMotion();
  const pts: [number, number][] = [
    [70, 150],
    [120, 130],
    [165, 100],
    [220, 110],
    [270, 70],
    [320, 90],
    [380, 60],
    [420, 100],
  ];
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <defs>
        <pattern id="map-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 22 0 L 0 0 0 22" fill="none" stroke={BD} strokeWidth="0.5" />
        </pattern>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0%" stopColor={A} stopOpacity="0.15" />
          <stop offset="100%" stopColor={V} />
        </linearGradient>
      </defs>
      <rect x="40" y="35" width="400" height="135" rx="6" fill={BG_S} stroke={BD} />
      <rect x="40" y="35" width="400" height="135" rx="6" fill="url(#map-grid)" opacity="0.7" />
      <path d="M 40 80 H 440" stroke={BD} strokeWidth="2" />
      <path d="M 40 130 H 440" stroke={BD} strokeWidth="2" />
      <path d="M 160 35 V 170" stroke={BD} strokeWidth="2" />
      <path d="M 290 35 V 170" stroke={BD} strokeWidth="2" />
      {[
        [70, 50, 30, 22],
        [200, 50, 40, 22],
        [340, 50, 28, 22],
        [80, 140, 30, 22],
        [220, 140, 50, 22],
        [360, 140, 36, 22],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={BG} stroke={BD} opacity="0.7" />
      ))}
      <path d={d} stroke="url(#trail)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill={A} opacity={i / pts.length + 0.3} />
      ))}
      <g transform={`translate(${pts[0]![0]},${pts[0]![1]})`}>
        <circle r="6" fill={E} stroke={BG_S} strokeWidth="2" />
      </g>
      {!reduce && (
        <motion.circle
          initial={false}
          r="8"
          fill={V}
          stroke={BG_S}
          strokeWidth="2"
          animate={{ cx: pts.map((p) => p[0]), cy: pts.map((p) => p[1]) }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
      <text x="40" y="22" style={{ fontSize: 11, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        track-person · live geofenced route · 8 waypoints
      </text>
      <text x="40" y="194" style={{ fontSize: 10, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        ● start · → trail · ● live position
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  SMART BRAIN — animated face + scanning detection                           */
/* -------------------------------------------------------------------------- */
export function BrainMini() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <defs>
        <radialGradient id="face-g" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor={A} stopOpacity="0.55" />
          <stop offset="100%" stopColor={A} stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={E} stopOpacity="0" />
          <stop offset="50%" stopColor={E} stopOpacity="0.9" />
          <stop offset="100%" stopColor={E} stopOpacity="0" />
        </linearGradient>
        <clipPath id="cam-clip">
          <rect x="40" y="36" width="240" height="144" rx="6" />
        </clipPath>
      </defs>
      <text x="40" y="22" style={{ fontSize: 11, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        smart-brain · clarifai face-detect · streaming
      </text>
      <rect x="40" y="36" width="240" height="144" rx="6" fill={BG_S} stroke={BD} />
      <g clipPath="url(#cam-clip)">
        <motion.circle
          initial={false}
          cx="160"
          cy="108"
          r="48"
          fill="url(#face-g)"
          animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ transformOrigin: "160px 108px" }}
        />
        <motion.ellipse
          initial={false}
          cx="142"
          cy="100"
          rx="3"
          ry="4"
          fill={FG}
          animate={reduce ? undefined : { ry: [4, 0.5, 4, 4] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2, 1] }}
        />
        <motion.ellipse
          initial={false}
          cx="178"
          cy="100"
          rx="3"
          ry="4"
          fill={FG}
          animate={reduce ? undefined : { ry: [4, 0.5, 4, 4] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.2, 1] }}
        />
        <motion.path
          initial={false}
          d="M 146 124 Q 160 134 174 124"
          stroke={FG}
          strokeWidth="2"
          fill="none"
          animate={
            reduce
              ? undefined
              : {
                  d: [
                    "M 146 124 Q 160 134 174 124",
                    "M 146 126 Q 160 130 174 126",
                    "M 146 124 Q 160 134 174 124",
                  ],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <motion.rect
          initial={false}
          x="108"
          y="58"
          width="104"
          height="104"
          rx="4"
          fill="none"
          stroke={E}
          strokeWidth="2"
          animate={reduce ? undefined : { x: [108, 106, 108], width: [104, 108, 104] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <text x="112" y="52" style={{ fontSize: 10, fill: E, fontFamily: "var(--font-mono)" }}>
          face · 0.98
        </text>
        {!reduce && (
          <motion.rect
            initial={false}
            x="40"
            width="240"
            height="6"
            fill="url(#scan)"
            animate={{ y: [36, 174, 36] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
      </g>
      <line x1="290" y1="108" x2="340" y2="108" stroke={V} strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="340,104 350,108 340,112" fill={V} />
      <g>
        <rect x="358" y="64" width="82" height="92" rx="6" fill={BG} stroke={BD} />
        <text
          x="399"
          y="84"
          textAnchor="middle"
          style={{ fontSize: 10, fill: FG_S, fontFamily: "var(--font-mono)" }}
        >
          CLARIFAI
        </text>
        <circle cx="399" cy="110" r="14" fill={V} opacity="0.18" />
        <motion.circle
          initial={false}
          cx="399"
          cy="110"
          r="8"
          fill={V}
          animate={reduce ? undefined : { scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ transformOrigin: "399px 110px" }}
        />
        <text
          x="399"
          y="142"
          textAnchor="middle"
          style={{ fontSize: 10, fill: FG_M, fontFamily: "var(--font-mono)" }}
        >
          model · v2
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  TEZOS — Steam-style marketplace grid                                       */
/* -------------------------------------------------------------------------- */
export function ChainBracket() {
  const reduce = useReducedMotion();
  const cards = [
    { x: 50, y: 50, c: A, label: "phx_arena" },
    { x: 158, y: 50, c: V, label: "chain_quest" },
    { x: 266, y: 50, c: E, label: "nft_drift" },
    { x: 374, y: 50, c: M, label: "pixl_war" },
    { x: 50, y: 120, c: V, label: "battle_xtz" },
    { x: 158, y: 120, c: E, label: "kaiju_loot" },
    { x: 266, y: 120, c: M, label: "card_realm" },
    { x: 374, y: 120, c: A, label: "skybound" },
  ];

  const [hot, setHot] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setHot((h) => (h + 1) % cards.length);
      setTick((t) => t + 1);
    }, 1400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <svg viewBox="0 0 480 200" className="h-full w-full">
      <text x="40" y="22" style={{ fontSize: 11, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        tezos premier league · on-chain games marketplace
      </text>
      {cards.map((c, i) => {
        const isHot = i === hot;
        const price = (i + 2) * 3 + ((tick + i) % 5);
        return (
          <motion.g
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <motion.rect
              initial={false}
              x={c.x}
              y={c.y}
              width="92"
              height="56"
              rx="5"
              fill={BG}
              animate={{
                stroke: isHot ? c.c : BD,
                strokeWidth: isHot ? 2 : 1,
              }}
              transition={{ duration: 0.4 }}
            />
            <rect x={c.x + 6} y={c.y + 6} width="80" height="28" rx="3" fill={c.c} opacity="0.25" />
            {[0, 1, 2, 3, 4].map((j) => (
              <motion.circle
                initial={false}
                key={j}
                cx={c.x + 14 + j * 14}
                cy={c.y + 20}
                fill={c.c}
                animate={
                  reduce
                    ? undefined
                    : {
                        r: j === 2 ? [5, 6, 5] : [3, 3.6, 3],
                        opacity: isHot ? 1 : j === 2 ? 0.9 : 0.5,
                      }
                }
                transition={{ duration: 1.6, repeat: Infinity, delay: (i + j) * 0.1 }}
              />
            ))}
            <text
              x={c.x + 8}
              y={c.y + 48}
              style={{ fontSize: 10, fontWeight: 600, fill: FG, fontFamily: "var(--font-mono)" }}
            >
              {c.label}
            </text>
            <rect
              x={c.x + 64}
              y={c.y + 40}
              width="22"
              height="11"
              rx="2"
              fill={c.c}
              opacity="0.85"
            />
            <motion.text
              x={c.x + 75}
              y={c.y + 48}
              key={`${c.label}-${price}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontWeight: 700,
                fill: BG_S,
                fontFamily: "var(--font-mono)",
              }}
            >
              ꜩ{price}
            </motion.text>
            {isHot && (
              <motion.text
                x={c.x + 88}
                y={c.y - 2}
                textAnchor="end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  fill: c.c,
                  fontFamily: "var(--font-mono)",
                }}
              >
                ▲ trending
              </motion.text>
            )}
          </motion.g>
        );
      })}
      <text x="40" y="194" style={{ fontSize: 9, fill: FG_S, fontFamily: "var(--font-mono)" }}>
        devs publish · users browse &amp; play · payouts settle on Tezos
      </text>
    </svg>
  );
}
