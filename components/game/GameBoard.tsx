"use client";

import dynamic from "next/dynamic";
import QuestionCard from "@/components/game/QuestionCard";
import type { Phenotype } from "@/lib/dailyQuestions";

// 动态加载地图，ssr:false 避免 leaflet 在服务端访问 window
const WorldMap = dynamic(() => import("@/components/game/WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-3xl bg-stone-100 h-[360px] lg:h-[480px]"
      aria-label="Loading map"
    />
  ),
});

interface GameBoardProps {
  /** 当前题目 phenotype */
  phenotype: Phenotype;
  /** 题号（1-based） */
  questionNumber: number;
  /** 总题数 */
  totalQuestions: number;
  /** 地图上方提示文案（如 phenotype / country 措辞差异） */
  hint: string;
  /** 当前猜测点；null 表示尚未落点 */
  guess: { lat: number; lng: number } | null;
  onGuess: (lat: number, lng: number) => void;
  onSubmit: () => void;
}

/**
 * 游戏进行中共用布局（Classic Daily / Challenge / Countries 三模式复用）。
 *
 * 桌面端（lg+）：左右分栏 —— 人脸卡在左（约 300px 列），地图在右，
 *   人脸与地图一屏同时可见，玩家看脸的同时直接点地图，无需来回滚动。
 * 移动端：上下堆叠 —— 人脸图缩小居中，让地图尽快进入视口。
 */
export default function GameBoard({
  phenotype,
  questionNumber,
  totalQuestions,
  hint,
  guess,
  onGuess,
  onSubmit,
}: GameBoardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-start">
      <QuestionCard
        phenotype={phenotype}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
      <div className="flex flex-col gap-2 min-w-0">
        <p className="m-0 text-sm text-stone-600">{hint}</p>
        <WorldMap
          heightClass="h-[360px] lg:h-[480px]"
          onGuess={onGuess}
          markers={
            guess
              ? [{ lat: guess.lat, lng: guess.lng, color: "blue" as const }]
              : []
          }
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!guess}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {guess ? "Submit Guess" : "Click the map to guess"}
        </button>
      </div>
    </div>
  );
}
