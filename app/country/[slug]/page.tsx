import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  allCountries,
  generateCountryContent,
  getCountryBySlug,
  getRelatedCountries,
} from "@/lib/countryContent";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";

/**
 * SSG: 预渲染全部 48 个 country 详情页。
 * dynamicParams = false：未在 generateStaticParams 返回列表中的 slug 直接 404。
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return allCountries.map((c) => ({ slug: c.slug }));
}

/**
 * 每页唯一 metadata（哥飞 TDH：主词 "{country} average face" 前置）。
 */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const country = getCountryBySlug(params.slug);
  if (!country) {
    return buildMetadata({
      title: "Country Not Found | Ethnicity Guesser",
      description: "The requested country average face page could not be found.",
      path: "/country",
    });
  }
  const title = `${country.name} Average Face - Phenotype & People`;
  const description = `Explore the ${country.name} average face composite and the people of ${country.name}. Learn about demographics, geography, history, and culture behind the ${country.name.toLowerCase()} average face.`;
  // 不传 ogImage：由 colocated app/country/[slug]/opengraph-image.tsx
  // 自动生成 1200×630 品牌化 OG 图（含 country 名称）。
  return buildMetadata({
    title,
    description,
    path: `/country/${country.slug}`,
  });
}

/**
 * /country/[slug] 详情页（服务端组件 + SSG）。
 *
 * 哥飞 H 骨架：
 * - Disclaimer 在 H1 之前（用 div 不用 H 标签）
 * - 单一 H1："{Country} Average Face - Phenotype & People"
 * - H2: Average Face Composite / People of {Country} / Play the Country Quiz / Related Countries
 * - H3: Demographics / Geography / {Related Country} 链接
 * - JSON-LD Article + BreadcrumbList（Breadcrumbs 组件已注入 BreadcrumbList）
 * - 图片 alt 含主词 "{country} average face composite"
 * - 底部 "← Back to countries list" 内链
 */
