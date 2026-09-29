"use client";

import { useTranslations } from "next-intl";
import { Arrow, ArrowMarker, Box, Caption, DC, LanePacket } from "./diagram-kit";

const TOP = 110;
const MID = 225;
const LOW = 325;

export function RegressionTriageArchitecture() {
  const t = useTranslations("architecture.regression-triage");
  const pipeline = [
    { id: "lists", x: 80, accent: DC.cyan },
    { id: "rerun", x: 235, accent: DC.cyan },
    { id: "signatures", x: 390, accent: DC.violet },
    { id: "categorise", x: 545, accent: DC.violet },
    { id: "cluster", x: 700, accent: DC.violet },
  ] as const;
  return (
    <svg viewBox="0 0 960 370" className="h-auto w-full" role="img" aria-label={t("aria")}>
      <defs>
        <ArrowMarker id="rt-arrow" />
        <ArrowMarker id="rt-arrow-amber" color={DC.amber} />
      </defs>

      <line x1={80} y1={TOP} x2={865} y2={TOP} stroke={DC.border} strokeWidth={1.4} />
      <LanePacket x1={80} x2={865} y={TOP} duration={5} />

      {pipeline.map((p, i) => (
        <g key={p.id}>
          <Box x={p.x} y={TOP} w={130} h={50} label={t(`stages.${p.id}`)} accent={p.accent} />
          <Arrow
            d={`M ${p.x + 65} ${TOP} L ${p.x + (i === 4 ? 98 : 88)} ${TOP}`}
            marker="rt-arrow"
          />
        </g>
      ))}

      <Box x={865} y={38} w={150} h={42} label={t("review")} accent={DC.violet} dashed />
      <Arrow d="M 865 59 L 865 83" marker="rt-arrow" dashed />
      <Box x={865} y={TOP} w={130} h={50} label={t("gate")} accent={DC.amber} />

      <Arrow d={`M 865 135 L 865 ${MID - 27}`} marker="rt-arrow" color={DC.emerald} />
      <Arrow d={`M 845 135 C 845 170, 700 165, 700 ${MID - 27}`} marker="rt-arrow" />
      <Arrow
        d={`M 825 135 C 820 178, 390 165, 390 ${MID - 27}`}
        marker="rt-arrow-amber"
        color={DC.amber}
      />

      <Box x={390} y={MID} w={170} h={50} label={t("rca")} sub={t("rcaSub")} accent={DC.amber} />
      <Box
        x={700}
        y={MID}
        w={140}
        h={50}
        label={t("filter")}
        sub={t("filterSub")}
        accent={DC.cyan}
      />
      <Box
        x={865}
        y={MID}
        w={140}
        h={50}
        label={t("regold")}
        sub={t("regoldSub")}
        accent={DC.emerald}
      />

      <Arrow d={`M 865 250 C 865 280, 805 280, 805 ${LOW - 27}`} marker="rt-arrow" />
      <Arrow d={`M 700 250 C 700 280, 760 280, 760 ${LOW - 27}`} marker="rt-arrow" />
      <Box x={782} y={LOW} w={150} h={50} label={t("verify")} accent={DC.emerald} />

      <Arrow d={`M 707 ${LOW} L 632 ${LOW}`} marker="rt-arrow" />
      <Arrow d={`M 390 250 C 390 300, 430 ${LOW}, 458 ${LOW}`} marker="rt-arrow" />
      <Box
        x={545}
        y={LOW}
        w={170}
        h={50}
        label={t("learning")}
        sub={t("learningSub")}
        accent={DC.violet}
        fill={DC.sunken}
      />
      <Arrow d={`M 545 ${LOW - 25} L 545 ${TOP + 27}`} marker="rt-arrow" color={DC.violet} dashed />
      <Caption x={553} y={262} anchor="start" color={DC.violet}>
        {t("feedback")}
      </Caption>
    </svg>
  );
}
