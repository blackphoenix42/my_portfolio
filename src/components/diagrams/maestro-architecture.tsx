"use client";

import { useTranslations } from "next-intl";
import { Arrow, ArrowMarker, Box, Caption, DC, GateMark, LanePacket } from "./diagram-kit";

const STAGES = [
  { id: "intake", x: 262, phases: "P0–5", gate: false },
  { id: "rca", x: 369, phases: "P6", gate: true },
  { id: "fix", x: 476, phases: "P7", gate: true },
  { id: "validate", x: 583, phases: "P8", gate: true },
  { id: "review", x: 690, phases: "P9–10", gate: true },
  { id: "regress", x: 797, phases: "P11–12", gate: false },
  { id: "release", x: 904, phases: "P13–19", gate: true },
] as const;

const ROW_Y = 190;
const BOX_W = 96;
const BOX_H = 64;

export function MaestroArchitecture() {
  const t = useTranslations("architecture.maestro");
  return (
    <svg viewBox="0 0 960 400" className="h-auto w-full" role="img" aria-label={t("aria")}>
      <defs>
        <ArrowMarker id="ma-arrow" />
        <ArrowMarker id="ma-arrow-amber" color={DC.amber} />
      </defs>

      <Box x={90} y={58} w={160} h={34} label={t("entry")} accent={DC.amber} fill={DC.sunken} />
      <Arrow d="M 90 75 L 90 152" marker="ma-arrow" />
      <Box
        x={90}
        y={ROW_Y}
        w={150}
        h={72}
        label={t("conductor")}
        sub={t("conductorSub")}
        accent={DC.violet}
      />

      <line x1={165} y1={ROW_Y} x2={950} y2={ROW_Y} stroke={DC.border} strokeWidth={1.4} />
      <LanePacket x1={165} x2={950} y={ROW_Y} duration={6} />
      <Arrow d={`M 165 ${ROW_Y} L 212 ${ROW_Y}`} marker="ma-arrow" />

      {/* Self-healing loop: a red validation test routes back to debug. */}
      <Arrow
        d={`M 583 ${ROW_Y - BOX_H / 2} C 583 112, 369 112, 369 ${ROW_Y - BOX_H / 2 - 2}`}
        marker="ma-arrow-amber"
        color={DC.amber}
        dashed
      />
      <Caption x={476} y={106} color={DC.amber}>
        {t("loop")}
      </Caption>

      {STAGES.map((s, i) => (
        <g key={s.id}>
          <Box
            x={s.x}
            y={ROW_Y}
            w={BOX_W}
            h={BOX_H}
            label={t(`stages.${s.id}`)}
            sub={s.phases}
            accent={i % 2 === 0 ? DC.cyan : DC.violet}
          />
          {s.gate && <GateMark x={s.x + BOX_W / 2 - 8} y={ROW_Y - BOX_H / 2} />}
          <line
            x1={s.x}
            y1={ROW_Y + BOX_H / 2}
            x2={s.x}
            y2={268}
            stroke={DC.border}
            strokeDasharray="3 3"
          />
        </g>
      ))}

      <Box x={583} y={285} w={740} h={34} label={t("state")} accent={DC.emerald} fill={DC.sunken} />

      <Box
        x={430}
        y={362}
        w={230}
        h={44}
        label={t("kb")}
        sub={t("kbSub")}
        accent={DC.cyan}
        dashed
      />
      <Box
        x={740}
        y={362}
        w={230}
        h={44}
        label={t("tools")}
        sub={t("toolsSub")}
        accent={DC.violet}
        dashed
      />
      <Arrow d="M 430 340 L 430 304" marker="ma-arrow" />
      <Arrow d="M 740 340 L 740 304" marker="ma-arrow" />

      <GateMark x={36} y={362} />
      <Caption x={48} y={365} anchor="start">
        {t("gate")}
      </Caption>
    </svg>
  );
}
