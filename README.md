# Beyblade Component Search

[![Deploy to GitHub Pages](https://github.com/sstu30814tw/Beyblade-Component-Search/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/sstu30814tw/Beyblade-Component-Search/actions/workflows/deploy-pages.yml)
[![Sync Beyblade Data](https://github.com/sstu30814tw/Beyblade-Component-Search/actions/workflows/sync-beyblade-data.yml/badge.svg)](https://github.com/sstu30814tw/Beyblade-Component-Search/actions/workflows/sync-beyblade-data.yml)

> 🌀 Beyblade X 台灣上市零件／產品查詢工具

線上網站：**<https://sstu30814tw.github.io/Beyblade-Component-Search/>**

用一個搜尋框快速查詢「某顆零件在哪幾款產品裡」或「某款產品包含哪些零件」，資料每週自動從 TAKARA TOMY 官方公開資料同步。

---

## 功能

- 🔎 **零件搜尋**：以中文／英文／產品編號（例如 `UX-09`、`3-60`、`I軸`）查詢
- 📦 **產品搜尋**：反查某款產品包含的戰刃、固鎖、軸心等組合
- 🎨 **分類標籤**：戰刃／主要戰刃／金屬戰刃／超越戰刃／輔助戰刃／紋章鎖／固鎖／軸心
- 🇹🇼 **只收台灣上市品項**：自動過濾未在台發售商品
- ♻️ **每週自動同步**：GitHub Actions 定期從官方資料拉取最新產品

## 資料來源

- **主要來源**：TAKARA TOMY 日本官方公開 JSON，透過 [beyblade.phstudy.org](https://beyblade.phstudy.org) 鏡像取得
- **翻譯偏好**：以台灣譯名為主，`zh-TW` 缺失時依序回退 `zh-HK` → `en-US` → `ja-JP`
- **過濾規則**：`collection_visible["zh-TW"] === true && invalid !== true`

> Beyblade X 為 TAKARA TOMY 商標。本網站為非官方粉絲自製工具，資料僅供參考，以實際市售為準。

---

## 專案架構

此專案為 pnpm workspace monorepo，本網站只用到下列兩個套件：

```
artifacts/beyblade-x/              # 前端網站（React + Vite + Tailwind + shadcn/ui）
  src/
    pages/Home.tsx                 # 主頁搜尋介面
    data/
      beybladeData.ts              # 合併層：generated + overrides 對外輸出
      beybladeData.generated.ts    # 自動產生（勿手改）
      beybladeDataTypes.ts         # Part / Product 型別
      overrides.ts                 # 人工覆寫譯名

lib/beyblade-data-sync/             # 同步工具（Node 腳本）
  src/index.ts                     # 抓 phstudy JSON → 輸出 beybladeData.generated.ts
  src/types.ts

.github/workflows/
  deploy-pages.yml                 # main push → 部署到 GitHub Pages
  sync-beyblade-data.yml           # 每週一自動同步 → 開 PR 到 beta
```

---

## 開發

### 需求

- Node.js 24
- pnpm 10（專案以 `packageManager` 鎖定版本，建議搭配 [Corepack](https://nodejs.org/api/corepack.html)）

### 啟動

```powershell
# Windows PowerShell
corepack enable
pnpm install

$env:PORT="5173"; $env:BASE_PATH="/"
pnpm --filter @workspace/beyblade-x run dev
```

預設開啟於 <http://localhost:5173/>。

### 常用指令

| 指令 | 說明 |
| --- | --- |
| `pnpm --filter @workspace/beyblade-x run dev` | 啟動開發伺服器 |
| `pnpm --filter @workspace/beyblade-x run build` | 產生 `dist/public/`（靜態檔） |
| `pnpm --filter @workspace/beyblade-x run typecheck` | 只對網站做 TypeScript 檢查 |
| `pnpm run sync:beyblade-data` | 手動重抓官方資料、重新產生 `beybladeData.generated.ts` |

---

## 資料同步流程

```
┌────────────────────────┐
│ beyblade.phstudy.org   │ (TAKARA TOMY 官方資料鏡像)
│  ├─ /data/main.json    │
│  └─ /data/products_    │
│     multilang.json     │
└──────────┬─────────────┘
           │  每週一 01:00 UTC（週一 09:00 台灣時間）
           ▼
┌────────────────────────┐
│ sync-beyblade-data.yml │ (GitHub Actions)
│  1. 下載 JSON          │
│  2. 過濾台灣上市品項   │
│  3. 轉換成內部格式     │
│  4. 寫入 .generated.ts │
│  5. 開 PR 到 beta       │
└──────────┬─────────────┘
           │  Review + Merge
           ▼
┌────────────────────────┐
│ main branch            │
└──────────┬─────────────┘
           │  push
           ▼
┌────────────────────────┐
│ deploy-pages.yml       │ → GitHub Pages 自動更新
└────────────────────────┘
```

### 翻譯覆寫

若 phstudy 的翻譯不理想，**不要**直接改 `beybladeData.generated.ts`（會被覆蓋），改編輯 [`artifacts/beyblade-x/src/data/overrides.ts`](./artifacts/beyblade-x/src/data/overrides.ts)：

```ts
export const partNameCnOverrides: Record<string, string> = {
  "戰刃|KnightShield": "騎士神盾",
};

export const productOverrides: Record<string, { nameCn?: string; note?: string }> = {
  "BX-04": { nameCn: "騎士神盾 3-80N" },
};
```

---

## 授權

- 本專案程式碼：MIT License
- Beyblade X 相關商標、產品名稱、圖片版權皆屬 TAKARA TOMY 所有
