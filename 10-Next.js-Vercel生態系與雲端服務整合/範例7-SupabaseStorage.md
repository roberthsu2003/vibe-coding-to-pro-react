# 範例 7：Supabase Storage — 雲端檔案儲存

## 目標

學會使用 **Supabase Storage**（類似 Vercel Blob 或 AWS S3 的雲端儲存空間）：
1. **建立 Storage Bucket**：在 Supabase 後台建立儲存桶。
2. **在 Next.js 實作上傳**：使用 Server Actions (或 API Route) 上傳檔案。
3. **取得公開網址**：上傳成功後取得圖片的 Public URL 並顯示。

---

## 背景知識：Supabase Storage vs Vercel Blob

在前面的「範例 4」中我們學過 Vercel Blob。兩者都可以用來儲存使用者的圖片或檔案。
- **Vercel Blob**：設定超簡單（免設定 Bucket），完全整合 Vercel 生態系，適合輕量級應用。
- **Supabase Storage**：適合「本身就已經使用 Supabase Database」的專案。它與資料庫（PostgreSQL）深度整合，你可以利用 RLS (Row Level Security) 來控制「誰可以下載這張圖片」，適合更複雜的權限控管。

---

## 步驟 1：建立 Supabase Storage Bucket

因為我們在範例 6 已經透過 Vercel 建立了 Supabase 專案，現在可以直接從 Vercel 進入它的管理後台：

1. 在 Vercel 專案的 **Storage** 頁面，點擊你的 Supabase 資料庫，會自動進入 **Supabase Studio**。
2. 點選左側選單的 **Storage**。
3. 點選 **New Bucket**。
4. Name 輸入 `avatars`。
5. **重要：** 勾選 **Public bucket**（這代表上傳到這個 Bucket 的檔案，所有人都可以透過網址看到，適合做大頭貼或公開圖片）。
6. 點選 **Save**。

---

## 步驟 2：設定 Storage 的 Security Policies

就算是 Public Bucket，預設也「不能隨便上傳」，我們必須開放上傳權限：

1. 在 Storage 頁面，點選左側選單的 **Policies**。
2. 找到 `avatars` bucket，在 `Configuration` 區塊點選 **New Policy**。
3. 選擇 **Get started quickly** -> **Enable insert for anyone** (允許任何人上傳) 或 **Enable insert for authenticated users only** (如果你有做登入)。
   *為了教學方便測試，我們選擇 **Enable insert for anyone**（注意：實務上應該限制登入者才能上傳）。*
4. 點選 **Save policy**。

---

## 步驟 3：在 Next.js 實作圖片上傳 (Server Action)

我們將利用 React 的 **Server Action** 來處理表單上傳。不需要寫 `/api` 路由！

建立或修改 `src/app/upload-supabase/page.tsx`：

```tsx
// src/app/upload-supabase/page.tsx
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// 這是一個 Server Action (伺服器動作)
async function uploadFile(formData: FormData) {
  'use server' // 標記這段程式碼只在伺服器端執行

  // 1. 從 FormData 取得檔案
  const file = formData.get('file') as File
  if (!file || file.size === 0) {
    return { error: '請選擇一個檔案' }
  }

  // 2. 產生獨一無二的檔名 (避免檔名重複被覆蓋)
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  // 3. 上傳檔案到 Supabase Storage 的 'avatars' bucket
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file)

  if (error) {
    console.error('上傳失敗:', error)
    return { error: error.message }
  }

  // 4. 取得該檔案的公開網址
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  console.log('上傳成功，網址:', publicUrl)
  
  // 上傳成功後，你可以把 publicUrl 存到 Supabase Database，
  // 或是重新驗證頁面。
  // revalidatePath('/upload-supabase')
  
  return { success: true, url: publicUrl }
}

export default function UploadPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">上傳圖片到 Supabase</h1>
        
        {/* 使用 action 屬性綁定 Server Action */}
        <form action={uploadFile} className="flex flex-col space-y-4">
          <input 
            type="file" 
            name="file" 
            accept="image/*"
            required
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 cursor-pointer"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            確認上傳
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          提示：上傳後請查看終端機 (Terminal) 的 log，或是到 Supabase 後台確認檔案是否出現。
        </p>
      </div>
    </main>
  )
}
```

> **💡 什麼是 Server Action？**  
> `use server` 讓我們可以直接在 React 元件內部寫後端邏輯。當使用者點擊「確認上傳」時，Next.js 會自動在背景發送 POST 請求給伺服器，並執行 `uploadFile` 函式。你的 API Keys 和上傳邏輯都安全地待在伺服器端。

---

## 如何測試是否成功？

1. **啟動開發伺服器**：`npm run dev`
2. **打開頁面**：前往 `http://localhost:3000/upload-supabase`。
3. **選擇檔案並上傳**：選一張圖片，按下「確認上傳」。
4. **驗證結果**：
   - 查看你跑 `npm run dev` 的那個 **終端機畫面 (Terminal)**，應該會印出「上傳成功，網址: https://...」。
   - 把那個網址複製到瀏覽器打開，你應該能看到你上傳的圖片！
   - 回到 **Supabase 後台** -> **Storage** -> `avatars` bucket，你也會看到檔案出現在裡面。

---

## ✅ 本步驟完成確認

- [ ] 已在 Supabase 建立 `avatars` bucket 並設定為 Public。
- [ ] 已設定 Policy 允許 Insert 操作。
- [ ] 撰寫 Server Action 處理上傳邏輯。
- [ ] 成功透過頁面上傳圖片，並在 Supabase 後台看到該圖片。

---

[上一範例：範例 6 - Supabase Database](範例6-SupabaseDatabase.md) | [回到章節主題](主題.md)
