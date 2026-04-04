# docs-site：建置到 `docs/` 的 Vite 專案（GitHub Pages）

本資料夾用 **Vite** 開發靜態網頁，建置結果輸出到 **repository 根目錄的 `docs/`**，方便在 GitHub 上啟用 **GitHub Pages**（從 `/docs` 資料夾發佈）。

## 為什麼是 `docs-site/app/` 兩層？

`vite.config.ts` 內使用：

```ts
build: {
  outDir: '../../docs',
}
```

從 **`docs-site/app/`** 往上一層是 `docs-site/`、再往上一層是 **repo 根目錄**，因此 **`../../docs`** 正好對應 **`倉庫根目錄/docs/`**。  
若你把 Vite 專案放在別的路徑，請相對調整 `outDir`（或改用絕對路徑／`fileURLToPath` 計算）。

## `base` 是什麼？（必讀）

```ts
base: '/__2026_03_14_chihlee_gemini__/',
```

GitHub **專案網站**的網址通常是：

`https://<使用者名稱>.github.io/<儲存庫名稱>/`

Vite 的 **`base`** 必須與網址路徑一致（前後斜線、區分大小寫），靜態資源才會載入正確。  
請將 `__2026_03_14_chihlee_gemini__` **改成你實際的 GitHub repository 名稱**；若儲存庫是 `react_typescript_vite`，應寫成：

```ts
base: '/react_typescript_vite/',
```

若是 **使用者/組織站**（`username.github.io` 且 repo 名稱等於 `username.github.io`），通常設為：

```ts
base: '/',
```

## 本機開發

```bash
cd docs-site/app
npm install
npm run dev
```

## 建置並產生 `docs/`

```bash
cd docs-site/app
npm run build
```

完成後，**repo 根目錄**會出現或更新 **`docs/`**（內含 `index.html`、assets 等）。請將 **`docs/`** 一併 **commit、push**。

> **注意**：`vite.config.ts` 設了 `emptyOutDir: true`，建置時會先清空 `docs/` 再寫入。若 `docs/` 裡還有你想保留的其它檔案，請先備份或調整設定。

## GitHub 上啟用 Pages

1. 將 **`docs/`** 推送到預設分支（例如 `main`）。
2. 進入儲存庫 **Settings → Pages**。
3. **Build and deployment** → **Source**：選 **Deploy from a branch**。
4. **Branch** 選 **`main`**（或你的預設分支），資料夾選 **`/docs`**。
5. 儲存後稍待，Pages 會顯示網址（格式見上文「`base`」）。

## 檔案一覽

| 路徑 | 說明 |
|------|------|
| `app/vite.config.ts` | `base`、`outDir: '../../docs'` |
| `app/package.json` | `npm run dev` / `npm run build` |
| `app/index.html`、`app/src/*` | 範例靜態頁內容（可自行改寫） |

此專案與講義內其它章節的 Vite 範例**獨立**，僅作為「發佈到 GitHub Pages」的參考骨架。
