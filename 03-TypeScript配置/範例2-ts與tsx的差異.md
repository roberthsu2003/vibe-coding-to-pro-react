# 範例 2：.ts 與 .tsx 的差異

## 目標

了解何時使用 `.ts`，何時使用 `.tsx`。

---

## 步驟 1：認識副檔名

| 副檔名 | 用途 |
|--------|------|
| **.ts** | 純 TypeScript，不含 JSX |
| **.tsx** | TypeScript + JSX，可寫 React 元件 |

---

## 步驟 2：.ts 範例

建立 `utils.ts`，寫入：

```typescript
// 純邏輯、型別、工具函式，沒有 HTML 標籤
export function add(a: number, b: number): number {
  return a + b
}
```

**重點**：沒有 `<div>` 等 JSX 語法，用 `.ts` 即可。

---

## 步驟 3：.tsx 範例

建立 `MyComponent.tsx`，寫入：

```tsx
// 有 JSX 語法，必須用 .tsx
function MyComponent() {
  return <div>Hello</div>
}

export default MyComponent
```

**重點**：有 `<div>` 等標籤，必須用 `.tsx`。

---

## 完成

記住：**有 JSX 就用 .tsx，沒有就用 .ts**。

[下一範例：範例 3 - 基本型別](範例3-基本型別.md)
