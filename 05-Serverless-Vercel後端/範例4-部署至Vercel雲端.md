# 範例 4：部署至 Vercel 雲端

## 目標

恭喜你！完成前三個範例後，你的專案已經：
- ✅ 有了安全的 Serverless Function（`api/gemini.ts`）
- ✅ 前端改為呼叫 `/api/gemini`
- ✅ 可以在本機正常測試

現在，是時候將它部署到 **Vercel 雲端**，讓全世界都可以使用你的 AI 應用程式了！

---

## 部署前的完整檢查清單

在執行任何部署指令前，請逐項確認以下事項：

### ✅ 程式碼質量檢查

```bash
# 1. 確認 TypeScript 編譯無誤
npm run build

# 2. 確認沒有 TypeScript 型別錯誤
npx tsc --noEmit

# 3. 確認 ESLint 檢查通過（如有設定）
npm run lint || echo "No lint script"
```

### ✅ 本機功能驗證

```bash
# 4. 啟動本機 Vercel 環境進行完整測試
vercel dev

# 然後在瀏覽器測試（http://localhost:3000）：
# - 送出問題並確認收到 AI 回答 ✓
# - 重新整理頁面，確認沒有 404 ✓
# - 在 DevTools Network 頁籤確認看不到 API Key ✓
```

### ✅ Git 和環境配置檢查

```bash
# 5. 確認 .gitignore 正確設定
cat .gitignore
# 應包含：.env*、node_modules/、dist/、.vercel

# 6. 確認沒有誤提交敏感檔案
git status
# 不應該出現 .env、.vercel 等

# 7. 確認 Vercel 配置存在（vercel.json 或 vercel.ts）
ls -la vercel.json || ls -la vercel.ts

# 8. 確認 .env.example 已更新
cat .env.example
# 應包含所有必要的環境變數（無真實值）
```

### 確認 `.gitignore` 正確設定

在部署前，務必確認以下檔案**不會**被上傳到 GitHub：

```
# .gitignore（應包含的內容）
node_modules/
dist/
.env*              ← 保護所有 .env 開頭的檔案（含你的 API Key）
!.env.example      ← 但允許 .env.example 上傳（範本，無真實 Key）
.vercel            ← Vercel CLI 產生的暫存設定，不需上傳
.DS_Store          ← macOS 暫存檔
```

### 確認 `vercel.json` 或 `vercel.ts` 存在

Vercel 需要知道如何路由你的請求。選擇其中一種設定方式：

**方式 A：`vercel.json`（簡單）**

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**方式 B：`vercel.ts`（推薦，需要 `@vercel/config`）**

```typescript
import { routes, type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  buildCommand: 'npm run build',
  framework: 'vite',
  rewrites: [
    routes.rewrite('/api/(.*)', '/api/$1'),
    routes.rewrite('/(.*)', '/index.html'),
  ],
};
```

### 確認 `.env.example` 已更新

更新 `.env.example`，讓其他人知道需要哪些環境變數：

```bash
# .env.example（提交 Git，無真實值）
# Gemini 一句話問答 - GEMINI_API_KEY 只存在伺服器端
# 請複製此檔案為 .env，並填入您的 Gemini API Key
# 注意：.env 已加入 .gitignore，不會被上傳至 GitHub

GEMINI_API_KEY="請填入您的 Gemini API Key"
```

### 確認 `package.json` 的 Node.js 版本

確認專案指定了適當的 Node.js 版本（推薦 18+）：

```json
{
  "name": "my-serverless-app",
  "engines": {
    "node": ">=18.0.0"
  },
  ...
}
```

---

## 方法一：透過 Vercel CLI 部署（手動部署，無 Git 連線）

> **⚠️ 觀念提醒：這是「單次」的手動上傳**  
> 透過 `vercel --prod` 指令，是將你「目前電腦本機」的專案檔案直接打包上傳到 Vercel。  
> 這種做法**完全沒有和 GitHub Repo 連線**。如果未來程式碼有任何修改，線上網站不會自動更新，你必須每次都手動再下一次指令才能發布新版本。
> 
> （如果你希望 `git push` 後 Vercel 就自動幫你更新，請直接使用下方的 **方法二**！）

### 步驟 1：在終端機執行部署

在專案根目錄執行：

```bash
vercel --prod
```

> **💡 `--prod` 是什麼意思？**  
> - 不加 `--prod`：部署到「預覽環境（Preview）」，每次都有不同的 URL
> - 加上 `--prod`：部署到「正式環境（Production）」，使用固定的主網址

### 步驟 2：設定 Vercel 環境變數（API Key）

