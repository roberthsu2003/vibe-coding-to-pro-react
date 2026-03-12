# 範例 4：Loader 資料載入

## 目標

學會用 `loader` 在頁面渲染前載入資料，並在元件中取得 `loaderData`。

---

## 前置條件

- 已完成 [範例 3：路由與頁面](範例3-路由與頁面.md)

---

## 步驟 1：認識 Loader

`loader` 是路由模組匯出的**非同步函式**，在頁面渲染前執行，用來：

- 從 API 取得資料
- 從資料庫查詢
- 回傳給元件使用

---

## 步驟 2：建立有 Loader 的頁面

在 `app/routes/` 下建立 `products.tsx`：

```tsx
import type { Route } from "./+types/products";

export async function loader() {
  const products = [
    { id: 1, name: "商品 A", price: 100 },
    { id: 2, name: "商品 B", price: 200 },
  ];
  return { products };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">商品列表</h1>
      <ul className="mt-4 space-y-2">
        {loaderData.products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

---

## 步驟 3：註冊路由

修改 `app/routes.ts`，加入 `route` 的 import，並在陣列中新增 products 路由：

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("products", "routes/products.tsx"),
] satisfies RouteConfig;
```

---

## 步驟 4：在 root.tsx 導覽列加入商品連結

在 `app/root.tsx` 的 `<nav>` 中新增：

```tsx
<Link to="/products" className="text-blue-600 hover:underline">商品</Link>
```

---

## 步驟 5：型別說明

- `Route.ComponentProps`：自動推斷 `loaderData` 型別
- `./+types/products`：由 React Router 自動產生的型別

---

## 步驟 6：驗證

1. 儲存檔案
2. 開啟 `http://localhost:5173/products`
3. 應看到商品列表

---

## 完成

學會 Loader 後，繼續 [範例 5：Action 表單處理](範例5-Action表單處理.md)。

---

[上一範例：範例 3 - 路由與頁面](範例3-路由與頁面.md) | [下一範例：範例 5 - Action 表單處理](範例5-Action表單處理.md)
