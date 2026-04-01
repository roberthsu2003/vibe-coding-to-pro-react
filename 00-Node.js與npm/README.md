# 00 - Node.js 與 npm

## 主題說明

**Node.js** 讓 JavaScript 能在電腦上（伺服器或終端機）執行，不必透過瀏覽器。**npm**（Node Package Manager）隨 Node 安裝，用來安裝套件、管理 `package.json`、執行腳本。後續的 TypeScript 編譯器、`tsc`、以及 Vite，都會透過 npm 裝進專案。

本章從**最小專案**出發，接著說明 **`package.json` 結構**、**常用 npm 指令**、**安裝與管理套件**，以及 **ESLint** 的角色，與 [01 - 環境建置](../01-環境建置/主題.md)、[02 - Vite 入門](../02-Vite入門/主題.md) 銜接。

建議在讀過 [00 - HTML／CSS／Node／TypeScript](../00-HTML-CSS-Node-TypeScript/README.md) 之前或之後搭配本章範例，依學習順序調整即可。

### 學習目標

- 能說明 Node.js 與瀏覽器執行 JavaScript 的差異（簡述即可）
- 會使用 `node -v`、`npm -v` 檢查環境；能執行 `node` 檔案與 `npm run` 腳本
- 會在專案目錄內建立／閱讀 `package.json`、執行 `npm install`、理解 `node_modules` 與 `package-lock.json` 的分工
- 認識 `dependencies` 與 `devDependencies`，並能安裝套件
- 知道 ESLint 的用途與其與 npm 的關係

### 本章範例

1. [範例：認識 Node、npm 與最小專案](範例1-認識Node與npm.md)
2. [範例：認識 package.json](範例2-認識package.json.md)
3. [範例：常用 npm 指令](範例3-常用npm指令.md)
4. [範例：安裝套件](範例4-安裝套件.md)
5. [範例：認識 ESLint](範例5-認識ESLint.md)

### 延伸閱讀（本 repo 主線）

- 正式環境建置：[01 - 環境建置](../01-環境建置/主題.md)
- React 入門：[05 - React 核心概念](../05-React核心概念/主題.md)

---

[上一章：00 - HTML + CSS + JavaScript](../00-HTML-CSS-JavaScript/README.md) | [下一章：00 - HTML／CSS／Node／TypeScript](../00-HTML-CSS-Node-TypeScript/README.md)
