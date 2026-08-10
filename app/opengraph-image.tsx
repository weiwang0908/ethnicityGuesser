import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

/**
 * 首页默认 OG 图（1200×630，next/og ImageResponse 动态生成）。
 * - 哥飞 TDH：每个可分享 URL 都有专属 OG 图
 * - 运行在 edge runtime，构建时静态预渲染
 */
export const runtime = "edge";
export const alt = `${SITE_NAME} - Daily Ethnicity Quiz & Phenotypes Game`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32 }}>
          <span style={{ marginRight: 16 }}>🌍</span>
          <span>{SITE_NAME}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Guess Ethnicity by Face
          </div>
          <div style={{ fontSize: 36, color: "#cbd5e1" }}>
            Free daily quiz · 240 phenotypes · 48 country faces
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8" }}>
          ethnicity-guesser.com
        </div>
      </div>
    ),
    { ...size }
  );
}
