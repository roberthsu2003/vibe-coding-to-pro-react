# 範例 2：Authentication (使用者驗證)

## 學習目標
- 在 Next.js 中實作註冊與登入功能。
- 了解 `@supabase/ssr` 的 Cookie-based 驗證機制。
- 透過 Middleware 保護路由。

---

## 步驟 1：建立登入 / 註冊頁面

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

## 步驟 2：實作 Server Actions 進行驗證

建立 `src/app/login/actions.ts` 處理表單送出事件：

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

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
  const supabase = createClient()

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

## 步驟 3：建立被保護的 Dashboard 頁面

我們建立一個只允許已登入使用者看到的 `/dashboard` 頁面，並提供登出功能。

建立 `src/app/dashboard/page.tsx`：

```tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()

  // 取得目前使用者
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function signOut() {
    'use server'
    const supabase = createClient()
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

*(提示：在正式開發中，我們通常還會設定 `middleware.ts` 來統一攔截未登入的使用者，避免每個頁面都要手動檢查。)*
