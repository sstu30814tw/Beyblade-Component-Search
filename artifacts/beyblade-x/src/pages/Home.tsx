import { useState, useMemo } from "react";
import { products, allParts, partTypes, type Part } from "@/data/beybladeData";

const partTypeColors: Record<Part["type"], { bg: string; text: string; border: string }> = {
  刀刃: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  鼓輪: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  軸心: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  套組: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

type SearchMode = "part" | "product";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("全部");
  const [searchMode, setSearchMode] = useState<SearchMode>("part");

  const filteredParts = useMemo(() => {
    if (searchMode !== "part") return [];
    const q = query.trim().toLowerCase();
    return allParts.filter((p) => {
      const typeMatch = selectedType === "全部" || p.type === selectedType;
      const nameMatch =
        !q || p.name.toLowerCase().includes(q) || p.products.some((code) => code.toLowerCase().includes(q));
      return typeMatch && nameMatch;
    });
  }, [query, selectedType, searchMode]);

  const filteredProducts = useMemo(() => {
    if (searchMode !== "product") return [];
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const nameMatch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.nameTw.toLowerCase().includes(q) ||
        p.parts.some((part) => part.name.toLowerCase().includes(q));
      return nameMatch;
    });
  }, [query, searchMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-blue-600/20" />
        <div className="relative mx-auto max-w-5xl px-4 py-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-300">
            <span className="size-1.5 animate-pulse rounded-full bg-indigo-400" />
            台灣版
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Beyblade X
            </span>
          </h1>
          <p className="mt-2 text-lg font-semibold text-indigo-300">配件查詢系統</p>
          <p className="mt-1 text-sm text-white/50">
            輸入配件名稱或產品編號，快速找到含有該配件的產品
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Search Mode Toggle */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setSearchMode("part")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              searchMode === "part"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            依配件搜尋
          </button>
          <button
            onClick={() => setSearchMode("product")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              searchMode === "product"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            依產品搜尋
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <svg className="size-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === "part"
                ? "搜尋配件名稱，例如：I軸、Wizard Arrow、4-80..."
                : "搜尋產品編號或名稱，例如：BX-07、地獄鐮刀..."
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-base text-white placeholder:text-white/30 backdrop-blur-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white/60"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Part Type Filter (only in part mode) */}
        {searchMode === "part" && (
          <div className="mb-6 flex flex-wrap gap-2">
            {partTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  selectedType === type
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {searchMode === "part" ? (
          <PartResults parts={filteredParts} query={query} />
        ) : (
          <ProductResults products={filteredProducts} query={query} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-white/5 py-6 text-center text-xs text-white/20">
        <p>資料僅供參考，以實際台灣市售產品為準。Beyblade X 為 TAKARA TOMY 商標。</p>
      </div>
    </div>
  );
}

function PartResults({
  parts,
  query,
}: {
  parts: typeof allParts;
  query: string;
}) {
  if (parts.length === 0 && query) {
    return (
      <div className="mt-8 text-center text-white/40">
        <div className="text-4xl mb-3">🔍</div>
        <p>找不到符合「{query}」的配件</p>
        <p className="mt-1 text-sm">試試其他關鍵字，例如：I軸、GF、HF...</p>
      </div>
    );
  }

  if (parts.length === 0) {
    return <PartAllList />;
  }

  return (
    <div>
      <p className="mb-3 text-sm text-white/40">
        找到 <span className="font-semibold text-indigo-300">{parts.length}</span> 個配件
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {parts.map((part) => {
          const colors = partTypeColors[part.type];
          return (
            <div
              key={`${part.type}|${part.name}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-white/8"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
                      {part.type}
                    </span>
                    <h3 className="font-bold text-white">{part.name}</h3>
                  </div>
                  <div className="mt-2">
                    <p className="mb-1.5 text-xs text-white/40">包含於以下產品：</p>
                    <div className="flex flex-wrap gap-1.5">
                      {part.products.map((code) => {
                        const product = products.find((p) => p.code === code);
                        return (
                          <div key={code} className="group relative">
                            <span className="cursor-default rounded-lg bg-indigo-900/60 border border-indigo-700/40 px-2 py-1 text-xs font-mono font-semibold text-indigo-300 transition hover:bg-indigo-800/60">
                              {code}
                            </span>
                            {product && (
                              <div className="absolute bottom-full left-0 z-10 mb-1 hidden w-max max-w-52 rounded-xl border border-white/10 bg-slate-800 p-2 text-xs shadow-xl group-hover:block">
                                <p className="font-semibold text-white">{product.nameTw}</p>
                                <p className="text-white/50">{product.type}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PartAllList() {
  const grouped = useMemo(() => {
    const map: Record<string, typeof allParts> = {};
    for (const part of allParts) {
      if (!map[part.type]) map[part.type] = [];
      map[part.type].push(part);
    }
    return map;
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/40">輸入關鍵字搜尋，或瀏覽下方全部配件列表</p>
      {(["刀刃", "鼓輪", "軸心"] as const).map((type) => {
        const colors = partTypeColors[type];
        const parts = grouped[type] ?? [];
        return (
          <div key={type}>
            <h2 className={`mb-3 flex items-center gap-2 text-base font-bold`}>
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                {type}
              </span>
              <span className="text-white/40 text-sm font-normal">（{parts.length} 種）</span>
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {parts.map((part) => (
                <div
                  key={part.name}
                  className="rounded-xl border border-white/8 bg-white/4 p-3 hover:border-indigo-500/40 hover:bg-white/6 transition-all"
                >
                  <p className="font-semibold text-white text-sm">{part.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {part.products.map((code) => (
                      <span key={code} className="rounded bg-indigo-900/50 px-1.5 py-0.5 text-xs font-mono text-indigo-300">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductResults({
  products: prods,
  query,
}: {
  products: typeof products;
  query: string;
}) {
  if (prods.length === 0 && query) {
    return (
      <div className="mt-8 text-center text-white/40">
        <div className="text-4xl mb-3">📦</div>
        <p>找不到符合「{query}」的產品</p>
        <p className="mt-1 text-sm">試試產品編號，例如：BX-07、CX-13...</p>
      </div>
    );
  }

  const displayProducts = prods.length > 0 ? prods : products;

  return (
    <div>
      <p className="mb-3 text-sm text-white/40">
        顯示 <span className="font-semibold text-indigo-300">{displayProducts.length}</span> 個產品
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-white/8"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold text-indigo-300 text-sm">{product.code}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/50">
                {product.type}
              </span>
            </div>
            <h3 className="font-bold text-white text-sm leading-snug">{product.nameTw}</h3>
            {product.note && (
              <p className="mt-1 text-xs text-amber-400/70">{product.note}</p>
            )}
            <div className="mt-3 space-y-1.5">
              {product.parts.map((part, i) => {
                const colors = partTypeColors[part.type];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`inline-flex w-10 shrink-0 justify-center rounded border px-1 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
                      {part.type}
                    </span>
                    <span className="text-sm text-white/80">{part.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
