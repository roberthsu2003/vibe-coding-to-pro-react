# 範例 5：Server Actions 表單處理

## 目標

學會用 Server Action 處理表單提交，在伺服器端執行邏輯。

---

## 前置條件

- 已完成 [範例 4：資料載入](範例4-資料載入.md)

---

## 步驟 1：認識 Server Action

**Server Action** 是在伺服器端執行的函式，用來：

- 處理表單提交
- 建立、更新、刪除資料
- 存取資料庫或 API

使用 `"use server"` 標記，並在表單的 `action` 屬性中傳入。

---

## 步驟 2：建立 Server Action

建立 `src/app/contact/actions.ts`：

```tsx
"use server";

export async function submitContact(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  console.log("收到：", name, message);
  return { success: true, message: "感謝您的留言！" };
}
```

> `_prevState` 為 `useActionState` 傳入的先前狀態，此例未使用。

---

## 步驟 3：建立表單頁面

建立 `src/app/contact/page.tsx`：

```tsx
"use client";

import { useActionState } from "react";
import { submitContact } from "./actions";

export default function Contact() {
  const [result, formAction] = useActionState(submitContact, null);

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-bold">聯絡我們</h1>
      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">姓名</label>
          <input name="name" type="text" className="mt-1 block w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">留言</label>
          <textarea name="message" rows={3} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>
        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          送出
        </button>
      </form>
      {result?.success && <p className="mt-4 text-green-600">{result.message}</p>}
    </main>
  );
}
```

- `useActionState(submitContact, null)`：綁定 Server Action，`result` 為 action 回傳值
- `form action={formAction}`：表單提交時呼叫 Server Action

---

## 步驟 4：在 layout 導覽列加入聯絡連結

在 `src/app/layout.tsx` 的 `<nav>` 中新增：

```tsx
<Link href="/contact" className="text-blue-600 hover:underline">聯絡</Link>
```

---

## 步驟 5：驗證

1. 儲存檔案
2. 開啟 `http://localhost:3000/contact`
3. 填寫表單並送出，應看到成功訊息

---

## 完成

**恭喜！你已完成 Next.js 的核心概念學習。**

- App Router：檔案即路由
- Server Component：async 載入資料
- Server Action：`"use server"` 處理表單

---

[上一範例：範例 4 - 資料載入](範例4-資料載入.md)
