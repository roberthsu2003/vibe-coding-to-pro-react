# 範例 5：Upstash Redis — 計數器與 Rate Limiting

## 目標

學會使用 **Upstash Redis**（透過 Vercel Marketplace 佈建）：
1. 建立頁面瀏覽計數器（每次有人訪問，數字 +1）
2. 建立 Rate Limiting（防止同一用戶在短時間內瘋狂呼叫 API）

---

## 背景知識：什麼是 KV 儲存？

**KV（Key-Value）儲存**就像一本超級字典：

```
"key"     →  "value"
─────────────────────
"visits"  →  "142"
"user:1"  →  "logged-in"
"rate:ip" →  "5"          ← 這個 IP 已呼叫 5 次
```

Redis 是最流行的 KV 資料庫，它把資料存在**記憶體**中，讀寫速度比傳統資料庫快 10～100 倍。

### 為什麼不用 Vercel KV？

Vercel 曾經提供 `@vercel/kv` 套件，但這個產品已**停售（sunset）**，不再接受新用戶。

現在 Vercel Marketplace 整合了 **Upstash Redis** 作為官方推薦的替代方案：
- 透過 Vercel Marketplace 一鍵建立，環境變數自動注入
- 使用 `@upstash/redis` 套件
- 免費方案：10,000 次請求/天

---

## 步驟 1：在 Vercel Marketplace 佈建 Upstash Redis

