import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { allCountries, type Country } from "@/lib/countryContent";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = buildMetadata({
  title: "Country Average Faces - 48 Countries Gallery",
  description:
    "Browse the average face composite for 48 countries grouped by region. Compare average faces from Europe, Asia, Africa, the Americas, and Oceania, and read about the people behind each composite.",
  path: "/country",
});

/**
 * 按 region 分组，保持每个 region 出现的原始顺序（按数据文件中首次出现排序）。
 */
function groupByRegion(items: Country[]): { region: string; items: Country[] }[] {
  const order: string[] = [];
  const map = new Map<string, Country[]>();
  for (const c of items) {
    if (!map.has(c.region)) {
      order.push(c.region);
      map.set(c.region, []);
    }
    map.get(c.region)!.push(c);
  }
  return order.map((region) => ({ region, items: map.get(region)! }));
}

const grouped = groupByRegion(allCountries);

/**
 * /country 索引页（服务端组件 + SSG）。
 *
 * 哥飞"分门别类罗列"打法：
 * - 单一 H1（含主词 "Country Average Faces - 48 Countries Gallery"）
 * - H2 = region，H3 = 单个 country 链接
 * - 正文写在 <p>，图片 alt 必填（占位 div 用 aria-label）
 * - 移动端单列，桌面端多列网格
 */
export default function CountryIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <Disclaimer />

      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Countries", url: `${SITE_URL}/country` },
        ]}
      />

      <article className="flex flex-col gap-6">
        <h1 className="m-0 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Country Average Faces - 48 Countries Gallery
        </h1>
        <p className="m-0 text-base text-gray-700 leading-relaxed">
          A gallery of {allCountries.length} country average face composites,
          grouped by region. Each country below links to a dedicated page with
          the composite, a 1500-word introduction to the country&apos;s people,
          demographics, geography, history, and culture, and links to
          neighboring countries for side-by-side comparison. Average faces are
          statistical impressions of recurring facial features, not portraits of
          real people, and they should be read alongside the demographic and
          historical context on each detail page.
        </p>

        <nav aria-label="Region jump links" className="flex flex-wrap gap-2">
          {grouped.map(({ region, items }) => (
            <a
              key={region}
              href={`#region-${region.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-sm text-gray-700 hover:underline underline-offset-4 min-h-[44px] flex items-center px-2 py-1 rounded hover:bg-gray-100"
            >
              {region} ({items.length})
            </a>
          ))}
        </nav>

        {grouped.map(({ region, items }) => {
          const anchor = `region-${region
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`;
          return (
            <section
              key={region}
              id={anchor}
              className="flex flex-col gap-4 scroll-mt-20"
            >
              <h2 className="m-0 text-2xl font-bold text-gray-900">{region}</h2>
              <p className="m-0 text-sm text-gray-600">
                {items.length} countr{items.length > 1 ? "ies" : "y"} in{" "}
                {region} with average face composites.
              </p>
              <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c) => {
                  const hasImage =
                    c.image_url && c.image_url.trim().length > 0;
                  return (
                    <li key={c.slug} className="m-0 p-0">
                      <div className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors h-full">
                        <div className="flex items-start gap-3">
                          {hasImage ? (
                            <Image
                              src={c.image_url}
                              alt={`${c.name} average face composite`}
                              width={80}
                              height={80}
                              sizes="80px"
                              className="rounded-md object-cover flex-shrink-0 bg-gray-100"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              role="img"
                              aria-label={`${c.name} average face composite`}
                              className="rounded-md border border-gray-200 bg-gray-100 w-20 h-20 flex items-center justify-center text-center px-1 text-[10px] text-gray-500 flex-shrink-0"
                            >
                              {c.name} average face
                            </div>
                          )}
                          <div className="flex flex-col gap-1 min-w-0">
                            <h3 className="m-0 text-base font-semibold text-gray-900 leading-tight">
                              <Link
                                href={`/country/${c.slug}`}
                                className="hover:underline underline-offset-4 min-h-[44px] flex items-center"
                              >
                                {c.name}
                              </Link>
                            </h3>
                            <p className="m-0 text-xs text-gray-600">
                              {c.region}
                            </p>
                            <p className="m-0 text-xs text-gray-600 line-clamp-2">
                              {c.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </article>

      <section className="flex flex-col gap-3 border-t border-gray-200 pt-6">
        <h2 className="m-0 text-xl font-bold text-gray-900">
          Continue Exploring
        </h2>
        <p className="m-0 text-sm text-gray-700">
          Read a specific country in detail, browse human phenotypes, or play
          the ethnicity quiz game.
        </p>
        <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
          <li className="m-0 p-0">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-gray-700 hover:underline border border-gray-300 rounded"
            >
              ← Back to Home
            </Link>
          </li>
          <li className="m-0 p-0">
            <Link
              href="/phenotypes"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-gray-700 hover:underline border border-gray-300 rounded"
            >
              Browse Human Phenotypes
            </Link>
          </li>
          <li className="m-0 p-0">
            <Link
              href="/play/countries"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-gray-700 hover:underline border border-gray-300 rounded"
            >
              Play Countries Mode
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
