"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import type { Phenotype } from "@/lib/dailyQuestions";

// 动态加载地图，ssr:false 避免 leaflet 在服务端访问 window
const WorldMap = dynamic(() => import("@/components/game/WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-3xl bg-stone-100"
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
    <div className="flex flex-col gap-4 rounded-4xl bg-section-soft border border-stone-200/70 shadow-premium p-6">
      {/* 人脸缩略图 + 名称并排：让用户答题时看到的脸和答案对照，无需靠记忆回想 */}
      <div className="flex items-center gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-premium ${
            phenotype.image_url.startsWith("/countries/")
              ? "w-24 aspect-[4/3]"
              : "w-20 sm:w-24 aspect-square"
          }`}
        >
          <Image
            src={phenotype.image_url}
            alt={
              phenotype.image_url.startsWith("/countries/")
                ? `${phenotype.name} country flag`
                : `${phenotype.name} phenotype average face`
            }
            fill
            sizes="96px"
            className={
              phenotype.image_url.startsWith("/countries/")
                ? "object-contain p-1.5"
                : "object-cover"
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-xl sm:text-2xl font-bold text-stone-900">
            {phenotype.name}
          </h2>
          <p className="m-0 text-sm text-stone-600">
            Region: {phenotype.region}
          </p>
        </div>
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
        <p className="m-0 text-base text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium p-4">
          You were{" "}
          <span className="font-semibold">{roundedDistance} km</span> away
        </p>
        <p className="m-0 text-base text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium p-4">
          Score:{" "}
          <span className="font-semibold">+{score} points</span>
        </p>
      </div>

      <p className="m-0 text-sm text-stone-700 leading-relaxed">{shortDesc}</p>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors w-full sm:w-auto"
      >
        {isLast ? "See Final Results" : "Next Question"}
      </button>
    </div>
  );
}
