# 範例 5：Upstash Redis — Server Component 直接操作與限流

## 目標

學會使用 **Upstash Redis**，並建立一個具備「防刷機制」的頁面計數器：
1. **Server Component 直接存取**：跳過 API 層，直接在頁面元件中讀寫資料庫（更安全、更快速）。
2. **建立頁面瀏覽計數器**：每當有人訪問，資料庫數字自動 +1。
3. **實作 Rate Limiting (限流)**：防止同一用戶在短時間內瘋狂重新整理頁面。

---

## 背景知識：為什麼在 Next.js 中優先使用 Server Component 操作 Redis？

在傳統的網頁開發（如純 React）中，你必須先寫一個後端 API，然後在前端 `fetch` 它。

但在 **Next.js App Router** 中：
- **效能更好**：伺服器直接連線 Redis，省去了一次「瀏覽器到伺服器」的往返時間。
- **更安全**：你的 Redis 密碼（Token）永遠留在伺服器端，**絕對不會**流出到使用者的瀏覽器。
- **SEO 友好**：計數器在 HTML 送到瀏覽器前就已經算好了，搜尋引擎抓到的是完整的資料。

---

## 步驟 1：在 Vercel 建立 Upstash Redis 服務

這是最簡單的獲取 Redis 資料庫方式，Vercel 會幫我們處理好所有的設定。

