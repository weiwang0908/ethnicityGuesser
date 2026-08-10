import phenotypes from "@/data/phenotypes.json";

/**
 * Phenotype 数据结构（与 data/phenotypes.json 一致）。
 * 单一事实来源，供游戏组件复用。
 */
export interface Phenotype {
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

/** Classic Daily 每日题数。 */
export const QUESTION_COUNT = 10;

/**
 * mulberry32 seeded PRNG：返回一个产生 [0, 1) 浮点数的函数。
 * 同一 seed 永远产生同一序列，保证跨设备同步。
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a 变体：把字符串 hash 成 32 位无符号整数。 */
function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 把 Date 格式化为本地 YYYY-MM-DD 字符串（用作确定性 seed）。 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 按日期确定性选出 10 题（mulberry32 + Fisher-Yates shuffle）。
 * 同一 dateKey 永远返回相同的 10 题，跨设备同步。
 */
export function getDailyQuestions(date: Date): Phenotype[] {
  const dateKey = formatDateKey(date);
  const seed = hashString(dateKey);
  const rng = mulberry32(seed);

  const arr = [...(phenotypes as Phenotype[])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, QUESTION_COUNT);
}
