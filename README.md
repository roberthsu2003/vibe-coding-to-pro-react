# React + TypeScript + Vite 初學者講義

專為初學者設計的**講義**，幫助你在 vibe coding 時理解程式碼在做什麼。

每一章節都有**主題**和**步驟化範例**，學生可依序學習。

---

## 開發環境演進：為什麼需要 Vite？

在閱讀 [02 - Vite 入門](02-Vite入門/主題.md) 之前，建議依序閱讀下列3個章節，並操作內附範例，再回頭閱讀**Vite** 時究竟省下了哪些手動步驟、加速了哪些環節。

| 順序 | 章節 | 重點 |
|------|--------|------|
| 1 | [00 - HTML + CSS + JavaScript](00-HTML-CSS-JavaScript/README.md) | 純靜態三件套；改程式後多半要**手動重新整理**頁面。 |
| 2 | [00 - Node.js 與 npm](00-Node.js與npm/README.md) | Node 與 **npm**（`package.json`、指令、`npm run`），為後續安裝編譯器與建構工具打底。 |
| 3 | [00 - HTML + CSS + Node + TypeScript](00-HTML-CSS-Node-TypeScript/README.md) | 用 **`tsc`** 把 `.ts` 編成 `.js` 再給瀏覽器載入；感受**編譯 + 重新整理**的迴圈。 |

---

## 講義結構

```
├── 00-HTML-CSS-JavaScript/   # README + 範例（純靜態三件套）
├── 00-Node.js與npm/          # README + 5 範例（Node、npm、package.json、套件、ESLint）
├── 00-HTML-CSS-Node-TypeScript/ # README + 範例（tsc 編譯流程）
├── 01-環境建置/       # 主題 + 4 個範例
├── 02-Vite入門/       # 主題 + 3 個範例
├── 03-TypeScript配置/  # 主題 + 3 個範例（專案設定）
├── 05-React核心概念/  # 主題 + 6 個範例（含建立專案）
├── 06-remix/          # 主題 + 6 個範例（React Router v7）
├── 07-Next.js/        # 主題 + 6 個範例（Next.js）
├── 08-TypeScript語法/ # 深度：TypeScript 語法與型別系統
└── 09-React/          # 深度：React 進階（ref、Context、自訂 Hook 等 8 範例）
```

**`00-*` 前置單元**：以 **README.md** 為章節主檔，內含學習目標與範例連結；範例為可操作的程式目錄與步驟說明（`.md`）。

**`01` 起**：每章包含 **主題.md**（學習目標與範例導覽）與 **範例N-xxx.md**（步驟化範例）。

---

## 學習路徑（主線）

建議先依序完成 **00 前置三單元**（[HTML/CSS/JS](00-HTML-CSS-JavaScript/README.md) → [Node 與 npm](00-Node.js與npm/README.md) → [HTML/CSS/Node/TS](00-HTML-CSS-Node-TypeScript/README.md)），再對照本頁 **〈開發環境演進〉** 的摘要表，接著依序完成 **01、02、03、05、06、07**（**npm** 與套件相關內容已併入 [00 - Node.js 與 npm](00-Node.js與npm/README.md)，故主線不再單獨編號「04」）。

| 章節 | 主題 | 範例數 |
|------|------|--------|
| [00 - HTML/CSS/JS](00-HTML-CSS-JavaScript/README.md) | 純靜態頁面與開發迴圈 | 1 |
| [00 - Node.js 與 npm](00-Node.js與npm/README.md) | Node、npm、`package.json`、套件、ESLint | 5 |
| [00 - HTML/CSS/Node/TS](00-HTML-CSS-Node-TypeScript/README.md) | `tsc` 編譯與瀏覽器載入 | 1 |
| [01 - 環境建置](01-環境建置/主題.md) | Node、npm、專案結構 | 4 |
| [02 - Vite 入門](02-Vite入門/主題.md) | Vite 是什麼、vite.config、dev/build | 3 |
| [03 - TypeScript 配置](03-TypeScript配置/主題.md) | tsconfig、型別基礎 | 3 |
| [05 - React 核心概念](05-React核心概念/主題.md) | JSX、Props、State、Hooks、事件 | 6 |
| [06 - Remix](06-remix/主題.md) | React Router v7、Remix、路由、Loader、Action | 6 |
| [07 - Next.js](07-Next.js/主題.md) | App Router、Server Component、Server Action | 6 |

---

## 深度學習（TypeScript 與 React）

以下單元**不在主線編號內**，內容較深，可依需求與 [03 - TypeScript 配置](03-TypeScript配置/主題.md)、[05 - React 核心概念](05-React核心概念/主題.md) 搭配閱讀。

| 單元 | 說明 | 範例數 |
|------|------|--------|
| [TypeScript 語法](08-TypeScript語法/主題.md) | 變數、函式、`interface`、泛型、聯合型別與窄化 | 6 |
| [React 單元（進階）](09-React/主題.md) | `useRef`、效能 Hook、Context、自訂 Hook、表單進階、組合、`memo`／`key`；**入門仍請先讀 [05](05-React核心概念/主題.md)** | 8 |

> **React**：入門在 [05 - React 核心概念](05-React核心概念/主題.md)；進階範例與練習專案說明在 [09-React](09-React/主題.md)。

---

## 使用方式

1. 選做／建議：完成 00 前置三單元（見上表三個連結）的 README 與範例後，再從 [01 - 環境建置](01-環境建置/主題.md) 開始，依主線完成 **01、02、03、05～07**
2. 需要加強型別或 React 時，再開啟上表 **深度學習**（React 進階請在讀完 05 後再讀 09）
3. 每個範例都是 **Markdown 檔案**，內含步驟與程式碼，可一步一步跟著操作

---

## 學習對象

- 程式初學者
- vibe coding 使用者，想了解 AI 產生的程式碼在做什麼
