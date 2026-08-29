import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  allPhenotypes,
  buildLead,
  buildPhenotypeFaq,
  firstSentences,
  formatCoords,
  getNearbyEntries,
  physicalTraitPoints,
  pickVariant,
  splitDescription,
} from "@/lib/phenotypeContent";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";

interface Phenotype {
  id: string;
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  image_url: string;
  description: string;
  references: string[];
  source_url: string;
}

const data = allPhenotypes as Phenotype[];

/**
 * SSG: 预渲染全部 phenotype 详情页。
 * dynamicParams = false：未在 generateStaticParams 返回列表中的 slug 直接 404。
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return data.map((p) => ({ slug: p.slug }));
}

/**
 * 每页唯一 metadata（哥飞 TDH：主词前置，60–70 字符 title）。
 */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = data.find((x) => x.slug === params.slug);
  if (!p) {
    return buildMetadata({
      title: "Phenotype Not Found | Ethnicity Guesser",
      description: "The requested human phenotype could not be found.",
      path: "/phenotypes",
    });
  }
  const title = `${p.name} Phenotype - Face Features & Origin`;
  const description =
    p.description.slice(0, 157).trim() +
    (p.description.length > 157 ? "..." : "");
  // 不传 ogImage：由 colocated app/phenotype/[slug]/opengraph-image.tsx
  // 自动生成 1200×630 品牌化 OG 图（含 phenotype 名称）。
  return buildMetadata({
    title,
    description,
    path: `/phenotype/${p.slug}`,
  });
}

/**
 * /phenotype/[slug] 详情页（服务端组件 + SSG）。
 *
 * 内容结构（H 骨架 + 数据驱动差异化）：
 * - Disclaimer 在 H1 之前（用 div 不用 H 标签）
 * - 单一 H1："{Name} Phenotype - Face Features & Origin"
 * - H2: Average Face / Geographic Distribution / Physical Characteristics
 *        / Historical Background / Research History & Naming
 *        / Comparison With Nearby Phenotypes / In the Game / FAQ
 *        / References / Related Phenotypes
 * - 各节框架文案按 slug 确定性轮换变体，导语/对比表/FAQ 嵌入每页独有数据
 * - JSON-LD Article + BreadcrumbList（Breadcrumbs 组件已注入 BreadcrumbList）
 */
