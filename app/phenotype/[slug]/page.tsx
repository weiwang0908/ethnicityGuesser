import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import phenotypes from "@/data/phenotypes.json";
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

const data = phenotypes as Phenotype[];

/**
 * SSG: 预渲染全部 phenotype 详情页（209 个）。
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
 * 智能分段 description：
 * - intro（"Physical Traits:" 之前）→ 历史背景
 * - physical traits 段（"Physical Traits:" 到 "Literature:" 或结尾）→ 面部特征
 * - 若无标记，全文作为历史背景，面部特征段为空
 */
function splitDescription(desc: string): {
  historical: string;
  physical: string | null;
} {
  const ptIdx = desc.indexOf("Physical Traits:");
  if (ptIdx === -1) {
    return { historical: desc.trim(), physical: null };
  }
  const historical = desc.slice(0, ptIdx).trim();
  const afterPt = desc.slice(ptIdx + "Physical Traits:".length);
  const litIdx = afterPt.indexOf("Literature:");
  const physical =
    litIdx === -1 ? afterPt.trim() : afterPt.slice(0, litIdx).trim();
  return { historical, physical: physical || null };
}

/**
 * 选取相关 phenotype：
 * - 同 region 优先，最多 5 个（排除当前）
 * - 不足 3 个时从其他 region 按字母顺序补齐到 3
 */
function getRelated(current: Phenotype, count = 5): Phenotype[] {
  const same = data.filter(
    (p) => p.region === current.region && p.slug !== current.slug
  );
  if (same.length >= count) {
    return same.slice(0, count);
  }
  const result = [...same];
  const others = data
    .filter((p) => p.region !== current.region && p.slug !== current.slug)
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const o of others) {
    if (result.length >= Math.max(3, count)) break;
    result.push(o);
  }
  return result.slice(0, Math.max(count, 3));
}

/**
 * /phenotype/[slug] 详情页（服务端组件 + SSG）。
 *
 * 哥飞 H 骨架：
 * - Disclaimer 在 H1 之前（用 div 不用 H 标签）
 * - 单一 H1："{Name} Phenotype - Face Features & Origin"
 * - H2: Average Face / Geographic Distribution / Physical Characteristics
 *        / Historical Background / References & Literature / Related Phenotypes
 * - JSON-LD Article + BreadcrumbList（Breadcrumbs 组件已注入 BreadcrumbList）
 * - 图片 alt 含主词 "{name} phenotype average face composite"
 * - 底部 "← Back to human phenotypes list" 内链
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

  const { historical, physical } = splitDescription(phenotype.description);
  const related = getRelated(phenotype);
  const shortDesc = phenotype.description.slice(0, 157).trim();

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
            The {phenotype.name} phenotype is a {phenotype.region.toLowerCase()}{" "}
            human phenotype documented in historical anthropology literature.
            This page presents the {phenotype.name} phenotype average face
            composite, its geographic distribution, physical characteristics,
            historical background, and academic references.
          </p>
        </header>

        {/* Average Face */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Average Face
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The {phenotype.name} phenotype average face is a composite
            synthesized from multiple individual photographs by historical
            anthropologists. It represents a statistical impression of recurring
            facial features, not a real person.
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
        </section>

        {/* Geographic Distribution */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Geographic Distribution
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The {phenotype.name} phenotype is native to {phenotype.region}. The
            historical distribution below reflects approximate centers of
            prevalence documented roughly 1500 years ago; modern borders and
            population movements have since blurred these boundaries.
          </p>
          <p className="m-0 text-sm text-stone-600">
            Approximate coordinates: {phenotype.lat.toFixed(2)}°,{" "}
            {phenotype.lng.toFixed(2)}° (latitude, longitude).
          </p>
          <div
            className="rounded-2xl bg-section-soft border border-stone-200/70 p-5 text-sm text-stone-700"
            aria-label={`Map placeholder for ${phenotype.name} phenotype location`}
          >
            <span aria-hidden className="mr-2">
              📍
            </span>
            {phenotype.name} phenotype historical center: {phenotype.lat.toFixed(2)}
            , {phenotype.lng.toFixed(2)} — {phenotype.region}
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
                {physical}
              </p>
            </>
          ) : (
            <p className="m-0 text-base text-stone-700 leading-relaxed">
              Physical trait details for the {phenotype.name} phenotype are not
              clearly segmented in source data; see the historical background
              section below for the full description.
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
          {phenotype.source_url && (
            <p className="m-0 text-sm text-stone-600">
              Source:{" "}
              <a
                href={phenotype.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors"
              >
                Human Phenotypes — {phenotype.name}
              </a>
            </p>
          )}
        </section>

        {/* References & Literature */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            References & Literature
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
            Other human phenotypes related to {phenotype.name} by geography or
            typological similarity.
          </p>
          <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((r) => (
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
                    {r.region}
                  </p>
                  <p className="m-0 text-xs text-stone-600 line-clamp-2">
                    {r.description.split("Physical Traits:")[0].trim().slice(0, 140)}
                    {r.description.split("Physical Traits:")[0].trim().length > 140
                      ? "..."
                      : ""}
                  </p>
                </div>
              </li>
            ))}
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
    </div>
  );
}
