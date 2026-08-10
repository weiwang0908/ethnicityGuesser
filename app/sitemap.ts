import { MetadataRoute } from "next";
import phenotypes from "@/data/phenotypes.json";
import countries from "@/data/countries.json";

/**
 * 全站 sitemap（哥飞 TDH：覆盖全部可索引 URL + lastmod）。
 * - 静态页：13 个（首页 / 3 个游戏页 / 2 个索引 / 7 个信任页）
 * - phenotype 详情：209 个
 * - country 详情：48 个
 *
 * SITE_URL 未配置时回退到正式域名，保证 build 不报错。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.SITE_URL || "https://ethnicity-guesser.com"
  ).replace(/\/$/, "");
  const now = new Date();

  const staticPages = [
    "",
    "/play/classic-daily",
    "/play/challenge",
    "/play/countries",
    "/phenotypes",
    "/country",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/editorial-policy",
    "/faq",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const phenotypePages = (phenotypes as { slug: string }[]).map((p) => ({
    url: `${baseUrl}/phenotype/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const countryPages = (countries as { slug: string }[]).map((c) => ({
    url: `${baseUrl}/country/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...phenotypePages, ...countryPages];
}
