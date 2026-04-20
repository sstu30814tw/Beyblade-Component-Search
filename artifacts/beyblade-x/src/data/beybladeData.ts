/**
 * Re-export layer: merges `beybladeData.generated.ts` (auto-synced from
 * beyblade.phstudy.org / TAKARA TOMY) with human overrides from
 * `overrides.ts`. Consumers should import from here, not from the
 * generated file directly.
 *
 * To regenerate the underlying data:
 *   pnpm --filter @workspace/beyblade-data-sync run sync
 */

import type { Part, Product } from "./beybladeDataTypes";
import {
  generatedAllParts,
  generatedPartTypeOptions,
  generatedProducts,
  generatedProductTypeOptions,
  generatedSeriesOptions,
} from "./beybladeData.generated";
import { applyPartOverrides, productOverrides } from "./overrides";

export type { Part, Product } from "./beybladeDataTypes";

function mergeParts(parts: readonly Part[]): Part[] {
  return parts.map((p) => {
    const override = applyPartOverrides(p.type, p.name);
    return override ? { ...p, nameCn: override } : { ...p };
  });
}

export const products: Product[] = generatedProducts.map((p) => {
  const override = productOverrides[p.code];
  return {
    ...p,
    ...(override ?? {}),
    parts: mergeParts(p.parts),
  };
});

export const allParts: (Part & { products: string[] })[] = generatedAllParts.map(
  (part) => {
    const override = applyPartOverrides(part.type, part.name);
    return {
      ...part,
      nameCn: override ?? part.nameCn,
      products: [...part.products],
    };
  },
);

export const seriesOptions = generatedSeriesOptions;
export const partTypeOptions = generatedPartTypeOptions;
export const productTypeOptions = generatedProductTypeOptions;
