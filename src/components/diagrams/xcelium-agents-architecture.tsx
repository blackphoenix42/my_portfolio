"use client";

import { useTranslations } from "next-intl";
import { Arrow, ArrowMarker, Box, Caption, DC, LanePacket } from "./diagram-kit";

const W = 130;
const H = 46;
const LANE_1 = 160;
const LANE_2 = 270;

export function XceliumAgentsArchitecture() {
  const t = useTranslations("architecture.xcelium-ai-agents");
  return (
    <svg viewBox="0 0 960 380" className="h-auto w-full" role="img" aria-label={t("aria")}>
      <defs>
        <ArrowMarker id="xa-arrow" />
        <ArrowMarker id="xa-arrow-amber" color={DC.amber} />
      </defs>

      <rect
        x={185}
        y={108}
        width={765}
        height={88}
        rx={12}
        fill="none"
        stroke={DC.emerald}
        strokeOpacity={0.35}
        strokeDasharray="4 4"
      />
      <Caption x={197} y={124} anchor="start" color={DC.emerald}>
        {t("laneDeterministic")}
      </Caption>
      <rect
        x={185}
        y={218}
        width={520}
        height={102}
        rx={12}
        fill="none"
        stroke={DC.violet}
        strokeOpacity={0.35}
        strokeDasharray="4 4"
      />
      <Caption x={197} y={312} anchor="start" color={DC.violet}>
        {t("laneLlm")}
      </Caption>

      <Box x={95} y={60} w={150} h={48} label={t("tui")} sub={t("tuiSub")} accent={DC.amber} />
      <Arrow d="M 95 84 L 95 171" marker="xa-arrow" />
      <Box
        x={95}
        y={205}
        w={150}
        h={64}
        label={t("planner")}
        sub={t("plannerSub")}
        accent={DC.violet}
      />
      <Arrow d={`M 170 195 C 200 195, 205 ${LANE_1}, 233 ${LANE_1}`} marker="xa-arrow" />
      <Arrow d={`M 170 215 C 200 215, 205 ${LANE_2}, 233 ${LANE_2}`} marker="xa-arrow" dashed />

      <LanePacket x1={235} x2={900} y={LANE_1} color={DC.emerald} duration={5} />

      {/* Deterministic lane: runs as plain Python before any model turn. */}
      <Box x={300} y={LANE_1} w={W} h={H} label={t("intake")} accent={DC.emerald} />
      <Box x={460} y={LANE_1} w={W} h={H} label={t("runner")} accent={DC.emerald} />
      <Box x={620} y={LANE_1} w={W} h={H} label={t("parser")} accent={DC.emerald} />
      <Box x={835} y={LANE_1} w={W} h={H} label={t("report")} accent={DC.emerald} />
      <Arrow d={`M 365 ${LANE_1} L 393 ${LANE_1}`} marker="xa-arrow" />
      <Arrow d={`M 525 ${LANE_1} L 553 ${LANE_1}`} marker="xa-arrow" />
      <Arrow d={`M 685 ${LANE_1} L 768 ${LANE_1}`} marker="xa-arrow" />

      {/* Reasoning lane: the model only gets parsed findings as data. */}
      <Arrow d={`M 620 183 L 620 ${LANE_2 - H / 2 - 2}`} marker="xa-arrow" />
      <Box x={620} y={LANE_2} w={W} h={H} label={t("analyse")} accent={DC.violet} />
      <Box x={460} y={LANE_2} w={W} h={H} label={t("recode")} accent={DC.violet} />
      <Box x={300} y={LANE_2} w={W} h={H} label={t("apply")} accent={DC.violet} />
      <Arrow d={`M 555 ${LANE_2} L 527 ${LANE_2}`} marker="xa-arrow" />
      <Arrow d={`M 395 ${LANE_2} L 367 ${LANE_2}`} marker="xa-arrow" />
      <Arrow d="M 330 247 C 360 212, 430 212, 452 185" marker="xa-arrow-amber" color={DC.amber} />
      <Caption x={330} y={211} anchor="end" color={DC.amber}>
        {t("rerun")}
      </Caption>

      <Box
        x={835}
        y={LANE_2}
        w={170}
        h={56}
        label={t("judge")}
        sub={t("judgeSub")}
        accent={DC.amber}
        dashed
      />
      <Arrow d={`M 835 ${LANE_2 - 28} L 835 185`} marker="xa-arrow-amber" color={DC.amber} dashed />
      <Caption x={845} y={218} anchor="start" color={DC.amber}>
        {t("golden")}
      </Caption>

      <Box
        x={480}
        y={346}
        w={920}
        h={34}
        label={t("framework")}
        accent={DC.cyan}
        fill={DC.sunken}
      />
    </svg>
  );
}