export default function PhenotypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const phenotype = data.find((p) => p.slug === params.slug);

  // SSG 已生成全部 slug，理论上不会到这里；保留以防开发态直接访问
  if (!phenotype) {
    return (
      <div className="flex flex-col gap-6">
        <Disclaimer />
        <h1 className="m-0 text-3xl font-bold text-stone-900">
          Phenotype Not Found
        </h1>
        <p className="m-0 text-base text-stone-700">
          The requested phenotype could not be found.
        </p>
        <Link
          href="/phenotypes"
          className="text-stone-900 underline underline-offset-4 min-h-[44px] inline-flex items-center"
        >
          ← Back to human phenotypes list
        </Link>
      </div>
    );
  }

  const { historical, physical, literature } = splitDescription(
    phenotype.description
  );
  const lead = buildLead(phenotype);
  const nearby = getNearbyEntries(phenotype, 5);
  const traitPoints = physical ? physicalTraitPoints(physical) : [];
  const faq = buildPhenotypeFaq(phenotype);
  const coords = formatCoords(phenotype);
  const shortDesc = phenotype.description.slice(0, 157).trim();

  // —— 各节框架文案的确定性变体（消除 240 页同构句式）——
  const averageFaceLeads = [
    `The composite below is not a photograph of a real person. Historical anthropologists aligned multiple individual portraits from the ${phenotype.name} reference population and averaged them into one image, so recurring structures — skull outline, nose form, lip thickness, brow position — dominate while individual idiosyncrasies cancel out.`,
    `Averaging many portraits leaves the features that repeat and erases the ones that do not. That is exactly how the ${phenotype.name} composite below was built: individual photographs were aligned and statistically merged, exaggerating shared structure into a single reference face that no actual person looks like.`,
    `What you see below is a statistical construction. Faces recorded from the ${phenotype.name} reference population were overlaid and merged; the result keeps the features most members shared and discards personal variation. It reads like a portrait, but it works like a histogram.`,
  ];
  const averageFaceLead = pickVariant(phenotype.slug, averageFaceLeads);

  const geoLeads = [
    `${phenotype.name} is documented across ${phenotype.region}, with its historical reference center near ${coords}. The coordinates mark where the type was most characteristic roughly 1500 years ago; population movements since then have scattered and blended the distribution far beyond that point.`,
    `The reference center for ${phenotype.name} sits near ${coords} in ${phenotype.region}. Around that anchor, prevalence falls off gradually — the type is not confined to one valley or one modern border, and the historical map should be read as a gradient rather than a boundary.`,
    `Geographically, ${phenotype.name} anchors to ${coords} (${phenotype.region}). That is the point where historical anthropologists judged the type most concentrated, not a hard edge; modern migration and intermarriage have long since softened whatever boundaries once existed.`,
  ];
  const geoLead = pickVariant(phenotype.slug + "geo", geoLeads);

  const researchLeads = [
    `The name "${phenotype.name}" carries its own history. The passage below traces who first defined the type, which rival names competed with it, and how later authors consolidated or disputed the classification — the raw material of any serious phenotype reference.`,
    `Typological names were coined, contested, and renamed repeatedly across the 20th century, and ${phenotype.name} is no exception. The extract below records the researchers who defined it, the alternative labels it accumulated, and where the modern consensus settled.`,
    `Every phenotype label in the historical catalogue has an author and a date, and several have competing authors and dates. For ${phenotype.name}, the literature extract below shows the naming chain — from the first definition through the later revisions that shaped the current entry.`,
  ];
  const researchLead = pickVariant(phenotype.slug + "lit", researchLeads);

  const gameLeads = [
    `${phenotype.name} is one of the faces that can appear in Classic Daily and Challenge Mode. When it does, the winning pin lands near ${coords} in ${phenotype.region} — and because the scoring decays with distance, recognizing the region matters more than pixel-perfect placement.`,
    `When the ${phenotype.name} composite shows up in the quiz, players who know the ${phenotype.region} distribution pattern have the edge. The reference answer sits near ${coords}; pins on the wrong continent score close to zero, so even a rough regional instinct beats a precise but misdirected pin.`,
    `In gameplay terms, ${phenotype.name} rewards region-level recall: the score is computed from the distance between your pin and ${coords}. Players often confuse it with the nearby types listed in the comparison table above — those confusions are exactly what the distance penalty is designed to expose.`,
  ];
  const gameLead = pickVariant(phenotype.slug + "game", gameLeads);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${phenotype.name} Phenotype - Face Features & Origin`,
    image: phenotype.image_url,
    description:
      shortDesc + (phenotype.description.length > 157 ? "..." : ""),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/phenotype/${phenotype.slug}`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="flex flex-col gap-8">
      <Disclaimer />

      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Phenotypes", url: `${SITE_URL}/phenotypes` },
          {
            name: phenotype.name,
            url: `${SITE_URL}/phenotype/${phenotype.slug}`,
          },
        ]}
      />

      <article className="flex flex-col gap-8 max-w-3xl rounded-4xl bg-white border border-stone-200 shadow-premium p-6 sm:p-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
              Phenotype
            </span>
            <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              {phenotype.name} Phenotype - Face Features & Origin
            </h1>
          </div>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            {lead}
          </p>
        </header>

        {/* Average Face */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Average Face
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            {averageFaceLead}
          </p>
          <Image
            src={phenotype.image_url}
            alt={`${phenotype.name} phenotype average face composite`}
            width={300}
            height={300}
            sizes="(max-width: 640px) 100vw, 300px"
            className="rounded-3xl overflow-hidden shadow-premium object-cover bg-stone-100 w-full max-w-[300px] h-auto"
            loading="lazy"
          />
          <p className="m-0 text-sm text-stone-600">
            Composite source:{" "}
            {phenotype.source_url && (
              <a
                href={phenotype.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors"
              >
                Human Phenotypes — {phenotype.name}
              </a>
            )}
          </p>
        </section>

        {/* Geographic Distribution */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Geographic Distribution
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            {geoLead}
          </p>
          <div
            className="rounded-2xl bg-section-soft border border-stone-200/70 p-5 text-sm text-stone-700"
            aria-label={`${phenotype.name} phenotype distribution reference card`}
          >
            <span aria-hidden className="mr-2">
              📍
            </span>
            Reference center: {coords} — {phenotype.region}. Historical
            distribution documented circa 500 CE; modern distributions
            differ substantially.
          </div>
        </section>

        {/* Physical Characteristics */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Physical Characteristics
          </h2>
          {physical ? (
            <>
              <p className="m-0 text-base text-stone-700 leading-relaxed">
                {firstSentences(physical, 1)}
              </p>
              {traitPoints.length > 1 && (
                <ul className="m-0 pl-6 list-disc flex flex-col gap-2 text-sm text-stone-700">
                  {traitPoints.slice(1).map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="m-0 text-base text-stone-700 leading-relaxed">
              Physical trait details for the {phenotype.name} phenotype are
              not clearly segmented in source data; see the historical
              background section below for the full description.
            </p>
          )}
        </section>

        {/* Historical Background */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Historical Background
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            {historical || phenotype.description}
          </p>
        </section>

        {/* Research History & Naming */}
        {literature && (
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-2xl font-bold text-stone-900">
              Research History &amp; Naming
            </h2>
            <p className="m-0 text-base text-stone-700 leading-relaxed">
              {researchLead}
            </p>
            <p className="m-0 text-base text-stone-700 leading-relaxed">
              {literature}
            </p>
          </section>
        )}

        {/* Comparison With Nearby Phenotypes */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Comparison With Nearby Phenotypes
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The five phenotypes whose documented centers lie closest to{" "}
            {phenotype.name}, ranked by great-circle distance. They are the
            types players most often confuse with {phenotype.name} in the
            quiz, precisely because their distributions overlap.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-sm text-stone-700 border-collapse">
              <thead>
                <tr className="bg-section-soft text-left">
                  <th className="px-4 py-2.5 font-semibold text-stone-900">
                    Phenotype
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-stone-900">
                    Region
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-stone-900">
                    Distance
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-stone-900">
                    Distinguishing trait
                  </th>
                </tr>
              </thead>
              <tbody>
                {nearby.map((entry) => (
                  <tr
                    key={entry.phenotype.slug}
                    className="border-t border-stone-200/70"
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/phenotype/${entry.phenotype.slug}`}
                        className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors"
                      >
                        {entry.phenotype.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">{entry.phenotype.region}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {entry.distance.toLocaleString()} km
                    </td>
                    <td className="px-4 py-2.5 text-stone-600">
                      {entry.traitSummary
                        ? firstSentences(entry.traitSummary, 1)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* In the Game */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            {phenotype.name} in the Game
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            {gameLead}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/play/classic-daily"
              className="inline-flex items-center min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-stone-900 rounded-full shadow-premium hover:bg-stone-800 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium"
            >
              Play Classic Daily
            </Link>
            <Link
              href="/play/challenge"
              className="inline-flex items-center min-h-[44px] px-5 py-2 text-sm font-medium text-stone-900 bg-white border border-stone-200 rounded-full shadow-premium hover:bg-stone-50 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium"
            >
              Practice in Challenge Mode
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            {phenotype.name} Phenotype FAQ
          </h2>
          <dl className="m-0 flex flex-col gap-5">
            {faq.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5">
                <dt className="m-0 text-base font-semibold text-stone-900">
                  {item.question}
                </dt>
                <dd className="m-0 text-sm text-stone-700 leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* References & Literature */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            References &amp; Literature
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The {phenotype.name} phenotype entry above is compiled from the
            following academic references. Readers are encouraged to consult
            the original sources for verification and deeper context.
          </p>
          {phenotype.references && phenotype.references.length > 0 ? (
            <ul className="m-0 pl-6 list-disc flex flex-col gap-2 text-sm text-stone-700">
              {phenotype.references.map((ref, idx) => (
                <li key={idx} className="leading-relaxed">
                  {ref}
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-sm text-stone-600">
              No academic references recorded for this phenotype.
            </p>
          )}
        </section>

        {/* Related Phenotypes */}
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Related Phenotypes
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Other human phenotypes whose documented centers lie in the same
            part of the map as {phenotype.name}.
          </p>
          <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nearby.map((entry) => {
              const r = entry.phenotype;
              return (
                <li key={r.slug} className="m-0 p-0">
                  <div className="group flex flex-col gap-1 p-3 h-full rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium">
                    <h3 className="m-0 text-base font-semibold text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                      <Link
                        href={`/phenotype/${r.slug}`}
                        className="hover:underline underline-offset-4 min-h-[44px] flex items-center"
                      >
                        {r.name}
                      </Link>
                    </h3>
                    <p className="m-0 text-xs text-stone-600">
                      {r.region} · {entry.distance.toLocaleString()} km away
                    </p>
                    <p className="m-0 text-xs text-stone-600 line-clamp-2">
                      {r.description.split("Physical Traits:")[0].trim().slice(0, 140)}
                      {r.description.split("Physical Traits:")[0].trim().length > 140
                        ? "..."
                        : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <nav
          aria-label="Back to phenotypes list"
          className="border-t border-stone-200 pt-4"
        >
          <Link
            href="/phenotypes"
            className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors min-h-[44px] inline-flex items-center text-sm"
          >
            ← Back to human phenotypes list
          </Link>
        </nav>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
