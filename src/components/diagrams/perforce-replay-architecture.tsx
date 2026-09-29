"use client";

import { useTranslations } from "next-intl";
import { Arrow, ArrowMarker, Box, Caption, DC, LanePacket } from "./diagram-kit";

const ROW = 150;
const OUT = 265;

export function PerforceReplayArchitecture() {
  const t = useTranslations("architecture.perforce-replay");
  const stages = [
    { id: "streams", x: 95, accent: DC.cyan },
    { id: "order", x: 245, accent: DC.cyan },
    { id: "plan", x: 395, accent: DC.violet },
    { id: "materialise", x: 545, accent: DC.violet },
    { id: "merge", x: 695, accent: DC.cyan },
    { id: "resolve", x: 845, accent: DC.cyan },
  ] as const;
  return (
    <svg viewBox="0 0 960 330" className="h-auto w-full" role="img" aria-label={t("aria")}>
      <defs>
        <ArrowMarker id="pr-arrow" />
      </defs>

      <Box x={95} y={55} w={170} h={34} label={t("input")} accent={DC.amber} fill={DC.sunken} />
      <Arrow d="M 95 72 L 95 120" marker="pr-arrow" />

      <line x1={95} y1={ROW} x2={845} y2={ROW} stroke={DC.border} strokeWidth={1.4} />
      <LanePacket x1={95} x2={845} y={ROW} duration={5} />

      {stages.map((s, i) => (
        <g key={s.id}>
          <Box x={s.x} y={ROW} w={128} h={56} label={t(`stages.${s.id}`)} accent={s.accent} />
          {i < stages.length - 1 && (
            <Arrow d={`M ${s.x + 64} ${ROW} L ${s.x + 84} ${ROW}`} marker="pr-arrow" />
          )}
        </g>
      ))}

      <Arrow d={`M 845 178 L 845 ${OUT - 27}`} marker="pr-arrow" />
      <Arrow d={`M 828 178 C 828 215, 695 208, 695 ${OUT - 27}`} marker="pr-arrow" />
      <Box x={695} y={OUT} w={150} h={50} label={t("merged")} accent={DC.emerald} />
      <Box x={845} y={OUT} w={140} h={50} label={t("declined")} accent={DC.amber} />

      <Box
        x={245}
        y={OUT}
        w={190}
        h={50}
        label={t("client")}
        sub={t("clientSub")}
        accent={DC.violet}
        dashed
      />
      <Arrow d="M 300 240 C 330 215, 380 212, 392 181" marker="pr-arrow" dashed />

      <Caption x={480} y={318}>
        {t("noSubmit")}
      </Caption>
    </svg>
  );
}
