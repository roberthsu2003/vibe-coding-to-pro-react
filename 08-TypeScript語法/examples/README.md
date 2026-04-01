# TypeScript 語法練習專案（依範例分資料夾）

本目錄為 [08 - TypeScript 語法](../主題.md) 的**第二階段**實作：**瀏覽器 + Vite**。**建議**先完成 [範例 0](../範例0-建立練習專案.md) 的**階段一** [`../tsx-cli/`](../tsx-cli/)（指令列 + tsx），再使用本目錄。

**每個範例一個獨立資料夾**，內含 **Vite + TypeScript** 專案：`index.html`、`src/main.ts`、`src/style.css`，以及該範例專用的練習檔 **`src/practice-….ts`**。

將整個資料夾複製到任意路徑後，於該資料夾執行 `npm install` 與 `npm run dev` 即可。

## 使用方式

1. 進入**對應範例**資料夾（見下表）。
2. `npm install`
3. `npm run dev`
4. 依講義在 **`src/practice-….ts`** 撰寫程式。
5. 輸出可從瀏覽器 **Console** 查看；頁面上的「頁面輸出」區塊會**同步**顯示 `console.log` 內容（由 `main.ts` 攔截後寫入）。

| 範例 | 資料夾 | 練習檔 |
|------|--------|--------|
| [範例 1](../範例1-變數與基本型別.md) | [`01-basics/`](01-basics/) | `src/practice-01-basics.ts` |
| [範例 2](../範例2-函式與型別.md) | [`02-functions/`](02-functions/) | `src/practice-02-functions.ts` |
| [範例 3](../範例3-interface與type.md) | [`03-interfaces/`](03-interfaces/) | `src/practice-03-interfaces.ts` |
| [範例 4](../範例4-陣列與泛型入門.md) | [`04-arrays-generics/`](04-arrays-generics/) | `src/practice-04-arrays-generics.ts` |
| [範例 5](../範例5-聯合型別與型別窄化.md) | [`05-unions/`](05-unions/) | `src/practice-05-unions.ts` |

各資料夾內另有 **`README.md`** 說明檔案分工。

## 練習檔位置

請以各範例資料夾內的 **`src/practice-….ts`** 為準：內含步驟說明與 TODO 鷹架，可依講義取消註解並改寫。
