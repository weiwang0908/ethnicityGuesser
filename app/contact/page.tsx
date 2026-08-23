import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact Ethnicity Guesser for support, corrections, or feedback. Email hello@ethnicity-guesser.com for help with the quiz, phenotype data, or to report an inaccuracy.",
  path: "/contact",
});

/**
 * /contact 信任页（服务端组件 + SSG）。
 * 哥飞方法论：单一 H1，H2 罗列章节，正文写在 <p>，无 keywords meta。
 * MVP 只显示邮箱（不做表单），符合任务约束。
 */
export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Contact", url: `${SITE_URL}/contact` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Contact
        </span>
        <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Contact Ethnicity Guesser
        </h1>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Get in Touch</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            We read every message. Whether you have a question about the game,
            a correction to a phenotype entry, a translation offer, or just
            want to say hello, the simplest way to reach the Ethnicity Guesser
            team is by email. We are a small volunteer project, so replies may
            take a few days, but every message is read by a human.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Email us at{" "}
            <a
              href="mailto:hello@ethnicity-guesser.com"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              hello@ethnicity-guesser.com
            </a>
            . Please include the page URL or phenotype name if your message is
            about a specific entry, so we can find it quickly.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Support</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            For technical support, tell us which device, browser, and game mode
            you were using when the issue happened, and roughly what time it
            occurred. Ethnicity Guesser is a static site with no login, so we
            cannot look up your account, but a screenshot and a description of
            the steps you took usually let us reproduce the problem. Common
            questions about how the daily quiz works, what the score means,
            and whether your data is stored are answered on the{" "}
            <Link
              href="/#faq"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              FAQ
            </Link>{" "}
            section on the homepage, so it is worth checking there first.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Report an Issue
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Phenotype boundaries blur at every edge, historical distributions
            shift with migration, and our writing is not perfect. If you spot
            an inaccuracy in a phenotype description, a misplaced region
            center, a broken image, or anything that reads as stereotyping
            rather than education, please tell us. The most useful reports
            include the exact page URL, a short quote of the offending text,
            and a source we can verify. We treat every accuracy report
            seriously and route them through the review process described on
            the{" "}
            <Link
              href="/editorial-policy"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Editorial Policy
            </Link>{" "}
            page.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            For privacy or data protection requests, see the{" "}
            <Link
              href="/privacy-policy"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Privacy Policy
            </Link>{" "}
            page for the dedicated contact path. For anything else, the
            general inbox above works fine.
          </p>
        </section>
      </article>
    </div>
  );
}
