import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Editorial Policy - Data Sources & Review",
  description:
    "Editorial Policy for Ethnicity Guesser: phenotype data sources, cross-validation review process, accuracy standards, correction handling, and citation policy.",
  path: "/editorial-policy",
});

/**
 * /editorial-policy 信任页（服务端组件 + SSG）。
 * 哥飞方法论：单一 H1，H2 罗列章节，正文写在 <p>，无 keywords meta。
 * 数据来源：humanphenotypes.net / 复旦大学金力团队 / 国家民委图鉴 / Wikipedia average face。
 * 审核流程：交叉验证 + 学术引用 + 定期更新。
 */
export default function EditorialPolicyPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Editorial Policy", url: `${SITE_URL}/editorial-policy` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl">
        <h1 className="m-0 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Editorial Policy
        </h1>

        <p className="m-0 text-base text-gray-700 leading-relaxed">
          This Editorial Policy explains how Ethnicity Guesser selects
          sources, reviews content, and handles corrections. Because the site
          covers human phenotypes, a topic that sits at the edge of
          anthropology, history, and identity politics, we treat editorial
          discipline as a first-class concern, not an afterthought. The policy
          applies to every phenotype entry, country average face article, and
          quiz question on the site.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">Data Sources</h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            The phenotype catalogue is compiled from publicly available
            anthropology references and rewritten in plain English. The
            primary source for phenotype descriptions and composite faces is{" "}
            <a
              href="https://humanphenotypes.net"
              className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
              rel="noopener noreferrer"
              target="_blank"
            >
              Human Phenotypes
            </a>
            , a long-running public reference that documents recurring sets
            of physical traits across populations. Country average faces are
            synthesized from composite face projects hosted on{" "}
            <a
              href="https://en.wikipedia.org"
              className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
              rel="noopener noreferrer"
              target="_blank"
            >
              Wikipedia
            </a>{" "}
            and related public archives, which themselves aggregate published
            composite-face studies.
          </p>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            For East Asian population history in particular, we cross-reference
            peer-reviewed genetics research, including work from the Fudan
            University Jin Li group on the demographic history of Han Chinese
            and neighboring populations. For ethnographic detail on China&apos;s
            recognized ethnic groups, we reference the national ethnic
            compendia published by China&apos;s State Ethnic Affairs
            Commission. Where a phenotype&apos;s region or trait description
            depends on a single source, we flag that uncertainty in the entry
            rather than presenting it as established fact.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Review Process
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Every phenotype entry goes through a lightweight review process
            before publication. The process has three stages. First, the
            compiler collects the source material and drafts the plain-English
            description, region center, and trait list. Second, an editor
            cross-checks the draft against at least one independent source,
            verifies that the region center falls inside the historically
            documented range for the phenotype, and removes any language that
            reads as racial stereotyping rather than geographic description.
            Third, the entry is checked against the disclaimer template to
            make sure it frames the phenotype as a historical appearance
            pattern, not a modern identity label.
          </p>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Reader-reported inaccuracies go through the same review process.
            When a reader emails us through the{" "}
            <Link
              href="/contact"
              className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
            >
              Contact
            </Link>{" "}
            page with a specific correction and a verifiable source, we
            re-run the cross-check stage and update the entry if the source
            checks out. We do not promise to act on every report, but we read
            every one and we keep a log of reports and outcomes.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Accuracy Standards
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            We aim for accuracy at the level of a serious educational
            reference, not a peer-reviewed journal. Concretely, that means:
            phenotype names follow the convention used by Human Phenotypes;
            region centers fall inside the historically documented range for
            the phenotype and are anchored to roughly 1500 years ago, not to
            modern borders; trait descriptions are drawn from the source and
            rewritten without exaggeration; and every entry explicitly states
            that the phenotype estimates appearance, not DNA ancestry or
            personal identity. We do not claim that phenotype boundaries are
            sharp, that any individual matches a phenotype, or that the
            historical distributions are still accurate today.
          </p>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Where sources disagree, we default to the more conservative
            description and note the disagreement in the entry. Where a
            phenotype is poorly documented or politically sensitive, we either
            omit it or publish it with an explicit caveat and a shorter
            description. We never invent trait descriptions or region centers
            to fill gaps.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Updates &amp; Corrections
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Entries are reviewed on a rolling basis and re-published whenever
            a correction is accepted. We do not maintain a public changelog,
            but every corrected entry carries an internal note of what changed
            and why, so future editors can see the reasoning. If a correction
            is material, for example a region center moving by more than a
            few hundred kilometers or a trait description changing
            substantially, we also re-check the related game questions to make
            sure the quiz still scores fairly.
          </p>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            If you believe an entry is wrong, please send the page URL, the
            specific text you disagree with, and a source we can verify to{" "}
            <a
              href="mailto:hello@ethnicity-guesser.com"
              className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
            >
              hello@ethnicity-guesser.com
            </a>
            . Reports with verifiable sources are prioritized over reports
            without them.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Citation Policy
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            You are welcome to quote short excerpts from any Ethnicity Guesser
            page for non-commercial educational purposes, with attribution and
            a link back to the original page. The composite face images and
            phenotype photographs shown on the site are sourced from
            third-party public references; the copyright in those images
            remains with their respective owners, and any reuse must comply
            with the license terms set by the original source, which we link
            to wherever possible. If you want to cite Ethnicity Guesser in an
            academic or journalistic context, please cite the page URL and the
            access date, and verify any underlying claim against the linked
            primary source rather than treating our plain-English summary as
            authoritative.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">Contact</h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Questions about this Editorial Policy, including source
            suggestions and correction reports, can be sent to{" "}
            <a
              href="mailto:hello@ethnicity-guesser.com"
              className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
            >
              hello@ethnicity-guesser.com
            </a>
            . The full disclaimer that frames every entry is on the{" "}
            <Link
              href="/disclaimer"
              className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
            >
              Disclaimer
            </Link>{" "}
            page.
          </p>
        </section>
      </article>
    </div>
  );
}
