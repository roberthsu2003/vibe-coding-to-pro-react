# 範例 4：Storage (雲端檔案儲存)

## 學習目標
- 在 Supabase 建立 Storage Bucket。
- 設定 Storage 的存取權限 (Policies)。
- 實作前端檔案上傳，並將檔案 URL 儲存至資料庫。

---

## 步驟 1：建立 Storage Bucket

1. 進入 Supabase 後台，點擊左側選單的 **Storage**。
2. 點擊 **"New Bucket"**，命名為 `avatars`，並將其設為 **Public**（允許任何人讀取檔案）。
3. 切換到該 Bucket 的 **Policies** 頁籤，點擊 "New Policy"。
4. 新增一條規則：允許 Authenticated users (已登入使用者) 進行 **INSERT** (上傳檔案)。

---

## 步驟 2：實作 Client Component 進行檔案上傳

由於檔案上傳通常需要直接與瀏覽器的 `<input type="file">` 互動，我們建立一個 Client Component 處理上傳邏輯。

建立 `src/components/AvatarUpload.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AvatarUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const supabase = createClient()

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setUploadedUrl(data.publicUrl)
      alert('上傳成功！')

    } catch (error) {
      alert('Error uploading avatar!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-4">
      <label className="block mb-2 font-bold" htmlFor="single">
        {uploading ? '上傳中 ...' : '上傳頭像'}
      </label>
      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {uploadedUrl && (
        <img src={uploadedUrl} alt="avatar" className="mt-4 w-24 h-24 rounded-full object-cover" />
      )}
    </div>
  )
}
```

> **注意**：這個元件只接受 `userId: string`，沒有 `onUploadSuccess` 這類 function prop。
> 原因：`dashboard/page.tsx` 是 **Server Component**，傳給 Client Component 的 props 必須可序列化（string、number、boolean 等），**普通 function 無法序列化**，傳入會導致 Next.js 拋出錯誤。
> 因此，上傳後的 URL 改由元件內部的 `uploadedUrl` state 自行管理，直接在元件內顯示上傳後的頭像圖片。

---

## 步驟 3：在頁面中使用元件進行測試

`AvatarUpload` 是一個 Client Component，需要嵌入到某個頁面才能實際操作。由於範例 3 已修改過 `src/app/dashboard/page.tsx`，這裡**不要覆蓋整個檔案**，只需在原有基礎上做兩處修改：

**修改 1**：在檔案頂部加入 import：

```tsx
import AvatarUpload from '@/components/AvatarUpload'
```

**修改 2**：在 `return` 的 JSX 裡，找到頁首區塊下方（新增表單的上方），插入元件：

```tsx
{/* 頭像上傳 */}
<div className="mb-8">
  <AvatarUpload userId={user.id} />
</div>

{/* 新增表單 */}
<form action={addTodo} className="flex gap-2 mb-8">
```

修改後 `src/app/dashboard/page.tsx` 的完整結果：

```tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import AvatarUpload from '@/components/AvatarUpload'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  async function addTodo(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const supabase = await createClient()
    await supabase.from('todos').insert({ title })
    revalidatePath('/dashboard')
  }

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

      {/* 頭像上傳 */}
      <div className="mb-8">
        <AvatarUpload userId={user.id} />
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

### 測試步驟

1. 啟動開發伺服器：`npm run dev`
2. 瀏覽器前往 `http://localhost:3000/login`，用已建立的帳號登入
3. 登入後會導向 `/dashboard`，頁面下方應出現「上傳頭像」的檔案選擇器
4. 選取一張圖片後，元件會自動上傳
5. 上傳成功後出現 `alert('上傳成功！')`，頁面上會即時顯示剛上傳的頭像圖片
6. 前往 Supabase 後台 → **Storage → avatars**，確認檔案確實存在

---

[下一章：範例 5 - Realtime (即時資料同步)](./範例5-Realtime.md)
