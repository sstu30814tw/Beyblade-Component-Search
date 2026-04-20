import { useState, useMemo } from "react";
import { products, allParts, seriesOptions, partTypeOptions, productTypeOptions, type Part } from "@/data/beybladeData";

const partTypeColors: Record<Part["type"], { bg: string; text: string; border: string; dot: string }> = {
  戰刃: { bg: "bg-red-950/60", text: "text-red-300", border: "border-red-700/50", dot: "bg-red-400" },
  主要戰刃: { bg: "bg-rose-950/60", text: "text-rose-300", border: "border-rose-700/50", dot: "bg-rose-400" },
  金屬戰刃: { bg: "bg-slate-800/60", text: "text-slate-200", border: "border-slate-500/50", dot: "bg-slate-300" },
  超越戰刃: { bg: "bg-fuchsia-950/60", text: "text-fuchsia-300", border: "border-fuchsia-700/50", dot: "bg-fuchsia-400" },
  輔助戰刃: { bg: "bg-amber-950/60", text: "text-amber-300", border: "border-amber-700/50", dot: "bg-amber-400" },
  紋章鎖: { bg: "bg-yellow-950/60", text: "text-yellow-300", border: "border-yellow-700/50", dot: "bg-yellow-400" },
  固鎖: { bg: "bg-blue-950/60", text: "text-blue-300", border: "border-blue-700/50", dot: "bg-blue-400" },
  軸心: { bg: "bg-emerald-950/60", text: "text-emerald-300", border: "border-emerald-700/50", dot: "bg-emerald-400" },
};

const seriesColors: Record<string, string> = {
  BX: "text-sky-300 bg-sky-900/40 border-sky-700/40",
  BXH: "text-cyan-300 bg-cyan-900/40 border-cyan-700/40",
  BXG: "text-yellow-300 bg-yellow-900/40 border-yellow-700/40",
  BXC: "text-pink-300 bg-pink-900/40 border-pink-700/40",
  UX: "text-purple-300 bg-purple-900/40 border-purple-700/40",
  CX: "text-orange-300 bg-orange-900/40 border-orange-700/40",
};

function formatReleaseDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

