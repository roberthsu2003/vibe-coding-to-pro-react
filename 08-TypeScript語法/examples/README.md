# TypeScript 語法練習專案（依範例分資料夾）

本目錄為 [08 - TypeScript 語法](../主題.md) 的**第二階段**實作：**瀏覽器 + Vite**。**建議**先完成 [範例 0](../範例0-建立練習專案.md) 的**階段一** [`../tsx-cli/`](../tsx-cli/)（指令列 + tsx），再使用本目錄。

## 與 `tsx-cli` 的關係

| | **tsx-cli（階段一）** | **examples（階段二）** |
|---|----------------------|-------------------------|
| 目的 | 在終端機熟悉語法、快速迭代 | 在網頁上以**美觀介面**呼應相同觀念 |
| 程式 | 以 `console.log` 為主 | **不需**與 tsx-cli 檔案逐行相同；以互動／版面呈現觀念 |
| 檔案 | `tsx-cli/src/0N-*.ts` | 各資料夾內 `src/practice-….ts` + `style.css` |

每個範例一個獨立資料夾，內含 **Vite + TypeScript**：`index.html`、`src/main.ts`（僅載入樣式與練習檔）、`src/style.css`，以及 **`src/practice-….ts`**（主要程式與畫面邏輯）。

將整個資料夾複製到任意路徑後，於該資料夾執行 `npm install` 與 `npm run dev` 即可。

## 使用方式

1. 進入**對應範例**資料夾（見下表）。
2. `npm install`
3. `npm run dev`
4. 閱讀該範例講義與 `practice-….ts` 註解；可修改**型別**與**畫面邏輯**做實驗（與 tsx-cli 的練習可並行，不必內容一致）。
5. 輸出以**頁面**為主；必要時仍可用瀏覽器 **Console** 除錯。

| 範例 | 主題（網頁呈現） | 資料夾 | 練習檔 |
|------|------------------|--------|--------|
| [範例 1](../範例1-變數與基本型別.md) | 型別儀表板（const / let / 基本型別） | [`01-basics/`](01-basics/) | `src/practice-01-basics.ts` |
| [範例 2](../範例2-函式與型別.md) | 輕食結帳（函式、選用與預設參數） | [`02-functions/`](02-functions/) | `src/practice-02-functions.ts` |
| [範例 3](../範例3-interface與type.md) | 閱讀清單（interface / extends） | [`03-interfaces/`](03-interfaces/) | `src/practice-03-interfaces.ts` |
| [範例 4](../範例4-陣列與泛型入門.md) | 成績光譜（陣列、泛型） | [`04-arrays-generics/`](04-arrays-generics/) | `src/practice-04-arrays-generics.ts` |
| [範例 5](../範例5-聯合型別與型別窄化.md) | 載入狀態控制台（可區辨聯合） | [`05-unions/`](05-unions/) | `src/practice-05-unions.ts` |

各資料夾內另有 **`README.md`** 說明檔案分工。

## 練習檔位置

請以各範例資料夾內的 **`src/practice-….ts`** 為主：內含示範程式與觀念註解；可依 [主題](../主題.md)「練習原則」改寫或對照 **tsx-cli** 的指令列練習。
