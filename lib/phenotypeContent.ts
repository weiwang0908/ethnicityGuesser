import phenotypesData from "@/data/phenotypes.json";

/**
 * Phenotype 数据类型（与 data/phenotypes.json 一致）。
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

/** 全部 phenotype（按数据文件原始顺序） */
export const allPhenotypes: Phenotype[] = phenotypesData as Phenotype[];

/** 按 slug 查找单个 phenotype */
export function getPhenotypeBySlug(slug: string): Phenotype | undefined {
  return allPhenotypes.find((p) => p.slug === slug);
}

/**
 * 确定性哈希：同一 slug 每次构建结果一致（SSG 稳定），
 * 用于在多个文案变体中固定选择其一，避免 240 页清一色模板句。
 */
function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** 按 slug 确定性选取文案变体 */
export function pickVariant<T>(slug: string, variants: T[]): T {
  return variants[stableHash(slug) % variants.length];
}

/**
 * 智能分段 description（三段式）：
 * - historical（"Physical Traits:" 之前）→ 历史与分布背景
 * - physical（"Physical Traits:" 到 "Literature:"）→ 面部与体格特征
 * - literature（"Literature:" 之后）→ 命名史与文献脉络（此前被丢弃，现渲染）
 * - 任一标记缺失时容错处理
 */
export function splitDescription(desc: string): {
  historical: string;
  physical: string | null;
  literature: string | null;
} {
  const ptIdx = desc.indexOf("Physical Traits:");
  if (ptIdx === -1) {
    return { historical: desc.trim(), physical: null, literature: null };
  }
  const historical = desc.slice(0, ptIdx).trim();
  const afterPt = desc.slice(ptIdx + "Physical Traits:".length);
  const litIdx = afterPt.indexOf("Literature:");
  if (litIdx === -1) {
    return { historical, physical: afterPt.trim() || null, literature: null };
  }
  return {
    historical,
    physical: afterPt.slice(0, litIdx).trim() || null,
    literature: afterPt.slice(litIdx + "Literature:".length).trim() || null,
  };
}

/**
 * 截取前 n 句（按句号粗分），用于数据驱动的导语与卡片摘要。
 */
export function firstSentences(text: string, n: number): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.slice(0, n).join(" ");
}

/**
 * 把 Physical Traits 段按句拆成结构化特征条目（供列表渲染）。
 */
export function physicalTraitPoints(physical: string): string[] {
  return physical
    .split(/(?<=[.])\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => s.length > 3);
}

/**
 * Haversine 大圆距离（km）：用于「邻近表型」真实数据对比。
 */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** 经纬度自然格式化："60° N, 15° E" */
export function formatCoords(p: { lat: number; lng: number }): string {
  const ns = p.lat >= 0 ? "N" : "S";
  const ew = p.lng >= 0 ? "E" : "W";
  return `${Math.abs(p.lat).toFixed(1)}° ${ns}, ${Math.abs(p.lng).toFixed(1)}° ${ew}`;
}

/**
 * 地理最相关的表型（按大圆距离排序，排除自身，取 count 个）。
 * 与旧的「同 region 字母序前 5」相比，这是每页唯一、可验证的真实数据。
 */
export function getNearestPhenotypes(
  current: Phenotype,
  count = 5
): Phenotype[] {
  return allPhenotypes
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ p, d: distanceKm(current, p) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((x) => x.p);
}

/** 邻近表型条目（含距离与特征摘要，用于对比表） */
export interface NearbyEntry {
  phenotype: Phenotype;
  distance: number;
  traitSummary: string | null;
}

export function getNearbyEntries(
  current: Phenotype,
  count = 5
): NearbyEntry[] {
  return getNearestPhenotypes(current, count).map((p) => {
    const { physical } = splitDescription(p.description);
    return {
      phenotype: p,
      distance: distanceKm(current, p),
      traitSummary: physical ? firstSentences(physical, 1) : null,
    };
  });
}

/**
 * 数据驱动导语（3 个确定性变体）：
 * 首句取自该表型独有的 historical 文本，坐标/地区各页不同，
 * 彻底替换旧的 "The X phenotype is a ... documented in ..." 模板句。
 */
export function buildLead(phenotype: Phenotype): string {
  const { historical } = splitDescription(phenotype.description);
  const lead = firstSentences(historical, 1);
  const coords = formatCoords(phenotype);
  const variants = [
    `${lead} The entry below collects the ${phenotype.name} composite face, its documented distribution around ${coords} in ${phenotype.region}, its physical characteristics, the research history behind the name, and the academic references that support all of it.`,
    `Historical anthropology places the ${phenotype.name} phenotype in ${phenotype.region}, with a documented center near ${coords}. ${lead} The sections that follow unpack what that means in practice: the composite face, the traits it summarizes, the naming history, and the sources.`,
    `${lead} Its reference coordinates sit near ${coords} in ${phenotype.region}. Rather than a single portrait, the composite below is a statistical average, and the surrounding sections — traits, distribution, research history, references — give that average its context.`,
  ];
  return pickVariant(phenotype.slug, variants);
}

/**
 * 数据驱动 FAQ（每页 4 问，答案嵌入该页独有数据）。
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function buildPhenotypeFaq(phenotype: Phenotype): FaqItem[] {
  const { physical } = splitDescription(phenotype.description);
  const coords = formatCoords(phenotype);
  const traitLead = physical ? firstSentences(physical, 1) : null;

  const whereAnswers = [
    `The reference coordinates for the ${phenotype.name} phenotype sit near ${coords}, in ${phenotype.region}. That point marks the center of the distribution documented roughly 1500 years ago — actual prevalence spread around it, and modern migration has blurred those boundaries further.`,
    `Historical sources center the ${phenotype.name} phenotype on ${coords} (${phenotype.region}). Treat that as a rough anchor: the type appeared across a wider surrounding area, and its present-day distribution no longer matches the historical map.`,
  ];

  const lookAnswers = traitLead
    ? [
        `The composite emphasizes recurring traits: ${traitLead.charAt(0).toLowerCase()}${traitLead.slice(1)} Full trait details are listed in the physical characteristics section above.`,
        `In the historical literature, ${traitLead.charAt(0).toLowerCase()}${traitLead.slice(1)} These are statistical tendencies across a population, not a checklist every individual matches.`,
      ]
    : [
        `The composite below visualizes the recurring feature pattern recorded for the ${phenotype.name} phenotype; see the physical characteristics section for the trait description preserved from the source literature.`,
      ];

  return [
    {
      question: `Where does the ${phenotype.name} phenotype come from?`,
      answer: pickVariant(phenotype.slug, whereAnswers),
    },
    {
      question: `What does the ${phenotype.name} phenotype look like?`,
      answer: pickVariant(phenotype.slug + "look", lookAnswers),
    },
    {
      question: `Is the ${phenotype.name} phenotype a race or a nationality?`,
      answer: `No. A phenotype is a recurring bundle of visible traits — skull shape, skin tone, hair form — documented by historical anthropologists across a population. It is not a genetic ancestry, not a nationality, and not a statement about any individual person. Two people from the same country can match completely different phenotypes, and one phenotype can span many modern borders.`,
    },
    {
      question: `How does ${phenotype.name} appear in the game?`,
      answer: `In Classic Daily and Challenge Mode, the ${phenotype.name} composite face appears without a label. Your task is to drop a pin on the world map where you think that face is historically most common — the scoring uses the distance between your pin and the reference coordinates near ${coords}. After the round you see the correct location, your distance error, and this entry for review.`,
    },
  ];
}
