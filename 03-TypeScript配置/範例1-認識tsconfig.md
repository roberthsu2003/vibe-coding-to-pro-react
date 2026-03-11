# 範例 1：認識 tsconfig.json

## 目標

了解 TypeScript 設定檔的關鍵欄位。

---

## 步驟 1：開啟 tsconfig.json

在專案根目錄找到 `tsconfig.json`，用編輯器開啟。

---

## 步驟 2：認識 compilerOptions

常見設定如下：

| 欄位 | 說明 |
|------|------|
| **target** | 編譯後的 JavaScript 版本，如 `ES2020` |
| **module** | 模組系統，`ESNext` 表示使用最新 ES 模組 |
| **strict** | 是否開啟嚴格模式（建議開啟） |
| **jsx** | 如何處理 JSX，`react-jsx` 用於 React |
| **noEmit** | 不輸出檔案（Vite 負責打包，TS 只做型別檢查） |

---

## 步驟 3：認識 include 與 exclude

```json
{
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

- **include**：要納入編譯的檔案
- **exclude**：要排除的檔案（預設會排除 node_modules）

---

## 完成

理解 tsconfig 後，可進行 [範例 2：.ts 與 .tsx 的差異](範例2-ts與tsx的差異.md)。
