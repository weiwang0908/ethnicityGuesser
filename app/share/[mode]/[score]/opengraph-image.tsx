import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MODE_LABELS: Record<string, string> = {
  "classic-daily": "Classic Daily",
  challenge: "Challenge",
  countries: "Countries",
};

// 各模式满分（单题 500 × 题数）：classic-daily 10 题、challenge 38 题、countries 48 题
const MODE_MAX_SCORE: Record<string, number> = {
  "classic-daily": 5000,
  challenge: 19000,
  countries: 24000,
};

// 纯字符串千分位格式化，避免 edge 运行时 Intl 依赖
function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ShareImage({
  params,
}: {
  params: { mode: string; score: string };
}) {
  const score = parseInt(params.score, 10) || 0;
  const modeLabel = MODE_LABELS[params.mode] || "Game";
  const maxScore = MODE_MAX_SCORE[params.mode] || 5000;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#1a1759",
          color: "white",
          padding: 60,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 36 }}>Ethnicity Guesser</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 700 }}>
            {formatNumber(score)} / {formatNumber(maxScore)}
          </div>
          <div style={{ display: "flex", fontSize: 36 }}>{modeLabel} Mode</div>
        </div>
        <div style={{ display: "flex", fontSize: 28 }}>
          Can you beat my score? Play at ethnicity-guesser.com
        </div>
      </div>
    ),
    { ...size }
  );
}
