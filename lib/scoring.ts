/** 地球半径（公里）。 */
const EARTH_RADIUS_KM = 6371;

const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Haversine 距离：两经纬度点之间的球面距离（公里）。
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/** 单题满分。 */
export const MAX_SCORE_PER_QUESTION = 500;

/**
 * 距离衰减系数（指数衰减）。
 * 校准点：0km=500, 500km≈400, 2000km≈200, 5000km≈50。
 */
const DECAY_K = 0.00045;

/**
 * 评分：距离越近分越高，满分 500。
 * 距离衰减用指数函数；时间加成 MVP 暂不扣分（仅记录，不参与计算）。
 */
export function calculateScore(distanceKm: number, timeMs?: number): number {
  // MVP 暂不扣时间分；保留参数以备后续计时模式（Task 6/7）使用。
  void timeMs;
  const raw = MAX_SCORE_PER_QUESTION * Math.exp(-DECAY_K * distanceKm);
  return Math.max(0, Math.min(MAX_SCORE_PER_QUESTION, Math.round(raw)));
}
