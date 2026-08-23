import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service for Ethnicity Guesser. By using this free educational anthropology game you accept these terms on acceptable use, intellectual property, and disclaimer of liability.",
  path: "/terms",
});

/**
 * /terms 信任页（服务端组件 + SSG）。
 * 哥飞方法论：单一 H1，H2 罗列章节，正文写在 <p>，无 keywords meta。
 * 针对教育型人类学猜脸游戏定制，反复强调 educational & entertainment use only。
 */
export default function TermsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Terms", url: `${SITE_URL}/terms` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl rounded-4xl bg-section-soft border border-stone-200/70 p-6 sm:p-8 shadow-premium">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Terms
        </span>
        <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Terms of Service
        </h1>

        <p className="m-0 text-base text-stone-700 leading-relaxed">
          These Terms of Service govern your use of the Ethnicity Guesser
          website. By opening any page on the site, you agree to these terms.
          If you do not agree, please do not use the site. These terms are
          written in plain English and reflect the fact that Ethnicity Guesser
          is a free, no-login, educational project; they are not intended as
          legal advice and do not create any obligation beyond what applicable
          law already provides.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Acceptance of Terms
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            By accessing Ethnicity Guesser, you confirm that you have read,
            understood, and agreed to these Terms of Service and to the{" "}
            <Link
              href="/privacy-policy"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Privacy Policy
            </Link>
            . If you are under the age of sixteen, please use the site only
            with the involvement of a parent or guardian. We may update these
            terms from time to time; continued use after a change constitutes
            acceptance of the revised terms. The effective date is the date
            you load this page.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Use of Service
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser is provided free of charge for educational and
            entertainment purposes only. You may play the quiz, read the
            phenotype encyclopedia and country face gallery, and share links
            to pages for non-commercial purposes. You agree not to misuse the
            site, which includes but is not limited to: attempting to disrupt
            or overload the service, scraping content at volume, using the
            site to harass or demean any individual or group, or
            misrepresenting phenotype data as a basis for racial, ethnic, or
            national classification of real people.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The site is an educational anthropology resource, not a tool for
            determining individual racial or ethnic identity. You agree to
            treat every phenotype description as a historical and geographic
            generalization, not as a statement about any specific person. See
            the{" "}
            <Link
              href="/disclaimer"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Disclaimer
            </Link>{" "}
            page for the full educational-use statement.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Intellectual Property
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The site&apos;s written content, page layout, code, and original
            illustrations are owned by Ethnicity Guesser and are provided for
            personal, non-commercial, educational use. You may quote short
            excerpts with attribution and a link back to the original page.
            Composite face images and phenotype photographs shown on the site
            are sourced from third-party public references such as Human
            Phenotypes and Wikimedia Commons; the copyright in those images
            remains with their respective owners, and any reuse of those
            images must comply with the license terms set by the original
            source, which we link to wherever possible.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            We respect intellectual property rights. If you believe any
            content on the site infringes your copyright, please contact us
            through the{" "}
            <Link
              href="/contact"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Contact
            </Link>{" "}
            page with the URL and proof of ownership, and we will review and
            remove the content where appropriate.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Disclaimer of Liability
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser is provided on an &quot;as is&quot; and
            &quot;as available&quot; basis without warranties of any kind,
            whether express or implied. To the maximum extent permitted by
            applicable law, we are not liable for any direct, indirect,
            incidental, consequential, or special damages arising from your
            use of, or inability to use, the site. This includes but is not
            limited to loss of data, loss of game progress stored in your
            browser, or any consequence of treating phenotype descriptions as
            a basis for real-world decisions about yourself or others.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The phenotype encyclopedia reflects historical distributions from
            roughly 1500 years ago and estimates appearance, not DNA ancestry
            or personal identity. It is not suitable for determining
            individual racial or ethnic identity, and we accept no liability
            for any such use. Nothing on the site constitutes medical,
            genetic, legal, or anthropological advice.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Changes to Terms
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            We may revise these Terms of Service at any time by updating this
            page. We will not notify users individually, because the site has
            no account system; instead, the effective date is the date you
            load this page. We encourage you to review these terms
            periodically. Material changes that affect acceptable use will be
            reflected in the text of this section.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Contact</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Questions about these Terms of Service can be sent to{" "}
            <a
              href="mailto:hello@ethnicity-guesser.com"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              hello@ethnicity-guesser.com
            </a>
            . For any formal notice that requires a response, please include
            &quot;Terms Notice&quot; in the subject line so we can route it
            correctly.
          </p>
        </section>
      </article>
    </div>
  );
}
