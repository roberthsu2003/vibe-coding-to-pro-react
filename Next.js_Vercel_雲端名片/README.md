# 實戰：打造極簡個人社交名片

## 專案目標

將第 10 章學到的五項 Vercel 雲端原生功能，整合進**一個完整的 Next.js 16 應用程式**並部署到 Vercel：

| 功能 | 用途 |
|------|------|
| **Route Handlers** | 留言板的後端 API（GET / POST 留言） |
| **`<Image>` 優化** | 顯示大頭照（自動 WebP + 響應式） |
| **Vercel Blob** | 讓使用者上傳並儲存大頭照 |
| **Upstash Redis** | 計算名片被瀏覽幾次 |
| **Edge Runtime** | 快速回傳問候語（根據語言 Header） |

---

## 完成後的效果

```
┌─────────────────────────────────────┐
│           我的個人名片               │
│                                     │
│        [大頭照]                     │
│        王小明                       │
│        Full Stack Developer         │
│                                     │
│        已被瀏覽 142 次              │
│                                     │
│  [上傳新大頭照]                     │
│                                     │
│  留言板                             │
│  ─────────────────                  │
│  Alice: 你好！                      │
│  Bob: 網站很棒！                    │
│                                     │
│  [留言輸入框]  [送出]               │
└─────────────────────────────────────┘
```

---

## 前置需求

在開始本實戰之前，請確認你已完成：

- [ ] [範例 1](../10-Next.js-Vercel雲端原生/範例1-RouteHandlers與Serverless.md)：Route Handlers
- [ ] [範例 2](../10-Next.js-Vercel雲端原生/範例2-ImageOptimization.md)：Image Optimization
- [ ] [範例 3](../10-Next.js-Vercel雲端原生/範例3-EdgeRuntime.md)：Edge Runtime
- [ ] [範例 4](../10-Next.js-Vercel雲端原生/範例4-VercelBlob.md)：Vercel Blob（已建立 Blob Store）
- [ ] [範例 5](../10-Next.js-Vercel雲端原生/範例5-UpstashRedis計數與限流.md)：Upstash Redis（已建立 Redis）

---

## 步驟一：建立新的 Next.js 專案

```bash
npx create-next-app@latest my-card --typescript --tailwind --app --src-dir --no-import-alias
cd my-card
```

安裝所需套件：

```bash
npm install @vercel/blob @upstash/redis
```

---

## 步驟二：連結 Vercel 並設定儲存服務

```bash
# 連結到 Vercel 帳號（建立新專案）
vercel link

# 到 Vercel Dashboard → Storage，將你在範例 4、5 建立的
# Blob Store 和 Upstash Redis 連結到這個新專案
# (Storage → 選擇已建立的 Store → Connect to Project → 選擇 my-card)

# 拉取所有環境變數
vercel env pull .env.local
```

確認 `.env.local` 包含以下三個 Token：

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 步驟三：建立專案架構

```
src/
├── app/
│   ├── api/
│   │   ├── greeting/route.ts     ← Edge Runtime 問候語
│   │   ├── messages/route.ts     ← 留言板 GET / POST
│   │   ├── upload/route.ts       ← Blob 上傳
│   │   └── views/route.ts        ← Redis 瀏覽計數
│   ├── page.tsx                  ← 名片首頁（Server Component）
│   └── layout.tsx
├── components/
│   ├── Avatar.tsx                ← 大頭照元件（含上傳按鈕）
│   ├── MessageBoard.tsx          ← 留言板（Client Component）
│   └── ViewCounter.tsx           ← 顯示瀏覽次數
└── lib/
    └── redis.ts                  ← Redis 客戶端
```

---

## 步驟四：建立共用工具

**`src/lib/redis.ts`**

```typescript
import { Redis } from '@upstash/redis';
export const redis = Redis.fromEnv();
```

---

## 步驟五：建立 API Route Handlers

