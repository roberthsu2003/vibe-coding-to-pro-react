# 範例 4：認識 ESLint

## 目標

了解 **ESLint** 是什麼、為何專案需要它，並在**同一個 [練習專案](./範例/練習專案/)** 中驗證已安裝的 `eslint` 指令。

> 若你尚未在 [範例 3：常用 npm 指令與安裝套件](範例3-常用npm指令與安裝套件.md) 裡安裝 `eslint`，請先在 **練習專案** 目錄執行：`npm install -D eslint`。

---

## 步驟 1：ESLint 是什麼？

**ESLint** 是 **JavaScript / TypeScript 的程式碼檢查工具**（Linter），負責：

- 檢查語法錯誤與潛在問題  
- 統一程式碼風格（縮排、引號、分號等）  
- 提醒不建議的寫法  

---

## 步驟 2：為什麼需要 ESLint？

| 好處 | 說明 |
|------|------|
| **提早發現錯誤** | 在執行前就找出 typo、未使用變數等問題 |
| **風格一致** | 團隊成員寫出風格統一的程式碼 |
| **最佳實踐** | 提醒避免常見陷阱與不建議的寫法 |

---

## 步驟 3：ESLint 如何運作？

```
你的程式碼 (.js, .ts, .tsx)
        ↓
    ESLint 檢查
        ↓
  報告錯誤或警告
```

- **開發時**：編輯器可即時顯示 ESLint 提示  
- **建置時**：可設定在 `npm run build` 前強制通過檢查  

---

## 步驟 4：與 npm 的關係

你在 **範例 3** 已用 **`npm install -D eslint`** 將 ESLint 裝入 **`devDependencies`**：

- 只在開發時使用，不會當成執行時套件打包進一般「網站前端 bundle」的語意仍依專案而定  
- 他人 clone 專案後需執行 **`npm install`** 才能使用本機的 `eslint`  

在 **練習專案** 目錄可確認 CLI 是否可用。

**`npx` 是什麼？** 它會執行 **`node_modules` 裡**（或暫時下載）的**命令列工具**。`eslint` 安裝後，執行檔通常位於 `node_modules/.bin/eslint`；打 `npx eslint` 等同「用目前專案安裝的那一份 eslint」，不必自己寫長路徑，也不必**全域**安裝 `eslint`。與 **`npm run`** 不同：`npx` 專門用來**跑某個套件提供的 CLI**（此處為 `eslint --version`）。

```bash
cd 路徑/00-Node.js與npm/範例/練習專案
npx eslint --version
```

應顯示版本號。實際專案若要檢查檔案，還會設定 `eslint.config` 或 `.eslintrc` 等規則；本節僅建立概念，規則細節可於進入 Vite／React 專案後再深入。

---

## 完成

你已了解 **ESLint** 的角色，並與 [範例 3](範例3-常用npm指令與安裝套件.md) 的 **`npm install -D`** 連結起來。本章 **00 - Node.js 與 npm** 的連續範例至此告一段落。

[上一範例：範例 3 - 常用 npm 指令與安裝套件](範例3-常用npm指令與安裝套件.md) | [下一章：05 - React 核心概念](../05-React核心概念/主題.md)

---

[回到本章 README](README.md)
