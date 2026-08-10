import type { Metadata } from "next";

/**
 * 全站统一 disclaimer 文案（YMYL 风控，spec 要求）。
 * 用于 Footer / Disclaimer 组件 / phenotype / country / 工具页顶部。
 */
export const SITE_DISCLAIMER =
  "Based on historical distributions from ~1500 years ago. Estimates appearance, not DNA ancestry or personal identity.";

/** 站点品牌名 */
export const SITE_NAME = "Ethnicity Guesser";

/**
 * 规范站点 URL（去尾斜杠）。优先取 process.env.SITE_URL，
 * 未配置时回退到本地开发地址，确保 build 不报错。
 */
export const SITE_URL = (
  process.env.SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/**
 * 默认 OG 图：由 app/opengraph-image.tsx 在运行时生成（next/og ImageResponse）。
 * 调用方未传 ogImage 时，buildMetadata 不再注入 images 字段，
 * 让 Next.js 自动拾取 colocated opengraph-image.tsx（哥飞 TDH：每页有专属 OG 图）。
 * 此常量仅保留供 layout.tsx 顶层 metadata 回退（如需）。
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

/** 默认社交分享描述，调用方可覆盖 */
const DEFAULT_DESCRIPTION =
  "Play Ethnicity Guesser, a free daily ethnicity quiz game. Guess ethnicity by face on the world map, browse human phenotypes with face features and origins.";

interface BuildMetadataArgs {
  /** 完整 title（不自动加后缀，调用方传完整） */
  title: string;
  /** 页面描述（150–160 字符推荐） */
  description?: string;
  /** 页面路径（如 "/play/classic-daily"），用于拼 canonical 与 og:url */
  path?: string;
  /** OG 图绝对或相对地址，缺省时由 colocated opengraph-image.tsx 自动生成 */
  ogImage?: string;
}

/**
 * 构建单页 Metadata（Next.js 14 App Router metadata API）。
 *
 * 哥飞 TDH 方法论：
 * - 不生成 <meta name="keywords">（keywords 已被 Google 淘汰）
 * - title 调用方传完整值（主词前置，60–70 字符）
 * - description 自然句子，不堆砌
 * - canonical 用 SITE_URL + path 唯一化
 * - OG 图：未传 ogImage 时不注入 images 字段，让 colocated
 *   opengraph-image.tsx 自动生成（首页/phenotype/country 已就绪，
 *   其他页继承首页 OG）；传 ogImage 时用具体图（如 composite face）
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const finalDescription = description || DEFAULT_DESCRIPTION;

  const baseMetadata: Metadata = {
    title,
    description: finalDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: finalDescription,
      type: "website",
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
    },
  };

  if (ogImage) {
    baseMetadata.openGraph!.images = [
      { url: ogImage, width: 1200, height: 630, alt: title },
    ];
    baseMetadata.twitter!.images = [ogImage];
  }

  return baseMetadata;
}
