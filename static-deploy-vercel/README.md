# 將靜態網頁部署至Vercel

> **注意：** 本篇教學適用於以 **Vite** 作為打包工具的 React 靜態專案。若您的專案並非透過 Vite 建立，請先考慮將專案遷移至 Vite 環境，再依照本篇進行部署。Vercel 對 Vite 有完美的內建支援，部署過程非常直覺且自動化。

---

## 1. 練習專案：雙班競賽計時器

為了進行部署練習，我們提供了一個基於 Vite + React + TypeScript 所寫的「雙班競賽計時器」網頁小工具。

### 🤖 原始生成 Prompt 參考
```text
請用 vite-react-typescript 做單一網頁：
1. 兩個獨立計時器，給兩班比賽同時計時；
2. 每組有開始、暫停、重設；
3. 時間用 MM:SS（或 HH:MM:SS）、字大易讀；
4. 兩組互不干擾；
5. 不需後端。
請給完整程式碼與簡短操作說明。
```

### 📁 專案檔案下載

- [📥 google_ai_studio_雙班競賽計時器專案ZIP檔)](./ai_studio_專案來源/dual-competition-timers.zip)
- [💻 雙班競賽計時器原始碼](./ai_studio_專案來源/dual-competition-timers/)

### 📂 專案架構參考

```text
dual-competition-timers/
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── components/
        └── Timer.tsx
```

---

## 2. 本機端開發與測試

開始修改設定前，請先透過 AI 編輯器將專案 Clone 下來或在終端機中開啟目標資料夾，並確保專案在本地端能正常運行：

```bash
# 安裝所有依賴套件
npm install

# 啟動開發用伺服器進行測試
npm run dev
```

確認網頁能順利呈現且功能正常後，我們再進行後續的部署動作。

---

## 3. 部署方法一：連結 GitHub 儲存庫 (推薦)

這是最常見且自動化的部署方式。將專案推送到 GitHub 後，只需在 Vercel 網頁介面上進行授權綁定，未來每次將程式碼推送到 `main` 分支時，Vercel 都會自動為您重新建置並部署。

### 3-1 將程式碼上傳至 GitHub

在開始部署之前，請確保您的程式碼已經上傳至 GitHub 儲存庫。

1. 在 GitHub 上建立一個新的 Repository。
2. 在本地專案終端機中執行：
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/<您的帳號>/<儲存庫名稱>.git
   git push -u origin main
   ```

### 3-2 在 Vercel 匯入專案

1. 前往 [Vercel 官網](https://vercel.com/) 並註冊或登入（建議直接使用 GitHub 帳號授權登入）。
2. 進入 Vercel 的 Dashboard（儀表板）後，點擊右上角的 **"Add New..."** 按鈕，然後選擇 **"Project"**。
3. 在左側的 "Import Git Repository" 區塊中，找到您剛才建立的 GitHub 儲存庫，點擊旁邊的 **"Import"** 按鈕。
   *(如果您沒有看到您的專案，請點擊下方的 "Adjust GitHub App Permissions" 來授權 Vercel 存取您的儲存庫)*

### 3-3 確認設定並部署

Vercel 系統非常聰明，它會自動偵測到您的專案是使用 **Vite** 框架建置的。

1. 在 Configure Project 頁面，您會看到 **Framework Preset** 已自動被設定為 `Vite`。
2. **Build and Output Settings**（建置與輸出設定）保留預設值即可，**不需任何修改**：
   - Build Command: `npm run build` 或 `vite build`
   - Output Directory: `dist`
3. 直接點擊下方的 **"Deploy"** 藍色按鈕。
4. 等待大約幾十秒鐘，建置完成後您就會看到灑花特效！點擊畫面上的預覽截圖或 "Continue to Dashboard" 即可取得您專屬的公開網址。

---

## 4. 部署方法二：使用 Vercel CLI 終端機指令

如果您喜歡直接在開發環境（如 VS Code 的終端機）中操作，或者您的專案沒有放在 GitHub 上，也可以直接使用 Vercel 提供的手動命令列工具 (CLI) 來進行部署。

### 4-1 安裝 Vercel CLI

首先，您需要在電腦上全域安裝 Vercel CLI 工具：

```bash
npm install -g vercel
```

### 4-2 登入 Vercel 帳號

安裝完成後，在終端機執行登入指令：

```bash
vercel login
```

終端機會提供幾個登入選項（例如：Continue with GitHub, Continue with Email 等），請使用鍵盤方向鍵選擇並按下 Enter。接著系統會自動開啟瀏覽器讓您完成登入授權。

### 4-3 執行部署

確認終端機目前位於您的專案根目錄中（例如 `dual-competition-timers/`），輸入以下指令開始部署：

```bash
vercel
```

接下來，終端機會詢問您幾個設定問題，您可以直接依照以下範例回答（多數選項直接按 Enter 使用預設值即可）：

```text
? Set up and deploy "~/your-project-path"? [Y/n] Y
? Which scope do you want to deploy to? (選擇您的帳號)
? Link to existing project? [y/N] N
? What's your project's name? (輸入您想要的專案名稱，或直接 Enter 使用當前資料夾名稱)
? In which directory is your code located? ./ (直接 Enter)
? Auto-detected Project Settings (Vite):
  - Build Command: vite build
  - Development Command: vite
  - Install Command: yarn install, pnpm install, npm install, or bun install
  - Output Directory: dist
