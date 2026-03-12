# 範例 4：useEffect

## 目標

學會用 `useEffect` 處理副作用，例如計時器、API 呼叫。

---

## 動手操作

1. 啟動範例專案後，點選 **「4. useEffect」**
2. 觀察秒數是否每秒自動增加（useEffect 啟動的計時器）

---

## 步驟 1：引入 useState 與 useEffect

```tsx
import { useState, useEffect } from 'react'
```

---

## 步驟 2：建立計時器

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <p>已經過了 {seconds} 秒</p>
}
```

---

## 步驟 3：理解 useEffect

- **第一個參數**：要執行的函式
- **第二個參數 `[]`**：空陣列表示只在元件掛載時執行一次
- **return 的函式**：元件卸載時執行，用來清理（如清除計時器）

---

## 步驟 4：實際操作

1. 將上述程式碼加入 `App.tsx` 或新建 `Timer.tsx`
2. 啟動 `npm run dev`
3. 觀察秒數是否每秒增加

---

## 完成

`useEffect` 用於處理「副作用」：計時器、訂閱、API 呼叫等。

[下一範例：範例 5 - 事件處理](範例5-事件處理.md)
