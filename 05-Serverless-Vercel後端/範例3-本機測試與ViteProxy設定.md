# 範例 3：本機測試與 Vite Proxy 設定

## 目標

到目前為止，我們已經：
- ✅ 建立了 `api/gemini.ts`（Serverless Function）
- ✅ 修改了 `src/App.tsx`（前端改呼叫 `/api/gemini`）

但如果你現在執行 `npm run dev`，然後在瀏覽器送出問題，會發現**出現 404 錯誤**！

這是因為 Vite Dev Server 只服務前端，它不知道 `/api/gemini` 在哪裡。  
本範例將解決這個問題，讓你可以在本機完整測試整個功能。

---

## 本機開發架構解說

### 為什麼會有問題？

```
瀏覽器 → http://localhost:3000/api/gemini
              ↑
        Vite Dev Server（port 3000）
        ❌ Vite 只懂處理前端，不知道怎麼執行 api/gemini.ts！
```

### 解決方案：同時啟動兩個伺服器

```
瀏覽器 → http://localhost:3000        ← Vite Dev Server（前端）
             ↓ 當路徑是 /api/* 時
        http://localhost:3001/api/*   ← Vercel CLI（Serverless Function 模擬器）
```

我們需要：
1. 讓 Vite 把所有 `/api/*` 的請求轉發給 Vercel CLI
2. 同時執行 `vercel dev`（port 3001）來處理這些請求

---

## 步驟 1：修改 `vite.config.ts`

打開 `vite.config.ts`，進行以下兩項修改：

### 1-A：移除 `define` 區塊

找到這段並**完整刪除**：

```typescript
// ❌ 刪除整個 define 區塊
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
},
```

> **這非常重要！**  
> 移除 `define` 後，GEMINI_API_KEY 就不會再被 Vite 編譯進前端 JS 檔案了。

### 1-B：加入 `proxy` 設定

在 `server` 區塊中加入 `proxy` 設定：

```typescript
server: {
  port: 3000,
  host: "0.0.0.0",
  hmr: process.env.DISABLE_HMR !== "true",
  // 🆕 新增以下 proxy 設定
  proxy: {
    // 開發環境：將 /api 請求代理到 Vercel CLI 本機模擬的 Serverless Function（port 3001）
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
    },
  },
},
```

### 完整修改後的 `vite.config.ts`

```typescript
// vite.config.ts（修改完成版）
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ✅ 已移除 define 區塊：GEMINI_API_KEY 不再注入前端
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: process.env.DISABLE_HMR !== "true",
    proxy: {
      // 開發環境：將 /api 請求代理到 Vercel CLI（port 3001）
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

---

## 步驟 2：在本機啟動兩個伺服器

你需要開啟**兩個終端機視窗**：

### 終端機視窗 1：啟動 Vite（前端）

```bash
cd my-serverless-app
npm run dev
```

輸出：
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

### 終端機視窗 2：啟動 Vercel CLI（Serverless Function 模擬器）

```bash
cd my-serverless-app
vercel dev --listen 3001
```

> **💡 `--listen 3001` 的用意**  
> 讓 Vercel CLI 使用 3001 port，這樣才不會和 Vite 的 3000 port 衝突。  
> Vite 的 proxy 設定也已指向 3001。

第一次執行 `vercel dev` 時，CLI 會詢問一些問題：

```
? Set up and develop "~/my-serverless-app"? [Y/n]  → 輸入 Y
? Which scope do you want to deploy to? → 選擇你的帳號
? Link to existing project? [y/N] → 輸入 N（建立新專案）
? What's your project's name? → 輸入專案名稱（例如 gemini-qa-app）
? In which directory is your code located? → 直接按 Enter（預設為 ./）
```

設定完後，Vercel CLI 啟動成功：

```
> Ready! Available at http://localhost:3001
```

---

## 步驟 3：測試整個流程

1. 打開瀏覽器，前往 `http://localhost:3000`
2. 在輸入框輸入任何問題，例如：「什麼是 TypeScript？」
3. 點選「送出提問」
4. 等待 AI 回應

### 確認請求流向（用 Chrome DevTools）

打開 DevTools → Network 頁籤，送出問題後，  
你應該看到一個 POST 請求到 `/api/gemini`：

```
Request URL: http://localhost:3000/api/gemini
Request Method: POST
Status Code: 200 OK

Request Payload:
{ "prompt": "什麼是 TypeScript？" }

Response:
{ "text": "TypeScript 是 JavaScript 的超集..." }
```

> ✅ 注意：在 Network 的 Request Headers 中，**完全看不到 API Key**！

---

## 常見問題排查

### ❓ 出現 `404 Not Found` 錯誤

**可能原因**：`vercel dev` 還沒有啟動，或啟動失敗。  
**解決方法**：確認終端機視窗 2 有正常顯示 `Ready! Available at http://localhost:3001`。

---

### ❓ 出現 `500 Internal Server Error`

**可能原因**：`.env` 檔案中的 `GEMINI_API_KEY` 未設定或填寫錯誤。  
**解決方法**：
1. 確認 `.env` 檔案存在於專案根目錄
2. 確認 `GEMINI_API_KEY` 的值是正確的 Key（非空白、非 placeholder）
3. 重新啟動 `vercel dev`

---

### ❓ 出現 CORS 錯誤

**可能原因**：`vite.config.ts` 的 `proxy` 設定有誤。  
**解決方法**：確認 `proxy` 的 `target` 指向 `http://localhost:3001`（不是 3000）。

---

## 理解 Proxy 機制

```typescript
// vite.config.ts 的 proxy 設定的意思：
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  },
},
```

| 設定項目 | 說明 |
|---|---|
| `"/api"` | 攔截所有以 `/api` 開頭的請求 |
| `target` | 將這些請求轉發至 `http://localhost:3001` |
| `changeOrigin: true` | 修改請求的 `Origin` header，避免某些伺服器的跨域阻擋 |

**效果**：
- 瀏覽器發出 `POST http://localhost:3000/api/gemini`
- Vite 攔截，轉發為 `POST http://localhost:3001/api/gemini`
- Vercel CLI 執行 `api/gemini.ts` 並回傳結果
- 瀏覽器收到回應，完全感覺不到中間的轉換

---

## ✅ 本步驟完成確認

- [ ] `vite.config.ts` 已移除 `define` 區塊
- [ ] `vite.config.ts` 已加入 `proxy` 設定，指向 port 3001
- [ ] 可同時啟動兩個終端機（`npm run dev` + `vercel dev --listen 3001`）
- [ ] 在瀏覽器成功收到 AI 回應
- [ ] Chrome DevTools Network 中看不到 API Key

---

[上一範例：範例 2 - 修改前端呼叫方式](範例2-修改前端呼叫方式.md) | [下一範例：範例 4 - 部署至 Vercel 雲端](範例4-部署至Vercel雲端.md)
