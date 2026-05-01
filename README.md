# 從 Vibe Coding 到專業開發：React + Vite + 生態系整合講義

這是一份專為 **Vibe Coding 使用者**與**初學者**設計的進階講義。
當你透過 AI 工具快速生成專案後，若想進一步客製化、優化或排除錯誤，就需要理解底層原理。本講義以 **Vite + React** 為技術主軸，由淺入深帶你掌握前端核心，並一路延伸至現代全端架構（如 Remix、Next.js）的整合，讓你不僅能用 AI 寫扣，更能真正讀懂並掌控你的專案架構。

每一章節都有**主題**和**步驟化範例**，學生可依序學習。

---

## 講義一覽（索引）

### 前置

| 章節 | 摘要 | 範例數 |
|------|------|--------|
| [00 - HTML 與 CSS](00-HTML-CSS/README.md) | 網頁骨架、語意標籤、CSS 選擇器與盒模型（**不含** JavaScript） | 1 |
| [00 - HTML + Tailwind CSS](00-HTML-TailwindCSS/README.md) | **Utility-first**、Play **CDN**、常用 utility 與排版（**不含**建置／npm） | 1 |
| [00 - HTML + CSS + JavaScript](00-HTML-CSS-JavaScript/README.md) | 純靜態三件套、**`<script type="module">`** 與 `import`／`export` | 1 |
| [00 - Node.js 與 npm](00-Node.js與npm/README.md) | Node、npm、`package.json`（**`type: module`**）、套件、ESLint | 4 |
| [00 - HTML + CSS + Node + TypeScript](00-HTML-CSS-Node-TypeScript/README.md) | `tsc` 編譯為 **ES Module**（`import`／`export`）後由瀏覽器載入；體驗編譯與重新整理 | 1 |

### 主線

| 章節 | 摘要 | 範例數 |
|------|------|--------|
| [01 - 環境建置](01-環境建置/主題.md) | Node、npm、專案結構 | 4 |
| [02 - Vite 入門](02-Vite入門/主題.md) | Vite 是什麼、`vite.config`、dev／build、`npm create vite`（**vanilla-ts**／**react-ts**） | 4 |
| [03 - TypeScript 配置](03-TypeScript配置/主題.md) | `tsconfig`、型別基礎 | 3 |
| [03.5 - 單元測試](03.5-UnitTesting/主題.md) | 搭配 Jest 或 Vitest 實作 React/Node.js 單元測試 | 4 |
| [04 - BFF 與 Express 代理](04-BFF與Express代理/主題.md) | 從零開始將 Vite + React 專案整合 Express 後端，實作 API Proxy (解決 CORS)、保護 Gemini API Key 並準備部署 | 4 |
| [05 - React 核心概念](05-React核心概念/主題.md) | JSX、Props、State、Hooks、事件；含 **react-ts** 專案結構補充 | 6 |
| [06 - Remix](06-remix/主題.md) | React Router v7、Remix、路由、Loader、Action | 6 |
| [07 - Next.js](07-Next.js/主題.md) | App Router、Server Component、Server Action | 6 |

### 深度

| 章節 | 摘要 | 範例數 |
|------|------|--------|
| [08 - TypeScript 語法](08-TypeScript語法/主題.md) | 變數、函式、`interface`、泛型、聯合型別與窄化 | 6 |
| [09 - React（進階）](09-React/主題.md) | `useRef`、效能 Hook、Context、自訂 Hook、表單進階、組合、`memo`／`key` 等 | 8 |

---

### 實戰演練：AI 生成專案的架構升級與部署整合

> 以下兩條「**實戰路徑**」皆以「**AI Studio 產生的 React 專案**」為起點，
> 教你如何保護 API Key 並部署至雲端。
> **請依序完成每條路徑中的步驟**，前一步是後一步的前置知識。

---

#### 🌐 其他基礎主題

- [如何將靜態網頁發佈到 GitHub Pages 教學](./github-docs-site/README.md)
- [如何將靜態網頁發佈到 vercel 教學](./static-deploy-vercel/README.md)

---

#### 路徑一：BFF + Express 代理（部署至 Render）

> 適合需要長時間執行、複雜邏輯或獨立後端需求的專案。

