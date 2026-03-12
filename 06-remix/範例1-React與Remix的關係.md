# 範例 1：React 與 Remix 的關係

## 目標

理解 React、Remix、React Router 三者的關係，以及 React Router v7 的演進。

---

## 步驟 1：React 是什麼？

**React** 是 UI 函式庫，負責：

- 元件化介面
- 虛擬 DOM 與渲染
- 狀態管理（useState、useEffect 等）

React **不包含**路由、伺服器渲染、表單處理等「全端」功能。

---

## 步驟 2：Remix 是什麼？

**Remix** 是建構在 React 之上的**全端框架**，提供：

- 檔案路由
- Loader（伺服器端載入資料）
- Action（表單提交處理）
- SSR（伺服器端渲染）

Remix 讓 React 應用能處理路由、資料載入、表單等完整 Web 需求。

---

## 步驟 3：React Router v7 的演進

2024 年起，**Remix 與 React Router 合併**：

| 項目 | 說明 |
|------|------|
| **合併** | Remix 團隊將 Remix 整合進 React Router |
| **React Router v7** | 即「Remix 的進化版」，包含所有 Remix 功能 |
| **建議** | 新專案使用 React Router v7，既有 Remix 專案可升級 |

---

## 步驟 4：三者關係圖

```
React（UI 函式庫）
    ↑
Remix（全端框架，已整合進 React Router）
    ↑
React Router v7（路由 + 全端框架）
```

**簡單說**：React Router v7 = React Router + Remix，是目前的推薦選擇。

---

## 步驟 5：與 Next.js 的差異與選擇

React Router v7 與 Next.js 都是 React 全端框架，差異如下：

### 主要差異

| 項目 | React Router v7（Remix） | Next.js |
|------|--------------------------|---------|
| **資料載入** | Loader（路由層級） | Server Component（元件層級 async） |
| **表單處理** | Action | Server Actions |
| **路由方式** | `routes.ts` 設定 | 檔案即路由（`app/` 資料夾） |
| **部署** | 可部署至任意 Node 環境 | 原生支援 Vercel，也可自部署 |
| **生態** | 輕量、彈性高 | 生態完整、模板多 |

### 適合的專案類型

| 選擇 React Router v7 | 選擇 Next.js |
|---------------------|--------------|
| 需要高度自訂、自架伺服器 | 需要快速部署、Vercel 生態 |
| 偏好 Loader/Action 模式 | 偏好檔案式路由、Server Components |
| 既有 React Router 專案升級 | 新專案、重視 SEO 的內容站 |
| 多策略路由（SPA / SSR 切換） | 以 App Router 為主的全端應用 |

兩者皆可勝任多數全端需求，可依團隊熟悉度與部署環境選擇。詳見 [07 - Next.js](../07-Next.js/主題.md) 的對應比較。

---

## 完成

理解關係後，繼續 [範例 2：認識專案結構](範例2-認識專案結構.md)。

---

[上一範例：範例 0 - 建立專案](範例0-建立專案.md) | [下一範例：範例 2 - 認識專案結構](範例2-認識專案結構.md)