1. **登入 Vercel**：打開 [vercel.com](https://vercel.com)。
2. **進入專案**：點選你的專案名稱。
3. **建立資料庫**：
    - 點選上方的 **Storage** 分頁。
    - 點選 **Create Database** 按鈕。
    - 選擇 **Upstash for Redis** 並點選 **Connect**。
    - 勾選服務條款並選擇地區（建議選 **AP Northeast 1 - Tokyo**，離台灣最近）。
    - 點選 **Create**。
4. **同步環境變數**：
    建立完成後，回到你的本機終端機（Terminal），執行：
    ```bash
    vercel env pull .env.local
    ```
    這會自動幫你下載 `UPSTASH_REDIS_REST_URL` 等設定，你不需要手動複製貼上。

---

## 步驟 2：安裝 Redis 工具套件

我們需要安裝官方提供的 SDK，讓我們的 Node.js 環境能與 Redis 溝通。

```bash
npm install @upstash/redis
```

---

## 步驟 3：建立 Redis 連線工具 (`src/lib/redis.ts`)

為了避免在每個檔案都重寫一遍設定，我們先在 `src/lib` 下建立一個共用工具。

1. 建立資料夾：`mkdir -p src/lib`
2. 建立檔案 `src/lib/redis.ts`：

```typescript
// src/lib/redis.ts
import { Redis } from '@upstash/redis';

/**
 * 建立並匯出一個 Redis 客戶端實例。
 * Redis.fromEnv() 會自動從 .env.local 讀取剛剛下載的環境變數。
 */
export const redis = Redis.fromEnv();
```

---

## 步驟 4：建立計數與限流頁面 (`src/app/counter/page.tsx`)

現在我們要利用 **Server Component** 直接在頁面裡寫下「計數」與「限流」的邏輯。

1. 建立資料夾：`mkdir -p src/app/counter`
2. 建立檔案 `src/app/counter/page.tsx`：

```typescript
// src/app/counter/page.tsx
import { redis } from '@/lib/redis';
import { headers } from 'next/headers';

/**
 * revalidate = 0 的作用是告訴 Next.js：
 * 「這個頁面絕對不要快取，每次使用者重新整理，都要重新執行一次伺服器邏輯。」
 * 這樣我們的計數器才能即時更新。
 */
export const revalidate = 0;

export default async function CounterPage() {
  // 1. 取得用戶 IP（用來判斷是誰在重新整理）
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  
  // 每個 IP 在 Redis 裡都有自己專屬的「計數器」，Key 名稱為 rate:ip:127.0.0.1
  const rateKey = `rate:ip:${ip}`;

  // 2. 實作限流邏輯
  // incr() 會讓 Redis 裡的數字 +1。如果原本沒資料，會從 1 開始。
  const requestCount = await redis.incr(rateKey);

  // 如果是這個 IP 第一次存取（數字剛好是 1），我們設定它 60 秒後失效
  if (requestCount === 1) {
    await redis.expire(rateKey, 60);
  }

  // 3. 檢查是否超過限制 (例如 60 秒內不能超過 10 次)
  if (requestCount > 10) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50 text-red-900">
        <div className="text-center p-10 bg-white shadow-2xl rounded-3xl border-2 border-red-200">
          <h1 className="text-3xl font-black mb-2">👮 限流警報</h1>
          <p className="text-lg">您點太快了！請在 1 分鐘後再試。</p>
          <p className="mt-4 text-sm bg-red-100 py-1 rounded-full text-red-500">
            目前次數：{requestCount} / 10
          </p>
        </div>
      </main>
    );
  }

  // 4. 通過限流檢查後，增加「全站總瀏覽次數」
  const totalViews = await redis.incr('page:views');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-12 bg-white shadow-2xl rounded-3xl border border-gray-100">
        <h2 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">
          Total Page Views
        </h2>
        <p className="text-8xl font-black text-indigo-600 mb-8 tabular-nums">
          {totalViews}
        </p>
        
        <div className="pt-8 border-t border-gray-50 text-left space-y-2">
          <p className="text-xs text-gray-400 flex justify-between">
            <span>您的 IP 位址：</span>
            <span className="font-mono text-gray-600">{ip}</span>
          </p>
          <p className="text-xs text-gray-400 flex justify-between">
            <span>60秒內重新整理次數：</span>
            <span className={`font-bold ${requestCount > 7 ? 'text-orange-500' : 'text-indigo-400'}`}>
              {requestCount} / 10
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
```

---

## 如何測試是否成功？

完成程式碼後，請按照以下步驟進行測試：

1. **啟動開發伺服器**：
   在終端機輸入 `npm run dev` 並確保專案已啟動。
2. **打開頁面**：
   在瀏覽器輸入 `http://localhost:3000/counter`。
3. **測試計數器**：
   - 每次點選瀏覽器的 **「重新整理」** 鈕，大數字（Total Views）應該會遞增。
   - 關閉瀏覽器再打開，數字應該會維持，因為它是存在雲端 Redis 裡。
4. **測試限流機制 (Rate Limit)**：
   - 快速、連續地按下 **F5 (重新整理)**。
   - 觀察下方的「重新整理次數」，當它到達 10 之後再按一次。
   - 畫面應該會切換成紅色的 **「👮 限流警報」**。
   - 等待 60 秒後再重新整理，頁面應該會恢復正常。

---

## 常見問題 (FAQ)

- **Q: 為什麼我在本機測，IP 顯示 127.0.0.1？**
  - **A**: 這是正常的，因為你現在是在本機開發。部署到 Vercel 後，它會顯示真實的網路 IP。
- **Q: `redis.incr` 是什麼意思？**
  - **A**: 它是 "Increment"（增加）的縮寫。這在 Redis 裡是「原子操作」，意思是即使 1000 個人同時點擊，Redis 也會一個一個幫你加好，絕對不會算錯數字。
- **Q: 如果我想要歸零數字怎麼辦？**
  - **A**: 你可以去 Vercel 的 Storage 分頁，進入 Upstash 介面，找到 **Data Browser**，手動刪除 Key 或修改數值。

---

## ✅ 本步驟完成確認

- [ ] 已在 Vercel 建立 Redis 服務並執行 `env pull`。
- [ ] 頁面 `/counter` 每次重新整理，數字會增加。
- [ ] 快速重新整理超過 10 次，能看到限流畫面。
- [ ] 理解 Server Component 不需要寫 API 就能直接操作 Redis。

---

[上一範例：範例 4 - Vercel Blob](範例4-VercelBlob.md) | [下一步：實戰演練](../Next.js_Vercel_雲端名片/README.md)
