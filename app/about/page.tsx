import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "About - Our Mission & Data Sources",
  description:
    "About Ethnicity Guesser: a free educational anthropology face-guessing game and phenotype encyclopedia. Learn our mission, what we do, and where our data comes from.",
  path: "/about",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ethnicity Guesser",
  url: "https://www.ethnicity-guesser.com",
  description:
    "Educational anthropology face-guessing game and phenotype encyclopedia.",
};

/**
 * /about 信任页（服务端组件 + SSG）。
 * 哥飞方法论：单一 H1，H2 罗列章节，正文写在 <p>，无 keywords meta。
 */
export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          About
        </span>
        <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          About Ethnicity Guesser
        </h1>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Mission</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser exists to turn casual curiosity about human
            diversity into structured, respectful learning. The internet is
            full of face-guessing games that lean on stereotype and shock
            value; we wanted the opposite. Our mission is to build an
            educational anthropology face-guessing game that treats phenotypes
            as a historical and geographic subject, not as a tool for sorting
            people into racial boxes. Every page on the site is written so a
            curious newcomer can follow along without a degree in physical
            anthropology, and every game round ends with the correct answer,
            the distance error, and a short readable description so each play
            teaches something concrete.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            We also believe free, no-signup educational tools should not be a
            luxury. Ethnicity Guesser is free to play in every mode, on every
            device, with no account, no paywall, and no premium tier. The
            phenotype encyclopedia and the country average face gallery are
            open to everyone, because geography and anthropology literacy
            should not sit behind a login.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">What We Do</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser is part geography game, part anthropology primer.
            In the core quiz, a composite face appears on screen, you click
            where you think that phenotype most commonly appears on the world
            map, and the game scores you by distance. Three modes let you
            choose your pace: a relaxed daily challenge that serves the same
            ten faces to every player, an endless marathon that runs through
            the full phenotype catalogue, and a country-focused variant built
            around average faces of forty-eight nations.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Beyond the game, we maintain a phenotype encyclopedia of 240
            entries sourced from public anthropology references, plus a country
            average face gallery with a short population-history article for
            each country. Every entry carries an explicit disclaimer that
            phenotypes describe historical appearance patterns from roughly
            1500 years ago, not modern national identity, DNA ancestry, or
            individual race. The game is a hook; the reading is the point.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Data Sources</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Our phenotype data is compiled from publicly available
            anthropology references and rewritten in plain English. The
            primary source for the phenotype catalogue is{" "}
            <a
              href="https://humanphenotypes.net"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
              rel="noopener noreferrer"
              target="_blank"
            >
              Human Phenotypes
            </a>
            , a long-running public reference that documents recurring sets
            of physical traits across populations. Country average faces are
            synthesized from composite face projects hosted on Wikipedia and
            related public archives. We also cross-reference population
            genetics literature, including research from the Fudan University
            Jin Li group on East Asian population history, and ethnographic
            references such as the national ethnic compendia published by
            China&apos;s State Ethnic Affairs Commission.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            None of these sources are perfect or complete. Phenotype
            boundaries blur at every edge, historical distributions shift with
            migration, and any single composite face is a statistical
            impression, not a real person. We treat every source critically,
            cross-check dates and regions where possible, and link out to the
            original references so readers can verify for themselves. The full
            methodology is described on the{" "}
            <Link
              href="/editorial-policy"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Editorial Policy
            </Link>{" "}
            page.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Team</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser is a small independent project maintained by a
            volunteer team of geography and anthropology enthusiasts. We are
            not affiliated with any university, government, or commercial
            DNA-testing company. The team handles data compilation, writing,
            translation, and web development on a best-effort basis, and we
            actively welcome corrections, source suggestions, and translation
            help from readers. If you spot an inaccuracy or have a source we
            should add, please reach out through the{" "}
            <Link
              href="/contact"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Contact
            </Link>{" "}
            page.
          </p>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </div>
  );
}
