# 範例 1：Supabase 專案建立與連線

## 學習目標
- 註冊並建立 Supabase 專案。
- 取得 Supabase URL 與 Anon Key。
- 在 Next.js 專案中設定環境變數。
- 建立並測試與 Supabase 的初步連線。

---

## 步驟 1：建立 Supabase 專案

1. 前往 [Supabase 官網](https://supabase.com/) 註冊並登入帳號。
2. 點擊 **"New Project"**。
3. 選擇一個 Organization（若無則建立一個）。
4. 填寫專案名稱（例如 `supabase-fullstack-app`）、設定資料庫密碼（請牢記），並選擇離你最近的伺服器區域（例如 `Tokyo` 或 `Singapore`）。
5. 點擊 **"Create new project"**。專案初始化需要幾分鐘時間，請耐心等待。

---

## 步驟 2：取得 API 金鑰

1. 專案建立完成後，在左側選單進入 **Settings > API**。
2. 找到 **Project URL**，複製網址。
3. 找到 **Project API keys** 中的 **`anon` `public`** 金鑰，並將其複製。
   > **注意**：`anon` 金鑰適合放在前端環境變數中，但必須配合後續的 RLS (Row Level Security) 來保護資料庫；請勿將 `service_role` 金鑰洩漏到前端。

---

## 步驟 3：設定 Next.js 環境變數

在你的 `supabase-fullstack-app` 專案根目錄下，建立一個 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_ANON_KEY
```
*(請將等號後方替換為步驟 2 中複製的內容)*

---

## 步驟 4：建立 Supabase Client 工具函式

由於我們使用 App Router，需要在 Server Component 與 Client Component 分別初始化 Supabase Client。

建立 `src/utils/supabase/server.ts`：

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

建立 `src/utils/supabase/client.ts`：

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 步驟 5：測試連線

我們可以在 `src/app/page.tsx` 中匯入並測試連線是否成功。

```tsx
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  
  // 目前還沒有建立資料表，但如果能成功呼叫，代表環境變數無誤
  // 這裡只印出 supabase 物件確認是否初始化成功
  console.log("Supabase Client initialized on server.")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Supabase + Next.js 專案啟動成功！</h1>
      <p>請前往下一個範例實作 Authentication。</p>
    </main>
  )
}
```

執行 `npm run dev`，開啟 http://localhost:3000 ，如果沒有報錯，就可以進入下一個範例！

---

[下一章：範例 2 - Authentication (使用者驗證)](./範例2-Authentication.md)
