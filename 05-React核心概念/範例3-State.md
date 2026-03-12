# 範例 3：State（狀態）

## 目標

學會用 `useState` 管理元件內部的資料，當資料改變時畫面會自動更新。

---

## 動手操作

1. 啟動範例專案後，點選 **「3. State」**
2. 點擊 **+1**、**-1**、**歸零** 按鈕，觀察數字如何即時更新

---

## 步驟 1：引入 useState

```tsx
import { useState } from 'react'
```

---

## 步驟 2：建立狀態

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  // ...
}
```

**說明**：

- `useState(0)`：初始值為 0
- `count`：當前值
- `setCount`：更新函式

---

## 步驟 3：在按鈕中更新狀態

```tsx
return (
  <div>
    <p>目前數字：{count}</p>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <button onClick={() => setCount(count - 1)}>-1</button>
    <button onClick={() => setCount(0)}>歸零</button>
  </div>
)
```

**重點**：點擊按鈕時呼叫 `setCount`，React 會重新渲染並顯示新數字。

---

## 步驟 4：實際操作

1. 將上述程式碼加入 `App.tsx` 或新建 `Counter.tsx`
2. 啟動 `npm run dev`
3. 點擊按鈕，觀察數字變化

---

## 完成

State 改變 → 觸發重新渲染 → 畫面更新。

[下一範例：範例 4 - useEffect](範例4-useEffect.md)
