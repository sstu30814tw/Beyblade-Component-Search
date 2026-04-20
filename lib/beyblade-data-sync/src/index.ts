import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type {
  GeneratedPart,
  GeneratedProduct,
  PartType,
  ProductType,
  RawMainJson,
  RawMultilangProduct,
  RawPartCommon,
  RawSeries,
  Series,
} from "./types.js";

const MAIN_JSON = "https://beyblade.phstudy.org/data/main.json";
const HARDCODED_JSON = "https://beyblade.phstudy.org/data/hardcoded.json";
const MULTILANG_JSON = "https://beyblade.phstudy.org/data/products_multilang.json";

const OUTPUT = new URL(
  "../../../artifacts/beyblade-x/src/data/beybladeData.generated.ts",
  import.meta.url,
);

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      // Identify ourselves so the source owner can see this traffic.
      "user-agent":
        "beyblade-component-search-sync/1.0 (+https://github.com/sstu30814tw/Beyblade-Component-Search)",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

function toTwText(t: RawPartCommon["name"]): string | undefined {
  const raw = t?.["zh-TW"] || t?.["zh-HK"] || t?.["en-US"] || t?.["ja-JP"];
  return raw ? raw.replace(/<[^>]+>/g, "").trim() : undefined;
}

function isTwVisible(p: RawPartCommon): boolean {
  return !!p.collection_visible?.["zh-TW"] && !p.invalid;
}

/**
 * Parse part Chinese name out of series.name (which is like
 * "BX-01 蒼龍神劍 3-60F"). The series zh-TW name contains the
 * product code + blade Chinese name + ratchet/bit config. Use it
 * to extract per-part Chinese labels when the part's own name
 * only contains the ASCII model code.
 */
function splitSeriesTwName(seriesTwName: string | undefined): {
  bladeCn?: string;
} {
  if (!seriesTwName) return {};
  // Remove leading product code like "BX-01 " or "BXG-57-01 "
  const rest = seriesTwName.replace(/^[A-Z]+-\d+(?:-\d+)?\s*/, "");
  // Split by space - first chunk is the blade name, then the ratchet/bit config.
  // But some names are "蒼龍神劍3-60F" without space; try both.
  const spaceSplit = rest.split(/\s+/);
  if (spaceSplit.length >= 2) {
    return { bladeCn: spaceSplit[0] };
  }
  // No space - try to strip trailing digits/letters config
  const m = rest.match(/^([^\d]+?)(?:[A-Z]?\d.*)?$/);
  if (m && m[1]) return { bladeCn: m[1].trim() };
  return {};
}

const CATEGORY_MAP: Record<string, ProductType> = {
  入門組: "入門組",
  補充包: "補充包",
  套組: "套組",
  隨機補充包: "隨機補充包",
  工具: "工具",
};

const PART_TYPE_BY_COLLECTION: Record<string, PartType> = {
  BeybladePartsBlade: "戰刃",
  BeybladePartsMainBlade: "主要戰刃",
  BeybladePartsMetalBlade: "金屬戰刃",
  BeybladePartsOverBlade: "超越戰刃",
  BeybladePartsAssistBlade: "輔助戰刃",
  BeybladePartsLockChip: "紋章鎖",
  BeybladePartsRatchet: "固鎖",
  BeybladePartsBit: "軸心",
};

function detectSeries(code: string): Series | null {
  const m = code.match(/^(BXH|BXG|BXC|BX|UX|CX)-/);
  return (m?.[1] as Series | undefined) ?? null;
}

