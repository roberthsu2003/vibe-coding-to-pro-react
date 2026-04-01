# 00 - HTML + CSS + Node.js + TypeScript

## 主題說明

在瀏覽器仍只認得 JavaScript 的前提下，我們用 **TypeScript** 撰寫邏輯（含 **`import`／`export`**），再透過 **`tsc`** 編譯成 **ES Module** 的 `.js`，由 HTML 以 `<script type="module">` 引用。此模式**沒有** Vite 的開發伺服器與 HMR，能清楚感受：每次改 `.ts` 都要先編譯、再重新整理頁面；多檔模組時還需本機 **http** 服務，不宜只靠 `file://` 雙擊。

### 學習目標

- 會用 npm 安裝 `typescript` 並執行 `tsc`，產出 **ES Module**
- 能對照 `src/*.ts` 與輸出 `dist/*.js`，並理解 **`import` 路徑寫 `./greet.js`（對應 `greet.ts`）** 的慣例
- 能說明為何進階專案常再導入 **bundler／建構工具**（例如 Vite）

### 本章範例

1. [範例：tsc 編譯與瀏覽器載入](範例1-tsc編譯與瀏覽器.md)

### 延伸閱讀

- Node／npm 基礎：[00 - Node.js 與 npm](../00-Node.js與npm/README.md)
- 建構工具與開發體驗：[02 - Vite 入門](../02-Vite入門/主題.md)
- TypeScript 專案設定：[03 - TypeScript 配置](../03-TypeScript配置/主題.md)

---

[上一章：00 - Node.js 與 npm](../00-Node.js與npm/README.md) | [下一章：01 - 環境建置](../01-環境建置/主題.md)