### `src/app/api/views/route.ts` — 瀏覽計數

```typescript
import { redis } from '@/lib/redis';

const KEY = 'card:views';

export async function GET() {
  const views = await redis.get<number>(KEY);
  return Response.json({ views: views ?? 0 });
}

export async function POST() {
  const views = await redis.incr(KEY);
  return Response.json({ views });
}
```

### `src/app/api/messages/route.ts` — 留言板

```typescript
import { redis } from '@/lib/redis';

const KEY = 'card:messages';

type Message = { id: string; name: string; text: string; createdAt: string };

export async function GET() {
  // lrange() 取得 List 中所有元素（從最新到最舊）
  const raw = await redis.lrange<string>(KEY, 0, -1);
  const messages: Message[] = raw.map((item) =>
    typeof item === 'string' ? JSON.parse(item) : item
  );
  return Response.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.text) {
    return Response.json({ error: '缺少 name 或 text' }, { status: 400 });
  }

  const message: Message = {
    id: crypto.randomUUID(),
    name: String(body.name).slice(0, 20),    // 限制名稱長度
    text: String(body.text).slice(0, 200),   // 限制留言長度
    createdAt: new Date().toISOString(),
  };

  // lpush() 將新留言加到 List 最前面（最新的顯示在最上方）
  await redis.lpush(KEY, JSON.stringify(message));

  // 只保留最新的 50 則留言
  await redis.ltrim(KEY, 0, 49);

  return Response.json(message, { status: 201 });
}
```

### `src/app/api/upload/route.ts` — 大頭照上傳

```typescript
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') ?? 'avatar.jpg';

  if (!request.body) {
    return Response.json({ error: '沒有檔案' }, { status: 400 });
  }

  const blob = await put(`avatars/${filename}`, request.body, {
    access: 'public',
  });

  // 將新的 avatar URL 儲存到 Redis，方便首頁讀取
  const { redis } = await import('@/lib/redis');
  await redis.set('card:avatar', blob.url);

  return Response.json({ url: blob.url });
}
```

### `src/app/api/greeting/route.ts` — Edge 問候語

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  const lang = request.headers.get('accept-language') ?? 'en';
  const country = request.headers.get('x-vercel-ip-country') ?? '';

  const greeting = lang.startsWith('zh') ? '你好' :
                   lang.startsWith('ja') ? 'こんにちは' : 'Hello';

  return Response.json({ greeting, country });
}
```

---

## 步驟六：建立 React 元件

### `src/components/ViewCounter.tsx` — 顯示瀏覽次數（Client Component）

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // 頁面載入後，呼叫 POST 讓計數 +1，並取得新的數字
    fetch('/api/views', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => setViews(data.views));
  }, []);

  if (views === null) return null;

  return (
    <p className="text-sm text-gray-500">
      已被瀏覽 <span className="font-bold text-blue-600">{views}</span> 次
    </p>
  );
}
```

### `src/components/Avatar.tsx` — 大頭照（含上傳）

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = { initialUrl: string | null };

