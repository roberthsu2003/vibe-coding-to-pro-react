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
| [04 - BFF 與 Express 代理](04-BFF與Express代理/主題.md) | 從零開始將 Vite + React 專案整合 Express 後端，實作 API Proxy (解決 CORS)、保護 Gemini API Key 並準備部署 | 4 |
| [05 - React 核心概念](05-React核心概念/主題.md) | JSX、Props、State、Hooks、事件；含 **react-ts** 專案結構補充 | 6 |
| [06 - Remix](06-remix/主題.md) | React Router v7、Remix、路由、Loader、Action | 6 |
| [07 - Next.js](07-Next.js/主題.md) | App Router、Server Component、Server Action | 6 |

### 深度

| 章節 | 摘要 | 範例數 |
|------|------|--------|
| [08 - TypeScript 語法](08-TypeScript語法/主題.md) | 變數、函式、`interface`、泛型、聯合型別與窄化 | 6 |
| [09 - React（進階）](09-React/主題.md) | `useRef`、效能 Hook、Context、自訂 Hook、表單進階、組合、`memo`／`key` 等 | 8 |

### 實戰演練：AI 生成專案的架構升級與部署整合

- [如何將靜態網頁發佈到 GitHub Pages 教學](./github-docs-site/README.md)

- [寫給程式設計師：Vite 進階配置與優化 (模組別名、環境變數、跨域代理與打包切割)](./Vite進階與優化/主題.md)

- [AI Studio React專案下載後轉BFF + Express API Proxy（Render）](./BFF+Express_API_proxy/README.md) (附錄：使用 AI 編輯器一鍵轉換專案之 Prompt 模板)

- [AI Studio React 專案轉 Vercel Serverless 後端（保護 API Key、本機模擬、雲端部署）](./05-Serverless-Vercel後端/主題.md)

**模組系統（與 React + Vite 一致）**

- 本講義**可執行範例**一律採 **ES Module**：**`import`／`export`**，不使用 CommonJS 的 **`require`**／**`module.exports`**。
- **瀏覽器**：以 `<script type="module" src="…">` 載入腳本（見 00-HTML/CSS/JS、00-HTML/CSS/Node/TS）。
- **Node**：在 `package.json` 設定 **`"type": "module"`**（見 00-Node 之最小專案與練習專案）。
---


