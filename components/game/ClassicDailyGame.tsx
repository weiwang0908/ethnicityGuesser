"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  getDailyQuestions,
  formatDateKey,
  QUESTION_COUNT,
  type Phenotype,
} from "@/lib/dailyQuestions";
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

const MAX_TOTAL_SCORE = MAX_SCORE_PER_QUESTION * QUESTION_COUNT;

type Phase = "playing" | "revealed" | "finished";

interface Guess {
  lat: number;
  lng: number;
}

/**
 * Classic Daily 游戏容器（客户端）。
 * 状态机：playing → revealed → playing → ... → finished。
 * 题目在客户端挂载后按当日日期计算，避免 SSR/客户端 hydration 不匹配。
 */
export default function ClassicDailyGame() {
  const [questions, setQuestions] = useState<Phenotype[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [phase, setPhase] = useState<Phase>("playing");
  const [dateKey, setDateKey] = useState("");

  useEffect(() => {
    const today = new Date();
    setDateKey(formatDateKey(today));
    setQuestions(getDailyQuestions(today));
  }, []);

  const current = questions[currentIndex];

  const totalScore = useMemo(
    () => answers.reduce((sum, a) => sum + a.score, 0),
    [answers]
  );

  function handleSubmitGuess() {
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
  }

  function handleNext() {
    if (currentIndex + 1 >= QUESTION_COUNT) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setGuess(null);
      setPhase("playing");
    }
  }

  function handlePlayAgain() {
    const today = new Date();
    setQuestions(getDailyQuestions(today));
    setDateKey(formatDateKey(today));
    setAnswers([]);
    setCurrentIndex(0);
    setGuess(null);
    setPhase("playing");
  }

  // 加载中（题目尚未计算）
  if (questions.length === 0) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="mx-auto w-full max-w-sm aspect-square bg-gray-200 rounded-lg" />
        <div className="w-full bg-gray-200 rounded-lg" style={{ height: 360 }} />
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <ResultsScreen
        totalScore={totalScore}
        maxScore={MAX_TOTAL_SCORE}
        answers={answers}
        onPlayAgain={handlePlayAgain}
        mode="classic-daily"
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
        isLast={currentIndex + 1 >= QUESTION_COUNT}
      />
    );
  }

  // playing
  return (
    <div className="flex flex-col gap-4">
      <QuestionCard
        phenotype={current}
        questionNumber={currentIndex + 1}
        totalQuestions={QUESTION_COUNT}
      />
      <div className="flex flex-col gap-2">
        <p className="m-0 text-sm text-gray-600">
          Click the map where you think this phenotype is from.
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
      {dateKey && (
        <p className="m-0 text-xs text-gray-400">Daily set: {dateKey}</p>
      )}
    </div>
  );
}
