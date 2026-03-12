# 範例 1：React 與 Next.js 的關係

## 目標

理解 React 與 Next.js 的關係，以及 Next.js 提供的全端能力。

---

## 步驟 1：React 是什麼？

**React** 是 UI 函式庫，負責：

- 元件化介面
- 虛擬 DOM 與渲染
- 狀態管理（useState、useEffect 等）

React **不包含**路由、伺服器渲染、建置工具等「全端」功能。

---

## 步驟 2：Next.js 是什麼？

**Next.js** 是建構在 React 之上的**全端框架**，由 Vercel 維護，提供：

- **App Router**：檔案式路由
- **Server Components**：預設在伺服器端渲染
- **Server Actions**：伺服器端處理表單
- **SSR / SSG**：伺服器端渲染、靜態生成
- **API Routes**：後端 API

Next.js 讓 React 應用能處理路由、資料載入、表單等完整 Web 需求。

---

## 步驟 3：兩者關係圖

```
React（UI 函式庫）
    ↑
Next.js（全端框架）
```

**簡單說**：Next.js 是「React 的全端解決方案」，內建路由、渲染、建置等。

---

## 步驟 4：與其他框架比較

| 框架 | 特色 |
|------|------|
| **Next.js** | Vercel 出品、生態完整、部署方便 |
| **React Router v7** | Remix 整合、Loader/Action 模式 |

兩者都是 React 全端框架，可依專案需求選擇。

---

## 完成

理解關係後，繼續 [範例 2：認識專案結構](範例2-認識專案結構.md)。

---

[上一範例：範例 0 - 建立專案](範例0-建立專案.md) | [下一範例：範例 2 - 認識專案結構](範例2-認識專案結構.md)
