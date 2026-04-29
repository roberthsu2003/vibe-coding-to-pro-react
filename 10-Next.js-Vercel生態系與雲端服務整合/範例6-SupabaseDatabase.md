# 範例 6：Supabase Database — 關聯式資料庫整合

## 目標

學會使用 **Supabase Database**（基於 PostgreSQL 的強大開源 Firebase 替代品）：
1. **建立 Supabase 專案與資料表**：在雲端建立 PostgreSQL 資料庫。
2. **在 Next.js 中連線**：使用 Server Component 安全地讀取資料。
3. **體驗 RLS (Row Level Security)**：了解 Supabase 基本的安全機制。

---

## 背景知識：為什麼選擇 Supabase？

在 Next.js 生態系中，雖然有很多資料庫選擇（如 Vercel Postgres, PlanetScale），但 **Supabase** 因為以下特點非常受歡迎：
- **PostgreSQL 核心**：支援強大的關聯式資料查詢。
- **內建 API**：不用自己寫後端 API，Supabase 自動為你的資料表產生 REST API 與 GraphQL。
- **一站式服務**：包含 Database, Auth, Storage, Edge Functions，非常適合全端開發。

---

## 步驟 1：透過 Vercel 建立 Supabase 專案與資料表

身為 Vercel 的深度整合夥伴，我們**不需要**手動去 Supabase 註冊和複製密鑰，一切都可以在 Vercel 介面內完成！

1. **進入 Vercel 專案**：打開 [vercel.com](https://vercel.com) 並進入你的專案。
2. **透過 Marketplace 安裝 Supabase**：
   - 點選頂部選單的 **Storage**，點選 **Create Database**。
   - 選擇 **Browse Marketplace**，找到 **Supabase** 並點選 **Add Integration**。
   - 授權綁定你的 Vercel 帳號與當前專案。
3. **在 Vercel 內建立 Supabase 專案**：
   - 在整合畫面上，選擇 **Create a new project**。
   - 取名（例如 `nextjs-demo`），設定密碼（**請務必記住這組密碼**），Region 選擇靠近你的地區（例如 `Tokyo`）。
   - 點選建立。Vercel 會自動幫你把 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 等環境變數寫入專案中！
4. **拉取環境變數到本機**：
   - 回到本機終端機執行：
     ```bash
     vercel env pull .env.local
     ```
5. **前往 Supabase Studio 建立資料表**：
   - 從 Vercel 的 Storage 頁面點擊你的 Supabase 資料庫，會自動跳轉進入 **Supabase Studio (管理後台)**。
   - 點選左側的 **Table Editor** -> **Create a new table**。
   - Name 輸入 `messages`，勾選 **Enable Row Level Security (RLS)**。
   - 新增一個欄位：Name 為 `content`，Type 為 `text`，點選 **Save**。
   - 點選 **Insert row** 新增一筆假資料（例如 "Hello Supabase via Vercel!"）。

---

## 步驟 2：設定 RLS (Row Level Security)

因為我們勾選了 RLS，預設情況下「沒有任何人可以讀取或寫入資料」。為了教學方便，我們先開放「所有人都可以讀取」。

1. 點選左側選單的 **Authentication** -> **Policies**。
2. 在 `messages` 資料表旁點選 **New Policy**。
3. 選擇 **Get started quickly** -> **Enable read access for everyone**。
4. 點選 **Save policy**。

---

## 步驟 3：安裝 Supabase 客戶端套件

因為在步驟 1 我們已經透過 `vercel env pull` 自動把 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 下載到 `.env.local` 中，所以我們不需要再手動去複製密鑰。

現在只需要安裝 Supabase 的官方套件即可：

```bash
npm install @supabase/supabase-js
```

---

## 步驟 4：建立 Supabase 連線工具 (`src/lib/supabase.ts`)

在 `src/lib/` 資料夾下建立 `supabase.ts`：

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 建立並匯出 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 步驟 5：在 Server Component 讀取資料

建立 `src/app/messages/page.tsx`：

```typescript
// src/app/messages/page.tsx
import { supabase } from '@/lib/supabase'

// 強制重新抓取，不快取
export const revalidate = 0

export default async function MessagesPage() {
  // 1. 從 Supabase 的 messages 資料表讀取資料
  // select('*') 代表選取所有欄位，order 依照建立時間遞減排序
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-500 p-4">讀取失敗：{error.message}</div>
  }

  // 2. 渲染 UI
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">留言板 (Supabase Database)</h1>
        
        {messages?.length === 0 ? (
          <p className="text-gray-500">目前沒有任何留言。</p>
        ) : (
          <ul className="space-y-4">
            {messages?.map((msg) => (
              <li key={msg.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
```

---

## 如何測試是否成功？

1. **啟動開發伺服器**：`npm run dev`
2. **打開頁面**：前往 `http://localhost:3000/messages`。
3. **驗證結果**：你應該會看到畫面上顯示你在 Supabase 後台新增的那筆「Hello Supabase!」資料。
4. **即時測試**：回到 Supabase 後台的 Table Editor，再新增一筆資料，然後重新整理你的本地網頁，新資料應該會立刻出現！

---

## ✅ 本步驟完成確認

- [ ] 已在 Supabase 建立專案與 `messages` 資料表。
- [ ] 已開啟 RLS 並設定允許所有人讀取的 Policy。
- [ ] 已將 `URL` 與 `ANON_KEY` 加入 `.env.local`。
- [ ] 頁面 `/messages` 能夠成功顯示資料庫中的資料。

---

[上一範例：範例 5 - Upstash Redis](範例5-UpstashRedis計數與限流.md) | [下一步：範例 7 - Supabase Storage](範例7-SupabaseStorage.md)
