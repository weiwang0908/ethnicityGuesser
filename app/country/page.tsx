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
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
            Gallery
          </span>
          <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            Country Average Faces - 48 Countries Gallery
          </h1>
        </div>
        <p className="m-0 text-base text-stone-700 leading-relaxed">
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
              className="text-sm text-stone-700 hover:underline underline-offset-4 min-h-[44px] flex items-center px-2 py-1 rounded hover:bg-stone-100"
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
              <h2 className="m-0 text-2xl font-bold text-stone-900">{region}</h2>
              <p className="m-0 text-sm text-stone-600">
                {items.length} countr{items.length > 1 ? "ies" : "y"} in{" "}
                {region} with average face composites.
              </p>
              <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c) => {
                  const hasImage =
                    c.image_url && c.image_url.trim().length > 0;
                  return (
                    <li key={c.slug} className="m-0 p-0">
                      <div className="group flex flex-col gap-2 p-3 h-full rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover transition-all duration-300 ease-premium">
                        <div className="flex items-start gap-3">
                          {hasImage ? (
                            <Image
                              src={c.image_url}
                              alt={`${c.name} average face composite`}
                              width={80}
                              height={80}
                              sizes="80px"
                              className="rounded-md object-cover flex-shrink-0 bg-stone-100 group-hover:scale-[1.06] transition-transform duration-500 ease-premium"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              role="img"
                              aria-label={`${c.name} average face composite`}
                              className="rounded-md border border-stone-200 bg-stone-100 w-20 h-20 flex items-center justify-center text-center px-1 text-[10px] text-stone-500 flex-shrink-0"
                            >
                              {c.name} average face
                            </div>
                          )}
                          <div className="flex flex-col gap-1 min-w-0">
                            <h3 className="m-0 text-base font-semibold text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                              <Link
                                href={`/country/${c.slug}`}
                                className="hover:underline underline-offset-4 min-h-[44px] flex items-center"
                              >
                                {c.name}
                              </Link>
                            </h3>
                            <p className="m-0 text-xs text-stone-600">
                              {c.region}
                            </p>
                            <p className="m-0 text-xs text-stone-600 line-clamp-2">
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

      <section className="flex flex-col gap-3 border-t border-stone-200 pt-6">
        <h2 className="m-0 text-xl font-bold text-stone-900">
          Continue Exploring
        </h2>
        <p className="m-0 text-sm text-stone-700">
          Read a specific country in detail, browse human phenotypes, or play
          the ethnicity quiz game.
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
              href="/phenotypes"
              className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm text-stone-900 rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              Browse Human Phenotypes
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
