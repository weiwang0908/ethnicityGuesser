"use client";

import dynamic from "next/dynamic";
import type { Phenotype } from "@/lib/dailyQuestions";

// 动态加载地图，ssr:false 避免 leaflet 在服务端访问 window
const WorldMap = dynamic(() => import("@/components/game/WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-lg bg-gray-100"
      style={{ height: 300 }}
      aria-label="Loading map"
    />
  ),
});

interface AnswerRevealProps {
  phenotype: Phenotype;
  userGuess: { lat: number; lng: number };
  /** 距离（公里） */
  distance: number;
  /** 本题得分 */
  score: number;
  onNext: () => void;
  isLast: boolean;
}

/**
 * 单题结果面板：真实位置（红）vs 用户猜测（蓝）+ 距离 + 得分 + 简短描述 + 下一题按钮。
 */
export default function AnswerReveal({
  phenotype,
  userGuess,
  distance,
  score,
  onNext,
  isLast,
}: AnswerRevealProps) {
  const shortDesc =
    phenotype.description.length > 200
      ? phenotype.description.slice(0, 200).trim() + "…"
      : phenotype.description;

  const roundedDistance = Math.round(distance).toLocaleString("en-US");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-xl sm:text-2xl font-bold text-gray-900">
          {phenotype.name}
        </h2>
        <p className="m-0 text-sm text-gray-600">
          Region: {phenotype.region}
        </p>
      </div>

      <WorldMap
        height={300}
        markers={[
          {
            lat: userGuess.lat,
            lng: userGuess.lng,
            color: "blue" as const,
            label: "Your guess",
          },
          {
            lat: phenotype.lat,
            lng: phenotype.lng,
            color: "red" as const,
            label: "Actual location",
          },
        ]}
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
        <p className="m-0 text-base text-gray-900">
          You were{" "}
          <span className="font-semibold">{roundedDistance} km</span> away
        </p>
        <p className="m-0 text-base text-gray-900">
          Score:{" "}
          <span className="font-semibold">+{score} points</span>
        </p>
      </div>

      <p className="m-0 text-sm text-gray-700 leading-relaxed">{shortDesc}</p>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
      >
        {isLast ? "See Final Results" : "Next Question"}
      </button>
    </div>
  );
}
