# React + TypeScript + Vite 初學者講義

專為初學者設計的**講義**，幫助你在 vibe coding 時理解程式碼在做什麼。

每一章節都有**主題**和**步驟化範例**，學生可依序學習。

---

## 講義一覽（索引）


| 分類 | 章節 | 摘要 | 範例數 |
|------|------|------|--------|
| 前置 | [00 - HTML + CSS + JavaScript](00-HTML-CSS-JavaScript/README.md) | 純靜態三件套、**`<script type="module">`** 與 `import`／`export` | 1 |
| 前置 | [00 - Node.js 與 npm](00-Node.js與npm/README.md) | Node、npm、`package.json`（**`type: module`**）、套件、ESLint | 4 |
| 前置 | [00 - HTML + CSS + Node + TypeScript](00-HTML-CSS-Node-TypeScript/README.md) | `tsc` 編譯為 **ES Module**（`import`／`export`）後由瀏覽器載入；體驗編譯與重新整理 | 1 |
| 主線 | [01 - 環境建置](01-環境建置/主題.md) | Node、npm、專案結構 | 4 |
| 主線 | [02 - Vite 入門](02-Vite入門/主題.md) | Vite 是什麼、`vite.config`、dev／build | 3 |
| 主線 | [03 - TypeScript 配置](03-TypeScript配置/主題.md) | `tsconfig`、型別基礎 | 3 |
| 主線 | [05 - React 核心概念](05-React核心概念/主題.md) | JSX、Props、State、Hooks、事件 | 6 |
| 主線 | [06 - Remix](06-remix/主題.md) | React Router v7、Remix、路由、Loader、Action | 6 |
| 主線 | [07 - Next.js](07-Next.js/主題.md) | App Router、Server Component、Server Action | 6 |
| 深度 | [08 - TypeScript 語法](08-TypeScript語法/主題.md) | 變數、函式、`interface`、泛型、聯合型別與窄化 | 6 |
| 深度 | [09 - React（進階）](09-React/主題.md) | `useRef`、效能 Hook、Context、自訂 Hook、表單進階、組合、`memo`／`key` 等 | 8 |

**檔案約定**

- **`00-*`**：以各目錄內 **`README.md`** 為章節主檔，並附範例說明與程式。
- **`01` 起（含 05～07、08、09）**：每章含 **`主題.md`** 與 **`範例N-xxx.md`**。
- _repository 內資料夾名稱_（如 `02-Vite入門`）與上表對應；若日後調整目錄名，請同步更新本表路徑。

**模組系統（與 React + Vite 一致）**

- 本講義**可執行範例**一律採 **ES Module**：**`import`／`export`**，不使用 CommonJS 的 **`require`**／**`module.exports`**。
- **瀏覽器**：以 `<script type="module" src="…">` 載入腳本（見 00-HTML/CSS/JS、00-HTML/CSS/Node/TS）。
- **Node**：在 `package.json` 設定 **`"type": "module"`**（見 00-Node 之最小專案與練習專案）。
- **主線** Vite + React 專案亦為 ES Module；前置單元先習慣語法，進入 **01** 後可直接銜接。

---

## 開發環境演進：為什麼需要 Vite？

在閱讀 [02 - Vite 入門](02-Vite入門/主題.md) 時，可對照 **講義一覽** 中「**前置**」三列：從純 HTML／CSS／JS（**`<script type="module">`**）、到 Node／npm（**`"type": "module"`**）、再到以 `tsc` 編譯 **ES Module** 的 TypeScript，逐步看出「沒有建構工具時」手動步驟與限制；再與 Vite 提供的開發伺服器、模組解析與建置流程比較，會較容易掌握差異（上述皆與 **React + Vite** 預設的模組型別一致）。

（細節仍以各前置單元內文為準，本段不另列重複連結。）

---

## 學習路徑建議（選讀）

一條常見路線是：先完成 **前置** 三個單元的 README 與範例，再從 **01** 起依各章 **`主題.md` 的上一章／下一章** 往 **07** 走。主線編號未含「04」：與 npm／套件相關內容已併入上表 **[00 - Node.js 與 npm](00-Node.js與npm/README.md)**。

**08**、**09** 為深度單元，建議在 [03](03-TypeScript配置/主題.md)、[05](05-React核心概念/主題.md) 有基礎後再讀；**09** 請先完成 **05**。

---

## 使用方式

1. 需要找某章時，以本頁最上方的 **講義一覽（索引）** 表格為準，點章節名稱進入。
2. 想跟一條完整路線時，參考上節 **學習路徑建議**，細節仍依各章內導覽。
3. 每個範例多為 **Markdown**，含步驟與程式碼，可跟著操作。
4. 若要將靜態網頁發佈到 **GitHub Pages**（建置輸出至倉庫根目錄 `docs/`），請參考 [docs-site 說明](docs-site/README.md)。

---

## 學習對象

- 程式初學者
- vibe coding 使用者，想了解 AI 產生的程式碼在做什麼
