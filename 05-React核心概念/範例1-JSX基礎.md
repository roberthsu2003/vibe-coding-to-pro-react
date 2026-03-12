# 範例 1：JSX 基礎

## 目標

學會 JSX 語法，以及用 `{}` 大括號插入 JavaScript 表達式。

---

## 動手操作

1. 啟動範例專案（若尚未啟動）：`cd 05-React核心概念/examples && npm run dev`
2. 在瀏覽器中點選 **「1. JSX 基礎」**
3. 觀察畫面上如何用 `{}` 顯示變數、運算結果與函式呼叫

---

## 步驟 1：什麼是 JSX？

JSX 是 JavaScript 的擴充語法，讓你在程式碼中直接寫類似 HTML 的標籤。

---

## 步驟 2：插入變數

在 `App.tsx` 中寫入：

```tsx
function App() {
  const userName = '小明'
  return (
    <div>
      <h1>你好，{userName}！</h1>
    </div>
  )
}
```

**重點**：`{userName}` 會顯示變數的值。

---

## 步驟 3：插入運算

```tsx
const score = 85
return (
  <p>及格了嗎？{score >= 60 ? '是' : '否'}</p>
)
```

**重點**：`{}` 內可以放任何 JavaScript 表達式。

---

## 步驟 4：插入函式呼叫

```tsx
return (
  <p>大寫名字：{userName.toUpperCase()}</p>
)
```

---

## 完成

記住：**用 `{}` 包住 JavaScript 表達式，就能在 JSX 中顯示結果**。

[下一範例：範例 2 - Props](範例2-Props.md)
