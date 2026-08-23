import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Disclaimer - Educational Use Only",
  description:
    "Ethnicity Guesser is for educational and entertainment purposes only. Phenotypes reflect historical distributions from ~1500 years ago and estimate appearance, not DNA ancestry or personal identity.",
  path: "/disclaimer",
});

/**
 * /disclaimer 信任页（服务端组件 + SSG）。
 * YMYL 风控核心页：反复强调 educational & entertainment use only、
 * historical distributions from ~1500 years ago、estimates appearance not DNA ancestry、
 * not suitable for determining individual racial or ethnic identity。
 */
export default function DisclaimerPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Disclaimer", url: `${SITE_URL}/disclaimer` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl rounded-4xl bg-section-soft border border-stone-200/70 p-6 sm:p-8 shadow-premium">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Disclaimer
        </span>
        <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Disclaimer - Educational Use Only
        </h1>

        <p className="m-0 text-base text-stone-700 leading-relaxed">
          Ethnicity Guesser is an educational anthropology project. The
          phenotype encyclopedia, country average faces, and quiz questions on
          this site are provided for educational and entertainment purposes
          only. They are not a genetic test, a DNA ancestry report, or a tool
          for determining individual racial or ethnic identity. This page
          restates that disclaimer in detail so you can read it once and
          understand exactly what the site is and is not.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Educational Purpose
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser exists to help curious people build a mental map
            of human phenotypic variation across geography. The game is a hook
            for reading; the encyclopedia is the point. Everything on the site
            is for educational and entertainment purposes only. None of it is
            medical, genetic, legal, or anthropological advice, and none of it
            should be used to make any decision about yourself, your family,
            your ancestry, or anyone else.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Not DNA Ancestry
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The phenotype descriptions on this site estimate appearance, not
            DNA ancestry or personal identity. A phenotype is a recurring set
            of visible physical traits, not a genetic haplogroup and not a
            genealogy. A person who visibly matches a phenotype may carry DNA
            from many different populations, and a person whose DNA matches a
            population may not visibly match the phenotype typically
            associated with that population. If you want to know your DNA
            ancestry, you need a genetic test from a reputable DNA-testing
            service; Ethnicity Guesser cannot and does not provide one.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Historical Context
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The phenotype distributions shown on this site are based on
            historical distributions from roughly 1500 years ago, not on
            modern national borders or modern census categories. Populations
            have moved and mixed continuously over the last millennium and a
            half, so the region a phenotype is associated with on the map may
            not match the people you would meet in that region today. Treat
            every region center as a historical anchor point for study, not as
            a statement about who lives there now.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            No Personal Identification
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser is not suitable for determining individual
            racial or ethnic identity. Composite faces and phenotype
            descriptions describe broad patterns across populations, not any
            specific person. You cannot use this site to look at a real
            person, including yourself, and assign them a race, ethnicity, or
            nationality. Attempting to do so misuses the site and produces
            results that are not scientifically valid. If you encounter
            content on the site that seems to invite such misuse, please
            report it through the{" "}
            <Link
              href="/contact"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Contact
            </Link>{" "}
            page.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            External Links
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The site links out to public reference sources such as Human
            Phenotypes, Wikimedia Commons, and academic publications so you
            can verify the underlying data. We do not control the content of
            those external sites and are not responsible for their accuracy,
            licensing terms, or continued availability. Following an external
            link is your choice; if you want to reuse an image or text from a
            linked source, check that source&apos;s own license before doing
            so.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Contact</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            If you have a question about this disclaimer or want to report
            content that reads as stereotyping rather than education, email
            us at{" "}
            <a
              href="mailto:hello@ethnicity-guesser.com"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              hello@ethnicity-guesser.com
            </a>
            . We treat accuracy and tone reports seriously and route them
            through the review process described on the{" "}
            <Link
              href="/editorial-policy"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Editorial Policy
            </Link>{" "}
            page.
          </p>
        </section>
      </article>
    </div>
  );
}
