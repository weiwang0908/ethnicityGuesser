import Image from "next/image";
import type { Phenotype } from "@/lib/dailyQuestions";

interface QuestionCardProps {
  /** 当前题目 phenotype */
  phenotype: Phenotype;
  /** 题号（1-based） */
  questionNumber: number;
  /** 总题数 */
  totalQuestions: number;
}

/**
 * 题目卡片：展示合成脸图 + 题号 + 进度条。
 * 纯展示组件，无交互，可被任意客户端游戏容器复用（Task 6/7）。
 */
export default function QuestionCard({
  phenotype,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const progress = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-medium text-gray-900">
          Question {questionNumber} / {totalQuestions}
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={questionNumber}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={`Question ${questionNumber} of ${totalQuestions}`}
      >
        <div
          className="h-full bg-gray-900 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-center">
        <div
          className={`relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${
            phenotype.image_url.startsWith("/countries/")
              ? "max-w-[240px] aspect-[4/3]"
              : "max-w-sm aspect-square"
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
            sizes="(max-width: 640px) 100vw, 384px"
            className={
              phenotype.image_url.startsWith("/countries/")
                ? "object-contain p-2"
                : "object-cover"
            }
          />
        </div>
      </div>
    </div>
  );
}
