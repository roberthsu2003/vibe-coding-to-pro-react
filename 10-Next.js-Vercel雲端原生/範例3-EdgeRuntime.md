# 範例 3：Edge Runtime — 邊緣執行環境

## 目標

了解 **Edge Runtime** 是什麼、與預設的 Node.js Runtime 有何差異，  
並透過一個「根據用戶語言偏好回傳問候語」的實際範例，體驗 Edge 的使用方式與限制。

---

## 背景知識：Edge Runtime 是什麼？

### 普通 Serverless Function（Node.js Runtime）

預設情況下，每個 Route Handler 都跑在 **Node.js Runtime**：

```
用戶在台灣 → 請求送到 美國 Vercel 資料中心 → 執行函式 → 回應回台灣
              ←────────────── 約 150ms 延遲 ──────────────→
```

### Edge Runtime

Vercel 在全球各地（包含亞洲）都有節點（Pop）。  
Edge Runtime 讓你的程式碼在**最靠近用戶的節點**上執行：

```
用戶在台灣 → 請求送到 東京/新加坡 Vercel Edge 節點 → 執行函式 → 回應
              ←────────── 約 20ms 延遲 ──────────→
```

### 為什麼 Edge Runtime 更快？

1. **地理位置更近** → 網路延遲大幅降低
2. **冷啟動更快** → Edge Function 啟動時間約 0ms（比 Serverless 的數百 ms 快很多）

### 但 Edge Runtime 有限制

Edge Runtime 使用的是 **Web 標準 API**，不支援完整的 Node.js：

| 功能 | Node.js Runtime | Edge Runtime |
|------|----------------|-------------|
| `fs`（讀寫檔案） | ✅ | ❌ |
| `crypto`（Node.js 版）| ✅ | ❌（需用 Web Crypto API） |
| 第三方 Node.js 套件 | ✅ 大多數 | ⚠️ 需確認相容性 |
| `Request` / `Response` | ✅ | ✅ |
| `fetch` | ✅ | ✅ |
| 執行時間上限 | 5 秒（預設） | 30 秒 |

### 什麼情況適合用 Edge？

| 適合 Edge | 不適合 Edge |
|-----------|-------------|
| 根據地理位置、語言轉址 | 資料庫查詢（使用 Node.js 套件） |
| JWT 驗證（簡單邏輯） | 讀寫本機檔案 |
| 回傳快取的靜態內容 | 複雜的 Node.js 運算 |
| A/B 測試分流 | 需要大量記憶體的工作 |

---

## 步驟 1：建立一個 Edge Route Handler

在 `src/app/api/greeting/route.ts` 建立一個使用 Edge Runtime 的 API：

```bash
mkdir -p src/app/api/greeting
```

建立 `src/app/api/greeting/route.ts`：

```typescript
// src/app/api/greeting/route.ts

// 這一行是關鍵：告訴 Next.js / Vercel 這個函式要用 Edge Runtime 執行
export const runtime = 'edge';

export async function GET(request: Request) {
  // Edge Runtime 可以讀取請求的 Headers
  // Vercel 會自動在請求中注入地理位置資訊
  const headers = request.headers;

  // 取得用戶的語言偏好（瀏覽器設定）
  const acceptLanguage = headers.get('accept-language') ?? 'en';

  // 取得 Vercel 注入的地理位置資訊（部署到 Vercel 後才有值，本機開發為 undefined）
  const country = headers.get('x-vercel-ip-country') ?? '未知';
  const city = headers.get('x-vercel-ip-city') ?? '未知';

  // 根據語言偏好決定問候語
  let greeting = 'Hello';
  if (acceptLanguage.startsWith('zh')) {
    greeting = '你好';
  } else if (acceptLanguage.startsWith('ja')) {
    greeting = 'こんにちは';
  } else if (acceptLanguage.startsWith('ko')) {
    greeting = '안녕하세요';
  }

  return Response.json({
    greeting,
    message: `${greeting}！你來自 ${country} 的 ${city}`,
    acceptLanguage,
    country,
    city,
    runtime: 'edge',  // 讓學生知道這個 API 跑在 Edge
  });
}
```

---

## 步驟 2：測試 Edge Route Handler（本機）

啟動開發伺服器，訪問：

```
http://localhost:3000/api/greeting
```