部署完成後，你的網站雖然上線了，但 `GEMINI_API_KEY` 還沒設定到 Vercel 上！  
Serverless Function 找不到 Key，會回傳 500 錯誤。

執行以下指令，將 API Key 設定到 Vercel：

```bash
vercel env add GEMINI_API_KEY
```

CLI 會互動式地詢問：

```
Vercel CLI
? What's the value of GEMINI_API_KEY? → 貼上你的 API Key
? Add GEMINI_API_KEY to which Environments (select multiple)? 
  → 勾選 Production、Preview、Development（全部勾選）
```

### 步驟 3：重新部署（讓環境變數生效）

設定完環境變數後，需要重新部署才能讓新設定生效：

```bash
vercel --prod
```

### （進階）步驟 4：事後綁定 GitHub Repo（啟動自動部署）

如果在執行完 `vercel --prod` 之後，你改變心意了，希望也能享有後續「只要 `git push` 上去就會自動更新網站」的便利性，你可以隨時手動將專案連結到 GitHub！

請先將目前的程式碼上傳到 GitHub，然後選擇以下其中一種方式：

- **做法 A：透過指令（推薦）**  
  在專案終端機執行：
  ```bash
  vercel git connect
  ```
  按照提示選擇你的 GitHub 帳號並授權，就能輕鬆將這份本機專案與 GitHub 綁定。

- **做法 B：從 Vercel 網頁設定**  
  進入 Vercel Dashboard 點選你的專案 ➔ 點選右上角的 **Settings** ➔ 選擇左側的 **Git** ➔ 在 **Connect to Git** 區域選擇你的 GitHub Repository，點選 Connect 即可。

---

## 方法二：透過 GitHub 自動部署（CI/CD，推薦）

因為我們在上一個單元（範例 3）執行 `vercel dev` 時，Vercel 其實已經在你的帳號中建立了一個對應的「專案空殼」。
所以最標準且推薦的做法，就是將這個專案空殼與你的 GitHub 綁定，達成未來的自動部署！

### 步驟 1：將程式碼推送到 GitHub

```bash
# 初始化 Git（如果還沒有）
git init
git add .
git commit -m "feat: 轉換為 Vercel Serverless 架構"

# 建立 GitHub Repository 並推送
# （先在 GitHub 網站建立新的 Repository，再執行以下指令）
git remote add origin https://github.com/你的帳號/你的專案名稱.git
git push -u origin main
```

### 步驟 2：在 Vercel 選擇剛建立的專案並綁定 GitHub

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 你會看到一個你在範例 3 時建立的專案卡片（例如 `gemini-qa-app`），**請點擊進入該專案**。
3. 點選頁面右上角的 **Settings**（設定）。
4. 在左側選單選擇 **Git**。
5. 在「Connect to Git」區域，選擇你的 GitHub 帳號與剛剛推送的 Repository，點選 **Connect** 進行綁定。

### 步驟 3：設定環境變數（最重要！）

專案雖然跟 GitHub 綁定了，但它還沒有你的 API Key，這會導致伺服器報錯（500 錯誤）！

1. 在同一個 Settings 頁面中，點擊左側的 **Environment Variables**。
2. 新增你的 API Key：
   ```text
   Key:   GEMINI_API_KEY
   Value: 貼上你的真實 Gemini API Key
   ```
3. 確認下方 Environments 都有勾選，點選 **Save** 儲存。

### 步驟 4：觸發第一次正式部署

因為我們剛才才把環境變數填上去，為了確保專案吃到最新的變數，我們手動觸發一次重新部署：

1. 點擊畫面上方的 **Deployments** 頁籤。
2. 找到最新的那筆發布紀錄，點擊右邊的「三個點 (`⋮`)」圖示。
3. 選擇 **Redeploy**（重新部署），按下確認。

Vercel 接著會自動下載 GitHub 的程式碼、安裝模組、打包前端靜態檔案，並將 `api/gemini.ts` 發布為 Serverless Function，只需等待幾十秒鐘即可！

完成後，你會得到一個類似這樣的網址：

```
https://gemini-qa-app.vercel.app
```

---

## 驗證部署是否成功

### 1. 測試網站基本功能

打開你的 Vercel 網址，嘗試送出一個問題，確認能收到 AI 回應。

### 2. 用 DevTools 確認安全性

打開瀏覽器 DevTools → Network，送出問題後：

- ✅ 請求應該是 `POST /api/gemini`（不是直接呼叫 Google API）
- ✅ Request Headers 中**完全看不到** API Key
- ✅ Response 只包含 `{ "text": "..." }`

