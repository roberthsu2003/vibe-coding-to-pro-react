# 範例 4：Vercel Blob — 雲端檔案儲存

## 目標

學會使用 **Vercel Blob** 讓使用者上傳檔案（例如大頭照）到雲端，並取得可公開存取的 URL。

完成本範例後，你將能夠：
1. 設定 Vercel Blob 並取得存取 Token
2. 建立一個接受檔案上傳的 Route Handler
3. 在前端頁面建立上傳表單
4. 用 `<Image>` 顯示上傳後的圖片

---

## 背景知識：為什麼 Serverless 不能直接存檔案？

在 Serverless 環境中，你**無法**把上傳的檔案存在伺服器的磁碟上：

```
用戶上傳圖片 → Serverless Function 執行 → 執行完畢，函式關閉
                                                   ↑
                                            所有記憶體中的資料消失！
                                            磁碟寫入也不被允許
```

你需要一個**獨立的雲端儲存空間**，把檔案存放在那裡：

```
用戶上傳圖片 → Route Handler → 轉存到 Vercel Blob → 回傳公開 URL → 前端顯示
```

**Vercel Blob** 就是這個雲端大抽屜。它提供：
- 上傳檔案並取得永久 URL（`https://xxx.public.blob.vercel-storage.com/filename`）
- 支援公開（Public）或私有（Private）存取
- 整合 Vercel CLI，`vercel env pull` 即可取得 Token

---

## 步驟 0：連結 Vercel 專案並取得 Blob Token

Vercel Blob 需要你的專案連結到 Vercel 帳號。

### 0-1. 將專案連結到 Vercel

在 `cloud-features/` 專案根目錄執行：

```bash
vercel link
```

按照提示回答：
```text
? Link to existing project? → N（建立新專案）
? What's your project's name? → cloud-features（或你喜歡的名稱）
```

### 0-2. 在 Vercel Dashboard 啟用 Blob Store

1. 前往 [vercel.com](https://vercel.com) → 登入 → 選擇你的 `cloud-features` 專案
2. 點選上方 **Storage** 分頁
3. 點選 **Create Database** → 選擇 **Blob**
4. 取一個名稱（例如 `my-blob-store`）→ 點選 **Create**

> **💡 費用說明**  
> Vercel Blob 在 Hobby 方案（免費）下有 1GB 的免費容量，學習練習完全足夠。

### 0-3. 將 Token 拉到本機

```bash
vercel env pull .env.local
```

這個指令會從 Vercel 下載環境變數，包含 Blob 的 Token：

```bash
# .env.local（自動生成，不要手動修改）
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxx
```

確認 `.env.local` 已被 `.gitignore` 保護（通常 Next.js 預設已設定）：

```bash
cat .gitignore | grep .env
# 應該看到 .env*.local 或類似內容
```

---

## 步驟 1：安裝 `@vercel/blob`

```bash
npm install @vercel/blob
```

---

## 步驟 2：建立上傳 Route Handler

建立 `src/app/api/upload/route.ts`：

```bash
mkdir -p src/app/api/upload
```

```typescript
// src/app/api/upload/route.ts
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  // 從 URL query 取得檔案名稱（由前端傳入）
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return Response.json({ error: '缺少 filename 參數' }, { status: 400 });
  }

  // request.body 就是原始的檔案資料流（binary stream）
  if (!request.body) {
    return Response.json({ error: '沒有上傳檔案' }, { status: 400 });
  }

  // put() 把檔案上傳到 Vercel Blob
  const blob = await put(filename, request.body, {
    access: 'public',   // 'public' 讓任何人都能用 URL 存取；'private' 需要 Token 才能讀取
  });

  // blob 物件包含上傳後的資訊
  return Response.json({
    url: blob.url,            // 公開存取 URL
    pathname: blob.pathname,  // Blob 中的路徑
    size: blob.size,          // 檔案大小（bytes）
  });
}
```

### 程式碼說明

| 重點 | 說明 |
|------|------|
| `put(filename, stream, options)` | 上傳檔案。filename 是 Blob 中的名稱（含副檔名），stream 是資料流 |
| `access: 'public'` | 公開存取；改成 `'private'` 則需要 Token 才能讀取 |
| `request.body` | Web 標準的 ReadableStream，直接傳給 `put()` 即可 |

---

## 步驟 3：建立前端上傳頁面

建立 `src/app/upload/page.tsx`：

```bash
mkdir -p src/app/upload
```

```typescript
// src/app/upload/page.tsx
'use client';  // 這個頁面有互動（表單、狀態），需要 Client Component

import { useState } from 'react';
import Image from 'next/image';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('請選擇一個檔案');
      return;
    }

    // 只允許圖片檔案
    if (!file.type.startsWith('image/')) {
      setError('只接受圖片檔案（jpg, png, webp 等）');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 把檔案直接用 fetch 傳送到 Route Handler
      // 不使用 FormData，而是把 file 作為 body 直接傳（更簡單、更快）
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,  // 直接傳 File 物件
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? '上傳失敗');
      }

      const data = await response.json();
      setUploadedUrl(data.url);  // 儲存上傳後的公開 URL
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳時發生未知錯誤');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">上傳大頭照</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm border rounded p-2"
        />
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? '上傳中...' : '上傳圖片'}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}

      {uploadedUrl && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">✅ 上傳成功！</p>

          {/* 用 Image 元件顯示上傳的圖片（自動優化） */}
          <div className="relative w-32 h-32">
            <Image
              src={uploadedUrl}
              alt="上傳的大頭照"
              fill
              className="object-cover rounded-full"
            />
          </div>

          {/* 顯示公開 URL，讓學生複製 */}
          <p className="mt-2 text-xs text-gray-500 break-all">
            URL：{uploadedUrl}
          </p>
        </div>
      )}
    </main>
  );
}
```

---

## 步驟 4：更新 `next.config.ts` 允許 Blob 圖片

在範例 2 中，我們已經加入了 Vercel Blob 的 `remotePatterns`，確認 `next.config.ts` 包含：

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
      // ... 其他設定
    ],
  },
};