? Want to modify these settings? [y/N] N
```

回答完畢後，Vercel CLI 就會開始將您的專案原始碼上傳至雲端並進行建置。完成後，終端機會提供一串 **Preview URL (預覽網址)** 供您測試。

### 4-4 發佈至正式環境 (Production)

剛剛使用 `vercel` 指令部署的網址屬於 Preview（預覽）測試環境。如果您確認網頁各項功能皆運作正常，想要將其發佈為正式版本 (Production)，請執行以下指令：

```bash
vercel --prod
```

系統同樣會上傳並建置，完成後提供給您的網址將會是簡潔、不帶隨機雜湊碼的正式生產環境網址！

---

## 5. 常見問題：使用 React Router 導致的 404 錯誤 (SPA 路由設定)

如果您在專案中使用了 `react-router-dom` 的 `BrowserRouter`，您可能會發現：
- 透過網頁內的連結跳轉頁面很正常。
- 但是**直接在瀏覽器輸入子路徑（例如：`https://您的網址/about`）或是在子頁面重新整理時，會出現 404 Not Found 錯誤。**

這是因為 Vercel 預設會去尋找對應路徑的實體 HTML 檔案（例如 `/about/index.html`），但我們的 React 單頁應用程式 (SPA) 實際上只有一個 `index.html`。

### 解決方案：新增 `vercel.json` 設定檔

要解決這個問題非常簡單，只需在您的**專案根目錄**（與 `package.json` 檔案同層）建立一個名為 `vercel.json` 的檔案，並輸入以下內容：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

這段設定會告訴 Vercel：「無論使用者存取什麼路徑，都一律將請求重新導向給 `index.html`」，接著 React Router 就會自動接手並渲染對應的元件。加上這個檔案後，重新推送程式碼或重新部署，404 的問題就能迎刃而解！

---

## 💡 總結與比較

將 Vite 專案部署到 Vercel 是一件非常輕鬆愉快的事。與傳統部署到 GitHub Pages 相比，Vercel 有以下幾點優勢：
1. **零配置 (Zero Configuration)**：**不需要** 修改 `vite.config.ts` 中的 `base` 或 `outDir` 設定。
2. **無需寫自動化腳本**：**不需要** 自己撰寫與設定 GitHub Actions 的 YAML 檔案，Vercel 原生支援自動化 CI/CD。
3. **完美支援單頁應用 (SPA)**：如果您的專案有使用到 React Router (例如 `BrowserRouter`)，只需新增一個簡單的 `vercel.json` 設定檔，Vercel 就能完美處理所有的路由轉發。
