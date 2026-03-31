# 範例：tsc 編譯與瀏覽器載入

## 目的

體驗 **「寫 TypeScript → 編譯成 JavaScript → 用瀏覽器開 HTML」** 的完整迴圈，並與 Vite 的**一鍵 dev／熱更新**對照。

## 檔案位置

程式在 [範例/tsc-專案](tsc-專案/) 目錄。

## 步驟一：安裝依賴

在終端機進入 `tsc-專案` 後執行：

```bash
cd 路徑/00-HTML-CSS-Node-TypeScript/範例/tsc-專案
npm install
```

會安裝 `devDependencies` 中的 `typescript`，並產生 `node_modules/`（本 repo 根目錄 `.gitignore` 已忽略）。

## 步驟二：編譯 TypeScript

```bash
npm run build
```

等同執行 `tsc`。依 `tsconfig.json` 設定，會把 `src/main.ts` 編譯到 `dist/main.js`。

> 若 `dist/` 不存在，`tsc` 會建立它。`dist` 亦已被 git 忽略，學生需在本地自行編譯後再開頁面。

## 步驟三：用瀏覽器開啟頁面

用檔案總管或編輯器開啟 `tsc-專案/index.html`（雙擊以瀏覽器開啟）。頁面會載入 `./dist/main.js`，在畫面上顯示問候文字。

## 步驟四：修改程式並感受迴圈

1. 編輯 `src/main.ts`（例如修改 `greet` 的參數字串）。
2. **再次**執行 `npm run build`。
3. 回到瀏覽器**重新整理**頁面。

這就是 **沒有** Vite 時常見的開發迴圈：每次改動都要手動編譯 + 重新整理。

## 選用：監看模式

若想省去「每次手動執行 `tsc`」，可在另一個終端視窗執行：

```bash
npm run watch
```

`main.ts` 存檔後會自動重新編譯；仍須**手動重新整理瀏覽器**才能看到畫面更新（除非另外架 live-reload 工具）。

---

[回到本章 README](README.md)
