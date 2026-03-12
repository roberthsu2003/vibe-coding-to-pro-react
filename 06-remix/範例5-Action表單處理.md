# 範例 5：Action 表單處理

## 目標

學會用 `action` 處理表單提交，並搭配 `Form` 元件。

---

## 前置條件

- 已完成 [範例 4：Loader 資料載入](範例4-Loader資料載入.md)

---

## 步驟 1：認識 Action

`action` 是路由模組匯出的**非同步函式**，用來處理：

- 表單提交（POST）
- 建立、更新、刪除資料

使用 `<Form>` 取代 `<form>`，React Router 會自動處理提交與導向。

---

## 步驟 2：建立表單頁面

在 `app/routes/` 下建立 `contact.tsx`：

```tsx
import { Form } from "react-router";
import type { Route } from "./+types/contact";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  console.log("收到：", name, message);
  return { success: true, message: "感謝您的留言！" };
}

export default function Contact({ actionData }: Route.ComponentProps) {
  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-bold">聯絡我們</h1>
      <Form method="post" className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">姓名</label>
          <input
            name="name"
            type="text"
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">留言</label>
          <textarea
            name="message"
            rows={3}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          送出
        </button>
      </Form>
      {actionData?.success && (
        <p className="mt-4 text-green-600">{actionData.message}</p>
      )}
    </main>
  );
}
```

---

## 步驟 3：註冊路由

修改 `app/routes.ts`，在陣列中新增 contact 路由：

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("products", "routes/products.tsx"),
  route("contact", "routes/contact.tsx"),
] satisfies RouteConfig;
```

---

## 步驟 4：在 root.tsx 導覽列加入聯絡連結

在 `app/root.tsx` 的 `<nav>` 中新增：

```tsx
<Link to="/contact" className="text-blue-600 hover:underline">聯絡</Link>
```

---

## 步驟 5：重點整理

| 項目 | 說明 |
|------|------|
| `<Form method="post">` | 提交時呼叫 `action` |
| `request.formData()` | 取得表單資料 |
| `actionData` | action 回傳的資料，可在元件中顯示 |

---

## 步驟 6：驗證

1. 儲存檔案
2. 開啟 `http://localhost:5173/contact`
3. 填寫表單並送出，應看到成功訊息

---

## 完成

**恭喜！你已完成 Remix / React Router v7 的核心概念學習。**

- React Router v7 = React Router + Remix
- 路由：`routes.ts` + `route()`、`index()`
- Loader：頁面載入前取得資料
- Action：處理表單提交

---

[上一範例：範例 4 - Loader 資料載入](範例4-Loader資料載入.md)