| 步驟 | 章節 | 說明 |
|:----:|------|------|
| **1** | [04 - BFF 與 Express 代理](./04-BFF與Express代理/主題.md) | 學習 BFF 概念、從零建立 Express 伺服器、設定 Vite proxy |
| **2** | [Vite 進階配置與優化](./Vite進階與優化/主題.md) | 模組別名、環境變數、跨域代理、打包切割 |
| **3** ✦ | [實戰：AI Studio 專案轉 BFF + Express（Render 部署）](./BFF+Express_API_proxy/README.md) | 用 AI 編輯器將 AI Studio React 專案一鍵轉換，附完整 Prompt 模板 |

> ✦ 步驟 3 為綜合實戰，須先完成步驟 1、2 的觀念學習。

---

#### 路徑二：Vercel Serverless Functions（部署至 Vercel）

> 適合輕量 AI 功能、無需維護伺服器、追求最低成本的專案。

| 步驟 | 章節 | 說明 |
|:----:|------|------|
| **1** | [05 - Serverless Vercel 後端（學習步驟）](./05-Serverless-Vercel後端/主題.md) | 認識 Vercel CLI、建立 Serverless Function、Vite proxy 本機測試、雲端部署 |
| **2** ✦ | [實戰：AI Studio 專案轉 Vercel Serverless（完整參考）](./Serverless_後端/README.md) | 完整轉換說明與 AI 編輯器 Prompt、部署驗證、常見錯誤排查 |

> ✦ 步驟 2 為綜合實戰，須先完成步驟 1 的觀念學習。

---

#### 路徑三：Next.js × Vercel 雲端原生（部署至 Vercel）

> 適合想深入了解 Vercel 平台功能、打造雲端原生應用的學習者。

| 步驟 | 章節 | 說明 |
|:----:|------|------|
| **1** | [10 - Next.js × Vercel 生態系與雲端服務整合](./10-Next.js-Vercel生態系與雲端服務整合/主題.md) | Route Handlers、Image Optimization、Edge Runtime、Vercel Blob、Upstash Redis |
| **2** ✦ | [實戰：打造極簡個人社交名片](./Next.js_Vercel_雲端名片/README.md) | 整合五項功能建立完整 Next.js 應用程式並部署 |

> ✦ 步驟 2 為綜合實戰，須先完成步驟 1 的五個範例。

---

#### 路徑四：Supabase 生態系與應用

> 適合想掌握完整 BaaS（Backend as a Service），以全端思維開發高互動性應用的學習者。

| 步驟 | 章節 | 說明 |
|:----:|------|------|
| **1** | [11 - Supabase 生態系與應用](./11-Supabase生態系與應用/主題.md) | 學習 Authentication、Database、Storage、Realtime 等核心功能 |
| **2** ✦ | [實戰：Supabase 全端專案整合](./11-Supabase生態系與應用/README.md) | 使用 1 個專案慢慢擴充功能，最後成為完整的專案 |

---

#### 路徑五：單元測試（Unit Tests）

> 適合希望提升程式品質、降低改動風險、建立「可持續維護」開發習慣的學習者。

| 步驟 | 章節 | 說明 |
|:----:|------|------|
| **1** | [03.5 - 單元測試（學習步驟）](./03.5-UnitTesting/主題.md) | 以 Vitest / Jest 實作 Node 與 React 的單元測試；含測試環境、常見斷言與 Mock |
| **2** ✦ | [把單元測試加進你的專案（參考流程）](./03.5-UnitTesting/主題.md#把單元測試加進你的專案參考流程) | 在既有專案加入 `test` 腳本、設定測試環境，並完成第一支可執行的測試 |

> ✦ 步驟 2 可直接套用到本講義任一 Vite / Next.js 專案（建議先完成步驟 1）。

---

**模組系統（與 React + Vite 一致）**

- 本講義**可執行範例**一律採 **ES Module**：**`import`／`export`**，不使用 CommonJS 的 **`require`**／**`module.exports`**。
- **瀏覽器**：以 `<script type="module" src="…">` 載入腳本（見 00-HTML/CSS/JS、00-HTML/CSS/Node/TS）。
- **Node**：在 `package.json` 設定 **`"type": "module"`**（見 00-Node 之最小專案與練習專案）。

---