async function main(): Promise<void> {
  console.log("[sync] fetching phstudy data…");
  const [mainJson, hardcodedJson, multilang] = await Promise.all([
    fetchJson<RawMainJson>(MAIN_JSON),
    fetchJson<RawMainJson>(HARDCODED_JSON),
    fetchJson<RawMultilangProduct[]>(MULTILANG_JSON),
  ]);

  // Merge hardcoded.json into main.json. hardcoded wins on conflicts
  // (it's phstudy's override/pre-release table for upcoming products).
  const data: RawMainJson["data"] = {};
  const collections: Array<keyof RawMainJson["data"]> = [
    "BeybladePartsBit",
    "BeybladePartsBlade",
    "BeybladePartsMainBlade",
    "BeybladePartsAssistBlade",
    "BeybladePartsLockChip",
    "BeybladePartsRatchet",
    "BeybladePartsMetalBlade",
    "BeybladePartsOverBlade",
    "BeybladeSeries",
  ];
  for (const key of collections) {
    (data as Record<string, Record<string, RawPartCommon>>)[key] = {
      ...(mainJson.data[key] ?? {}),
      ...(hardcodedJson.data[key] ?? {}),
    };
  }
  const series = data.BeybladeSeries ?? {};

  // Build category lookup by product code (e.g. "BX-01" → "入門組")
  const categoryByCode = new Map<string, ProductType>();
  for (const p of multilang) {
    const code = normalizeCode(p.product_id);
    const twCat = p.category?.["zh-TW"];
    if (code && twCat && CATEGORY_MAP[twCat]) {
      categoryByCode.set(code, CATEGORY_MAP[twCat]);
    }
  }

  // Lookup helpers for part collections
  const partLookups: Array<[keyof RawMainJson["data"], PartType]> = [
    ["BeybladePartsBlade", "戰刃"],
    ["BeybladePartsMainBlade", "主要戰刃"],
    ["BeybladePartsMetalBlade", "金屬戰刃"],
    ["BeybladePartsOverBlade", "超越戰刃"],
    ["BeybladePartsAssistBlade", "輔助戰刃"],
    ["BeybladePartsLockChip", "紋章鎖"],
    ["BeybladePartsRatchet", "固鎖"],
    ["BeybladePartsBit", "軸心"],
  ];

  /** Find a part by its ID in any of the part collections */
  function lookupPart(
    id: string | undefined,
  ): { raw: RawPartCommon; type: PartType } | undefined {
    if (!id) return undefined;
    for (const [col, type] of partLookups) {
      const bag = data[col] as Record<string, RawPartCommon> | undefined;
      if (bag && bag[id]) return { raw: bag[id]!, type };
    }
    return undefined;
  }

  const products: GeneratedProduct[] = [];

  // Series come keyed by ID; iterate in collection_order for stable output
  const seriesEntries = Object.values(series)
    .filter((s) => isTwVisible(s))
    .sort((a, b) => {
      const oa = a.collection_order ?? 0;
      const ob = b.collection_order ?? 0;
      if (oa !== ob) return oa - ob;
      return (a.id ?? "").localeCompare(b.id ?? "");
    });

  for (const s of seriesEntries) {
    const code = s.set_id || s.base_set_id;
    if (!code || code === "undefined") continue;
    const seriesPrefix = detectSeries(code);
    if (!seriesPrefix) continue;
    const twName = toTwText(s.name);
    if (!twName) continue;

    // Build parts list in a canonical order:
    // blade → lock_chip → main_blade → metal_blade → over_blade → ratchet → assist_blade → bit
    const partIds: Array<string | undefined> = [
      s.blade_id,
      s.lock_chip_id,
      s.main_blade_id,
      s.metal_blade_id,
      s.over_blade_id,
      s.ratchet_id,
      s.assist_blade_id,
      s.bit_id,
    ];

    const seenGroups = new Set<string>();
    const parts: GeneratedPart[] = [];
    for (const pid of partIds) {
      const hit = lookupPart(pid);
      if (!hit) continue;
      // Deduplicate across collections: e.g. same blade found in both
      // BeybladePartsBlade and BeybladePartsMainBlade
      const dedupKey = `${hit.type}|${hit.raw.group_id || hit.raw.en_name || hit.raw.id}`;
      if (seenGroups.has(dedupKey)) continue;
      seenGroups.add(dedupKey);

      const rawCn = toTwText(hit.raw.name);
      const english = hit.raw.en_name?.trim();
      parts.push(buildPart(hit.type, english, rawCn, pid!, s));
    }

    const productType =
      categoryByCode.get(normalizeCode(code) ?? "") ?? inferProductType(s, code);

    // nameCn strategy: use series zh-TW name directly (already includes code)
    // but strip the code prefix so the card's `code` chip doesn't duplicate.
    const nameCn = twName.replace(new RegExp(`^${escapeRegex(code)}\\s*`), "").trim() || twName;
    const name = toEnglishName(s) ?? nameCn;

    products.push({
      id: s.id || code,
      code,
      name,
      nameCn,
      series: seriesPrefix,
      productType,
      parts,
      releaseAt: s.release_at,
    });
  }

  // Build allParts by aggregating parts across products
  const allParts = buildAllParts(products);

  // Series / filter options
  const seriesOptions: ReadonlyArray<"全部" | Series> = [
    "全部",
    "BX",
    "BXH",
    "BXG",
    "BXC",
    "UX",
    "CX",
  ];
  const partTypeOptions: ReadonlyArray<"全部" | PartType> = [
    "全部",
    "戰刃",
    "主要戰刃",
    "金屬戰刃",
    "超越戰刃",
    "輔助戰刃",
    "紋章鎖",
    "固鎖",
    "軸心",
  ];
  const productTypeSet = new Set<ProductType>();
  for (const p of products) productTypeSet.add(p.productType);
  const productTypeOptions: ReadonlyArray<"全部" | ProductType> = [
    "全部",
    ...[...productTypeSet].sort(),
  ];

  await writeOutput({
    products,
    allParts,
    seriesOptions,
    partTypeOptions,
    productTypeOptions,
  });

  console.log(
    `[sync] done. products=${products.length}, allParts=${allParts.length}`,
  );
}

