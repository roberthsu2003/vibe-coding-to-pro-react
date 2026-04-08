# React + TypeScript + Vite 初學者講義

專為初學者設計的**講義**，幫助你在 vibe coding 時理解程式碼在做什麼。

每一章節都有**主題**和**步驟化範例**，學生可依序學習。

## 學習對象

- 程式初學者
- vibe coding 使用者，想了解 AI 產生的程式碼在做什麼

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
| [05 - React 核心概念](05-React核心概念/主題.md) | JSX、Props、State、Hooks、事件；含 **react-ts** 專案結構補充 | 6 |
| [06 - Remix](06-remix/主題.md) | React Router v7、Remix、路由、Loader、Action | 6 |
| [07 - Next.js](07-Next.js/主題.md) | App Router、Server Component、Server Action | 6 |

### 深度

| 章節 | 摘要 | 範例數 |
|------|------|--------|
| [08 - TypeScript 語法](08-TypeScript語法/主題.md) | 變數、函式、`interface`、泛型、聯合型別與窄化 | 6 |
| [09 - React（進階）](09-React/主題.md) | `useRef`、效能 Hook、Context、自訂 Hook、表單進階、組合、`memo`／`key` 等 | 8 |

### 整合Google AI Studio產生的專案

- 若要將靜態網頁發佈到 **GitHub Pages**（建置輸出至倉庫根目錄 `docs/`），請參考 [docs-site 說明](github-docs-site/README.md)。

**模組系統（與 React + Vite 一致）**

- 本講義**可執行範例**一律採 **ES Module**：**`import`／`export`**，不使用 CommonJS 的 **`require`**／**`module.exports`**。
- **瀏覽器**：以 `<script type="module" src="…">` 載入腳本（見 00-HTML/CSS/JS、00-HTML/CSS/Node/TS）。
- **Node**：在 `package.json` 設定 **`"type": "module"`**（見 00-Node 之最小專案與練習專案）。
---