type SearchMode = "part" | "product";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("part");
  const [selectedPartType, setSelectedPartType] = useState<string>("全部");
  const [selectedSeries, setSelectedSeries] = useState<string>("全部");
  const [selectedProductType, setSelectedProductType] = useState<string>("全部");

  const filteredParts = useMemo(() => {
    if (searchMode !== "part") return [];
    const q = query.trim().toLowerCase();
    // Handle "X軸" pattern → search for bit code X (e.g. "I軸" → bit starts with "i")
    const bitCode = q.endsWith("軸") && q.length > 1 ? q.slice(0, -1) : "";
    // Handle "X固鎖" or "X鎖" pattern
    const ratchetCode = (q.endsWith("固鎖") || q.endsWith("鎖")) && q.length > 1
      ? q.replace(/固鎖$|鎖$/, "")
      : "";
    return allParts.filter((p) => {
      const typeMatch = selectedPartType === "全部" || p.type === selectedPartType;
      const nameMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.nameCn && p.nameCn.toLowerCase().includes(q)) ||
        p.products.some((code) => code.toLowerCase().includes(q)) ||
        (bitCode && p.type === "軸心" && p.name.toLowerCase().startsWith(bitCode)) ||
        (ratchetCode && p.type === "固鎖" && p.name.toLowerCase().startsWith(ratchetCode));
      return typeMatch && nameMatch;
    });
  }, [query, selectedPartType, searchMode]);

  const filteredProducts = useMemo(() => {
    if (searchMode !== "product") return [];
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const seriesMatch = selectedSeries === "全部" || p.series === selectedSeries;
      const typeMatch = selectedProductType === "全部" || p.productType === selectedProductType;
      const nameMatch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.nameCn.toLowerCase().includes(q) ||
        p.parts.some(
          (part) => part.name.toLowerCase().includes(q) || (part.nameCn && part.nameCn.toLowerCase().includes(q))
        );
      return seriesMatch && typeMatch && nameMatch;
    });
  }, [query, selectedSeries, selectedProductType, searchMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/15 via-purple-600/8 to-blue-600/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            <span className="size-1.5 animate-pulse rounded-full bg-indigo-400" />
            台灣版 Takara Tomy
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Beyblade X
            </span>
          </h1>
          <p className="mt-2 text-xl font-bold text-indigo-300">戰鬥陀螺 配件查詢系統</p>
          <p className="mt-2 text-sm text-white/40">
            輸入配件名稱或產品編號，快速找到含有該配件的產品
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-white/30">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-400" />戰刃（Blade）</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-400" />固鎖（Ratchet）</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400" />軸心（Bit）</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" />輔助戰刃（Assist Blade，CX專屬）</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Search Mode Toggle */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setSearchMode("part")}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              searchMode === "part"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            依配件搜尋
          </button>
          <button
            onClick={() => setSearchMode("product")}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              searchMode === "product"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            依產品搜尋
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <svg className="size-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === "part"
                ? "搜尋配件，例如：I軸、GF、蒼龍神劍、3-60..."
                : "搜尋產品，例如：BX-23、鳳凰飛翼、CX-13..."
            }
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-10 text-base text-white placeholder:text-white/25 backdrop-blur-sm outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-white/25 hover:text-white/60 transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        {searchMode === "part" && (
          <div className="mb-6 flex flex-wrap gap-2">
            {partTypeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPartType(type)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  selectedPartType === type
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8 hover:text-white/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {searchMode === "product" && (
          <div className="mb-6 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="self-center text-xs text-white/30">系列：</span>
              {seriesOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedSeries === s
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8 hover:text-white/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="self-center text-xs text-white/30">類型：</span>
              {productTypeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedProductType(t)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedProductType === t
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/8 hover:text-white/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchMode === "part" ? (
          <PartResults parts={filteredParts} query={query} selectedType={selectedPartType} />
        ) : (
          <ProductResults prods={filteredProducts} query={query} />
        )}
      </div>

      <div className="mt-12 border-t border-white/5 py-6 text-center text-xs text-white/15">
        <p>資料來源：TAKARA TOMY 官方公開資料（透過 <a href="https://beyblade.phstudy.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">beyblade.phstudy.org</a> 鏡像）。僅收錄台灣上市品項，資料自動同步，以實際市售為準。Beyblade X 為 TAKARA TOMY 商標。</p>
      </div>
    </div>
  );
}

function PartResults({
  parts,
  query,
  selectedType,
}: {
  parts: typeof allParts;
  query: string;
  selectedType: string;
}) {
  if (parts.length === 0 && query) {
    return (
      <div className="mt-12 text-center text-white/40">
        <div className="text-5xl mb-3">🔍</div>
        <p className="text-lg font-semibold">找不到符合「{query}」的配件</p>
        <p className="mt-1 text-sm">試試其他關鍵字，例如：I軸、GF、3-60、蒼龍神劍...</p>
      </div>
    );
  }

  const showAll = !query && selectedType === "全部";

  if (showAll) {
    return <PartAllGrouped />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-white/35">
        找到 <span className="font-bold text-indigo-300">{parts.length}</span> 個配件
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {parts.map((part) => (
          <PartCard key={`${part.type}|${part.name}`} part={part} />
        ))}
      </div>
    </div>
  );
}

function PartCard({ part }: { part: (typeof allParts)[0] }) {
  const colors = partTypeColors[part.type];
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4 transition-all hover:border-indigo-500/40 hover:bg-white/6">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${colors.bg} ${colors.text} ${colors.border}`}>
              <span className={`size-1.5 rounded-full ${colors.dot}`} />
              {part.type}
            </span>
            <div>
              {part.nameCn && <span className="font-bold text-white mr-1.5">{part.nameCn}</span>}
              {part.nameCn && part.nameCn !== part.name && (
                <span className="text-xs text-white/35">{part.name}</span>
              )}
              {!part.nameCn && <span className="font-bold text-white">{part.name}</span>}
            </div>
          </div>
          <p className="mb-2 text-xs text-white/35">包含於以下產品：</p>
          <div className="flex flex-wrap gap-1.5">
            {part.products.map((code) => {
              const product = products.find((p) => p.code === code);
              return (
                <div key={code} className="group relative">
                  <span className={`cursor-default rounded-lg border px-2 py-1 text-xs font-mono font-bold transition-colors ${
                    product ? seriesColors[product.series] : "bg-indigo-900/50 text-indigo-300 border-indigo-700/40"
                  }`}>
                    {code}
                  </span>
                  {product && (
                    <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 hidden w-max max-w-64 rounded-xl border border-white/10 bg-slate-800/95 p-2.5 text-xs shadow-2xl backdrop-blur group-hover:block">
                      <p className="font-bold text-white text-sm">{product.nameCn}</p>
                      <p className="text-white/40 mt-0.5">{product.series} 系列 · {product.productType}</p>
                      {product.releaseAt && (
                        <p className="text-white/40 mt-0.5">
                          {product.upcoming ? "預計" : ""}上市：{formatReleaseDate(product.releaseAt)}
                          {product.upcoming && <span className="ml-1 text-rose-300 font-bold">未上市</span>}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PartAllGrouped() {
  const grouped = useMemo(() => {
    const map: Partial<Record<Part["type"], typeof allParts>> = {};
    for (const part of allParts) {
      if (!map[part.type]) map[part.type] = [];
      map[part.type]!.push(part);
    }
    return map;
  }, []);

  const typeOrder: Part["type"][] = ["戰刃", "固鎖", "軸心", "輔助戰刃"];

  return (
    <div className="space-y-8">
      <p className="text-sm text-white/35">輸入關鍵字搜尋，或瀏覽下方全部配件列表</p>
      {typeOrder.map((type) => {
        const parts = grouped[type] ?? [];
        if (parts.length === 0) return null;
        const colors = partTypeColors[type];
        return (
          <div key={type}>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${colors.bg} ${colors.text} ${colors.border}`}>
                <span className={`size-2 rounded-full ${colors.dot}`} />
                {type}
              </span>
              <span className="text-white/30 text-sm font-normal">（{parts.length} 種）</span>
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {parts.map((part) => (
                <div
                  key={`${part.type}|${part.name}`}
                  className="rounded-xl border border-white/6 bg-white/3 p-3 hover:border-indigo-500/30 hover:bg-white/5 transition-all"
                >
                  <div className="min-w-0">
                    {part.nameCn && part.nameCn !== part.name ? (
                      <>
                        <p className="font-bold text-white text-sm leading-tight">{part.nameCn}</p>
                        <p className="text-white/35 text-xs mt-0.5">{part.name}</p>
                      </>
                    ) : (
                      <p className="font-bold text-white text-sm">{part.name}</p>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {part.products.map((code) => {
                      const product = products.find((p) => p.code === code);
                      return (
                        <span
                          key={code}
                          className={`rounded border px-1.5 py-0.5 text-xs font-mono font-semibold ${
                            product ? seriesColors[product.series] : "bg-indigo-900/50 text-indigo-300 border-indigo-700/40"
                          }`}
                        >
                          {code}
                        </span>
                      );
                    })}
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
  prods,
  query,
}: {
  prods: typeof products;
  query: string;
}) {
  if (prods.length === 0 && query) {
    return (
      <div className="mt-12 text-center text-white/40">
        <div className="text-5xl mb-3">📦</div>
        <p className="text-lg font-semibold">找不到符合「{query}」的產品</p>
        <p className="mt-1 text-sm">試試產品編號，例如：BX-23、CX-13、鳳凰飛翼...</p>
      </div>
    );
  }

  const displayProducts = prods.length > 0 ? prods : products;

  return (
    <div>
      <p className="mb-4 text-sm text-white/35">
        顯示 <span className="font-bold text-indigo-300">{displayProducts.length}</span> 個產品
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-white/8 bg-white/4 p-4 transition-all hover:border-indigo-500/40 hover:bg-white/6"
          >
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <span className={`font-mono font-black text-sm rounded-lg border px-2.5 py-1 ${seriesColors[product.series]}`}>
                {product.code}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">
                {product.productType}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${seriesColors[product.series]}`}>
                {product.series} 系列
              </span>
              {product.upcoming && (
                <span className="rounded-full border border-rose-500/60 bg-rose-950/60 px-2 py-0.5 text-xs font-bold text-rose-300">
                  未上市
                </span>
              )}
              {product.releaseAt && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/50">
                  {product.upcoming ? "預計上市" : "上市"}：{formatReleaseDate(product.releaseAt)}
                </span>
              )}
            </div>
            <h3 className="font-bold text-white leading-snug">{product.nameCn}</h3>
            {product.note && (
              <p className="mt-1 text-xs text-amber-400/60">{product.note}</p>
            )}
            <div className="mt-3 space-y-1.5">
              {product.parts.map((part, i) => {
                const colors = partTypeColors[part.type];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-xs font-bold whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border}`}>
                      {part.type}
                    </span>
                    <span className="text-sm text-white/75">
                      {part.nameCn && part.nameCn !== part.name ? (
                        <>{part.nameCn} <span className="text-white/30 text-xs">{part.name}</span></>
                      ) : (
                        part.name
                      )}
                    </span>
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
