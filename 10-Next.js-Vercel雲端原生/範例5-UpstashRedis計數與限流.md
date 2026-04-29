# 範例 5：Upstash Redis — Server Component 直接操作與限流

## 目標

學會使用 **Upstash Redis**：
1. **Server Component 直接存取**：跳過 API 層，直接在頁面元件中讀寫資料庫。
2. **建立頁面瀏覽計數器**：每次頁面渲染，數字自動 +1。
3. **實作 Rate Limiting (限流)**：防止同一用戶在短時間內過度重新整理。

---

## 背景知識：為什麼在 Next.js 中優先使用 Server Component 操作 Redis？

在傳統的 SPA（如純 React）或舊版 Next.js 中，我們必須寫一個 API (`/api/views`)，然後在前端 `fetch` 它。

但在 **App Router (Server Components)** 中：
- **效能更好**：伺服器直接連線 Redis，省去了一次瀏覽器到 API 的 HTTP 請求。
- **更安全**：Redis 的 Token 永遠留在伺服器端，不會暴露給瀏覽器。
- **代碼更簡潔**：不再需要為了讀取一個數字而寫一堆 API 路由。

---

## 步驟 1：在 Vercel Marketplace 佈建 Upstash Redis

1. 前往 [vercel.com](https://vercel.com) → 登入 → 選擇你的專案。
2. 點選上方 **Storage** 分頁 → **Create Database** → 選擇 **Upstash for Redis**。
3. 建立完成後，執行以下指令拉取環境變數到本機：

```bash
vercel env pull .env.local
```

---

## 步驟 2：安裝 `@upstash/redis`

```bash
npm install @upstash/redis
```

---

## 步驟 3：建立 Redis 工具函式

在 `src/lib/redis.ts` 建立客戶端：

```typescript
// src/lib/redis.ts
import { Redis } from '@upstash/redis';

// 自動讀取 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv();
```

---

## 步驟 4：在 Server Component 直接實作計數與限流

我們不再建立 `api/` 路由，直接在頁面元件中實作所有邏輯。

建立 `src/app/counter/page.tsx`：

```typescript
// src/app/counter/page.tsx
import { redis } from '@/lib/redis';
import { headers } from 'next/headers';

// 強制每次請求都重新執行，不使用快取
export const revalidate = 0;

export default async function CounterPage() {
  // 1. 取得用戶 IP（用於限流）
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const rateKey = `rate:ip:${ip}`;

  // 2. 實作限流 (每 60 秒最多 10 次)
  const count = await redis.incr(rateKey);
  if (count === 1) {
    await redis.expire(rateKey, 60);
  }

  // 3. 檢查是否超過限制
  if (count > 10) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white shadow-xl rounded-2xl border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-2">請求過於頻繁</h1>
          <p className="text-gray-600">請等 60 秒後再重新整理頁面。</p>
          <p className="mt-4 text-sm text-gray-400">目前計數：{count} / 10</p>
        </div>
      </main>
    );
  }

  // 4. 增加總瀏覽次數 (原子操作)
  const views = await redis.incr('page:views');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-12 bg-white shadow-2xl rounded-3xl border border-gray-100">
        <h1 className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">
          Total Page Views
        </h1>
        <p className="text-8xl font-black text-indigo-600 mb-6 tabular-nums">
          {views}
        </p>
        <div className="pt-6 border-t border-gray-50 text-gray-400 text-sm">
          <p>您的 IP: <span className="font-mono">{ip}</span></p>
          <p>限流狀態: <span className="text-indigo-400 font-medium">{count} / 10</span></p>
        </div>
      </div>
    </main>
  );
}
```

---

## 關鍵觀念對比

| 比較項目 | 傳統 API 路由方式 | Server Component 方式 (推薦) |
| :--- | :--- | :--- |
| **流程** | 瀏覽器 → API → Redis → 回傳數據 → 前端渲染 | 伺服器渲染 HTML 時直接讀取 Redis |
| **網路開銷** | 額外一次 HTTP 請求 (Round-trip) | **零** 額外請求 (Zero round-trip) |
| **安全性** | 需注意 API 端點是否被惡意大量呼叫 | 代碼完全在伺服器端，不暴露 API 給外界 |
| **SEO** | 需處理 Client-side 讀取狀態 (Loading) | **完美 SEO**，HTML 產出時即包含計數 |

---

## Redis 常用指令速查

| 指令 | 說明 | 範例 |
|------|------|------|
| `redis.get(key)` | 取得值 | `await redis.get('views')` |
| `redis.incr(key)` | 數值 +1（原子操作） | 非常適合計數器，不會因為並發而遺失數字 |
| `redis.expire(key, sec)`| 設定到期時間 | 常用於限流、暫存、一次性驗證碼 |
| `redis.set(key, val)` | 設定值 | 可搭配 `{ ex: 60 }` 同時設定秒數 |

---

## ✅ 本步驟完成確認

- [ ] 已建立 `src/lib/redis.ts` 工具函式
- [ ] 頁面 `/counter` 每次重新整理，數字正確增加
- [ ] 快速重新整理 10 次以上，能正確觸發「請求過於頻繁」的限流畫面
- [ ] 理解為什麼 Server Component 不需要另外寫 `/api` 就能操作資料庫

---

[上一範例：範例 4 - Vercel Blob](範例4-VercelBlob.md) | [下一步：實戰演練](../Next.js_Vercel_雲端名片/README.md)
