import Breadcrumbs from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import CountriesGame from "@/components/game/CountriesGame";

export const metadata = buildMetadata({
  title: "Guess the Nationality Game - 48 Country Face Quiz",
  description:
    "Play Guess the Nationality Game: identify 48 country average faces by dropping your pin on the world map. A free geography face quiz with instant scoring.",
  path: "/play/countries",
});

const gameJsonLd = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: "Guess the Nationality Game",
  description:
    "Guess the nationality game with 48 country average faces. Pin each country on the world map and score points by accuracy.",
  gameItem: "Country Average Face",
  numberOfPlayers: "1",
  numberOfQuestions: "48",
  gameLocation: "World",
};

/**
 * Countries 模式游戏页（服务端外壳）。
 * - metadata + JSON-LD Game schema 在服务端注入
 * - 唯一 H1（主词 "guess the nationality game"）
 * - 游戏交互由客户端容器 CountriesGame 承载
 */
export default function CountriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Play", url: "/play/classic-daily" },
          { name: "Countries", url: "/play/countries" },
        ]}
      />
      <header className="flex flex-col gap-3 rounded-3xl bg-white border border-stone-200 shadow-premium p-6 sm:p-7">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Game mode
        </span>
        <h1 className="m-0 text-2xl sm:text-3xl font-bold text-stone-900">
          Guess the Nationality Game - 48 Country Faces
        </h1>
        <p className="m-0 text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl">
          Guess the Nationality Game challenges you to place 48 country average
          faces on the world map. Look at each composite face, drop your pin
          where you think the country is, and earn points for accuracy. A free
          geography face quiz you can replay anytime.
        </p>
        <a
          href="#game"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-stone-900 text-white font-medium shadow-premium hover:bg-stone-800 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium w-full sm:w-auto"
        >
          Start
        </a>
      </header>
      <div id="game" className="scroll-mt-24">
        <CountriesGame />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
    </div>
  );
}