function normalizeCode(id: string | undefined): string | null {
  if (!id) return null;
  // Raw product_id is like "BX01", "BX01_01", "BXG01", etc.
  // Convert to display form: "BX-01", "BX-01-01"
  const m = id.match(/^([A-Z]+?)(\d+)(?:_(\d+))?$/);
  if (!m) return id;
  const prefix = m[1];
  const a = m[2];
  const b = m[3];
  return b ? `${prefix}-${a}-${b}` : `${prefix}-${a}`;
}

function inferProductType(s: RawSeries, _code: string): ProductType {
  const tags = s.tags ?? [];
  if (tags.includes("booster")) return "補充包";
  if (tags.includes("starter")) return "入門組";
  if (tags.includes("random")) return "隨機補充包";
  return "其他";
}

function toEnglishName(s: RawSeries): string | undefined {
  const en = s.name?.["en-US"] || s.name?.["en-SG"];
  if (!en) return undefined;
  // strip leading "BX-01 " code
  return en.replace(/^[A-Z]+-\d+(?:-\d+)?\s*/, "").trim();
}

function buildPart(
  type: PartType,
  english: string | undefined,
  cn: string | undefined,
  _id: string,
  series: RawSeries,
): GeneratedPart {
  // part.name (English code, e.g. "DranSword", "3-60", "F")
  // phstudy's part name for ratchet/bit often already matches "3-60" / "F"
  // For blades, en_name is like "DRANSWORD" - convert to PascalCase for consistency
  const name = english ? formatEnglishPartName(english, type) : cn || "?";
  // Chinese: prefer the part's own zh-TW; fallback to parsing from series name for blade
  let nameCn: string | undefined;
  const cleaned = cleanPartNameCn(cn, series);
  if (cleaned && cleaned !== name) nameCn = cleaned;
  if (!nameCn && (type === "戰刃" || type === "主要戰刃" || type === "金屬戰刃" || type === "超越戰刃")) {
    const { bladeCn } = splitSeriesTwName(series.name?.["zh-TW"]);
    if (bladeCn && bladeCn !== name) nameCn = bladeCn;
  }
  return { name, nameCn, type };
}

/**
 * Remove noise from a part's zh-TW name. Input is something like
 * "BX-01 蒼龍神劍 金屬塗層:燦金" or "BXH-02 3-80" or "BX-01 F".
 * We strip the leading product code and trailing coat/variant suffix;
 * if the remainder is just ASCII (like "3-80" or "F"), return undefined
 * so it falls back to the English `name`.
 */
