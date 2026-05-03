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

import { useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AvatarUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false)
  const selectedFileRef = useRef<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    setErrorMessage(null)
    setUploadedUrl(null)
    selectedFileRef.current = file
    setSelectedFileName(file?.name ?? null)
    setPreviewUrl(null)

    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.onerror = () => {
      setErrorMessage('圖片預覽讀取失敗，但仍可以嘗試上傳。')
    }
    reader.readAsDataURL(file)
  }

  async function uploadAvatar() {
    try {
      setUploading(true)
      setErrorMessage(null)
      setUploadedUrl(null)

      const selectedFile = selectedFileRef.current
      if (!selectedFile) throw new Error('you must select an image to upload.')

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('請先登入後再上傳頭像。')

      const fileExt = selectedFile.name.split('.').pop()
      const filePath = `${userId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setUploadedUrl(data.publicUrl)
      selectedFileRef.current = null
      setSelectedFileName(null)
      setPreviewUrl(null)
      alert('上傳成功!')

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error uploading avatar!'
      setErrorMessage(message)
      alert(message)
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
        onChange={handleFileChange}
        onInput={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      <p className="mt-2 text-sm text-gray-500">
        目前狀態：{selectedFileName ? `已選擇 ${selectedFileName}` : '尚未選擇圖片'}
      </p>
      <div className="mt-4">
        {previewUrl ? (
          <div
            role="img"
            aria-label="頭像預覽"
            className="h-32 w-32 rounded-full border bg-cover bg-center"
            style={{ backgroundImage: `url(${previewUrl})` }}
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full border bg-gray-100 text-sm text-gray-500">
            尚無預覽
          </div>
        )}
        {selectedFileName ? (
          <p className="mt-2 text-sm text-gray-600">已選擇：{selectedFileName}</p>
        ) : null}
        <button
          type="button"
          onClick={uploadAvatar}
          disabled={uploading || !selectedFileName}
          className="mt-3 rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {uploading ? '上傳中 ...' : '確認上傳'}
        </button>
      </div>
      {uploadedUrl ? (
        <p className="mt-2 text-sm text-green-600">頭像已上傳成功</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  )
}
```

> **設計說明**：
> - **選檔與上傳分離**：`handleFileChange` 只處理預覽，使用者確認後才點「確認上傳」按鈕觸發 `uploadAvatar`，避免誤選就送出。
> - **`useRef` 保存檔案**：用 `useRef` 而非 `useState` 保存 `File` 物件，因為上傳時不需要觸發重新渲染，只需在點擊按鈕時讀取即可。
> - **`FileReader` 即時預覽**：選檔後用 `FileReader.readAsDataURL()` 讀取圖片，產生 base64 預覽 URL，讓使用者確認圖片後再上傳。
> - **不使用 `onUploadSuccess` function prop**：`dashboard/page.tsx` 是 Server Component，傳給 Client Component 的 props 必須可序列化（string、number 等），**普通 function 無法序列化**，會導致 Next.js 拋出錯誤。上傳結果改由元件內部 state 管理。

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
3. 登入後會導向 `/dashboard`，頁面上方應出現「上傳頭像」的檔案選擇器
4. 選取一張圖片後，圓形預覽區域會顯示選取的圖片，並顯示「已選擇：檔名」
5. 點擊「**確認上傳**」按鈕送出（按鈕在未選檔時為灰色不可點擊）
6. 上傳成功後出現 `alert('上傳成功!')`，元件下方顯示「頭像已上傳成功」綠色文字
7. 前往 Supabase 後台 → **Storage → avatars**，確認檔案確實存在

---

[下一章：範例 5 - Realtime (即時資料同步)](./範例5-Realtime.md)
