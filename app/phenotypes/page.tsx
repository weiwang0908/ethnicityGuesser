import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import phenotypes from "@/data/phenotypes.json";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = buildMetadata({
  title: "Human Phenotypes - Complete List of 209 Types",
  description:
    "Browse the complete list of 209 human phenotypes with average face composites, geographic distribution, and physical traits. Grouped by region from Northern Europe to Sub-Saharan Africa.",
  path: "/phenotypes",
});

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
 * 按 region 分组，保持每个 region 出现的原始顺序（按数据文件中首次出现排序）。
 */
function groupByRegion(items: Phenotype[]): { region: string; items: Phenotype[] }[] {
  const order: string[] = [];
  const map = new Map<string, Phenotype[]>();
  for (const p of items) {
    if (!map.has(p.region)) {
      order.push(p.region);
      map.set(p.region, []);
    }
    map.get(p.region)!.push(p);
  }
  return order.map((region) => ({ region, items: map.get(region)! }));
}

const grouped = groupByRegion(data);

/**
 * /phenotypes 索引页（服务端组件 + SSG）。
 *
 * 哥飞"分门别类罗列"打法：
 * - 单一 H1（含主词 "human phenotypes"）
 * - H2 = region，H3 = 单个 phenotype 链接
 * - 正文写在 <p>，图片 alt 必填
 * - 移动端单列，桌面端多列网格
 */
export default function PhenotypesIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <Disclaimer />

      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Phenotypes", url: `${SITE_URL}/phenotypes` },
        ]}
      />

      <article className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
            Catalog
          </span>
          <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            Human Phenotypes - Complete List
          </h1>
        </div>
        <p className="m-0 text-base text-stone-700 leading-relaxed">
          A complete list of {data.length} human phenotypes with average face
          composites, geographic distribution, and physical characteristics.
          Each phenotype entry is grouped by its native region, from Northern
          Europe to Sub-Saharan Africa, and links to a dedicated detail page
          with the composite face, historical background, and academic
          references. Phenotypes describe recurring patterns of physical
          appearance documented by historical anthropologists roughly 1500
          years ago, not modern national identity or personal DNA ancestry.
        </p>

        <nav aria-label="Region jump links" className="flex flex-wrap gap-2">
          {grouped.map(({ region, items }) => (
            <a
              key={region}
              href={`#region-${region.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-sm text-stone-700 hover:underline underline-offset-4 min-h-[44px] flex items-center px-2 py-1 rounded hover:bg-stone-100"
            >
              {region} ({items.length})
            </a>
          ))}
        </nav>

        {grouped.map(({ region, items }) => {
          const anchor = `region-${region.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          return (
            <section key={region} id={anchor} className="flex flex-col gap-4 scroll-mt-20">
              <h2 className="m-0 text-2xl font-bold text-stone-900">
                {region}
              </h2>
              <p className="m-0 text-sm text-stone-600">
                {items.length} phenotype{items.length > 1 ? "s" : ""} native to{" "}
                {region}.
              </p>
              <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p) => (
                  <li key={p.slug} className="m-0 p-0">
                    <div className="group flex flex-col gap-2 p-3 h-full rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover transition-all duration-300 ease-premium">
                      <div className="flex items-start gap-3">
                        <Image
                          src={p.image_url}
                          alt={`${p.name} phenotype average face`}
                          width={80}
                          height={80}
                          sizes="80px"
                          className="rounded-md object-cover flex-shrink-0 bg-stone-100 group-hover:scale-[1.06] transition-transform duration-500 ease-premium"
                          loading="lazy"
                        />
                        <div className="flex flex-col gap-1 min-w-0">
                          <h3 className="m-0 text-base font-semibold text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                            <Link
                              href={`/phenotype/${p.slug}`}
                              className="hover:underline underline-offset-4 min-h-[44px] flex items-center"
                            >
                              {p.name}
                            </Link>
                          </h3>
                          <p className="m-0 text-xs text-stone-600 line-clamp-3">
                            {p.description.split("Physical Traits:")[0].trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </article>

      <section className="flex flex-col gap-3 border-t border-stone-200 pt-6">
        <h2 className="m-0 text-xl font-bold text-stone-900">Continue Exploring</h2>
        <p className="m-0 text-sm text-stone-700">
          Read a specific phenotype in detail or play the ethnicity quiz game.
        </p>
        <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
          <li className="m-0 p-0">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              ← Back to Home
            </Link>
          </li>
          <li className="m-0 p-0">
            <Link
              href="/play/classic-daily"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              Play Classic Daily Game
            </Link>
          </li>
          <li className="m-0 p-0">
            <Link
              href="/play/challenge"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              Play Challenge Mode
            </Link>
          </li>
          <li className="m-0 p-0">
            <Link
              href="/play/countries"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              Play Countries Mode
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
