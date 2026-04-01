# 範例 1：變數與基本型別（可複製專案）

此資料夾為 [範例 1](../../範例1-變數與基本型別.md) 的**網頁（第二階段）**練習環境，可整個複製到任意路徑使用。**建議**先完成 [tsx-cli 指令列練習](../../tsx-cli/README.md)（`src/01-basics.ts`），再使用本資料夾。

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `index.html` | 頁面結構與標題 |
| `src/main.ts` | 進入點：載入樣式、同步 `console.log` 至頁面、載入練習檔 |
| `src/style.css` | 頁面樣式 |
| `src/practice-01-basics.ts` | **主要練習**：依講義在此撰寫程式 |
| `package.json` / `vite.config.ts` / `tsconfig*.json` | Vite + TypeScript 設定 |

## 執行

```bash
cd 此資料夾
npm install
npm run dev
```

瀏覽器開啟終端機顯示的本機網址後，可開 **Console** 觀察輸出，頁面上「頁面輸出」區塊會同步顯示 `console.log` 內容。
