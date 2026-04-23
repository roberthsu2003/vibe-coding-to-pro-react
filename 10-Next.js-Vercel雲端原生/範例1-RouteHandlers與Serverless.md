# 範例 1：Route Handlers 與 Serverless Functions

## 目標

理解 Next.js 16 App Router 中的 **Route Handlers** 是什麼，以及它們部署到 Vercel 後如何自動成為 **Serverless Functions**。

完成本範例後，你將能夠：
1. 在 App Router 中建立 GET 和 POST 的 API 端點
2. 使用 Web 標準的 `Request` / `Response` 介面（而非 Node.js 的 `IncomingMessage`）
3. 理解「一個 route.ts 檔案 = 一個 Serverless Function」的對應關係

---

## 背景知識：Route Handlers 是什麼？

在 Next.js 的 App Router 中，**Route Handlers** 是你撰寫後端 API 的方式。  
只要在 `app/` 目錄下建立 `route.ts` 檔案，Next.js 就會把它當成 HTTP 端點。

```
app/
├── page.tsx              ← 頁面（回傳 HTML）
└── api/
    └── hello/
        └── route.ts      ← Route Handler（回傳 JSON、處理請求）
```

### 與舊版 Pages Router 的差異

| 特性 | Pages Router (`pages/api/*.ts`) | App Router (`app/api/*/route.ts`) |
|------|-------------------------------|-----------------------------------|
| Request 物件 | Node.js `IncomingMessage` | Web 標準 `Request` |
| Response 方式 | `res.json()`, `res.send()` | `return Response.json()` |
| HTTP 方法 | `req.method === 'POST'` | 匯出具名函式 `export async function POST()` |
| 執行環境 | Node.js | Node.js（預設），可切換 Edge |

### Vercel 的自動對應

部署到 Vercel 後：

```
app/api/hello/route.ts      →  https://你的網域/api/hello  （一個 Serverless Function）
app/api/messages/route.ts   →  https://你的網域/api/messages（一個 Serverless Function）
```

> **💡 為什麼這很重要？**  
> 每個 Route Handler 都是獨立的 Serverless Function：有人呼叫才啟動，用完即釋放。  
> 你不需要管理任何伺服器，也不需要設定任何路由框架——Next.js + Vercel 全部自動處理。

---

## Next.js 的角色：一個工具取代三個

學習 Vite + React 時，若想開發全端應用，你需要組合多個工具：

| 工具 | 負責的事 |
|------|----------|
| Vite | 打包前端程式碼 + HMR（存檔即更新） |
| React | UI 元件 |
| Vercel CLI（`vercel dev`） | 本機模擬 Serverless Function |

**Next.js 把這三件事全部整合進來：**

```
Next.js = React + Turbopack（含 HMR）+ 內建伺服器（含模擬 Serverless）
```

所以你只需要執行 `npm run dev`，就能同時擁有：
- ✅ 前端打包與 HMR（由 **Turbopack** 負責，不是 Vite）
- ✅ 本機模擬 Route Handlers（不需要安裝 Vercel CLI）
- ✅ 部署到 Vercel 也不需要在專案裡安裝任何額外套件

> **💡 HMR（Hot Module Replacement）**  
> 你修改程式碼存檔後，瀏覽器自動局部更新，不需要手動重新整理頁面。  
> Turbopack 用 Rust 實作，HMR 速度比 Vite 更快。

---

## 步驟 1：建立本章學習用的 Next.js 專案

為本章建立一個獨立的練習專案，方便你自由嘗試各項功能。

```bash
npx create-next-app@latest cloud-features --typescript --tailwind --app --src-dir --no-import-alias
cd cloud-features
```

<details>
<summary>💡 指令參數說明</summary>

| 參數 | 說明 |
|------|------|
| `--typescript` | 使用 TypeScript |
| `--tailwind` | 安裝 Tailwind CSS 4 |
| `--app` | 使用 App Router（非 Pages Router） |
| `--src-dir` | 原始碼放在 `src/` 目錄下 |
| `--no-import-alias` | 不設定路徑別名（保持簡單） |

</details>

確認版本符合本章教材：

```bash
cat package.json | grep '"next"'
# 預期看到 "next": "16.x.x"
```

---

## 步驟 2：建立第一個 Route Handler（GET）

在 `src/app/api/hello/` 目錄下建立 `route.ts`：

```bash
mkdir -p src/app/api/hello
```

建立 `src/app/api/hello/route.ts`，內容如下：

```typescript
// src/app/api/hello/route.ts

// Next.js 的 Route Handler：匯出具名的 HTTP 方法函式
// GET 函式對應 HTTP GET 請求
export async function GET() {
  return Response.json({
    message: '你好，這是我的第一個 Route Handler！',
    timestamp: new Date().toISOString(),
  });
}
```

### 程式碼說明

| 重點 | 說明 |
|------|------|
| `export async function GET()` | 匯出具名函式，函式名稱即 HTTP 方法（GET/POST/PUT/DELETE） |
| `Response.json({...})` | 使用 Web 標準 API 回傳 JSON，**不是** `res.json()` |
| 不需要 `export default` | Route Handlers 用具名匯出，一個檔案可以有多個 HTTP 方法 |

---

## 步驟 3：測試 GET 端點

啟動開發伺服器：

```bash
npm run dev
```

開啟瀏覽器，前往：`http://localhost:3000/api/hello`

你應該看到：

