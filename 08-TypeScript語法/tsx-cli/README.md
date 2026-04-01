# TypeScript 語法 — 指令列練習（tsx）

本資料夾用 **[tsx](https://github.com/privatenumber/tsx)** 在**終端機**直接執行 `.ts` 檔，無需開瀏覽器、也無需 Vite。適合先熟悉語法與 `console.log`，再進入 [`../examples/`](../examples/) 的網頁專案。

> **名稱說明**：口語或打字有時會寫成「**tcx**」，一般是指這類「在終端機跑 TypeScript」的工具；本教材採用社群常用的 **`tsx`** 套件（與 React 的 `.tsx` 副檔名不同，請勿混淆）。

## 與網頁範例的對照

| 範例講義 | 本資料夾練習檔 | 網頁專案（第二階段） |
|----------|----------------|----------------------|
| [範例 1](../範例1-變數與基本型別.md) | `src/01-basics.ts` | `examples/01-basics/` |
| [範例 2](../範例2-函式與型別.md) | `src/02-functions.ts` | `examples/02-functions/` |
| [範例 3](../範例3-interface與type.md) | `src/03-interfaces.ts` | `examples/03-interfaces/` |
| [範例 4](../範例4-陣列與泛型入門.md) | `src/04-arrays-generics.ts` | `examples/04-arrays-generics/` |
| [範例 5](../範例5-聯合型別與型別窄化.md) | `src/05-unions.ts` | `examples/05-unions/` |

## 第一次使用

```bash
cd 08-TypeScript語法/tsx-cli
npm install
```

## 執行單一範例

以範例 1 為例：

```bash
npm run 01
```

或：

```bash
npx tsx src/01-basics.ts
```

輸出會顯示在**終端機**。修改 `src/01-basics.ts` 後再執行同一指令即可重新跑。

若要存檔後自動重跑，可用：

```bash
npm run watch:01
```

（`watch:02`～`watch:05` 同理。）

## 建議順序

1. 在此資料夾依範例 1→5 完成（或與講義同步）**指令列**練習。  
2. 再依各講義「步驟 0」進入 **`examples/`** 對應資料夾，用瀏覽器與 **Console／頁面輸出** 體驗前端環境。