1. 前往 [vercel.com](https://vercel.com) → 登入 → 選擇 `cloud-features` 專案
2. 點選上方 **Storage** 分頁
3. 點選 **Create Database** → 選擇 **Upstash for Redis**
4. 選擇地區（建議選 **AP Northeast 1** — 最靠近台灣）
5. 取名（例如 `my-redis`）→ 點選 **Create**

建立完成後，Vercel 會自動將以下環境變數注入到你的專案：

```bash
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 拉取環境變數到本機

```bash
vercel env pull .env.local
```

確認 `.env.local` 中出現了兩個 Upstash 的環境變數：

```bash
grep UPSTASH .env.local
# UPSTASH_REDIS_REST_URL=https://...
# UPSTASH_REDIS_REST_TOKEN=...
```

---

## 步驟 2：安裝 `@upstash/redis`

```bash
npm install @upstash/redis
```

---

## 步驟 3：建立 Redis 工具函式

在 `src/lib/` 目錄下建立 Redis 客戶端，方便在多個地方重複使用：

```bash
mkdir -p src/lib
```

建立 `src/lib/redis.ts`：

```typescript
// src/lib/redis.ts
import { Redis } from '@upstash/redis';

// 從環境變數建立 Redis 客戶端
// Redis.fromEnv() 會自動讀取 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv();
```

> **💡 為什麼要獨立一個檔案？**  
> 如果直接在每個 Route Handler 裡 `new Redis()`，每次匯入都會建立新物件。  
> 獨立一個 `redis.ts` 並匯出，讓 Node.js 的模組快取重複利用同一個實例。

---

## 步驟 4：建立頁面瀏覽計數器 API

建立 `src/app/api/views/route.ts`：

```bash
mkdir -p src/app/api/views
```

```typescript
// src/app/api/views/route.ts
import { redis } from '@/lib/redis';

// 計數器的 Key 名稱（在 Redis 中的鍵）
const VIEWS_KEY = 'page:views';

// GET：取得目前瀏覽次數
export async function GET() {
  // get() 取得 Key 的值；如果 Key 不存在，回傳 null
  const views = await redis.get<number>(VIEWS_KEY);

  return Response.json({
    views: views ?? 0,  // null 時顯示 0
  });
}

// POST：將瀏覽次數 +1，並回傳新的數字
export async function POST() {
  // incr() 是 Redis 的原子操作：將 Key 的值 +1 並回傳新值
  // 如果 Key 不存在，自動從 0 開始計數
  // 「原子操作」的意思是：即使有 1000 個請求同時到達，每次 +1 都保證不會遺失
  const newViews = await redis.incr(VIEWS_KEY);

  return Response.json({
    views: newViews,
  });
}
```

### 關鍵概念：`incr()` 的原子性

```
同時 1000 個請求呼叫 POST /api/views
↓
Redis incr() 逐一執行（原子操作）
↓
最終結果：正確增加 1000 次（不會因為並發而遺失）
```

相比之下，用普通變數 `count++` 在高並發下會發生 Race Condition（多個操作同時讀取舊值，寫回時互相覆蓋）。

---

## 步驟 5：在頁面中顯示瀏覽次數

建立 `src/app/counter/page.tsx`，讓頁面每次被訪問時自動計數：

```bash
mkdir -p src/app/counter
```

```typescript
// src/app/counter/page.tsx

// Server Component：每次請求時在伺服器端執行
// revalidate = 0 確保每次都是最新數字，不使用快取
export const revalidate = 0;

async function incrementAndGetViews(): Promise<number> {
  // 呼叫自己的 API（Server Component 中直接 fetch）
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/views`, {
    method: 'POST',
    cache: 'no-store',  // 不使用 fetch 快取，確保每次都呼叫 API
  });

  const data = await res.json();
  return data.views;
}

export default async function CounterPage() {
  const views = await incrementAndGetViews();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">頁面瀏覽計數器</h1>
        <p className="text-6xl font-mono text-blue-600">{views}</p>
        <p className="text-gray-500 mt-2">次訪問</p>
        <p className="text-sm text-gray-400 mt-4">
          重新整理這個頁面，數字會增加
        </p>
      </div>
    </main>
  );
}
```

啟動 `npm run dev`，前往 `http://localhost:3000/counter`，每次重新整理數字都會 +1。

---

## 步驟 6：建立 Rate Limiting（防濫用）

Rate Limiting 是「防止同一個用戶在短時間內呼叫太多次 API」的機制。  
例如：每個 IP 每 60 秒最多呼叫 10 次。

建立 `src/app/api/protected/route.ts`：

```bash
mkdir -p src/app/api/protected
```

```typescript
// src/app/api/protected/route.ts
import { redis } from '@/lib/redis';

const RATE_LIMIT = 10;       // 每個時間窗口最多 10 次
const WINDOW_SECONDS = 60;   // 時間窗口：60 秒

export async function GET(request: Request) {
  // 取得用戶 IP（Vercel 注入的 Header；本機開發時使用 '127.0.0.1'）
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '127.0.0.1';

  // 每個 IP 有自己的 Key：rate:ip:123.456.789.0
  const key = `rate:ip:${ip}`;

  // incr() 讓這個 Key 的計數 +1，並回傳目前的計數值
  const count = await redis.incr(key);

  // 第一次呼叫時（count === 1），設定 TTL（到期時間）
  // 到期後 Redis 自動刪除這個 Key，計數歸零
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  // 檢查是否超過限制
  if (count > RATE_LIMIT) {
    return Response.json(
      {
        error: `請求過於頻繁，請 ${WINDOW_SECONDS} 秒後再試`,
        retryAfter: WINDOW_SECONDS,
        currentCount: count,
        limit: RATE_LIMIT,
      },
      {
        status: 429,  // 429 Too Many Requests
        headers: {
          'Retry-After': String(WINDOW_SECONDS),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': String(Math.max(0, RATE_LIMIT - count)),
        },
      }
    );
  }

  // 通過限制，執行正常邏輯
  return Response.json({
    message: '呼叫成功！',
    ip,
    currentCount: count,
    remaining: RATE_LIMIT - count,
    resetIn: `${WINDOW_SECONDS} 秒`,
  });
}
```

### Rate Limiting 的運作邏輯

```
第 1 次請求 → count = 1 → 設定 60 秒 TTL → 回傳成功（剩餘 9 次）
第 2 次請求 → count = 2 → TTL 已設定，不再設定 → 回傳成功（剩餘 8 次）
...
第 10 次請求 → count = 10 → 回傳成功（剩餘 0 次）
第 11 次請求 → count = 11 → 超過限制 → 回傳 429 Too Many Requests
...
60 秒後 → Redis TTL 到期 → Key 自動刪除 → 計數歸零
第 1 次請求 → count = 1 → 重新計時
```

### 測試 Rate Limiting

用迴圈快速呼叫 API，觸發限制：

```bash
# 連續呼叫 15 次
for i in $(seq 1 15); do
  echo "第 $i 次："
  curl -s http://localhost:3000/api/protected | python3 -m json.tool
  echo "---"
done
```

前 10 次會成功，第 11 次之後會收到 `429` 錯誤。

---

## Redis 常用指令速查

| 指令 | 說明 | 範例 |
|------|------|------|
| `redis.get(key)` | 取得值 | `await redis.get('name')` |
| `redis.set(key, value)` | 設定值 | `await redis.set('name', 'Alice')` |
| `redis.set(key, value, { ex: 60 })` | 設定值並在 60 秒後自動刪除 | 登入狀態、一次性驗證碼 |
| `redis.incr(key)` | 數值 +1（原子操作） | 計數器 |
| `redis.expire(key, seconds)` | 設定 Key 的存活時間 | 搭配 incr 做 Rate Limiting |
| `redis.del(key)` | 刪除 Key | 登出時清除 Session |

---

## ✅ 本步驟完成確認

- [ ] 已在 Vercel Marketplace 建立 Upstash Redis
- [ ] 已執行 `vercel env pull .env.local` 取得 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`
- [ ] 安裝 `@upstash/redis` 完成
- [ ] 建立了 `src/lib/redis.ts` 工具函式
- [ ] 訪問 `/counter` 並重新整理，確認數字每次 +1
- [ ] 快速呼叫 `/api/protected` 超過 10 次，確認收到 429 錯誤

---

[上一範例：範例 4 - Vercel Blob](範例4-VercelBlob.md) | [下一步：實戰演練](../Next.js_Vercel_雲端名片/README.md)
