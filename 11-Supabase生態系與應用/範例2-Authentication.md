# 範例 2：Authentication (使用者驗證)

## 學習目標
- 在 Next.js 中實作註冊與登入功能。
- 了解 `@supabase/ssr` 的 Cookie-based 驗證機制。
- 透過 Middleware 保護路由。

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
    redirect('/login?message=Could not authenticate user')
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

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```

---

## 步驟 2：建立登入 / 註冊頁面

我們將在同一個頁面建立登入表單。

建立 `src/app/login/page.tsx`：

```tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">登入 / 註冊</h2>
        
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

---

## 步驟 4：設定 Middleware 保護路由

每個頁面手動呼叫 `supabase.auth.getUser()` 並判斷跳轉，既繁瑣又容易遺漏。Next.js 的 `middleware.ts` 可以在請求抵達頁面**之前**統一攔截，自動將未登入的使用者導向登入頁。

在專案根目錄（與 `src/` 同層）建立 `middleware.ts`：

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 重新整理 Session（讓 Cookie 保持最新）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 若使用者未登入，且目標路徑以 /dashboard 開頭，則導向 /login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// 設定 Middleware 要攔截哪些路徑
// 這裡排除靜態檔案與 Next.js 內部路徑，僅攔截一般頁面請求
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

設定好後，即使直接在網址列輸入 `/dashboard`，也會被自動導向 `/login`，無需在每個受保護的頁面重複寫判斷邏輯。

> **注意**：`middleware.ts` 必須放在**專案根目錄**（App Router 架構下，即與 `src/` 資料夾同層），而不是 `src/` 裡面，否則 Next.js 不會自動載入它。

---

[下一章：範例 3 - Database 與 RLS (資料庫與權限控制)](./範例3-Database與RLS.md)