### 3. 查看 Serverless Function 執行日誌（排除問題用）

如果遇到問題（例如 500 錯誤），可以查看函數的執行日誌：

**方式 A：使用 Vercel 網頁介面**

1. 進入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊你的專案名稱
3. 點擊 **Deployments** 頁籤
4. 找到最新的部署，點擊進入
5. 點擊 **Functions** 頁籤，選擇 `api/gemini`
6. 查看 **Logs** 區域，看執行時的錯誤訊息

**方式 B：使用 Vercel CLI（更即時）**

```bash
# 查看即時日誌
vercel logs --follow

# 或查看過去 1 小時的日誌
vercel logs --since 1h

# 查看特定函數的日誌
vercel logs api/gemini
```

### 常見的部署錯誤及解決方案

| 錯誤 | 原因 | 解決方案 |
|---|---|---|
| 500 Internal Server Error | 環境變數未設定或 API Key 無效 | 在 Vercel Settings → Environment Variables 確認 `GEMINI_API_KEY` 已設定 |
| 404 Not Found | Serverless Function 未被正確部署 | 檢查 `api/gemini.ts` 是否在專案根目錄，檢查 `vercel.json` rewrites 設定 |
| CORS 錯誤 | 前端和後端來源不同 | 這個不應該出現。確認你的前端呼叫的是 `/api/gemini`（相對路徑），而不是絕對 URL |
| 請求超時 | Gemini API 呼叫太慢 | Vercel 的預設超時是 300 秒，應該足夠。檢查網路連線或 Gemini API 狀態 |

---

## 了解 Vercel 的自動部署（CI/CD）

設定完成後，Vercel 會幫你自動處理後續的部署：

```
你修改程式碼
    ↓
git push 到 GitHub main 分支
    ↓
Vercel 自動偵測到有新的 push
    ↓
自動執行 build 並重新部署
    ↓
線上網站自動更新！
```

**你完全不需要再手動執行任何部署指令！**

---

## 環境變數管理進階

### 不同環境的環境變數

Vercel 支援針對不同環境設定不同的環境變數：

| 環境 | 用途 | 何時使用 |
|---|---|---|
| Production | 正式上線環境 | `main` 分支或手動 `vercel --prod` |
| Preview | 預覽環境 | 其他分支或 PR 預覽 |
| Development | 本機開發環境 | 本機 `vercel dev` |

### 透過 CLI 管理環境變數

```bash
# 列出所有環境變數
vercel env list

# 拉取 Vercel 上的環境變數到本機 .env
vercel env pull

# 新增環境變數（互動式）
vercel env add GEMINI_API_KEY

# 移除環境變數
vercel env remove GEMINI_API_KEY

# 查看特定環境變數
vercel env view GEMINI_API_KEY
```

> 💡 **提示**：`vercel env pull` 可以讓你快速將 Vercel 上的環境變數同步到本機，方便在不同電腦上開發。

---

## 可選：加入 GitHub Actions CI（自動化測試）

如果你想要在每次 push 時自動執行型別檢查，可以在專案中建立以下檔案：

```bash
mkdir -p .github/workflows
```

建立 `.github/workflows/ci.yml`：

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build & Type Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: TypeScript type check
        run: npm run lint

      - name: Build project
        run: npm run build
