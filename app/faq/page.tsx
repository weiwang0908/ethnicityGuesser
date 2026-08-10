import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "FAQ - Is AI Ethnicity Guesser Accurate?",
  description:
    "Frequently asked questions about Ethnicity Guesser: is it free, how accurate are phenotypes, is it DNA or appearance, where data comes from, and how the daily quiz works.",
  path: "/faq",
});

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * 12 个 FAQ 项（任务要求 10+）。
 * 文案与首页 FAQ 一致但更长，回答教育型人类学立场、AI 工具即将上线等关键点。
 */
const faqItems: FaqItem[] = [
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
    question: "How does the daily quiz work?",
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

/**
 * /faq 信任页（服务端组件 + SSG）。
 * 哥飞方法论：单一 H1，每个 FAQ 用 H2 问题 + <p> 回答，FAQPage JSON-LD 注入。
 */
export default function FaqPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "FAQ", url: `${SITE_URL}/faq` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl">
        <h1 className="m-0 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Frequently Asked Questions - Ethnicity Guesser
        </h1>

        <p className="m-0 text-base text-gray-700 leading-relaxed">
          Quick answers to the questions players ask most about Ethnicity
          Guesser: how the quiz works, where the phenotype data comes from,
          what the score means, and how the site handles privacy and
          accuracy. If your question is not here, reach out through the{" "}
          <Link
            href="/contact"
            className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
          >
            Contact
          </Link>{" "}
          page.
        </p>

        <div className="flex flex-col gap-6">
          {faqItems.map((item) => (
            <section key={item.question} className="flex flex-col gap-2">
              <h2 className="m-0 text-xl sm:text-2xl font-bold text-gray-900">
                {item.question}
              </h2>
              <p className="m-0 text-base text-gray-700 leading-relaxed">
                {item.answer}
              </p>
            </section>
          ))}
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
    </div>
  );
}
