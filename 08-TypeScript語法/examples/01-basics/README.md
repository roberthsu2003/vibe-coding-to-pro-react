# 範例 1：變數與基本型別（可複製專案）

此資料夾為 [範例 1](../../範例1-變數與基本型別.md) 的**網頁（第二階段）**練習環境。**與 tsx-cli 的 `01-basics.ts` 不必相同**：這裡以「**型別儀表板**」呈現 `string` / `number` / `boolean` / `let` 計數等觀念。

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `index.html` | 頁面骨架、`#app` 掛載點、字型 |
| `src/main.ts` | 進入點：載入樣式與練習檔 |
| `src/style.css` | 暖色儀表板樣式 |
| `src/practice-01-basics.ts` | **主要程式**：型別與畫面更新邏輯 |
| `package.json` / `vite.config.ts` / `tsconfig*.json` | Vite + TypeScript 設定 |

## 執行

```bash
cd 此資料夾
npm install
npm run dev
```

瀏覽器開啟終端機顯示的本機網址後，按「造訪 +1」觀察 `let` 與畫面連動。
