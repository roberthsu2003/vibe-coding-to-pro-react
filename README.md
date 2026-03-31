# React + TypeScript + Vite 初學者講義

專為初學者設計的**講義**，幫助你在 vibe coding 時理解程式碼在做什麼。

每一章節都有**主題**和**步驟化範例**，學生可依序學習。

---

## 開發環境演進：為什麼需要 Vite？

在閱讀 [02 - Vite 入門](02-Vite入門/主題.md) 之前，建議依序閱讀下列 **三個資料夾內的 `README.md`**，並操作內附範例，再回頭看 **本 repo 使用 Vite** 時究竟省下了哪些手動步驟、加速了哪些環節。

| 順序 | 資料夾 | 重點 |
|------|--------|------|
| 1 | [00 - HTML + CSS + JavaScript](00-HTML-CSS-JavaScript/README.md) | 純靜態三件套；改程式後多半要**手動重新整理**頁面。 |
| 2 | [00 - Node.js 與 npm](00-Node.js與npm/README.md) | Node 與 **npm**（`package.json`、指令、`npm run`），為後續安裝編譯器與建構工具打底。 |
| 3 | [00 - HTML + CSS + Node + TypeScript](00-HTML-CSS-Node-TypeScript/README.md) | 用 **`tsc`** 把 `.ts` 編成 `.js` 再給瀏覽器載入；感受**編譯 + 重新整理**的迴圈。 |

### 概念摘要（詳見各資料夾）

**1. HTML + CSS + JavaScript**

| 面向 | 說明 |
|------|------|
| **典型做法** | 用編輯器寫 `.html` / `.css` / `.js`，用瀏覽器直接開檔案，或架一個極簡的本機靜態伺服器。 |
| **優點** | 概念單純、沒有「建置」步驟，適合認識 DOM 與語法。 |
| **實務上的限制** | 大型專案難以模組化維護；`import` 模組與瀏覽器支援需自己處理；沒有型別檢查；若要壓縮、轉譯（例如相容舊瀏覽器）通常要另外接工具；改檔後多半要**手動重新整理**頁面才能看到結果。 |

**2. HTML + CSS + Node.js + TypeScript**

| 面向 | 說明 |
|------|------|
| **典型做法** | 在專案裡寫 `.ts`，透過 npm 安裝 `typescript`，執行 **`tsc` 編譯**成 `.js`，再讓 HTML 引用編譯後的腳本；CSS 仍可能是手寫或另外用前處理器。 |
| **優點** | 有型別與較好的重構體驗；可把邏輯拆成多個 `.ts` 檔再編譯合併。 |
| **實務上的限制** | **開發迴圈較繁瑣**：改 TypeScript 後要先編譯、再重新整理瀏覽器；若還要打包 npm 套件、處理路徑別名、或與 React/JSX 搭配，往往會再疊上 **bundler** 與一堆設定；沒有一個整合的「開發伺服器 + 熱更新」，體感會比現代建構工具慢很多。 |

### 對照：使用 Vite 這類建構工具的好處（與本 repo 的關係）

- **開發**：內建開發伺服器、**極快的 HMR（熱模組替換）**，改程式後畫面幾乎即時更新，不必每次手動整頁重新整理。
- **模組與現代語法**：在開發時可直接寫 `import`、TypeScript、JSX 等，由工具負責轉譯與解析路徑。
- **生產**：`build` 時做打包與最佳化，產出適合部署的靜態資源。

本專案即是 **Vite + React + TypeScript** 的起手式；請在完成上方三個 `00-*` 資料夾的閱讀與範例後，接著進入 [02 - Vite 入門](02-Vite入門/主題.md) 與下方主線章節，把「工具在幫你做什麼」對應到實際設定與指令。

---

## 講義結構

```
├── 00-HTML-CSS-JavaScript/   # README + 範例（純靜態三件套）
├── 00-Node.js與npm/          # README + 範例（Node、npm、最小專案）
├── 00-HTML-CSS-Node-TypeScript/ # README + 範例（tsc 編譯流程）
├── 01-環境建置/       # 主題 + 4 個範例
├── 02-Vite入門/       # 主題 + 3 個範例
├── 03-TypeScript配置/  # 主題 + 3 個範例（專案設定）
├── 04-npm入門/        # 主題 + 4 個範例
├── 05-React核心概念/  # 主題 + 6 個範例（含建立專案）
├── 06-remix/          # 主題 + 6 個範例（React Router v7）
├── 07-Next.js/        # 主題 + 6 個範例（Next.js）
├── 08-TypeScript語法/ # 深度：TypeScript 語法與型別系統
└── 09-React/          # 深度：React 進階（ref、Context、自訂 Hook 等 8 範例）
```

**`00-*` 資料夾**：以 **README.md** 為章節主檔，內含學習目標與範例連結；範例為可操作的程式目錄與步驟說明（`.md`）。

**`01` 起**：每章包含 **主題.md**（學習目標與範例導覽）與 **範例N-xxx.md**（步驟化範例）。

---

## 學習路徑（主線）

建議先依序完成 **00 前置三單元**（[HTML/CSS/JS](00-HTML-CSS-JavaScript/README.md) → [Node 與 npm](00-Node.js與npm/README.md) → [HTML/CSS/Node/TS](00-HTML-CSS-Node-TypeScript/README.md)），再對照本頁 **〈開發環境演進〉** 的摘要表，接著依序完成 **01～07**。

| 章節 | 主題 | 範例數 |
|------|------|--------|
| [00 - HTML/CSS/JS](00-HTML-CSS-JavaScript/README.md) | 純靜態頁面與開發迴圈 | 1 |
| [00 - Node.js 與 npm](00-Node.js與npm/README.md) | Node、npm、`npm run` | 1 |
| [00 - HTML/CSS/Node/TS](00-HTML-CSS-Node-TypeScript/README.md) | `tsc` 編譯與瀏覽器載入 | 1 |
| [01 - 環境建置](01-環境建置/主題.md) | Node、npm、專案結構 | 4 |
| [02 - Vite 入門](02-Vite入門/主題.md) | Vite 是什麼、vite.config、dev/build | 3 |
| [03 - TypeScript 配置](03-TypeScript配置/主題.md) | tsconfig、型別基礎 | 3 |
| [04 - npm 入門](04-npm入門/主題.md) | package.json、套件安裝、ESLint | 4 |
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

1. 選做／建議：完成 00 前置三單元（見上表三個連結）的 README 與範例後，再從 [01 - 環境建置](01-環境建置/主題.md) 開始，依主線完成 **01～07**
2. 需要加強型別或 React 時，再開啟上表 **深度學習**（React 進階請在讀完 05 後再讀 09）
3. 每個範例都是 **Markdown 檔案**，內含步驟與程式碼，可一步一步跟著操作

---

## 學習對象

- 程式初學者
- vibe coding 使用者，想了解 AI 產生的程式碼在做什麼
