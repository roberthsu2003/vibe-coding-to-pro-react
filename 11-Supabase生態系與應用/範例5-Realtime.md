# 範例 5：Realtime (即時資料同步)

## 學習目標
- 開啟 Supabase 表格的 Realtime 功能。
- 在前端使用 WebSocket 訂閱資料庫變動。
- 實作即時更新的 UI（例如：當有新代辦事項時，不需重新整理頁面就會自動顯示）。

---

## 步驟 1：在 Supabase 後台開啟 Realtime

預設情況下，為了節省資源，Supabase 的 Realtime 功能是關閉的。

1. 進入 Supabase 後台的 **Database**。
2. 左側選單點擊 **Replication**。
3. 找到 `supabase_realtime` 區塊，點擊 **0 tables** 或 Source 設定。
4. 將 `todos` 表格的 Realtime 功能切換為 **開啟 (Toggle on)**。

---

## 步驟 2：實作即時訂閱的 Client Component

要在畫面上即時反映變化，我們需要使用 Client Component 搭配 `useEffect` 來監聽。

建立 `src/components/RealtimeTodos.tsx`：

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

// 定義資料型別
type Todo = {
  id: string
  title: string
  is_complete: boolean
}

export default function RealtimeTodos({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const supabase = createClient()

  useEffect(() => {
    // 訂閱 todos 表格的所有變動
    const channel = supabase
      .channel('realtime todos')
      .on('postgres_changes', {
        event: '*', // 監聽 INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'todos',
      }, (payload) => {
        console.log('Change received!', payload)
        
        // 根據不同事件更新畫面
        if (payload.eventType === 'INSERT') {
          setTodos((prev) => [payload.new as Todo, ...prev])
        }
        if (payload.eventType === 'DELETE') {
          setTodos((prev) => prev.filter(t => t.id !== payload.old.id))
        }
      })
      .subscribe()

    // 元件卸載時清除訂閱
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li key={todo.id} className="p-4 border rounded shadow-sm bg-white">
          {todo.title}
        </li>
      ))}
    </ul>
  )
}
```

## 步驟 3：在頁面中使用

回到 `src/app/dashboard/page.tsx`，將原本的靜態列表替換為這個 Client Component：

```tsx
// 在 dashboard 中匯入 RealtimeTodos
import RealtimeTodos from '@/components/RealtimeTodos'

// ...
  // 讀取初始資料
  const { data: initialTodos } = await supabase.from('todos').select('*').order('created_at', { ascending: false })

// ...
  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* ... */}
      {/* 傳入初始資料 */}
      <RealtimeTodos initialTodos={initialTodos || []} />
    </div>
  )
```

現在，如果在另一個瀏覽器分頁新增或刪除 Todo，這個頁面會「即時」自動更新！這就是 WebSocket 與 Supabase Realtime 的強大威力。

---

[下一章：實戰演練 - Supabase 全端專案整合](./README.md)
