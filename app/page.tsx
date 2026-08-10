import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ethnicity Guesser - Daily Ethnicity Quiz & Phenotypes Game",
  description:
    "Play Ethnicity Guesser, a free ethnoguessr-style daily ethnicity quiz. Guess ethnicity by face on the world map and browse 240 human phenotypes with origins.",
  path: "/",
});

const featuredPhenotypes = [
  {
    slug: "hallstatt",
    name: "Hallstatt",
    region: "Northern Europe",
    image_url: "/phenotypes/hallstatt.jpg",
  },
  {
    slug: "huanghoid",
    name: "Huanghoid",
    region: "East Asia",
    image_url: "/phenotypes/huanghoid.jpg",
  },
  {
    slug: "north-indid",
    name: "North Indid",
    region: "South Asia",
    image_url: "/phenotypes/north-indid.jpg",
  },
  {
    slug: "central-bantuid",
    name: "Central Bantuid",
    region: "Sub-Saharan Africa",
    image_url: "/phenotypes/central-bantuid.jpg",
  },
  {
    slug: "iranid",
    name: "Iranid",
    region: "North Africa",
    image_url: "/phenotypes/iranid.jpg",
  },
  {
    slug: "deutero-malayid",
    name: "Deutero Malayid",
    region: "Southeast Asia",
    image_url: "/phenotypes/deutero-malayid.jpg",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ethnicity Guesser",
  url: "https://ethnicity-guesser.com",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free daily ethnicity quiz game. Guess ethnicity by face on the world map, browse 240 human phenotypes.",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 pt-10 pb-4">
        <h1 className="m-0 text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-950 tracking-tight leading-[1.1] max-w-4xl">
          Guess where a face comes from
        </h1>
        <p className="m-0 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
          A free daily ethnoguessr game. Look at a composite face, drop a pin on
          the map, and learn something about human phenotypes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <Link
            href="/play/classic-daily"
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-full bg-gray-950 text-white font-medium hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            Play Daily Game
          </Link>
          <Link
            href="/phenotypes"
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-full border border-gray-200 text-gray-950 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Browse Phenotypes
          </Link>
        </div>
      </section>

      {/* Featured Phenotypes */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-2xl sm:text-3xl font-semibold text-gray-950">
              Featured human phenotypes
            </h2>
            <p className="m-0 text-base text-gray-500 max-w-xl">
              Six entries from a catalog of 240. Click a face to read its origin
              and features.
            </p>
          </div>
          <Link
            href="/phenotypes"
            className="text-sm font-medium text-gray-950 underline underline-offset-4 hover:text-gray-600 shrink-0"
          >
            Browse all phenotypes
          </Link>
        </div>
        <ul className="m-0 p-0 list-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {featuredPhenotypes.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/phenotype/${p.slug}`}
                className="flex flex-col gap-2 group"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={p.image_url}
                    alt={`${p.name} phenotype average face composite`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="flex flex-col px-0.5">
                  <span className="font-medium text-gray-950 group-hover:underline">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-500">{p.region}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Game Modes - Bento */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="m-0 text-2xl sm:text-3xl font-semibold text-gray-950">
            Three ways to play
          </h2>
          <p className="m-0 text-base text-gray-500 max-w-xl">
            Pick the pace that fits your mood. Each mode uses the same simple
            loop: face, map, score.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/play/classic-daily"
            className="group flex flex-col justify-between gap-8 p-6 sm:p-8 rounded-3xl bg-gray-950 text-white hover:bg-gray-900 transition-colors md:row-span-2"
          >
            <div className="flex flex-col gap-3">
              <h3 className="m-0 text-2xl font-semibold">Classic Daily</h3>
              <p className="m-0 text-gray-300 leading-relaxed">
                Ten new faces every day, identical for every player. The best
                mode for a quick routine and friendly score comparisons.
              </p>
            </div>
            <span className="text-sm font-medium group-hover:underline underline-offset-4">
              Play Classic Daily →
            </span>
          </Link>
          <Link
            href="/play/challenge"
            className="group flex flex-col gap-3 p-6 rounded-3xl border border-gray-200 bg-white hover:border-gray-400 transition-colors"
          >
            <h3 className="m-0 text-xl font-semibold text-gray-950">
              Challenge Mode
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              Thirty-eight phenotypes, no timer. A quiet marathon through the
              full catalog.
            </p>
            <span className="text-sm font-medium text-gray-950 mt-auto group-hover:underline underline-offset-4">
              Start Challenge →
            </span>
          </Link>
          <Link
            href="/play/countries"
            className="group flex flex-col gap-3 p-6 rounded-3xl border border-gray-200 bg-white hover:border-gray-400 transition-colors"
          >
            <h3 className="m-0 text-xl font-semibold text-gray-950">
              Countries Mode
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              Forty-eight country flags on the map. A lighter, geography-first
              way to play.
            </p>
            <span className="text-sm font-medium text-gray-950 mt-auto group-hover:underline underline-offset-4">
              Play Countries →
            </span>
          </Link>
        </div>
      </section>

      {/* Country Flags */}
      <section className="flex flex-col sm:flex-row gap-8 sm:items-center">
        <div className="flex flex-col gap-3 sm:flex-1">
          <h2 className="m-0 text-2xl sm:text-3xl font-semibold text-gray-950">
            Guess countries by flag
          </h2>
          <p className="m-0 text-base text-gray-500 leading-relaxed max-w-md">
            Forty-eight flags on the world map. Click a flag to read about that
            nation, then test yourself in Countries Mode.
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            <Link
              href="/country"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full bg-gray-950 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Open Gallery
            </Link>
            <Link
              href="/play/countries"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full border border-gray-200 text-gray-950 text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Play Countries Mode
            </Link>
          </div>
        </div>
        <div className="sm:flex-1 grid grid-cols-2 gap-3">
          {[
            { name: "Japan", slug: "japan" },
            { name: "Brazil", slug: "brazil" },
            { name: "Germany", slug: "germany" },
            { name: "Nigeria", slug: "nigeria" },
          ].map((country) => (
            <Link
              key={country.slug}
              href={`/country/${country.slug}`}
              className="group relative flex items-center justify-center aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <Image
                src={`/countries/${country.slug}.png`}
                alt={`${country.name} country flag`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="m-0 text-2xl sm:text-3xl font-semibold text-gray-950">
            How it works
          </h2>
          <p className="m-0 text-base text-gray-500 max-w-xl">
            One loop. About five minutes. A little anthropology mixed into a
            geography game.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gray-50">
            <span className="text-xs font-medium text-gray-400">01</span>
            <h3 className="m-0 text-lg font-semibold text-gray-950">
              See the face
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              Study skin tone, hair form, and facial structure for clues about
              origin.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gray-50">
            <span className="text-xs font-medium text-gray-400">02</span>
            <h3 className="m-0 text-lg font-semibold text-gray-950">
              Drop your pin
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              Click the world map where you think that face is most common.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gray-50">
            <span className="text-xs font-medium text-gray-400">03</span>
            <h3 className="m-0 text-lg font-semibold text-gray-950">
              Learn the answer
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              See the real region, distance, score, and a short description.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-6">
        <h2 className="m-0 text-2xl sm:text-3xl font-semibold text-gray-950">
          Frequently asked questions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-base font-semibold text-gray-950">
              Is Ethnicity Guesser free?
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              Yes. No sign-up, no paywall. All game modes and the phenotype
              catalog are open.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-base font-semibold text-gray-950">
              What does ethnoguessr mean?
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              A blend of ethnicity and GeoGuessr. It describes this style of
              click-the-map face quiz.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-base font-semibold text-gray-950">
              How accurate are the phenotypes?
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              They reflect historical appearance patterns, not DNA ancestry or
              individual identity. Use them as a learning aid.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-base font-semibold text-gray-950">
              Can I play on mobile?
            </h3>
            <p className="m-0 text-sm text-gray-500 leading-relaxed">
              Yes. The game is built mobile-first, with touch targets at least
              44 pixels wide.
            </p>
          </div>
        </div>
        <p className="m-0 text-sm text-gray-500">
          Read the full{" "}
          <Link
            href="/faq"
            className="text-gray-950 font-medium underline underline-offset-4 hover:text-gray-600"
          >
            FAQ
          </Link>
          .
        </p>
      </section>

      {/* Disclaimer */}
      <section className="p-6 rounded-3xl bg-gray-50">
        <h2 className="m-0 text-xs font-semibold text-gray-950 uppercase tracking-widest">
          Disclaimer
        </h2>
        <p className="m-0 mt-3 text-sm text-gray-500 leading-relaxed max-w-3xl">
          Ethnicity Guesser is an educational geography and anthropology game.
          Phenotypes and country average faces describe historical appearance
          patterns from roughly 1,500 years ago, not modern nationality, DNA
          ancestry, or individual identity. See our{" "}
          <Link
            href="/disclaimer"
            className="text-gray-950 font-medium underline underline-offset-4 hover:text-gray-600"
          >
            full disclaimer
          </Link>{" "}
          and{" "}
          <Link
            href="/editorial-policy"
            className="text-gray-950 font-medium underline underline-offset-4 hover:text-gray-600"
          >
            editorial policy
          </Link>
          .
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
    </div>
  );
}
