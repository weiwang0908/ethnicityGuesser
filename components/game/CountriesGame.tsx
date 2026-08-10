"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import countriesRaw from "@/data/countries.json";
import type { Phenotype } from "@/lib/dailyQuestions";
import {
  haversineDistance,
  calculateScore,
  MAX_SCORE_PER_QUESTION,
} from "@/lib/scoring";
import QuestionCard from "@/components/game/QuestionCard";
import AnswerReveal from "@/components/game/AnswerReveal";
import ResultsScreen, { type GameAnswer } from "@/components/game/ResultsScreen";

// 动态加载地图，ssr:false 避免 leaflet 在服务端访问 window
const WorldMap = dynamic(() => import("@/components/game/WorldMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-lg bg-gray-100"
      style={{ height: 360 }}
      aria-label="Loading map"
    />
  ),
});

/** Countries 模式题数（48 国全部，固定顺序）。 */
const COUNTRIES_QUESTION_COUNT = countriesRaw.length;

const MAX_TOTAL_SCORE = MAX_SCORE_PER_QUESTION * COUNTRIES_QUESTION_COUNT;

type Phase = "playing" | "revealed" | "finished";

interface Guess {
  lat: number;
  lng: number;
}

/**
 * 把 countries.json 归一化为 Phenotype 结构。
 *
 * countries.json 缺少 `references` 字段，且 `image_url` 可能为空字符串。
 * - 补 `references: []` 以满足 Phenotype 类型。
 * - 空 image_url 替换为 placehold.co 占位图（已在 next.config.mjs 白名单），
 *   文案为 "{country} average face"，让 QuestionCard / ResultsScreen 无需改动即可正常渲染。
 */
const COUNTRIES: Phenotype[] = (countriesRaw as Omit<Phenotype, "references">[])
  .map((c) => ({
    ...c,
    references: [],
    image_url:
      c.image_url && c.image_url.trim().length > 0
        ? c.image_url
        : `https://placehold.co/400x400/eeeeee/666666?text=${encodeURIComponent(
            `${c.name} average face`
          )}`,
  }));

/**
 * Countries 模式游戏容器（客户端）。
 *
 * 数据源：data/countries.json（48 国全部，固定顺序）。
 * 复用 Task 5 的 QuestionCard / WorldMap / AnswerReveal / ResultsScreen 组件。
 * 状态机：playing → revealed → playing → ... → finished。
 */
export default function CountriesGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [phase, setPhase] = useState<Phase>("playing");

  const current = COUNTRIES[currentIndex];

  const totalScore = useMemo(
    () => answers.reduce((sum, a) => sum + a.score, 0),
    [answers]
  );

  const handleSubmitGuess = useCallback(() => {
    if (!current || !guess) return;
    const distance = haversineDistance(
      guess.lat,
      guess.lng,
      current.lat,
      current.lng
    );
    const score = calculateScore(distance);
    setAnswers((prev) => [
      ...prev,
      { phenotype: current, guess, distance, score },
    ]);
    setPhase("revealed");
  }, [current, guess]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= COUNTRIES_QUESTION_COUNT) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setGuess(null);
      setPhase("playing");
    }
  }, [currentIndex]);

  const handlePlayAgain = useCallback(() => {
    setAnswers([]);
    setCurrentIndex(0);
    setGuess(null);
    setPhase("playing");
  }, []);

  if (phase === "finished") {
    return (
      <ResultsScreen
        totalScore={totalScore}
        maxScore={MAX_TOTAL_SCORE}
        answers={answers}
        onPlayAgain={handlePlayAgain}
        mode="countries"
      />
    );
  }

  if (phase === "revealed" && answers.length > 0) {
    const last = answers[answers.length - 1];
    return (
      <AnswerReveal
        phenotype={last.phenotype}
        userGuess={last.guess}
        distance={last.distance}
        score={last.score}
        onNext={handleNext}
        isLast={currentIndex + 1 >= COUNTRIES_QUESTION_COUNT}
      />
    );
  }

  // playing
  return (
    <div className="flex flex-col gap-4">
      <QuestionCard
        phenotype={current}
        questionNumber={currentIndex + 1}
        totalQuestions={COUNTRIES_QUESTION_COUNT}
      />
      <div className="flex flex-col gap-2">
        <p className="m-0 text-sm text-gray-600">
          Click the map where you think this country is located.
        </p>
        <WorldMap
          height={360}
          onGuess={(lat, lng) => setGuess({ lat, lng })}
          markers={
            guess
              ? [{ lat: guess.lat, lng: guess.lng, color: "blue" as const }]
              : []
          }
        />
        <button
          type="button"
          onClick={handleSubmitGuess}
          disabled={!guess}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {guess ? "Submit Guess" : "Click the map to guess"}
        </button>
      </div>
    </div>
  );
}
