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

export default function AvatarUpload({ userId, onUploadSuccess }: { userId: string, onUploadSuccess: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
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

      // 上傳檔案至 supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // 取得公開 URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      onUploadSuccess(data.publicUrl)
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
    </div>
  )
}
```

這段程式碼會在使用者選取檔案後，自動上傳至 `avatars` Bucket，並透過 `onUploadSuccess` 回傳最終的圖片 URL。

---

[下一章：範例 5 - Realtime (即時資料同步)](./範例5-Realtime.md)
