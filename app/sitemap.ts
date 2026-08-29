import { MetadataRoute } from "next";
import phenotypes from "@/data/phenotypes.json";
import countries from "@/data/countries.json";
import blogPosts from "@/data/blog-posts.json";

/**
 * 全站 sitemap（哥飞 TDH：覆盖全部可索引 URL + lastmod）。
 * - 静态页：13 个（首页 / 3 个游戏页 / 2 个索引 / 博客列表 / 6 个信任页）
 *   /faq 已删除，FAQ 内容内嵌于首页 #faq 锚点
 * - phenotype 详情：209 个
 * - country 详情：48 个
 * - blog 文章：随 data/blog-posts.json 增长
 *
 * SITE_URL 未配置时回退到正式域名（www 主域，与 Vercel 重定向方向一致）。
 * sitemap 内 URL 必须与 sitemap 文件同域，否则 Google 判定跨域拒绝抓取。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.SITE_URL || "https://www.ethnicity-guesser.com"
  ).replace(/\/$/, "");
  const now = new Date();

  const staticPages = [
    "",
    "/play/classic-daily",
    "/play/challenge",
    "/play/countries",
    "/phenotypes",
    "/country",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/editorial-policy",
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

  const blogPages = (blogPosts as { slug: string; date: string }[]).map(
    (p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.date + "T00:00:00Z"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...blogPages, ...phenotypePages, ...countryPages];
}