function cleanPartNameCn(
  raw: string | undefined,
  _series: RawSeries,
): string | undefined {
  if (!raw) return undefined;
  let s = raw;
  // strip any HTML tags (phstudy sometimes wraps the code in <b>…</b>)
  s = s.replace(/<[^>]+>/g, "");
  // strip leading product code (e.g. "BX-01 ", "BXG-57-01 ")
  s = s.replace(/^[A-Z]+-\d+(?:-\d+)?\s*/, "");
  // strip trailing coat/variant markers
  s = s
    .replace(/金屬塗層\s*[:：].*$/u, "")
    .replace(/メタルコート\s*[:：].*$/u, "")
    .replace(/Metallic\s*Coat\s*[:：].*$/iu, "")
    .trim();
  if (!s) return undefined;
  // If only ASCII/digits/dash/dot left, it's just the code, no Chinese
  if (/^[\x20-\x7e]+$/.test(s)) return undefined;
  return s;
}

function formatEnglishPartName(en: string, type: PartType): string {
  const up = en.trim();
  // For ratchets like "3-60" and bits like "F", leave as-is
  if (type === "固鎖" || type === "紋章鎖" || type === "軸心") return up;
  // For blades convert ALLCAPS -> PascalCase (best-effort; handles "DRANSWORD" -> "DranSword")
  // Known compound words in the current dataset:
  const known: Record<string, string> = {
    DRANSWORD: "DranSword",
    HELLSSCYTHE: "HellsScythe",
    WIZARDARROW: "WizardArrow",
    KNIGHTSHIELD: "KnightShield",
    SAMURAISABER: "SamuraiSaber",
    SAMURAISPEAR: "SamuraiSpear",
    PHOENIXFEATHER: "PhoenixFeather",
    PHOENIXTAIL: "PhoenixTail",
    PHOENIXWING: "PhoenixWing",
  };
  if (known[up]) return known[up]!;
  // Generic: keep first letter capitalised, rest lower-case
  return up.charAt(0) + up.slice(1).toLowerCase();
}

function buildAllParts(products: GeneratedProduct[]): Array<{
  name: string;
  nameCn?: string;
  type: PartType;
  products: string[];
}> {
  const map = new Map<
    string,
    { name: string; nameCn?: string; type: PartType; products: Set<string> }
  >();
  for (const prod of products) {
    for (const part of prod.parts) {
      const key = `${part.type}|${part.name}`;
      let entry = map.get(key);
      if (!entry) {
        entry = {
          name: part.name,
          nameCn: part.nameCn,
          type: part.type,
          products: new Set<string>(),
        };
        map.set(key, entry);
      } else if (!entry.nameCn && part.nameCn) {
        entry.nameCn = part.nameCn;
      }
      entry.products.add(prod.code);
    }
  }
  return [...map.values()].map((e) => ({
    name: e.name,
    nameCn: e.nameCn,
    type: e.type,
    products: [...e.products].sort(),
  }));
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function writeOutput(args: {
  products: GeneratedProduct[];
  allParts: ReturnType<typeof buildAllParts>;
  seriesOptions: ReadonlyArray<string>;
  partTypeOptions: ReadonlyArray<string>;
  productTypeOptions: ReadonlyArray<string>;
}): Promise<void> {
  const { products, allParts, seriesOptions, partTypeOptions, productTypeOptions } = args;
  const banner = `/**
 * ⚠️  This file is auto-generated by @workspace/beyblade-data-sync.
 *     DO NOT edit by hand. Run \`pnpm run sync:beyblade-data\` to regenerate.
 *
 * Source: https://beyblade.phstudy.org/data/ (mirrors TAKARA TOMY official JSON)
 * Filter: only products with zh-TW visibility (台灣上市) are included.
 * Generated at: ${new Date().toISOString()}
 */

import type { Part, Product } from "./beybladeDataTypes";

export const generatedProducts: readonly Product[] = ${JSON.stringify(products, null, 2)} as const;

export const generatedAllParts: readonly (Part & { products: string[] })[] = ${JSON.stringify(
    allParts,
    null,
    2,
  )} as const;

export const generatedSeriesOptions = ${JSON.stringify(seriesOptions)} as const;
export const generatedPartTypeOptions = ${JSON.stringify(partTypeOptions)} as const;
export const generatedProductTypeOptions = ${JSON.stringify(productTypeOptions)} as const;
`;

  const outPath = OUTPUT.pathname.startsWith("/") && process.platform === "win32"
    ? OUTPUT.pathname.slice(1)
    : OUTPUT.pathname;
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, banner, "utf8");
  console.log(`[sync] wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