export default function CountryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const country = getCountryBySlug(params.slug);

  // SSG 已生成全部 slug，理论上不会到这里；保留以防开发态直接访问
  if (!country) {
    return (
      <div className="flex flex-col gap-6">
        <Disclaimer />
        <h1 className="m-0 text-3xl font-bold text-gray-900">
          Country Not Found
        </h1>
        <p className="m-0 text-base text-gray-700">
          The requested country average face page could not be found.
        </p>
        <Link
          href="/country"
          className="text-gray-900 underline underline-offset-4 min-h-[44px] inline-flex items-center"
        >
          ← Back to countries list
        </Link>
      </div>
    );
  }

  const content = generateCountryContent(country);
  const related = getRelatedCountries(country, 5);
  const hasImage = country.image_url && country.image_url.trim().length > 0;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${country.name} Average Face - Phenotype & People`,
    image: hasImage ? country.image_url : undefined,
    description: `Explore the ${country.name} average face composite and the people of ${country.name}: demographics, geography, history, and culture.`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/country/${country.slug}`,
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <Disclaimer />

      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Countries", url: `${SITE_URL}/country` },
          {
            name: country.name,
            url: `${SITE_URL}/country/${country.slug}`,
          },
        ]}
      />

      <article className="flex flex-col gap-8 max-w-3xl">
        <header className="flex flex-col gap-3">
          <h1 className="m-0 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {country.name} Average Face - Phenotype & People
          </h1>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            The {country.name.toLowerCase()} average face is a composite image
            synthesizing the most frequently recurring facial features among
            people from {country.name}. This page presents the {country.name}{" "}
            average face composite, then situates it within the country&apos;s
            demographics, geography, history, and culture so that the composite
            can be read in context rather than as a portrait of any individual.
          </p>
        </header>

        {/* Average Face Composite */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Average Face Composite
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            The {country.name.toLowerCase()} average face composite below is a
            statistical synthesis: many individual photographs of people from{" "}
            {country.name} are aligned and averaged to produce a single image
            that emphasizes recurring facial structures, skin tone tendencies,
            and hair patterns. It is a research and visualization artifact, not
            a photograph of a real person, and individual variation within{" "}
            {country.name} is far greater than the composite suggests.
          </p>
          {hasImage ? (
            <Image
              src={country.image_url}
              alt={`${country.name} average face composite`}
              width={300}
              height={300}
              sizes="(max-width: 640px) 100vw, 300px"
              className="rounded-lg border border-gray-200 object-cover bg-gray-100 w-full max-w-[300px] h-auto"
              loading="lazy"
            />
          ) : (
            <div
              role="img"
              aria-label={`${country.name} average face composite`}
              className="rounded-lg border border-gray-200 bg-gray-100 w-full max-w-[300px] h-[300px] flex items-center justify-center text-center px-4 text-sm text-gray-500"
            >
              {country.name} average face composite
            </div>
          )}
        </section>

        {/* People of {Country} */}
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            People of {country.name}
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            To understand the {country.name.toLowerCase()} average face, it
            helps to understand the people behind it. {country.name} is located
            in {country.region}, and the sections below describe the
            demographics, geography, history, and culture that together shape
            the recurring facial features captured in the composite.
          </p>

          <h3 className="m-0 text-xl font-bold text-gray-900">Demographics</h3>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            {content.demographics}
          </p>

          <h3 className="m-0 text-xl font-bold text-gray-900">Geography</h3>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            {content.geography}
          </p>

          <h3 className="m-0 text-xl font-bold text-gray-900">
            Historical Background
          </h3>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            {content.history}
          </p>

          <h3 className="m-0 text-xl font-bold text-gray-900">Culture</h3>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            {content.culture}
          </p>

          {country.source_url && (
            <p className="m-0 text-sm text-gray-600">
              Source:{" "}
              <a
                href={country.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 underline underline-offset-4 hover:text-gray-700"
              >
                {country.name} average face source
              </a>
            </p>
          )}
        </section>

        {/* Play the Country Quiz */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Play the Country Quiz
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Put your eye for faces to the test. In the Countries game mode you
            are shown an average face composite like the {country.name.toLowerCase()}{" "}
            one above and asked to guess which country it represents. Try a few
            rounds and see how quickly you can recognize the {country.name}{" "}
            composite alongside the other 47 countries in the gallery.
          </p>
          <a
            href="/play/countries"
            className="self-start inline-flex items-center min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-700"
          >
            Play Guess the Nationality Game
          </a>
        </section>

        {/* Related Countries */}
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-gray-900">
            Related Countries
          </h2>
          <p className="m-0 text-base text-gray-700 leading-relaxed">
            Other countries in {country.region} and neighboring regions whose
            average face composites share features with the {country.name.toLowerCase()}{" "}
            composite. Comparing them side by side makes the regional patterns
            clearer.
          </p>
          <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((r) => {
              const rHasImage = r.image_url && r.image_url.trim().length > 0;
              return (
                <li key={r.slug} className="m-0 p-0">
                  <div className="flex flex-col gap-1 border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors h-full">
                    <h3 className="m-0 text-base font-semibold text-gray-900 leading-tight">
                      <Link
                        href={`/country/${r.slug}`}
                        className="hover:underline underline-offset-4 min-h-[44px] flex items-center"
                      >
                        {r.name}
                      </Link>
                    </h3>
                    <p className="m-0 text-xs text-gray-600">{r.region}</p>
                    {rHasImage ? (
                      <Image
                        src={r.image_url}
                        alt={`${r.name} average face composite`}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="rounded-md object-cover flex-shrink-0 bg-gray-100"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`${r.name} average face composite`}
                        className="rounded-md border border-gray-200 bg-gray-100 w-20 h-20 flex items-center justify-center text-center px-1 text-[10px] text-gray-500"
                      >
                        {r.name} average face
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <nav
          aria-label="Back to countries list"
          className="border-t border-gray-200 pt-4"
        >
          <Link
            href="/country"
            className="text-gray-900 underline underline-offset-4 min-h-[44px] inline-flex items-center text-sm"
          >
            ← Back to countries list
          </Link>
        </nav>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}
