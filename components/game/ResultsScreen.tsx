"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Phenotype } from "@/lib/dailyQuestions";

export interface GameAnswer {
  phenotype: Phenotype;
  guess: { lat: number; lng: number };
  /** 距离（公里） */
  distance: number;
  score: number;
}

/** 游戏模式标识，用于构造分享文案与链接。 */
export type GameMode = "classic-daily" | "challenge" | "countries";

const MODE_LABELS: Record<GameMode, string> = {
  "classic-daily": "Classic Daily",
  challenge: "Challenge",
  countries: "Countries",
};

interface ResultsScreenProps {
  totalScore: number;
  maxScore: number;
  answers: GameAnswer[];
  onPlayAgain: () => void;
  /** 当前游戏模式，用于分享文案与链接 */
  mode: GameMode;
}

/**
 * 最终结算页：总分 + 每题回顾 + 分享/重玩/挑战入口。
 */
export default function ResultsScreen({
  totalScore,
  maxScore,
  answers,
  onPlayAgain,
  mode,
}: ResultsScreenProps) {
  const [copied, setCopied] = useState(false);

  const modeLabel = MODE_LABELS[mode];
  const shareUrl = `https://ethnicity-guesser.com/play/${mode}`;
  const tweetText = `I scored ${totalScore}/${maxScore} on Ethnicity Guesser ${modeLabel}! Can you beat my score? 🌍🧬`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(shareUrl)}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用（如非 HTTPS / 旧浏览器）：静默忽略
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="m-0 text-2xl sm:text-3xl font-bold text-gray-900">
          Final Score
        </h2>
        <p className="m-0 text-4xl sm:text-5xl font-bold text-gray-900">
          {totalScore.toLocaleString("en-US")}{" "}
          <span className="text-xl sm:text-2xl text-gray-500 font-normal">
            / {maxScore.toLocaleString("en-US")}
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Share on Twitter
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition-colors"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition-colors"
        >
          Play Again
        </button>
        <Link
          href="/play/challenge"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition-colors"
        >
          Try Challenge Mode
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="m-0 text-lg font-semibold text-gray-900">
          Question Review
        </h3>
        <ul className="m-0 p-0 list-none flex flex-col gap-2">
          {answers.map((a, i) => (
            <li
              key={a.phenotype.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
            >
              <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                <Image
                  src={a.phenotype.image_url}
                  alt={`${a.phenotype.name} phenotype average face`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {i + 1}. {a.phenotype.name}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(a.distance).toLocaleString("en-US")} km away
                </div>
              </div>
              <div className="font-semibold text-gray-900 flex-shrink-0">
                +{a.score}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
