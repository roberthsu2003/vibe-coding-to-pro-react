# 範例 3：`interface` 與 `type`

## 目標

學會用 **`interface`** 與 **`type`** 描述物件結構，並理解兩者常見使用情境與差異。

---

## 前置條件

- 已完成 [範例 2：函式與型別](範例2-函式與型別.md)

---

## 步驟 0a：指令列練習（建議先做）

1. 編輯 [`tsx-cli/src/03-interfaces.ts`](tsx-cli/src/03-interfaces.ts)，依下方**步驟 1～6** 在此檔撰寫程式。
2. 在 [`tsx-cli/`](tsx-cli/) 目錄執行：`npm run 03`（見 [tsx-cli README](tsx-cli/README.md)）。

完成後，再進行 **步驟 0b**（可將程式複製到 `src/practice-03-interfaces.ts`）。

---

## 步驟 0b：開啟本範例網頁專案並確認可執行

本範例使用**獨立資料夾** [`examples/03-interfaces/`](examples/03-interfaces/)（可整份複製）。內含 **`index.html`**、**`src/main.ts`**、**`src/style.css`**、練習檔 **`src/practice-03-interfaces.ts`**；`console.log` 會同步顯示在網頁上。

1. 終端機進入該資料夾：

   ```bash
   cd 08-TypeScript語法/examples/03-interfaces
   ```

2. 安裝依賴並啟動：

   ```bash
   npm install
   npm run dev
   ```

3. 用瀏覽器開啟終端機顯示的本機網址，確認專案能啟動。

接下來**步驟 1～6**的程式碼：若走 **步驟 0a**，請寫在 **`tsx-cli/src/03-interfaces.ts`**；若走 **步驟 0b**，請寫在 **`examples/03-interfaces/src/practice-03-interfaces.ts`**（內含 TODO 鷹架）。

---

## 步驟 1：用 `interface` 描述物件

`interface` 用來**命名**一種物件「長什麼樣子」：有哪些屬性、各是什麼型別。

```typescript
interface User {
  id: number
  name: string
  email: string
}

const u: User = {
  id: 1,
  name: '小明',
  email: 'ming@example.com',
}
```

- 少寫必填屬性、寫錯型別，TypeScript 都會檢查出來。  
- 在 React 裡，**Props** 很常寫成 `interface`。

---

## 步驟 2：選用屬性與唯讀

屬性名後加 **`?`** 表示**可有可無**；加 **`readonly`** 表示建立後不可改參考（物件內層仍要各別限制）。

```typescript
interface Product {
  readonly sku: string
  title: string
  discount?: number  // 可省略
}

const p: Product = { sku: 'A-001', title: '筆記本' }
// p.sku = 'x'  // ❌ readonly 不可指定
```

---

## 步驟 3：擴充：`extends`

新介面可**繼承**舊介面的欄位，再追加欄位：

```typescript
interface Named {
  name: string
}

interface Member extends Named {
  memberSince: number
}

const m: Member = { name: '小華', memberSince: 2024 }
```

---

## 步驟 4：用 `type` 定義別名

**`type`** 可為各種型別取**別名**，其中很常見的是「物件形狀」與 `interface` 類似：

```typescript
type Point = {
  x: number
  y: number
}

type Book = {
  isbn: string
  title: string
}
```

`type` 也常用來組合**聯合**、**交集**（後續範例 4、5 會更常用）：

```typescript
type ID = string | number

type Admin = User & { role: 'admin' }
```

---

## 步驟 5：`interface` 與 `type` 怎麼選？

| 情境 | 建議 |
|------|------|
| 描述**物件／Props**，且可能 **extends** 擴充 | 多用 **`interface`** |
| **聯合型別**、**交集**、**對應到條件型別**等 | 多用 **`type`** |
| 團隊風格 | 許多專案約定「物件用 interface，其餘用 type」，**一致即可** |

**技術差異（入門可先記結論）：**

- 同名 `interface` 可在不同檔案**合併宣告**（declaration merging）；`type` **不會**合併。  
- `type` 可以表達的形態較廣（例如 `string | number` 直接命名為 `ID`）。

初學階段：**能寫出清楚的物件型別**比選哪一個更重要；React 元件 Props 用 `interface` 很常見。

---

## 步驟 6：綜合練習（在練習檔中）

在**練習檔**（`tsx-cli/src/03-interfaces.ts` 或 `examples/…/src/practice-03-interfaces.ts`）末尾加入（或覆寫前面實驗碼）：

```typescript
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

function summarize(items: Todo[]): string {
  const left = items.filter((t) => !t.done).length;
  return `共 ${items.length} 筆，未完成 ${left} 筆`;
}

const list: Todo[] = [
  { id: 1, title: "寫作業", done: false },
  { id: 2, title: "買菜", done: true },
];

console.log(summarize(list));
```

執行 `npm run dev`，在瀏覽器**開發者工具 → Console** 或頁面上「頁面輸出」區塊查看輸出。

---

## 重點整理

| 關鍵字 | 用途 |
|--------|------|
| `interface User { ... }` | 命名物件結構，可 `extends` |
| `type X = { ... }` | 型別別名，物件寫法與 interface 類似 |
| `name?: string` | 選用屬性 |
| `readonly id` | 唯讀屬性 |
| `type A = B & C` | 交集：同時符合 B 與 C |

---

## 小練習

在 **tsx-cli** 或 **網頁專案** 的練習檔中完成：

1. 定義 `interface Book`，包含 `title: string`、`author: string`、選用欄位 `year?: number`，並建立一個符合的常數。  
2. 定義 `type Point3D`，在 `Point`（`x`, `y`）之上加上 `z: number`（可用 `type Point = { x: number; y: number }` 再交集）。  
3. 將某函式的參數標註為 `interface`，故意少傳一個必填屬性，觀察錯誤訊息。

---

## 完成

你已能描述物件結構並在函式中使用。接下來請繼續 [範例 4：陣列與泛型入門](範例4-陣列與泛型入門.md)。

---

[上一範例：範例 2 - 函式與型別](範例2-函式與型別.md) | [下一範例：範例 4 - 陣列與泛型入門](範例4-陣列與泛型入門.md)