```json
{
  "message": "你好，這是我的第一個 Route Handler！",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

> **✅ 成功！** 你剛才建立的 `route.ts` 就對應到 `/api/hello` 這個 URL。

---

## 步驟 4：建立支援 GET 和 POST 的 Route Handler

大多數 API 需要同時支援「讀取」（GET）和「寫入」（POST）。  
讓我們建立一個簡單的留言板 API：

```bash
mkdir -p src/app/api/messages
```

建立 `src/app/api/messages/route.ts`：

```typescript
// src/app/api/messages/route.ts

// 用陣列模擬資料庫（注意：重啟伺服器後資料會消失，稍後 Upstash Redis 會解決這個問題）
const messages: { id: number; text: string; createdAt: string }[] = [];
let nextId = 1;

// GET：取得所有留言
export async function GET() {
  return Response.json({ messages });
}

// POST：新增一則留言
export async function POST(request: Request) {
  // 從請求的 body 解析 JSON
  const body = await request.json();

  // 驗證：確保 text 欄位存在
  if (!body.text || typeof body.text !== 'string') {
    return Response.json(
      { error: '缺少 text 欄位' },
      { status: 400 }  // 400 Bad Request
    );
  }

  // 建立新留言
  const newMessage = {
    id: nextId++,
    text: body.text,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);

  return Response.json(newMessage, { status: 201 }); // 201 Created
}
```

### 程式碼說明

| 重點 | 說明 |
|------|------|
| `export async function POST(request: Request)` | POST 方法接收 `Request` 物件（Web 標準，型別是 `Request`） |
| `await request.json()` | 非同步解析請求 body（Web 標準 API） |
| `Response.json(data, { status: 201 })` | 第二個參數可設定 HTTP 狀態碼與 Headers |
| 同一個 `route.ts` 有 GET 和 POST | 一個檔案處理同一路徑的多種 HTTP 方法 |

---

## 步驟 5：用 curl 測試 POST 端點

在另一個終端機視窗執行（保持 `npm run dev` 繼續運行）：

```bash
# 新增一則留言
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, Next.js Route Handler!"}'
```

預期回應：

```json
{
  "id": 1,
  "text": "Hello, Next.js Route Handler!",
  "createdAt": "2025-01-15T10:35:00.000Z"
}
```

再用 GET 確認留言已儲存：

```bash
curl http://localhost:3000/api/messages
```

預期回應：

```json
{
  "messages": [
    {
      "id": 1,
      "text": "Hello, Next.js Route Handler!",
      "createdAt": "2025-01-15T10:35:00.000Z"
    }
  ]
}
```

---

## 步驟 6：從前端頁面呼叫 API

在 `src/app/page.tsx` 中，用 Server Component 的方式直接呼叫 API：

```typescript
// src/app/page.tsx
export default async function HomePage() {
  // Server Component：直接在伺服器端 fetch，不需要 useEffect
  const res = await fetch('http://localhost:3000/api/hello');
  const data = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Route Handler 測試</h1>
      <p className="mt-4 text-gray-600">API 回應：{data.message}</p>
      <p className="text-sm text-gray-400">時間：{data.timestamp}</p>
    </main>
  );
}
```

> **💡 Server Component 的優勢**  
> 在 Server Component 中直接 `fetch` 自己的 API，這個請求在伺服器端完成，  
> 不需要 `useEffect` + `useState`，也不會佔用用戶端的頻寬。

---

## 理解 Serverless Functions 的特性

### 本機 vs 雲端：底層完全不同

執行 `npm run dev` 時，**本機並沒有真正的 Serverless**。  
Next.js 啟動的是一個**持續運行的 Node.js 伺服器**，只是讓你用相同的程式碼寫法開發：

```
本機 npm run dev
┌──────────────────────────────────────┐
│  Next.js 開發伺服器（一直在跑）      │
│  /api/hello   ──┐                    │
│  /api/messages──┤ 同一個程序處理     │
│  /page.tsx    ──┘                    │
└──────────────────────────────────────┘

部署到 Vercel 後（真正的 Serverless）
┌──────────────────────────────────────┐
│  /api/hello    → Function A  ← 有請求才啟動 │
│  /api/messages → Function B  ← 有請求才啟動 │
│  /page.tsx     → 靜態 / SSR               │
└──────────────────────────────────────┘
```

程式碼寫法完全相同，但執行機制不同：本機是「持續待命」，Vercel 是「按需啟動」。

---

### Serverless Function 的生命週期

在結束本範例前，有一件事很重要——理解 Serverless Function 的生命週期：

```
用戶請求 → 函式啟動 → 執行 → 回傳結果 → 函式休眠
```

這意味著：
- ✅ **優點**：不請求就不消耗資源、自動擴展
- ⚠️ **限制**：函式重啟後，**記憶體中的資料會消失**

在本範例的留言板中，`messages` 陣列存在記憶體裡。  
**重新部署或函式冷啟動後，留言全部消失。**  
這就是為什麼後面需要學 Vercel Blob（存檔案）和 Upstash Redis（存資料）。

---

## ✅ 本步驟完成確認

完成後，你的目錄結構應為：

```
cloud-features/
├── src/
│   └── app/
│       ├── api/
│       │   ├── hello/
│       │   │   └── route.ts     ← ✅ GET 端點
│       │   └── messages/
│       │       └── route.ts     ← ✅ GET + POST 端點
│       └── page.tsx             ← ✅ 呼叫 API 的 Server Component
├── package.json
└── next.config.ts
```

- [ ] 訪問 `http://localhost:3000/api/hello` 可看到 JSON 回應
- [ ] 用 curl 新增留言後，GET 可取回該留言
- [ ] `src/app/page.tsx` 顯示 API 回傳的訊息

---

[下一範例：範例 2 - Image Optimization](範例2-ImageOptimization.md)
