# 範例：tsc 編譯與瀏覽器載入（ES Module）

## 目的

體驗 **「寫 TypeScript（`import`／`export`）→ `tsc` 編譯成 ES Module → 用瀏覽器載入」** 的完整迴圈，並與 Vite 的**一鍵 dev／熱更新**對照。

## 檔案位置

程式在 [範例/tsc-專案](./範例/tsc-專案/) 目錄。

- **`src/greet.ts`**：`export function greet(...)`  
- **`src/main.ts`**：`import { greet } from "./greet.js"` 後呼叫（編譯後為 `import`／`export` 的 **ES Module**）  
- **`index.html`**：以 `<script type="module" src="./dist/main.js">` 載入（瀏覽器執行 ESM 必須加 `type="module"`）

> **為何要用本機伺服器？** 編譯後會產生 **`dist/main.js`** 與 **`dist/greet.js`** 兩個檔案，彼此以相對路徑 `import`。若用 `file://` 直接雙擊 `index.html`，多數瀏覽器會阻擋模組載入；請在 `tsc-專案` 目錄執行 **`npx serve .`**（或 `python3 -m http.server`）後，以 **http** 開啟頁面。

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

等同執行 `tsc`。依 `tsconfig.json`（`module`: **ES2020**）會把 `src/*.ts` 編譯到 `dist/`，輸出為 **ES Module**（含 `import`／`export`）。

> 若 `dist/` 不存在，`tsc` 會建立它。`dist` 亦已被 git 忽略，學生需在本地自行編譯後再開頁面。

## 步驟三：用瀏覽器開啟頁面（請用 http）

在 **`tsc-專案` 目錄**啟動靜態伺服器，例如：

```bash
npx --yes serve .
```

終端機會顯示本機網址（常見為 `http://localhost:3000`），用瀏覽器開啟後進入 **`index.html`** 對應路徑（視 `serve` 顯示為準）。頁面會以 **ES Module** 載入 `./dist/main.js`，再依序載入 `greet.js`，畫面上應顯示問候文字。

## 步驟四：修改程式並感受迴圈

1. 編輯 `src/greet.ts` 或 `src/main.ts`（例如修改 `greet` 的參數字串）。  
2. **再次**執行 `npm run build`。  
3. 回到瀏覽器**重新整理**頁面。

這就是 **沒有** Vite 時常見的開發迴圈：每次改動都要手動編譯 + 重新整理。

## 選用：監看模式

若想省去「每次手動執行 `tsc`」，可在另一個終端視窗執行：

```bash
npm run watch
```

`main.ts`／`greet.ts` 存檔後會自動重新編譯；仍須**手動重新整理瀏覽器**才能看到畫面更新（除非另外架 live-reload 工具）。

---

[回到本章 README](README.md)
