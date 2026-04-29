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

## 步驟 1：建立 Supabase 專案與資料表

1. **登入 Supabase**：前往 [supabase.com](https://supabase.com) 並登入或註冊。
2. **建立專案 (New Project)**：
   - 選擇你的 Organization（如果沒有就建立一個）。
   - 取名（例如 `nextjs-demo`）。
   - 設定 Database Password（**請記住這組密碼**，雖然本範例用不到，但未來直連資料庫時會需要）。
   - Region 選擇靠近你的地區（例如 `Tokyo`）。
   - 點選 **Create new project**（建立過程約需 1-2 分鐘）。
3. **建立資料表 (Table Editor)**：
   - 在左側選單點選 **Table Editor**，點選 **Create a new table**。
   - Name 輸入 `messages`。
   - 勾選 **Enable Row Level Security (RLS)**。
   - 預設會有 `id` (uuid) 和 `created_at` (timestamp)。
   - 點選 **Add column**，新增一個欄位：Name 為 `content`，Type 為 `text`。
   - 點選 **Save**。
4. **新增假資料**：
   - 在剛建立的 `messages` 資料表中，點選 **Insert row**。
   - 在 `content` 欄位輸入「Hello Supabase!」，點選 **Save**。

---

## 步驟 2：設定 RLS (Row Level Security)

因為我們勾選了 RLS，預設情況下「沒有任何人可以讀取或寫入資料」。為了教學方便，我們先開放「所有人都可以讀取」。

1. 點選左側選單的 **Authentication** -> **Policies**。
2. 在 `messages` 資料表旁點選 **New Policy**。
3. 選擇 **Get started quickly** -> **Enable read access for everyone**。
4. 點選 **Save policy**。

---

## 步驟 3：在 Next.js 取得 API Keys 並安裝套件

1. **取得 Keys**：
   - 在 Supabase 專案左側底部的 **Project Settings** (齒輪圖示) -> **API**。
   - 找到 `Project URL` 和 `Project API Keys` 中的 `anon` `public` key。
2. **設定環境變數**：
   - 在你的 Next.js 專案根目錄建立或開啟 `.env.local`。
   - 加入以下內容（替換成你自己的 URL 和 Key）：
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
     ```
3. **安裝 Supabase JS 客戶端**：
   在終端機執行：
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
