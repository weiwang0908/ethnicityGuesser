import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = buildMetadata({
  title: "Ethnicity Guesser — Daily Ethnicity Quiz",
  description:
    "Ethnicity Guesser is a free daily ethnicity quiz and ethnoguessr-style face game. Guess ethnicity by face on the world map, browse 240 human phenotypes with origins, and play the daily ethnicity quiz online — no sign-up, free on mobile and desktop.",
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

/**
 * 12 条完整 FAQ — 内嵌于首页 #faq 锚点，集中关键词权重，
 * 并通过 FAQPage JSON-LD 提升 rich snippet 命中率。
 */
const faqItems: { question: string; answer: string }[] = [
  {
    question: "Is Ethnicity Guesser free?",
    answer:
      "Yes. Ethnicity Guesser is completely free to play. There is no sign-up, no paywall, and no premium tier. All three game modes (Classic Daily, Challenge, and Countries), the 240-entry phenotype encyclopedia, and the country average face gallery are open to everyone on every device.",
  },
  {
    question: "How accurate are the phenotypes?",
    answer:
      "The phenotypes are based on historical anthropology references and reflect distributions from roughly 1500 years ago, not modern borders or DNA ancestry. They describe broad appearance patterns across populations, not individual identity. Treat them as a geography and anthropology learning aid, not a genetic test. Where sources disagree, we default to the more conservative description.",
  },
  {
    question: "Is this based on DNA or appearance?",
    answer:
      "Appearance. A phenotype is a recurring set of visible physical traits such as skull shape, skin tone, hair form, and eye color, not a genetic haplogroup and not a genealogy. A person who visibly matches a phenotype may carry DNA from many different populations, and a person whose DNA matches a population may not visibly match the associated phenotype. If you want your DNA ancestry, you need a genetic test.",
  },
  {
    question: "Can this determine my personal ethnicity?",
    answer:
      "No. Ethnicity Guesser is not suitable for determining individual racial or ethnic identity. Composite faces and phenotype descriptions describe broad patterns across populations, not any specific person. You cannot use this site to look at a real person, including yourself, and assign them a race, ethnicity, or nationality. Attempting to do so misuses the site.",
  },
  {
    question: "Where does the phenotype data come from?",
    answer:
      "The phenotype catalogue is compiled from publicly available anthropology references, with the primary source being Human Phenotypes (humanphenotypes.net). Country average faces are synthesized from composite face projects hosted on Wikipedia and related public archives. For East Asian population history we cross-reference peer-reviewed research, including work from the Fudan University Jin Li group, and the national ethnic compendia published by China's State Ethnic Affairs Commission. Full details are on the Editorial Policy page.",
  },
  {
    question: "How does the daily ethnicity quiz work?",
    answer:
      "Classic Daily serves the same ten faces to every player each day. A composite face appears on screen, you click where you think that phenotype most commonly appears on the world map, and the game scores you by distance. After ten questions you see your final score on a 5000-point scale, the correct locations, the distance errors, and a short phenotype description for each round. Your daily streak is stored locally in your browser.",
  },
  {
    question: "Is my data stored when I play?",
    answer:
      "Only your daily streak and local game progress, and only in your own browser through localStorage. Nothing leaves your device, there is no account, and clearing your browser data erases it completely. The site uses cookie-free Plausible Analytics for aggregate traffic counts only. See the Privacy Policy page for the full details.",
  },
  {
    question: "Can I use my own photos?",
    answer:
      "Not yet. The AI face analysis tool that would let you upload a photo is coming soon. It has been deferred from the initial launch to make sure the privacy and educational framing are right before it ships. When it launches, uploaded photos will be processed transiently and never persisted on our servers, as described in the Privacy Policy.",
  },
  {
    question: "What does the score mean?",
    answer:
      "Each question is scored by distance with a distance-decay function plus a small speed bonus, on a 5000-point scale across a full game. A near-perfect pin scores around five hundred points for that question and a wrong-continent guess scores near zero. The score rewards both knowing the right region and placing your pin precisely, so a confident guess that lands two thousand kilometers off still scores poorly.",
  },
  {
    question: "How often is new content added?",
    answer:
      "The phenotype encyclopedia and country face gallery are reviewed on a rolling basis and re-published whenever a correction is accepted. New phenotype entries and new country faces are added when we find a reliable public source for them; we do not publish entries to fill gaps when the underlying data is thin. If you have a source suggestion, send it through the Contact page.",
  },
  {
    question: "Is this racist or discriminatory?",
    answer:
      "No. Ethnicity Guesser is an educational anthropology project, not a racial identification tool. Every entry explicitly states that phenotypes describe historical appearance patterns from roughly 1500 years ago, not modern identity, and the site is not suitable for determining individual racial or ethnic identity. We remove language that reads as stereotyping rather than geographic description during the editorial review process. If you spot content that crosses that line, please report it.",
  },
  {
    question: "How can I report an inaccuracy?",
    answer:
      "Email hello@ethnicity-guesser.com with the page URL, the specific text you disagree with, and a verifiable source. Reports with verifiable sources are prioritized over reports without them. We read every report and route accepted corrections through the review process described on the Editorial Policy page.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ethnicity Guesser",
  url: "https://www.ethnicity-guesser.com",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free daily ethnicity quiz and ethnoguessr-style face game. Guess ethnicity by face on the world map, browse 240 human phenotypes with origins.",
};

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <div className="flex flex-col gap-24 sm:gap-32">
      {/* Hero — warm radial glow on off-white */}
      <section className="relative -mx-4 -mt-6 px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 bg-hero-glow">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur border border-stone-200/80 shadow-premium text-xs font-medium text-stone-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            240 phenotypes · 48 countries · free daily ethnicity quiz
          </div>
          <h1 className="m-0 text-5xl sm:text-7xl lg:text-8xl font-semibold text-stone-900 tracking-tightest leading-[1] max-w-4xl">
            Ethnicity Guesser
          </h1>
          <p className="m-0 text-lg sm:text-xl text-stone-500 leading-relaxed max-w-2xl">
            A free daily ethnicity quiz and ethnoguessr-style face game.
            Look at a composite face, drop a pin on the world map, and learn
            about 240 human phenotypes — no sign-up needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <Link
              href="/play/classic-daily"
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-stone-900 text-white font-medium shadow-premium hover:bg-stone-800 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium"
            >
              Play Daily Game
            </Link>
            <Link
              href="/phenotypes"
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-white/80 backdrop-blur border border-stone-200 text-stone-900 font-medium shadow-premium hover:bg-white hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium"
            >
              Browse Phenotypes
            </Link>
          </div>
        </div>
      </section>

      {/* What is Ethnoguessr — long-form SEO content block */}
      <section className="flex flex-col gap-6 max-w-3xl">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          About the game
        </span>
        <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          What is an ethnoguessr game?
        </h2>
        <div className="flex flex-col gap-4 text-base text-stone-600 leading-relaxed">
          <p className="m-0">
            Ethnoguessr is a portmanteau of <em>ethnicity</em> and{" "}
            <em>GeoGuessr</em>. It describes a category of browser game where
            you look at a face — usually a composite average built from many
            photos of a population — and guess where on the world map that
            face is most common. Ethnicity Guesser is a free daily ethnicity
            quiz built in that tradition, with a 240-entry phenotype
            encyclopedia behind it.
          </p>
          <p className="m-0">
            Each round of the ethnicity quiz works the same way: a composite
            face appears, you drop a pin on the world map where you think
            that phenotype most commonly appears, and the game scores you by
            the distance between your pin and the reference region. A
            near-perfect pin scores high, a wrong-continent guess scores
            near zero. After ten questions you see your total on a 5000-point
            scale, the correct locations, the distance errors, and a short
            anthropology description for each round.
          </p>
          <p className="m-0">
            Ethnicity Guesser is not a DNA test and not a racial
            identification tool. The phenotypes describe broad historical
            appearance patterns from roughly 1,500 years ago, not modern
            nationality, genetic ancestry, or personal identity. They are a
            geography and anthropology learning aid, and the game is built
            for curiosity-driven exploration of how human populations vary
            across the world.
          </p>
        </div>
      </section>

      {/* Featured Phenotypes — clean white panel with soft warm tint */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
              Catalog
            </span>
            <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Featured human phenotypes
            </h2>
            <p className="m-0 text-base text-stone-500 max-w-xl">
              Six entries from a catalog of 240 human phenotypes, each with a
              composite average face, region of origin, and a short
              anthropology description. Click any face to read its full
              entry, or browse the complete phenotype encyclopedia.
            </p>
          </div>
          <Link
            href="/phenotypes"
            className="text-sm font-medium text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors shrink-0"
          >
            Browse all 240 phenotypes
          </Link>
        </div>
        <ul className="m-0 p-0 list-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {featuredPhenotypes.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/phenotype/${p.slug}`}
                className="flex flex-col gap-2.5 group"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-stone-100 shadow-premium group-hover:shadow-premium-hover transition-all duration-300 ease-premium">
                  <Image
                    src={p.image_url}
                    alt={`${p.name} phenotype average face composite`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-premium"
                  />
                </div>
                <div className="flex flex-col px-0.5">
                  <span className="font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
                    {p.name}
                  </span>
                  <span className="text-xs text-stone-500">{p.region}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Game Modes — Bento with warm dark hero card + soft white companions */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
            Game modes
          </span>
          <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            Three ways to play the ethnicity quiz
          </h2>
          <p className="m-0 text-base text-stone-500 max-w-xl">
            Pick the pace that fits your mood. Every mode uses the same
            simple loop — face, map, score — and every mode is free with no
            sign-up. Classic Daily is the main daily ethnicity quiz,
            Challenge is a no-timer marathon through the full phenotype
            catalog, and Countries Mode is a lighter, geography-first
            variant using country flags.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <Link
            href="/play/classic-daily"
            className="group relative overflow-hidden flex flex-col justify-between gap-8 p-7 sm:p-9 rounded-4xl bg-premium-dark text-white shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 ease-premium md:row-span-2 md:min-h-[420px]"
          >
            <div className="flex flex-col gap-3 relative z-10">
              <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium tracking-wide">
                Daily ethnicity quiz
              </span>
              <h3 className="m-0 text-3xl font-semibold tracking-tight">
                Classic Daily
              </h3>
              <p className="m-0 text-stone-300 leading-relaxed max-w-sm">
                Ten new composite faces every day, identical for every
                player. The main daily ethnicity quiz mode — the best choice
                for a quick five-minute routine, friendly score
                comparisons, and building a daily streak.
              </p>
            </div>
            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 ease-premium relative z-10">
              Play the daily ethnicity quiz →
            </span>
          </Link>
          <Link
            href="/play/challenge"
            className="group flex flex-col gap-3 p-6 sm:p-7 rounded-4xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-stone-300 transition-all duration-300 ease-premium"
          >
            <h3 className="m-0 text-xl font-semibold text-stone-900">
              Challenge Mode
            </h3>
            <p className="m-0 text-sm text-stone-500 leading-relaxed">
              Thirty-eight phenotypes, no timer, no daily limit. A quiet
              marathon through the full phenotype catalog for players who
              want to study every face without the clock.
            </p>
            <span className="text-sm font-medium text-stone-900 mt-auto group-hover:text-amber-800 group-hover:translate-x-1 transition-all duration-300 ease-premium">
              Start Challenge →
            </span>
          </Link>
          <Link
            href="/play/countries"
            className="group flex flex-col gap-3 p-6 sm:p-7 rounded-4xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-stone-300 transition-all duration-300 ease-premium"
          >
            <h3 className="m-0 text-xl font-semibold text-stone-900">
              Countries Mode
            </h3>
            <p className="m-0 text-sm text-stone-500 leading-relaxed">
              Forty-eight country flags on the map instead of composite
              faces. A lighter, geography-first way to play the ethnicity
              quiz for players who want a softer entry point.
            </p>
            <span className="text-sm font-medium text-stone-900 mt-auto group-hover:text-amber-800 group-hover:translate-x-1 transition-all duration-300 ease-premium">
              Play Countries →
            </span>
          </Link>
        </div>
      </section>

      {/* Country Flags — alternating warm tinted section */}
      <section className="relative -mx-4 px-4 py-10 sm:py-14 rounded-none bg-section-soft border-y border-stone-200/70">
        <div className="flex flex-col sm:flex-row gap-10 sm:items-center">
          <div className="flex flex-col gap-4 sm:flex-1">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
              Geography
            </span>
            <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Guess countries by flag
            </h2>
            <p className="m-0 text-base text-stone-500 leading-relaxed max-w-md">
              Forty-eight country flags on the world map, paired with a
              short country profile and an average face where a public
              composite exists. Click any flag to read about that nation,
              then test yourself in Countries Mode — a geography-first
              variant of the ethnicity quiz.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/country"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full bg-stone-900 text-white text-sm font-medium shadow-premium hover:bg-stone-800 active:scale-[0.98] transition-all duration-300 ease-premium"
              >
                Open country gallery
              </Link>
              <Link
                href="/play/countries"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full bg-white border border-stone-200 text-stone-900 text-sm font-medium shadow-premium hover:bg-stone-50 active:scale-[0.98] transition-all duration-300 ease-premium"
              >
                Play Countries Mode
              </Link>
            </div>
          </div>
          <div className="sm:flex-1 grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { name: "Japan", slug: "japan" },
              { name: "Brazil", slug: "brazil" },
              { name: "Germany", slug: "germany" },
              { name: "Nigeria", slug: "nigeria" },
            ].map((country) => (
              <Link
                key={country.slug}
                href={`/country/${country.slug}`}
                className="group relative flex items-center justify-center aspect-[4/3] overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-stone-300 transition-all duration-300 ease-premium"
              >
                <Image
                  src={`/countries/${country.slug}.png`}
                  alt={`${country.name} country flag`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-premium"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — warm tinted cards */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
            How it works
          </span>
          <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            How the ethnicity quiz works
          </h2>
          <p className="m-0 text-base text-stone-500 max-w-xl">
            One loop, about five minutes a round. A little anthropology
            mixed into a geography game — built for curiosity-driven
            exploration, not for assigning anyone a race or identity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover transition-all duration-300 ease-premium">
            <span className="text-xs font-semibold text-amber-700 tracking-widest">
              01
            </span>
            <h3 className="m-0 text-lg font-semibold text-stone-900">
              See the composite face
            </h3>
            <p className="m-0 text-sm text-stone-500 leading-relaxed">
              Study the composite average face — skin tone, hair form,
              facial structure, and other visible phenotype traits — for
              clues about its historical region of origin.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover transition-all duration-300 ease-premium">
            <span className="text-xs font-semibold text-amber-700 tracking-widest">
              02
            </span>
            <h3 className="m-0 text-lg font-semibold text-stone-900">
              Drop your pin
            </h3>
            <p className="m-0 text-sm text-stone-500 leading-relaxed">
              Click the world map where you think that phenotype most
              commonly appears. The closer your pin lands to the reference
              region, the higher your score.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover transition-all duration-300 ease-premium">
            <span className="text-xs font-semibold text-amber-700 tracking-widest">
              03
            </span>
            <h3 className="m-0 text-lg font-semibold text-stone-900">
              Learn the answer
            </h3>
            <p className="m-0 text-sm text-stone-500 leading-relaxed">
              See the real region, the distance error, your round score,
              and a short anthropology description of the phenotype — built
              as a learning aid, not a label for any person.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — full 12 items inlined on homepage for keyword density */}
      <section id="faq" className="flex flex-col gap-8 scroll-mt-24">
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            Ethnicity Guesser FAQ — frequently asked questions
          </h2>
          <p className="m-0 text-base text-stone-500 leading-relaxed">
            Quick answers to the questions players ask most about Ethnicity
            Guesser: how the daily ethnicity quiz works, where the phenotype
            data comes from, what the score means, and how the site handles
            privacy and accuracy. If your question is not answered here,
            reach out through the{" "}
            <Link
              href="/contact"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors"
            >
              Contact
            </Link>{" "}
            page.
          </p>
        </div>
        <FaqAccordion items={faqItems} />
      </section>

      {/* Disclaimer — warm tinted panel */}
      <section className="p-6 sm:p-7 rounded-4xl bg-section-soft border border-stone-200/70 shadow-premium">
        <h2 className="m-0 text-xs font-semibold text-stone-900 uppercase tracking-widest">
          Disclaimer
        </h2>
        <p className="m-0 mt-3 text-sm text-stone-500 leading-relaxed max-w-3xl">
          Ethnicity Guesser is an educational geography and anthropology
          game. Phenotypes and country average faces describe historical
          appearance patterns from roughly 1,500 years ago, not modern
          nationality, DNA ancestry, or individual identity. See our{" "}
          <Link
            href="/disclaimer"
            className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors"
          >
            full disclaimer
          </Link>{" "}
          and{" "}
          <Link
            href="/editorial-policy"
            className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
    </div>
  );
}
