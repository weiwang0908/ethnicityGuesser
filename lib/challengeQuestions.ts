import phenotypes from "@/data/phenotypes.json";
import type { Phenotype } from "./dailyQuestions";

/** Challenge 模式题数（固定 38 题，无时限）。 */
export const CHALLENGE_QUESTION_COUNT = 38;

/**
 * 按地区多样性确定性选出 38 题（无随机，无日期 seed）。
 *
 * 策略：轮询所有 region（按首次出现顺序），每轮从每个 region 取下一条
 * 未选 phenotype，直到选满 38 题。209 条数据覆盖 23 个 region，因此
 * 每个 region 至少 1 题（共 23 题），剩余 15 题继续按 region 顺序轮询
 * 分配，保证地域覆盖广泛且顺序固定。
 *
 * 同一份数据集永远返回相同的 38 题，跨设备一致。
 */
export function getChallengeQuestions(): Phenotype[] {
  const all = phenotypes as Phenotype[];

  // 按 region 分组，保留 JSON 原始顺序
  const byRegion = new Map<string, Phenotype[]>();
  const regionOrder: string[] = [];
  for (const p of all) {
    if (!byRegion.has(p.region)) {
      byRegion.set(p.region, []);
      regionOrder.push(p.region);
    }
    byRegion.get(p.region)!.push(p);
  }

  const result: Phenotype[] = [];
  const cursor = new Map<string, number>();
  for (const r of regionOrder) cursor.set(r, 0);

  let remaining = CHALLENGE_QUESTION_COUNT;
  while (remaining > 0) {
    let pickedThisRound = false;
    for (const r of regionOrder) {
      if (remaining <= 0) break;
      const list = byRegion.get(r)!;
      const idx = cursor.get(r)!;
      if (idx < list.length) {
        result.push(list[idx]);
        cursor.set(r, idx + 1);
        remaining--;
        pickedThisRound = true;
      }
    }
    if (!pickedThisRound) break; // 所有 region 已取尽
  }
  return result;
}
