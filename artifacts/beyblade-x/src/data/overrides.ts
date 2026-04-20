/**
 * 人工覆寫：同步後仍想強制使用的翻譯或欄位。
 *
 * 規則：
 * - productOverrides：以產品 code 為 key（例如 "BX-04"），可覆寫 nameCn / note / productType。
 * - partNameCnOverrides：以 `"${type}|${name}"` 為 key（例如 "戰刃|DranSword"），
 *   或以 `"${type}|${name}"`（無中文名的單純英文部件）為 key，值為中文名。
 *
 * 同步來源若與此處衝突，以下方覆寫為準。
 */

import type { PartType, ProductType, Series } from "./beybladeDataTypes";

export const productOverrides: Record<
  string,
  {
    nameCn?: string;
    note?: string;
    productType?: ProductType;
    series?: Series;
  }
> = {
  // 範例：
  // "BX-04": { nameCn: "騎士神盾" },
};

export const partNameCnOverrides: Record<string, string> = {
  // 範例：
  // "戰刃|KnightShield": "騎士神盾",
};

/**
 * 額外補上同步來源缺少的 part 中文名（純英文的 ratchet/bit 不需要覆寫，
 * 這個表適合用來補官方尚未有台灣譯名但你想填入的零件）。
 */
export function applyPartOverrides(type: PartType, name: string): string | undefined {
  return partNameCnOverrides[`${type}|${name}`];
}
