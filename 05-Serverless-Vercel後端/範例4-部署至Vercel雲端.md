# 範例 4：部署至 Vercel 雲端

## 目標

恭喜你！完成前三個範例後，你的專案已經：
- ✅ 有了安全的 Serverless Function（`api/gemini.ts`）
- ✅ 前端改為呼叫 `/api/gemini`
- ✅ 可以在本機正常測試

現在，是時候將它部署到 **Vercel 雲端**，讓全世界都可以使用你的 AI 應用程式了！

---

## 部署前的準備工作

### 確認 `.gitignore` 正確設定

在部署前，務必確認以下檔案**不會**被上傳到 GitHub：

```
# .gitignore（應包含的內容）
node_modules/
dist/
.env*        ← 保護所有 .env 開頭的檔案（含你的 API Key）
!.env.example ← 但允許 .env.example 上傳（範本，無真實 Key）
.vercel       ← Vercel CLI 產生的暫存設定，不需上傳
```

### 確認 `vercel.json` 存在

在範例 3 中我們介紹了使用 `vercel.json` 來幫助解析 `/api` 請求與防止 React 前端路由出現 404 問題。請確保你的專案根目錄擁有此設定檔：

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

### 確認 `.env.example` 已更新

更新 `.env.example`，讓其他人知道需要哪些環境變數：

```bash
# .env.example
# Gemini 一句話問答 - GEMINI_API_KEY 只存在伺服器端
# 請複製此檔案為 .env，並填入您的 Gemini API Key
# 注意：.env 已加入 .gitignore，不會被上傳至 GitHub

GEMINI_API_KEY="請填入您的 Gemini API Key"
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

## ✅ 本步驟完成確認

- [ ] `.gitignore` 已正確保護 `.env`
- [ ] 已將程式碼推送到 GitHub
- [ ] 已在 Vercel 匯入 Repository 並成功部署
- [ ] 已在 Vercel 設定 `GEMINI_API_KEY` 環境變數
- [ ] 線上網站可以正常呼叫 AI 並顯示回應
- [ ] （可選）已建立 `.github/workflows/ci.yml` 並推送到 GitHub

---

[上一範例：範例 3 - 本機測試與 Vite Proxy 設定](範例3-本機測試與ViteProxy設定.md) | [回到主題](主題.md)