```

### GitHub Actions 的作用

| 步驟 | 說明 |
|---|---|
| `checkout` | 下載你的程式碼 |
| `setup-node` | 安裝 Node.js 20 環境 |
| `npm install` | 安裝所有依賴套件 |
| `npm run lint` | 執行 TypeScript 型別檢查（`tsc --noEmit`） |
| `npm run build` | 確認專案可以成功編譯 |

> **💡 CI（持續整合）的好處**：  
> 每次有人 push 程式碼，GitHub Actions 都會自動測試。  
> 如果有型別錯誤或編譯失敗，你會馬上在 GitHub 上看到紅色警告。

---

## 常見問題 (FAQ)

### ❓ 如果我已經用 `vercel --prod` 建立了專案，可以「砍掉重練」，完全從網頁版重新建立一次嗎？

**當然可以！** 如果你想完整體驗初學者最常使用的「從網頁版 Vercel 匯入 GitHub Repo」的乾淨流程，你可以這樣把現有的連結切斷並重置：

1. **刪除雲端專案**：到 Vercel Dashboard 找到並點進你的專案 ➔ 點右上角 **Settings** ➔ 左側選單拉到最底點擊 **Advanced** ➔ 滑到最下方點擊 **Delete Project** 把它刪除。
2. **刪除本機綁定**：在你的專案終端機執行 `rm -rf .vercel`（Mac 系統）或用檔案總管直接刪除這包程式碼裡隱藏的 `.vercel` 資料夾。這會解除你電腦與剛剛刪除的雲端專案的綁定。
3. **重新開始**：接下來你只要把程式碼 `git push` 到 GitHub，然後直接前往 [https://vercel.com/new](https://vercel.com/new) 點選 Import 你的 Repository，就能跑完一套全新且標準的網頁版專案建立流程了！

---

## 整個學習路徑的總結

恭喜你完成了全部四個範例！回顧一下這個轉換過程：

```
AI Studio 原始版（不安全）
│
│  範例 0：安裝 Vercel CLI，複製原始專案
│  範例 1：建立 api/gemini.ts，移除前端 SDK，設定 .env
│  範例 2：修改 App.tsx，改為呼叫 /api/gemini
│  範例 3：設定 vite.config.ts 的 proxy，本機測試
│  範例 4：部署到 Vercel，設定雲端環境變數
│
Serverless 安全版（完成！）
```

### 你學會了什麼？

| 技能 | 學習範例 |
|---|---|
| Vercel CLI 安裝與使用 | 範例 0 |
| Serverless Function 概念與撰寫 | 範例 1 |
| 環境變數的安全管理 | 範例 1 |
| 前端 fetch API 呼叫自訂端點 | 範例 2 |
| Vite Dev Server 的 proxy 設定 | 範例 3 |
| 本機模擬 Serverless 環境 | 範例 3 |
| 部署到 Vercel 雲端 | 範例 4 |
| GitHub Actions CI/CD | 範例 4 |

---

## 部署後的最佳實踐

### 1. 監控部署狀態

每次 `git push` 到 GitHub 後，Vercel 會自動進行部署。你可以：

```bash
# 查看部署歷史
vercel deployments

# 查看即時部署進度
vercel logs --follow
```

### 2. 設定部署前檢查（保護 main 分支）

建議在 GitHub 設定 Branch Protection Rule，要求所有 PR 都必須通過 CI 檢查才能合併：

1. 進入 GitHub Repository Settings
2. 點擊 **Branches**
3. 在 **Branch protection rules** 點 **Add rule**
4. Pattern name：填入 `main`
5. 勾選 **Require status checks to pass before merging**
6. 選擇 Vercel 的檢查項目
7. 儲存

這樣可以防止有問題的程式碼被合併到 main 分支。

### 3. 回滾部署

如果部署後發現有嚴重問題，可以快速回滾：

```bash
# 查看過去的部署
vercel deployments

# 重新部署舊版本（透過 Vercel Dashboard）
# Settings → Deployments → 找到要回滾的版本 → Redeploy
```

---

## 整合檢查清單：從本機到上線

```
✓ 本機開發與測試
  └─ npm run build 確認編譯無誤
  └─ npm run lint 確認型別檢查通過
  └─ vercel dev 確認本機功能正常

✓ 版本控制
  └─ .gitignore 正確保護敏感檔案
  └─ git push 上傳到 GitHub main

✓ Vercel 設定
  └─ Vercel 自動偵測並部署
  └─ 設定環境變數 GEMINI_API_KEY
  └─ 觸發重新部署以套用環境變數

✓ 線上測試
  └─ 訪問 Vercel URL，測試功能
  └─ 查看 DevTools Network，確認安全性
  └─ 檢查 Vercel Logs，確認無錯誤

✓ 持續部署
  └─ 未來 git push 會自動部署
  └─ 監控部署狀態與日誌
  └─ 設定 GitHub Branch Protection 保護品質
```

---

## ✅ 本步驟完成確認

- [ ] 已完成部署前的完整檢查清單
- [ ] 已將程式碼推送到 GitHub
- [ ] 已在 Vercel 匯入 Repository 並成功部署
- [ ] 已在 Vercel 設定 `GEMINI_API_KEY` 環境變數
- [ ] 已觸發重新部署以套用環境變數
- [ ] 線上網站可以正常呼叫 AI 並顯示回應
- [ ] 已驗證 DevTools 中看不到 API Key
- [ ] 已查看過 Vercel Logs，確認函數執行無誤
- [ ] （可選）已建立 `.github/workflows/ci.yml` 並推送到 GitHub
- [ ] （可選）已設定 GitHub Branch Protection Rule

---

[上一範例：範例 3 - 本機測試與 Vite Proxy 設定](範例3-本機測試與ViteProxy設定.md) | [回到主題](主題.md)
