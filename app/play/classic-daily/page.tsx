import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import ClassicDailyGame from "@/components/game/ClassicDailyGame";

export const metadata = buildMetadata({
  title: "Ethnoguessr Game - Daily Ethnicity Quiz 10 Questions",
  description:
    "Play the Ethnoguessr game: a free daily ethnicity quiz with 10 questions. Guess each phenotype's origin on the world map and score up to 5000 points.",
  path: "/play/classic-daily",
});

const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: "Ethnoguessr Classic Daily",
  description:
    "Daily ethnicity quiz game. Guess the origin of 10 human phenotypes on the world map.",
  gameItem: "Human Phenotype",
  numberOfPlayers: "1",
};

/**
 * Classic Daily 游戏页（服务端外壳）。
 * - metadata + JSON-LD Game schema 在服务端注入
 * - 唯一 H1
 * - 游戏交互由客户端容器 ClassicDailyGame 承载
 */
export default function ClassicDailyPage() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Play", url: "/play/classic-daily" },
          { name: "Classic Daily", url: "/play/classic-daily" },
        ]}
      />
      <header className="flex flex-col gap-2">
        <h1 className="m-0 text-2xl sm:text-3xl font-bold text-gray-900">
          Ethnoguessr Game - Daily Ethnicity Quiz
        </h1>
        <p className="m-0 text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl">
          A free daily ethnicity quiz game. Look at 10 composite human faces,
          drop your pin on the world map, and see how close each guess lands.
          The same 10 questions are served to every player each day.
        </p>
      </header>
      <ClassicDailyGame />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
    </div>
  );
}
