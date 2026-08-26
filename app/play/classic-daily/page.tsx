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
      <header className="flex flex-col gap-3 rounded-3xl bg-white border border-stone-200 shadow-premium p-6 sm:p-7">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Game mode
        </span>
        <h1 className="m-0 text-2xl sm:text-3xl font-bold text-stone-900">
          Ethnoguessr Game - Daily Ethnicity Quiz
        </h1>
        <p className="m-0 text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl">
          A free daily ethnicity quiz game. Look at 10 composite human faces,
          drop your pin on the world map, and see how close each guess lands.
          The same 10 questions are served to every player each day.
        </p>
        <a
          href="#game"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-stone-900 text-white font-medium shadow-premium hover:bg-stone-800 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium w-full sm:w-auto"
        >
          Start
        </a>
      </header>
      <div id="game" className="scroll-mt-24">
        <ClassicDailyGame />
      </div>
      <article className="flex flex-col gap-6 rounded-3xl bg-white border border-stone-200 shadow-premium p-6 sm:p-8">
        <div className="prose prose-stone max-w-none">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            What Is the Ethnicity Guesser?
          </h2>
          <p>
            The Ethnicity Guesser is a free, map-based daily quiz that tests how
            well you can read a human face. Anyone who has tried EthnoGuessr
            will recognise the format instantly. Each day it serves ten composite
            faces built from real population samples, and your job is to drop a
            pin on the world map where you believe that face comes from. The
            closer your guess, the more points you earn, up to a perfect score
            of five thousand. Unlike trivia games that ask random facts, the
            Ethnicity Guesser is built around a single, elegant question: can
            you look at a face and tell where its ancestry lies? For fans of the
            EthnoGuessr brand, the daily round is the familiar, quick-fire
            format they know best.
          </p>
          <p>
            The Ethnicity Guesser was designed to be played in about three
            minutes, so it fits naturally into a morning coffee or a short
            break. There is no account to create, no download to install, and no
            streak you need to protect. You simply open the page, press Start,
            and let your eye lead the way. Because every player sees the same
            ten questions on the same day, you can compare results with friends
            and argue about why one face clearly looked Mediterranean and not
            Northern European.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            How the Ethnicity Guesser Scores Your Guesses
          </h2>
          <p>
            Scoring on the Ethnicity Guesser rewards both accuracy and honesty.
            The game measures the actual geographic distance between your pin
            and the real region of each face. It is the same distance-based
            logic EthnoGuessr fans have grown to trust. Drop the pin near the centre of
            the correct country and you are rewarded generously; land it on the
            wrong continent and you earn very little. The Ethnicity Guesser
            never hides a result behind a right-or-wrong binary, so even a
            partial guess teaches you something about geography and population
            history.
          </p>
          <p>
            Ten questions, five thousand points, and a daily reset sound simple,
            but the game has a surprising amount of depth. It is the kind of
            depth EthnoGuessr players revisit daily. Some faces are
            deliberately subtle, blending features from two neighbouring
            regions, and these are the moments where the Ethnicity Guesser
            becomes genuinely challenging. You learn to weigh skin tone against
            bone structure, hair texture against eye shape, and a hundred small
            visual clues that most of us absorb without ever naming.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Where the Phenotypes Come From
          </h2>
          <p>
            Pop quiz games often borrow generic celebrity photos, but the
            Ethnicity Guesser takes a more scientific route. EthnoGuessr was
            built on the same composite-face method. Each face in the
            daily round is a composite created by averaging many individual
            portraits from a defined population. This is the same photographic
            technique used in anthropology and forensic research, and it gives
            the EthnoGuessr experience its distinctive look. Instead of one
            person who may not represent a nation, you see the distilled
            features of a whole group.
          </p>
          <p>
            Because the source data changes per round, the Ethnicity Guesser
            stays fresh long after you memorise the classic European and East
            Asian faces. New regions rotate in and out of the daily mix, and
            dedicated players begin to recognise the patterns behind each
            phenotype. Whether you play the EthnoGuessr daily challenge for a
            quick check of your skills or over several weeks to chase a perfect
            round, the variety keeps the map interesting.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Tips to Improve Your Daily Score
          </h2>
          <p>
            New players often panic between the composite faces, but a calm
            method pays off. Start by reading the whole face before you touch
            the map. Ask yourself which continent the skin tone and bone
            structure point towards, then narrow down the country. A quick
            EthnoGuessr habit is to commit to your first strong impression. The
            Ethnicity Guesser rewards that two-step approach far more than
            guessing at random, and a steady process beats a rushed instinct
            every time.
          </p>
          <p>
            When you are unsure, trust geography over stereotypes. Faces from
            high latitudes are often lighter, while equatorial populations tend
            to show more depth of colour, but climate is only one clue. The
            Ethnicity Guesser is a game of probability, not certainty, so a
            thought-out guess near a border is usually smarter than a wild pin
            in the middle of nowhere. Reviewing your results after each round is
            the fastest way to improve, because the answer map shows you exactly
            where reality ended up.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Why People Keep Coming Back
          </h2>
          <p>
            Part of the appeal is routine. Like the best puzzle games, the
            EthnoGuessr daily mode gives you a reason to return every single
            day. There is always one round waiting, always a number to beat, and
            always a new set of faces that are just different enough to keep you
            honest. You do not need to grind for hours, which makes it an ideal
            companion for people who love geography but have busy schedules.
          </p>
          <p>
            The other part is community. Because the Ethnicity Guesser shares
            the same questions worldwide, discussions spring up around each
            daily answer. Was question four actually from the Balkans? Why did
            the last face read as Andean to everyone in the chat? These debates
            turn a simple quiz into a shared ritual, and they are exactly the
            reason the Ethnicity Guesser feels bigger than a normal meme photo
            game, and a big part of why EthnoGuessr has such a loyal following.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Play It on Any Device
          </h2>
          <p>
            The EthnoGuessr game runs entirely in your browser, so there is
            nothing to install and no account to link. It works just as well on
            a phone during your commute as it does on a desktop monitor, and
            your progress saves automatically once you finish a round. The
            touch controls are built for one hand, which makes this one of the
            few geography games that feels comfortable on a small screen.
          </p>
          <p>
            The Ethnicity Guesser also loads quickly and respects your privacy.
            There is no forced login wall, no barrage of ads between questions,
            and no endless onboarding before you reach the map. You open the
            page, see the day’s ten faces, and play. That commitment to a clean,
            fast experience is a big reason players recommend the Ethnicity
            Guesser to friends who normally skip online quizzes entirely.
          </p>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
    </div>
  );
}
