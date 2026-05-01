# 實戰：Supabase 全端專案整合

## 專案簡介

經歷了本章的 5 個範例，你已經在同一個 `supabase-fullstack-app` 專案中實作了：
1. Next.js App Router 與 Supabase 的環境串接。
2. Email/密碼註冊與登入。
3. 受 Row Level Security (RLS) 保護的 PostgreSQL 資料庫操作。
4. Storage 圖片上傳。
5. Realtime 即時資料更新。

這份實戰演練是為了幫助你「整合」與「優化」這些零散的功能，將其打磨成一個架構清晰、使用者體驗良好的完整應用程式。

---

## 實戰目標與優化方向

### 1. 完善版面與導覽列 (Layout & Navigation)
- 使用 `src/app/layout.tsx` 建立全局導覽列。
- 當使用者未登入時，顯示「首頁」與「登入」按鈕。
- 當使用者已登入時，顯示使用者的頭像 (Avatar)、Email，以及「登出」按鈕。

### 2. 優化使用者資料表 (Profiles)
目前我們只有 Auth 系統內建的 user 資料，實務上我們通常會建立一個 `profiles` 資料表與 `auth.users` 關聯。
- 在 Supabase SQL Editor 建立 `profiles` 表格（包含 `id`, `avatar_url`, `username` 等欄位）。
- 設定 Database Trigger，當有新用戶註冊時自動新增一筆 profile 紀錄。
- 修改 **範例 4** 的上傳邏輯，上傳完成後將 `avatar_url` 更新到 `profiles` 表格。

### 3. Middleware 統一路由保護
在 **範例 2** 中，我們在單一頁面中檢查使用者是否登入，但當頁面變多時這樣會難以維護。
- 在專案根目錄建立 `src/middleware.ts`。
- 透過 Middleware 檢查 user session，如果未登入且試圖存取 `/dashboard` 或 `/profile`，自動重導向至 `/login` 頁面。

### 4. 部署至 Vercel
將你的 Next.js 專案推送到 GitHub，並匯入到 Vercel 進行部署。
- 記得在 Vercel 後台設定 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 環境變數。

---

## 挑戰題（進階）

- **第三方登入**：嘗試在 Supabase 後台設定 Google OAuth，並在登入頁面加入「使用 Google 登入」按鈕。
- **樂觀 UI 更新 (Optimistic UI)**：在 **範例 5** 中，當使用者新增 Todo 時，先在畫面上顯示該項目，再等 Supabase 的確認回傳，提升操作的流暢感。

透過這個專案，你已經具備了打造現代全端 SaaS (Software as a Service) 應用程式的核心基礎！
