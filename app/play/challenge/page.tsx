import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import ChallengeGame from "@/components/game/ChallengeGame";

export const metadata = buildMetadata({
  title: "Ethnicity Challenge Quiz - 38 Phenotypes Game",
  description:
    "Take the Ethnicity Challenge Quiz: guess the origin of 38 human phenotypes on the world map. No time limit, save your progress, and beat your best score.",
  path: "/play/challenge",
});

const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: "Ethnicity Challenge Quiz",
  description:
    "Ethnicity challenge quiz with 38 human phenotypes. Guess each origin on the world map with no time limit.",
  gameItem: "Human Phenotype",
  numberOfPlayers: "1",
  numberOfQuestions: "38",
  gameLocation: "World",
};

/**
 * Challenge 模式游戏页（服务端外壳）。
 * - metadata + JSON-LD Game schema 在服务端注入
 * - 唯一 H1（主词 "ethnicity challenge quiz"）
 * - 游戏交互由客户端容器 ChallengeGame 承载
 */
export default function ChallengePage() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Play", url: "/play/classic-daily" },
          { name: "Challenge", url: "/play/challenge" },
        ]}
      />
      <header className="flex flex-col gap-2">
        <h1 className="m-0 text-2xl sm:text-3xl font-bold text-gray-900">
          Ethnicity Challenge Quiz - 38 Phenotypes
        </h1>
        <p className="m-0 text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl">
          The Ethnicity Challenge Quiz tests you on 38 human phenotypes from
          every inhabited region. There is no time limit, and your progress is
          saved automatically, so you can pause and resume anytime. Drop your
          pin on the world map and see how close each guess lands.
        </p>
      </header>
      <ChallengeGame />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
    </div>
  );
}
