# 範例 3：Database 與 RLS (資料庫與權限控制)

## 學習目標
- 在 Supabase 後台建立 PostgreSQL 資料表。
- 了解並設定 Row Level Security (RLS) 保護資料。
- 實作前後端的資料 CRUD 操作。

---

## 步驟 1：建立 `todos` 資料表與開啟 RLS

1. 進入 Supabase 後台，點擊左側選單的 **SQL Editor**。
2. 貼上並執行以下 SQL 指令：

```sql
-- 建立資料表
create table public.todos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  is_complete boolean default false,
  user_id uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 開啟 Row Level Security
alter table public.todos enable row level security;

-- 建立 RLS 規則：使用者只能查看自己的代辦事項
create policy "Users can view their own todos."
  on todos for select
  using ( auth.uid() = user_id );

-- 建立 RLS 規則：使用者只能新增自己的代辦事項
create policy "Users can insert their own todos."
  on todos for insert
  with check ( auth.uid() = user_id );

-- 建立 RLS 規則：使用者只能更新自己的代辦事項
create policy "Users can update their own todos."
  on todos for update
  using ( auth.uid() = user_id );

-- 建立 RLS 規則：使用者只能刪除自己的代辦事項
create policy "Users can delete their own todos."
  on todos for delete
  using ( auth.uid() = user_id );
```

這個 SQL 腳本建立了表格，並設定了 4 條 RLS 原則，確保只有資料擁有者 (user_id = auth.uid) 可以對自己的資料進行操作。

---

## 步驟 2：在前端讀取與新增代辦事項

修改 `src/app/dashboard/page.tsx`，在保留範例 2 的登出功能基礎上，加入代辦清單功能：

```tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 讀取資料庫：RLS 已確保只回傳目前登入使用者的資料，不需再加 .eq() 過濾
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  // Server Action: 登出
  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  // Server Action: 新增代辦事項
  async function addTodo(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const supabase = await createClient()
    await supabase.from('todos').insert({ title })
    revalidatePath('/dashboard')
  }

  // Server Action: 刪除代辦事項
  async function deleteTodo(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabase = await createClient()
    await supabase.from('todos').delete().eq('id', id)
    revalidatePath('/dashboard')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* 頁首：標題、Email、登出按鈕 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">你的代辦事項</h1>
          <p className="text-gray-500 mt-1">登入 Email：{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="bg-red-500 text-white px-4 py-2 rounded">登出</button>
        </form>
      </div>

      {/* 新增表單 */}
      <form action={addTodo} className="flex gap-2 mb-8">
        <input name="title" required placeholder="新增任務..." className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">新增</button>
      </form>

      {/* 列表渲染 */}
      <ul className="space-y-4">
        {todos?.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center p-4 border rounded bg-white shadow-sm">
            <span>{todo.title}</span>
            <form action={deleteTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" className="text-red-500">刪除</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

由於 RLS 的保護，這段程式碼只會讀出目前登入使用者的 Todo，也無法刪除別人的資料。

---

[下一章：範例 4 - Storage (雲端檔案儲存)](./範例4-Storage.md)
