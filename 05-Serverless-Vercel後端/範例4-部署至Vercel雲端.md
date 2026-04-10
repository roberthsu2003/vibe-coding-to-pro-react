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

## 方法一：透過 Vercel CLI 部署（指令行）

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

---

## 方法二：透過 Vercel 網頁介面部署（推薦初學者）

### 步驟 1：將專案推送到 GitHub

```bash
# 初始化 Git（如果還沒有）
git init
git add .
git commit -m "feat: 轉換為 Vercel Serverless 架構"

# 建立 GitHub Repository 並推送
# （先在 GitHub 網站建立新的 Repository，再執行以下指令）
git remote add origin https://github.com/你的帳號/gemini-qa-app.git
git push -u origin main
```

### 步驟 2：在 Vercel 匯入 GitHub Repository

1. 前往 [https://vercel.com/new](https://vercel.com/new)
2. 點選「Import Git Repository」
3. 授權 Vercel 存取你的 GitHub
4. 找到剛剛推送的 Repository，點選「Import」

### 步驟 3：設定部署選項

在 Vercel 的部署設定頁面：

```
Framework Preset: Vite           ← Vercel 通常會自動偵測
Build Command:    npm run build  ← 保持預設
Output Directory: dist           ← 保持預設
```

> **不需要修改任何設定**，Vercel 會自動偵測到這是 Vite 專案。

### 步驟 4：設定環境變數（最重要！）

在部署設定頁面，找到「Environment Variables」區塊，新增：

```
Name:  GEMINI_API_KEY
Value: 貼上你的真實 Gemini API Key
```

> ⚠️ **這步驟非常關鍵！**  
> 如果沒有設定環境變數，Serverless Function 就無法讀取 Key，  
> 所有 AI 請求都會回傳 500 錯誤。

### 步驟 5：點選「Deploy」

Vercel 會自動：
1. 從 GitHub 下載你的程式碼
2. 執行 `npm install`
3. 執行 `npm run build`（產生前端靜態檔案）
4. 部署靜態檔案到全球 CDN
5. 部署 `api/gemini.ts` 為 Serverless Function

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