export default function Avatar({ initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      setUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        {url ? (
          <Image
            src={url}
            alt="大頭照"
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
            👤
          </div>
        )}
      </div>
      <label className="cursor-pointer text-xs text-blue-600 hover:underline">
        {uploading ? '上傳中...' : '更換大頭照'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
```

### `src/components/MessageBoard.tsx` — 留言板（Client Component）

```typescript
'use client';

import { useState } from 'react';

type Message = { id: string; name: string; text: string; createdAt: string };

type Props = { initialMessages: Message[] };

export default function MessageBoard({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), text: text.trim() }),
      });
      const newMsg = await res.json();
      setMessages((prev) => [newMsg, ...prev]);
      setText('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">留言板</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的名字"
          className="border rounded px-2 py-1 w-24 text-sm"
          maxLength={20}
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="留言內容"
          className="border rounded px-2 py-1 flex-1 text-sm"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={submitting || !name.trim() || !text.trim()}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          送出
        </button>
      </form>

      <ul className="space-y-3">
        {messages.map((msg) => (
          <li key={msg.id} className="bg-gray-50 rounded p-3 text-sm">
            <span className="font-semibold">{msg.name}：</span>
            <span className="text-gray-700">{msg.text}</span>
            <time className="block text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleString('zh-TW')}
            </time>
          </li>
        ))}
        {messages.length === 0 && (
          <li className="text-gray-400 text-sm">還沒有留言，快來留下第一則！</li>
        )}
      </ul>
    </section>
  );
}
```

---

## 步驟七：組合名片首頁

**`src/app/page.tsx`** — Server Component，整合所有功能

```typescript
// src/app/page.tsx
import { redis } from '@/lib/redis';
import Avatar from '@/components/Avatar';
import ViewCounter from '@/components/ViewCounter';
import MessageBoard from '@/components/MessageBoard';

// 不快取（每次請求都取得最新資料）
export const revalidate = 0;

type Message = { id: string; name: string; text: string; createdAt: string };

export default async function CardPage() {
  // 在 Server Component 中直接讀取 Redis（不需要透過 fetch）
  const [avatarUrl, rawMessages] = await Promise.all([
    redis.get<string>('card:avatar'),
    redis.lrange<string>('card:messages', 0, 19),
  ]);

  const messages: Message[] = rawMessages.map((item) =>
    typeof item === 'string' ? JSON.parse(item) : item
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        {/* 大頭照（Client Component，支援上傳） */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Avatar initialUrl={avatarUrl} />
          <h1 className="text-2xl font-bold mt-2">王小明</h1>
          <p className="text-gray-500">Full Stack Developer</p>
          {/* 瀏覽計數（Client Component，頁面載入後 +1） */}
          <ViewCounter />
        </div>

        {/* 留言板（Client Component，初始資料由 Server 傳入） */}
        <MessageBoard initialMessages={messages} />
      </div>
    </main>
  );
}
```

### 架構重點：Server Component 傳初始資料給 Client Component

```
Server Component (page.tsx)
  │
  ├── 直接讀取 Redis（無需 fetch）
  ├── 取得 avatarUrl 和 messages
  │
  └── 傳入 Client Components
        ├── <Avatar initialUrl={avatarUrl} />
        └── <MessageBoard initialMessages={messages} />
                              ↑
                        Server 預先載入的資料作為初始值
                        用戶後續的操作在 Client 端更新
```

---

## 步驟八：更新 `next.config.ts`

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
```

---

## 步驟九：本機測試

```bash
npm run dev
```

前往 `http://localhost:3000`，依序測試：

1. **瀏覽計數**：重新整理頁面，確認數字增加
2. **大頭照上傳**：點擊「更換大頭照」，上傳圖片，確認顯示
3. **留言板**：填入名字和內容，點擊送出，確認留言出現
4. **留言持久化**：重新整理頁面後，留言依然存在（存在 Redis）

---

## 步驟十：部署到 Vercel

```bash
vercel --prod
```

部署完成後，前往 Vercel 給你的網址（例如 `https://my-card-xxx.vercel.app`），用手機掃 QR Code 分享給同學！

---

## 常見問題

**Q：重新整理後大頭照消失了？**  
A：確認 `vercel env pull` 已執行，`.env.local` 中有 `BLOB_READ_WRITE_TOKEN`。本機需要 Token 才能讀取。

**Q：留言板新增後沒有顯示？**  
A：確認 `.env.local` 中有 Upstash 的兩個環境變數。

**Q：上傳圖片後顯示 `Invalid src prop`？**  
A：確認 `next.config.ts` 的 `remotePatterns` 已加入 `*.public.blob.vercel-storage.com`。

---

[回到第 10 章主題](../10-Next.js-Vercel雲端原生/主題.md)