本機開發時，地理位置 Header 不會有真實的值（Vercel 只在雲端注入），  
但你可以確認 `runtime: "edge"` 的回應格式：

```json
{
  "greeting": "Hello",
  "message": "Hello！你來自 未知 的 未知",
  "acceptLanguage": "zh-TW,zh;q=0.9,en;q=0.8",
  "country": "未知",
  "city": "未知",
  "runtime": "edge"
}
```

> **💡 台灣用戶的 `accept-language` 通常是 `zh-TW`，所以 greeting 會是「你好」。**

---

## 步驟 3：模擬不同語言（用 curl 傳入 Header）

用 curl 測試不同語言偏好：

```bash
# 模擬日文使用者
curl -H "Accept-Language: ja-JP" http://localhost:3000/api/greeting

# 模擬韓文使用者
curl -H "Accept-Language: ko-KR" http://localhost:3000/api/greeting

# 模擬英文使用者
curl -H "Accept-Language: en-US" http://localhost:3000/api/greeting
```

---

## 步驟 4：比較 Edge 與 Node.js Runtime 的回應速度

讓我們建立兩個功能相同但 Runtime 不同的 API，在部署後比較速度差異：

建立 `src/app/api/ping-node/route.ts`（Node.js Runtime）：

```typescript
// src/app/api/ping-node/route.ts

// 不寫 export const runtime，預設就是 Node.js
export async function GET() {
  return Response.json({
    message: 'pong',
    runtime: 'nodejs',
    timestamp: Date.now(),
  });
}
```

建立 `src/app/api/ping-edge/route.ts`（Edge Runtime）：

```typescript
// src/app/api/ping-edge/route.ts

export const runtime = 'edge';  // ← 唯一的差異

export async function GET() {
  return Response.json({
    message: 'pong',
    runtime: 'edge',
    timestamp: Date.now(),
  });
}
```

> **⚠️ 本機測試看不出差異**  
> 速度差異在部署到 Vercel 後才會明顯，尤其是從地理位置遠的地方發出請求時。  
> 本地開發兩者都是 localhost，延遲相同。

---

## 步驟 5：了解 Edge Runtime 的限制（親手觸發錯誤）

Edge Runtime 不支援 Node.js 的 `fs` 模組。  
讓我們親身體驗這個限制：

建立 `src/app/api/test-edge-limit/route.ts`：

```typescript
// src/app/api/test-edge-limit/route.ts
export const runtime = 'edge';

export async function GET() {
  // ❌ 這行會在 build 時或執行時報錯
  // const fs = require('fs');  // CommonJS require 在 Edge 中完全不支援

  // ✅ Web 標準 API 在 Edge 中可以使用
  const encoded = btoa('Hello Edge!');  // Base64 encoding（Web API）
  const decoded = atob(encoded);

  return Response.json({
    encoded,
    decoded,
    webCryptoAvailable: typeof crypto !== 'undefined',
    message: 'Web 標準 API 在 Edge 中運作正常',
  });
}
```

訪問 `http://localhost:3000/api/test-edge-limit`，你會看到：

```json
{
  "encoded": "SGVsbG8gRWRnZSE=",
  "decoded": "Hello Edge!",
  "webCryptoAvailable": true,
  "message": "Web 標準 API 在 Edge 中運作正常"
}
```

---

## 重點整理

```
需要速度（全球用戶、簡單邏輯）？      → 用 Edge Runtime
需要 Node.js 套件、資料庫連線？       → 用 Node.js Runtime（預設）
不確定？                              → 先用 Node.js Runtime
```

在 Next.js 中，`export const runtime = 'edge'` 這一行是唯一的差異。  
大多數情況下，使用預設的 Node.js Runtime 就足夠了。

---

## ✅ 本步驟完成確認

- [ ] `src/app/api/greeting/route.ts` 已建立，包含 `export const runtime = 'edge'`
- [ ] 訪問 `/api/greeting` 可看到根據 `accept-language` Header 決定的問候語
- [ ] 已建立 `ping-node` 和 `ping-edge` 兩個對照 API
- [ ] 理解 Edge 不支援 `fs` 等 Node.js 模組

---

[上一範例：範例 2 - Image Optimization](範例2-ImageOptimization.md) | [下一範例：範例 4 - Vercel Blob](範例4-VercelBlob.md)
