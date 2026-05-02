# 範例 2：Authentication (使用者驗證)

## 學習目標
- 在 Next.js 中實作註冊與登入功能。
- 了解 `@supabase/ssr` 的 Cookie-based 驗證機制。
- 在 Server Component 中保護受限路由。

---

## 前置作業：Supabase Dashboard 設定

在撰寫任何程式碼之前，需先在 Supabase 後台完成以下設定。

### 1. 啟用 Email 驗證

1. 在 Supabase 後台左側選單，點擊 **Authentication**。
2. 進入 **Providers** 分頁。
3. 找到 **Email**，確認它已是 **Enabled**（預設為啟用）。
4. 你可以選擇是否開啟 **Confirm email**（Email 驗證信）：
   - **開啟**：使用者註冊後需點擊驗證信才能登入（正式環境建議）。
   - **關閉**：註冊後直接登入（開發測試時較方便）。

> **開發建議**：初期練習時可先**關閉** Confirm email，避免每次測試都要收信，待功能完成後再開啟。

---

### 2. 設定 Site URL 與重新導向網址

Supabase 在寄送驗證信或進行 OAuth 登入後，需要知道要把使用者導向哪個網址。若設定錯誤，驗證流程會失敗。

1. 在左側選單，進入 **Authentication > URL Configuration**。
2. 設定 **Site URL**（你的應用程式主網址）：
   - 本機開發：填入 `http://localhost:3000`
   - 部署後：填入你的正式網域（例如 `https://your-app.vercel.app`）
3. 在 **Redirect URLs** 欄位中，新增允許的回調網址：
   ```
   http://localhost:3000/**
   ```
   > 加上 `/**` 萬用字元，允許任何 `/` 後的路徑（例如 `/auth/callback`）。
4. 點擊 **Save** 儲存。

---

## 步驟 1：實作 Server Actions 進行驗證

建立 `src/app/login/actions.ts` 處理表單送出事件：

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signupData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // 若 Supabase 設定了「需要 Email 驗證」，signUp 成功後不會立即建立 session
  if (!signupData.session) {
    redirect(
      `/login?message=${encodeURIComponent('註冊成功，請先到信箱完成驗證後再登入。')}`
    )
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```

> **說明**：
> - 錯誤訊息改用 `encodeURIComponent(error.message)` 傳遞，讓使用者看到 Supabase 回傳的實際錯誤原因（例如密碼太短、Email 已被使用等），而非固定的通用訊息。
> - `signup` 額外判斷 `!signupData.session`：當 Supabase 後台開啟了「Confirm email」時，使用者完成註冊後不會立即取得 session，這時應提示使用者去收信驗證，而非直接跳轉 `/dashboard`。

---

## 步驟 2：建立登入 / 註冊頁面

我們將在同一個頁面建立登入表單，並顯示來自 Server Actions 的訊息（例如錯誤原因或驗證提示）。

建立 `src/app/login/page.tsx`：

```tsx
import { login, signup } from './actions'

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const message = Array.isArray(params?.message)
    ? params.message[0]
    : params?.message

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">登入 / 註冊</h2>

        {message ? (
          <p className="rounded border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
            {message}
          </p>
        ) : null}

        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required className="border p-2 rounded" />

        <label htmlFor="password">密碼:</label>
        <input id="password" name="password" type="password" required className="border p-2 rounded" />

        <div className="flex gap-4 mt-4">
          <button formAction={login} className="bg-blue-500 text-white px-4 py-2 rounded flex-1">登入</button>
          <button formAction={signup} className="bg-green-500 text-white px-4 py-2 rounded flex-1">註冊</button>
        </div>
      </form>
    </div>
  )
}
```

> **說明**：
> - Next.js 16 (App Router) 的 `searchParams` prop 型別為 `Promise<...>`，必須 `await` 才能取得值，因此頁面元件需宣告為 `async`。
> - 當 `actions.ts` 的 `redirect('/login?message=...')` 被呼叫時，`message` 會出現在 URL 查詢字串中。頁面在這裡讀取並顯示它，讓使用者知道發生了什麼事。

---

## 步驟 3：建立被保護的 Dashboard 頁面

我們建立一個只允許已登入使用者看到的 `/dashboard` 頁面，並提供登出功能。

建立 `src/app/dashboard/page.tsx`：

```tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 取得目前使用者
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">歡迎回來！</h1>
      <p className="mt-4">你的登入 Email: {user.email}</p>
      
      <form action={signOut} className="mt-8">
        <button className="bg-red-500 text-white px-4 py-2 rounded">登出</button>
      </form>
    </div>
  )
}
```


[下一章：範例 3 - Database 與 RLS (資料庫與權限控制)](./範例3-Database與RLS.md)
