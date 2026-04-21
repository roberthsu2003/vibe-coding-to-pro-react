# 範例 3：本機測試與 Vite Proxy 設定

## 目標

到目前為止，我們已經：
- ✅ 建立了 `api/gemini.ts`（Serverless Function）
- ✅ 修改了 `src/App.tsx`（前端改呼叫 `/api/gemini`）

但如果你現在執行 `npm run dev`，然後在瀏覽器送出問題，會發現**出現 404 錯誤**！

這是因為 Vite Dev Server 只服務前端，它不知道 `/api/gemini` 在哪裡。  
本範例將介紹兩種解決方案，讓你可以在本機完整測試整個功能：
1. **傳統做法**：Vite Proxy 搭配雙伺服器（幫助理解底層運作）
2. **最佳實務**：使用 `vercel dev` 一鍵啟動單一伺服器，並引入 `vercel.json` 設定檔

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
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
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
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
      hmr: env.DISABLE_HMR !== "true",
      proxy: {
        // 開發環境：將 /api 請求代理到 Vercel CLI（port 3001）
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
  };
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

> **💡 這個動作背後發生了什麼事？**  
> 1. **產生 `.vercel` 資料夾**：CLI 會在你的本機專案根目錄產生一個隱藏的 `.vercel` 資料夾，裡面儲存了專案與你的帳號綁定的 ID。
> 2. **在 Vercel 雲端建立專案**：沒錯！雖然你只是要在「本機測試」，但在你回答完問題的那一刻，Vercel 確實已經在你的雲端帳號裡建立了一個名為 `gemini-qa-app` 的專案（App）。只是裡面暫時是一片空殼，等待我們之後正式執行部署（Deploy）。

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

## 🔥 升級做法：使用 Vercel CLI 單一啟動（推薦）

剛才我們學習了如何啟動「兩個」伺服器來完成本機測試，這是為了讓你理解 proxy 的運作原理。
但在實際開發中，**其實你只要開一個終端機就夠了！**

Vercel 非常聰明，當你執行 `vercel dev` 時，它會自動偵測到你的專案是 Vite，進而自動：
1. 在背景幫你啟動 Vite 開發伺服器
2. 啟動 Serverless Function 模擬器
3. 自動將 `/api` 開頭的請求導向後端，其餘所有請求導向 Vite 前端

### 步驟 A：建立 `vercel.json` 檔（解決重新整理 404 問題）

在使用單一伺服器或正式部署前，我們建議在專案根目錄加入一個 `vercel.json` 檔案。
特別是當你的前端使用 React Router（例如使用者進入 `/about` 路徑），直接重新整理網頁時，Vercel 伺服器會找不到該路徑而回傳 404。

在專案根目錄建立 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1.ts"
    }
  ]
}
```

> **💡 這種設定寫法的優勢：**
> 特別在 **GitHub Codespaces** 或其他雲端開發環境中，直接指定 `builds` 和 `routes` 能夠確保 Vercel 環境明確知道：
> 1. **前端打包**：使用 `@vercel/static-build` 處理 `package.json` 並將 `dist` 設為輸出目錄。
> 2. **後端處理**：使用 `@vercel/node` 明確處理 `api/**/*.ts` 內的 Serverless Functions。
> 3. **路由對應**：將 `/api/*` 的請求精準導向對應的 TypeScript 檔案。
> 
> 明確寫出編譯與路由規則，能大幅降低因自動偵測機制帶來的不可預期錯誤。

### 步驟 B：只執行 `vercel dev`

現在，關閉剛才開啟的兩個伺服器（按 `Ctrl + C`）。
只需要開啟**一個**終端機，執行：

```bash
vercel dev
```

你會看到類似如下的輸出：

```
Vercel CLI
> Ready! Available at http://localhost:3000
> Running Dev Command "npm run dev"
> Vite is starting...
```

這時候，你只需要連線至 `http://localhost:3000`，就可以同時存取前端畫面，並且 `/api/gemini` 也隨時待命！
再也不需要開兩個終端機視窗，開發體驗大幅提升！

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


## 部署前的完整檢查清單

在正式部署前，執行以下步驟確保一切就緒：

```bash
# ① 確認本機編譯無誤
npm run build

# ② 檢查 TypeScript 型別（如果有 typecheck 指令）
npm run typecheck || npx tsc --noEmit

# ③ 執行本機 Vercel 環境測試
vercel dev

# ④ 在瀏覽器測試所有功能（http://localhost:3000）
# - 送出問題並確認收到 AI 回答
# - 檢查 DevTools Network，確認 API Key 沒有外洩
# - 測試重新整理頁面，確認路由沒有 404

# ⑤ 檢查環境變數是否已設定在 Vercel
vercel env list

# ⑥ 檢查 Git 狀態，確認沒有誤提交敏感檔案
git status
# 應該看不到 .env（只有 .env.example）
```

---

## ✅ 本步驟完成確認

- [ ] `vite.config.ts` 已移除 `define` 區塊
- [ ] 了解 Vercel Proxy 的運作原理，並成功獲得 AI 回應
- [ ] 已在專案根目錄建立 `vercel.json` 設定路由對應（routes）
- [ ] 已成功利用單一個 `vercel dev` 指令啟動本機開發伺服器
- [ ] Chrome DevTools Network 中看不到 API Key


---

[上一範例：範例 2 - 修改前端呼叫方式](範例2-修改前端呼叫方式.md) | [下一範例：範例 4 - 部署至 Vercel 雲端](範例4-部署至Vercel雲端.md)
