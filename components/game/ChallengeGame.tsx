"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  getChallengeQuestions,
  CHALLENGE_QUESTION_COUNT,
} from "@/lib/challengeQuestions";
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

const MAX_TOTAL_SCORE = MAX_SCORE_PER_QUESTION * CHALLENGE_QUESTION_COUNT;
const STORAGE_KEY = "challenge-progress";

type Phase = "playing" | "revealed" | "finished";

interface Guess {
  lat: number;
  lng: number;
}

/** localStorage 持久化结构（只存必要字段，phenotype 通过 id 还原）。 */
interface StoredAnswer {
  phenotypeId: string;
  guess: Guess;
  distance: number;
  score: number;
}
interface StoredProgress {
  v: 1;
  sig: string;
  currentIndex: number;
  answers: StoredAnswer[];
}

/**
 * Challenge 模式游戏容器（客户端）。
 *
 * 与 Classic Daily 区别：
 * - 题目数 38（非 10），固定题库（非每日 seed），无时限。
 * - 中途刷新/离开，进度持久化在 localStorage（key: challenge-progress）。
 * - 重新访问时询问是否继续；"Quit" 按钮带确认，确认后清空进度并回首页。
 *
 * 状态机：playing → revealed → playing → ... → finished。
 */
export default function ChallengeGame() {
  const router = useRouter();
  // 题目在客户端挂载后计算，避免 SSR/客户端 hydration 不匹配。
  const [questions, setQuestions] = useState<Phenotype[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [phase, setPhase] = useState<Phase>("playing");
  // 是否已从 localStorage 还原，避免还原前误写
  const [hydrated, setHydrated] = useState(false);

  // 题目签名（id 列表），用于校验存储的进度是否匹配当前题库
  const signature = useMemo(
    () => questions.map((q) => q.id).join(","),
    [questions]
  );

  // 挂载时计算题目 + 尝试还原进度
  useEffect(() => {
    const qs = getChallengeQuestions();
    setQuestions(qs);

    const sig = qs.map((q) => q.id).join(",");
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredProgress;
        if (
          stored &&
          stored.v === 1 &&
          stored.sig === sig &&
          Number.isInteger(stored.currentIndex) &&
          Array.isArray(stored.answers) &&
          stored.currentIndex >= 0 &&
          stored.currentIndex <= qs.length &&
          stored.answers.length <= qs.length
        ) {
          // 还原 answers：通过 phenotypeId 从题目数组查回完整 phenotype
          const byId = new Map(qs.map((q) => [q.id, q]));
          const restored: GameAnswer[] = stored.answers
            .map((a): GameAnswer | null => {
              const ph = byId.get(a.phenotypeId);
              if (!ph) return null;
              return {
                phenotype: ph,
                guess: a.guess,
                distance: a.distance,
                score: a.score,
              };
            })
            .filter((a): a is GameAnswer => a !== null);

          // 仅当已答题数与 currentIndex 一致时才还原（防止状态错乱）
          if (restored.length === stored.currentIndex) {
            const continueGame = window.confirm(
              `You have a saved Challenge in progress (question ${
                stored.currentIndex + 1
              } / ${qs.length}). Continue where you left off?`
            );
            if (continueGame) {
              setAnswers(restored);
              setCurrentIndex(stored.currentIndex);
              // 若已答完全部但未结算，保持 finished 之外的状态
              setPhase(
                restored.length >= qs.length ? "finished" : "playing"
              );
            } else {
              window.localStorage.removeItem(STORAGE_KEY);
            }
          }
        }
      }
    } catch {
      // JSON 解析失败或 localStorage 不可用：静默忽略，开始新游戏
    }
    setHydrated(true);
  }, []);

  // 进度持久化：状态变化时写入 localStorage（仅在还原完成后）
  useEffect(() => {
    if (!hydrated || questions.length === 0) return;
    if (phase === "finished") {
      // 结算后清除进度，避免下次还提示继续已结束的游戏
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const progress: StoredProgress = {
      v: 1,
      sig: signature,
      currentIndex,
      answers: answers.map((a) => ({
        phenotypeId: a.phenotype.id,
        guess: a.guess,
        distance: a.distance,
        score: a.score,
      })),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // 存储失败（如隐私模式 / 配额满）：静默忽略，游戏仍可继续
    }
  }, [hydrated, questions, signature, currentIndex, answers, phase]);

  const current = questions[currentIndex];

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
    if (currentIndex + 1 >= CHALLENGE_QUESTION_COUNT) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setGuess(null);
      setPhase("playing");
    }
  }, [currentIndex]);

  const handlePlayAgain = useCallback(() => {
    // 结算页 "Play Again"：重新开始一局，清空进度
    setQuestions(getChallengeQuestions());
    setAnswers([]);
    setCurrentIndex(0);
    setGuess(null);
    setPhase("playing");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 忽略
    }
  }, []);

  const handleQuit = useCallback(() => {
    const ok = window.confirm(
      "Quit the Challenge? Your saved progress will be lost."
    );
    if (!ok) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 忽略
    }
    router.push("/");
  }, [router]);

  // 加载中（题目尚未计算 / 还原未完成）
  if (questions.length === 0 || !hydrated) {
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
        mode="challenge"
      />
    );
  }

  if (phase === "revealed" && answers.length > 0) {
    const last = answers[answers.length - 1];
    return (
      <div className="flex flex-col gap-4">
        <AnswerReveal
          phenotype={last.phenotype}
          userGuess={last.guess}
          distance={last.distance}
          score={last.score}
          onNext={handleNext}
          isLast={currentIndex + 1 >= CHALLENGE_QUESTION_COUNT}
        />
        <QuitButton onQuit={handleQuit} />
      </div>
    );
  }

  // playing
  return (
    <div className="flex flex-col gap-4">
      <QuestionCard
        phenotype={current}
        questionNumber={currentIndex + 1}
        totalQuestions={CHALLENGE_QUESTION_COUNT}
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
      <QuitButton onQuit={handleQuit} />
    </div>
  );
}

/** Quit 按钮：带确认，触摸目标 ≥44px。 */
function QuitButton({ onQuit }: { onQuit: () => void }) {
  return (
    <button
      type="button"
      onClick={onQuit}
      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto"
    >
      Quit Challenge
    </button>
  );
}
