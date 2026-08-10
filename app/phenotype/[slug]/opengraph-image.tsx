import { ImageResponse } from "next/og";
import phenotypes from "@/data/phenotypes.json";
import { SITE_NAME } from "@/lib/seo";

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
 * phenotype 详情页 OG 图（1200×630，next/og ImageResponse 动态生成）。
 * - 哥飞 TDH：每个可分享 URL 都有专属 OG 图，含页面主词
 * - 与 page.tsx 共享 generateStaticParams，构建时为全部 209 个 slug 预渲染
 * - edge runtime + ImageResponse，无额外依赖
 * - 不使用 generateImageMetadata（避免多 og:image 变体被全注入页面 metadata）
 */
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Phenotype - Face Features & Origin";

export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  const phenotype = data.find((p) => p.slug === params.slug);
  const name = phenotype ? phenotype.name : "Phenotype";
  const region = phenotype ? phenotype.region : "";

  const subtitle = region
    ? `Face Features & Origin · ${region}`
    : "Face Features & Origin";
  const footerUrl = `ethnicity-guesser.com/phenotype/${params.slug}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #1e293b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32 }}>
          <span style={{ marginRight: 16 }}>🧬</span>
          <span>{SITE_NAME}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {`${name} Phenotype`}
          </div>
          <div style={{ fontSize: 36, color: "#cbd5e1" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8" }}>
          {footerUrl}
        </div>
      </div>
    ),
    { ...size }
  );
}
