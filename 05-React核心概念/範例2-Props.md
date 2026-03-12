# 範例 2：Props（屬性）

## 目標

學會從父元件傳入參數給子元件，並定義型別。

---

## 動手操作

1. 啟動範例專案後，點選 **「2. Props」**
2. 觀察同一個 Greeting 元件，傳入不同參數（有 age / 無 age）會顯示不同內容

---

## 步驟 1：建立子元件

在 `src/` 下建立 `Greeting.tsx`：

```tsx
interface GreetingProps {
  name: string
  age?: number
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h2>你好，{name}！</h2>
      {age !== undefined && <p>今年 {age} 歲</p>}
    </div>
  )
}

export default Greeting
```

**重點**：`interface` 定義 Props 型別，`age?` 表示可選。

---

## 步驟 2：在父元件使用

在 `App.tsx` 中：

```tsx
import Greeting from './Greeting'

function App() {
  return (
    <div>
      <Greeting name="小明" age={18} />
      <Greeting name="小華" />
    </div>
  )
}
```

**重點**：`name` 和 `age` 是傳給子元件的參數。

---

## 步驟 3：觀察結果

- 第一個會顯示「你好，小明！」和「今年 18 歲」
- 第二個只顯示「你好，小華！」（因為沒傳 age）

---

## 完成

Props 讓元件可以接收不同資料，達到重複使用。

[下一範例：範例 3 - State](範例3-State.md)
