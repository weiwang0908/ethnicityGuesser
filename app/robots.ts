import { MetadataRoute } from "next";

/**
 * robots.txt（哥飞 TDH：允许全站 + 指向 sitemap）。
 * 站点无 /admin /api 等需屏蔽路径，全站允许。
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.SITE_URL || "https://www.ethnicity-guesser.com"
  ).replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