export default nextConfig;
```

---

## 步驟 5：測試完整上傳流程

1. 確認 `.env.local` 中有 `BLOB_READ_WRITE_TOKEN`
2. 啟動開發伺服器：`npm run dev`
3. 前往 `http://localhost:3000/upload`
4. 選擇一張圖片，點擊「上傳圖片」
5. 確認出現成功訊息和圖片預覽
6. 複製 URL，在新分頁開啟——應該可以直接存取這張圖片

> **🎉 上傳後的 URL（`https://xxxx.public.blob.vercel-storage.com/...`）是永久有效的，**  
> 即使你重啟伺服器或重新部署，圖片依然存在。  
> 這就是 Blob 儲存解決 Serverless 無法存檔案問題的方式。

---

## 延伸：列出已上傳的所有檔案

Vercel Blob 也提供列出已上傳檔案的 API：

```typescript
// src/app/api/files/route.ts
import { list } from '@vercel/blob';

export async function GET() {
  const { blobs } = await list();

  return Response.json({
    files: blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    })),
  });
}
```

訪問 `http://localhost:3000/api/files` 可以看到所有已上傳的檔案清單。

---

## ✅ 本步驟完成確認

- [ ] 已執行 `vercel link` 連結專案
- [ ] 已在 Vercel Dashboard 建立 Blob Store
- [ ] 已執行 `vercel env pull .env.local` 取得 `BLOB_READ_WRITE_TOKEN`
- [ ] 安裝 `@vercel/blob` 完成
- [ ] 建立了 `/api/upload` Route Handler
- [ ] 建立了 `/upload` 頁面，可選擇圖片並上傳
- [ ] 上傳成功後能看到圖片預覽和公開 URL
- [ ] 在新分頁直接開啟該 URL，圖片可正常顯示

---

[上一範例：範例 3 - Edge Runtime](範例3-EdgeRuntime.md) | [下一範例：範例 5 - Upstash Redis 計數與 Rate Limiting](範例5-UpstashRedis計數與限流.md)
