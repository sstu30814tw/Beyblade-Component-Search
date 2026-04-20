/**
 * phstudy main.json 的原始 schema（只列我們會用到的欄位）
 * 實際資料來源：TAKARA TOMY 日本官網（透過 beyblade.phstudy.org 的鏡像 JSON）
 */
export type Lang = "ja-JP" | "en-US" | "en-SG" | "ko-KR" | "zh-TW" | "zh-HK";

export type LangText = Partial<Record<Lang, string>>;

export interface RawPartCommon {
  collection_visible?: Partial<Record<Lang, boolean>>;
  tags?: string[];
  release_at?: string;
  model_name?: string;
  name?: LangText;
  en_name?: string;
  group_id?: string;
  type?: string;
  invalid?: boolean;
  id?: string;
  base_set_id?: string;
  set_id?: string;
}

export interface RawSeries extends RawPartCommon {
  blade_id?: string;
  ratchet_id?: string;
  bit_id?: string;
  lock_chip_id?: string;
  main_blade_id?: string;
  assist_blade_id?: string;
  metal_blade_id?: string;
  over_blade_id?: string;
  kana_name?: string;
  collection_order?: number;
}

export interface RawMainJson {
  data: {
    BeybladePartsBit?: Record<string, RawPartCommon>;
    BeybladePartsBlade?: Record<string, RawPartCommon>;
    BeybladePartsMainBlade?: Record<string, RawPartCommon>;
    BeybladePartsAssistBlade?: Record<string, RawPartCommon>;
    BeybladePartsLockChip?: Record<string, RawPartCommon>;
    BeybladePartsRatchet?: Record<string, RawPartCommon>;
    BeybladePartsMetalBlade?: Record<string, RawPartCommon>;
    BeybladePartsOverBlade?: Record<string, RawPartCommon>;
    BeybladeSeries?: Record<string, RawSeries>;
  };
}

export interface RawMultilangProduct {
  product_id: string;
  url?: string;
  release_date?: string;
  name?: LangText;
  category?: LangText;
  specs?: { type?: string[] };
}

/** 我們資料庫用的 Part 種類 */
export type PartType =
  | "戰刃"
  | "主要戰刃"
  | "金屬戰刃"
  | "超越戰刃"
  | "輔助戰刃"
  | "紋章鎖"
  | "固鎖"
  | "軸心";

export interface GeneratedPart {
  name: string;
  nameCn?: string;
  type: PartType;
}

export type Series = "BX" | "BXH" | "BXG" | "BXC" | "UX" | "CX";

export type ProductType =
  | "入門組"
  | "補充包"
  | "套組"
  | "隨機補充包"
  | "工具"
  | "其他";

export interface GeneratedProduct {
  id: string;
  code: string;
  name: string;
  nameCn: string;
  series: Series;
  productType: ProductType;
  parts: GeneratedPart[];
  note?: string;
  releaseAt?: string;
}
