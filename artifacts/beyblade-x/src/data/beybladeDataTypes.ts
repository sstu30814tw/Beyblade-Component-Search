export type PartType =
  | "戰刃"
  | "主要戰刃"
  | "金屬戰刃"
  | "超越戰刃"
  | "輔助戰刃"
  | "紋章鎖"
  | "固鎖"
  | "軸心";

export type Series = "BX" | "BXH" | "BXG" | "BXC" | "UX" | "CX";

export type ProductType =
  | "入門組"
  | "補充包"
  | "套組"
  | "隨機補充包"
  | "工具"
  | "其他";

export interface Part {
  name: string;
  nameCn?: string;
  type: PartType;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameCn: string;
  series: Series;
  productType: ProductType;
  parts: Part[];
  note?: string;
  releaseAt?: string;
  upcoming?: boolean;
}
