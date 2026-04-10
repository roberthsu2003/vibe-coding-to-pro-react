# 範例 0：認識 Vercel CLI 與本機開發環境

## 目標

在開始修改程式碼之前，我們先來了解 **Vercel CLI** 是什麼，以及為什麼在開發 Serverless Function 時需要它。  
本步驟不需要修改任何程式碼，只需要完成安裝與設定。

---

## 為什麼需要 Vercel CLI？

當你在本機執行 `npm run dev`（Vite Dev Server）時，它只負責處理**前端**的 React 程式碼。

問題來了：`api/gemini.ts` 這個 Serverless Function 放在 Vercel 的雲端伺服器執行，**本機的 Vite 完全不知道怎麼執行它！**

> 你的前端呼叫 `/api/gemini`，但本機根本沒有東西在回應這個路徑。

**Vercel CLI** 的 `vercel dev` 指令就是解決這個問題的工具：

| 指令 | 說明 |
|---|---|
| `npm run dev` | 啟動 Vite Dev Server（前端，port 3000） |
| `vercel dev` | 在本機模擬 Vercel 伺服器，執行 Serverless Function（port 3001） |

你需要**同時執行兩者**，讓前端的 `/api/*` 請求能被代理到 Vercel CLI 模擬的伺服器。

```
瀏覽器 → Vite (port 3000) → [proxy] → Vercel dev (port 3001) → api/gemini.ts
```

---

## 步驟 1：安裝 Vercel CLI

打開終端機，執行以下指令，將 Vercel CLI 安裝到你的電腦（全域安裝）：

```bash
npm install -g vercel
```

安裝完成後，確認版本：

```bash
vercel --version
```

你應該會看到類似這樣的輸出：

```
Vercel CLI 39.x.x
```

> **💡 什麼是全域安裝（`-g`）？**  
> 加上 `-g` 代表安裝到你的系統，而不是某個特定專案。  
> 安裝完後，在任何資料夾都可以執行 `vercel` 指令。

---

## 步驟 2：登入 Vercel 帳號

Vercel CLI 需要登入你的帳號才能使用。執行：

```bash
vercel login
```

CLI 會問你要用哪種方式登入，選擇 **GitHub**（推薦）或 Email 皆可：

```
? Log in to Vercel
  ● Continue with GitHub
  ○ Continue with GitLab
  ○ Continue with Bitbucket
  ○ Continue with Email
  ○ Continue with SAML Single Sign-On
```

登入後，瀏覽器會開啟確認頁面，授權後回到終端機即有成功訊息。

> ✅ 如果你還沒有 Vercel 帳號，請先到 [https://vercel.com/signup](https://vercel.com/signup) 免費註冊。  
> 使用 GitHub 帳號登入即可，完全免費。

---

## 步驟 3：認識 Vercel CLI 的常用指令

| 指令 | 用途 |
|---|---|
| `vercel login` | 登入 Vercel 帳號 |
| `vercel dev` | 在本機啟動 Vercel 模擬環境（含 Serverless Function） |
| `vercel` | 部署到 Vercel 預覽環境（Preview） |
| `vercel --prod` | 部署到 Vercel 正式環境（Production） |
| `vercel env pull` | 將 Vercel 上設定的環境變數下載到本機 `.env.local` |
| `vercel link` | 將本機專案連結到 Vercel 上的專案 |

在本單元的學習過程中，主要會用到 **`vercel dev`** 和 **`vercel --prod`**。

---

## 步驟 4：複製原始專案

我們將以 `ai_studio_專案來源/gemini-一句話問答` 為基礎進行修改。  
**請不要直接修改原始版本**，先將它複製一份：

### 方法：在終端機執行複製指令

進入 `Serverless_後端` 資料夾，執行：

```bash
# 進入 Serverless_後端 資料夾
cd Serverless_後端

# 複製原始專案，取名為 my-serverless-app（或你喜歡的名字）
cp -r ai_studio_專案來源/gemini-一句話問答 my-serverless-app
```

> **💡 提醒**：`my-serverless-app` 只是本練習用的工作資料夾名稱，
> 你可以換成自己喜歡的名字。後續範例都以此名稱為例。

---

## 步驟 5：進入專案並安裝依賴

```bash
cd my-serverless-app
npm install
```

完成安裝後，確認目前的目錄結構：

```
my-serverless-app/
├── src/
│   ├── App.tsx      ← 目前直接呼叫 Gemini API（待修改）
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts   ← 目前將 API Key 注入前端（待修改）
```

---

## 步驟 6：了解目前版本的問題

打開 `src/App.tsx`，找到這段程式碼：

```typescript
// ⚠️ 危險！API Key 被注入到前端 JavaScript 中
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });
const result = await ai.models.generateContent({ ... });
```

再打開 `vite.config.ts`，找到：

```typescript
// ⚠️ 危險！這樣做會把 Key 編譯進前端的 JS bundle 中
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
},
```

> **❌ 這個做法的問題**：
> Vite 的 `define` 設定會在 build 時，把 Key 的值**直接寫死**在 JavaScript 檔案裡。
> 任何人打開 Chrome DevTools → Sources → 搜尋 `AIzaSy`，就能找到你的 Key！

我們接下來的三個範例，就是要一步一步把這個問題修復。

---

## ✅ 本步驟完成確認

- [ ] 已安裝 Vercel CLI：`vercel --version` 可正常執行
- [ ] 已登入 Vercel 帳號：`vercel login` 完成
- [ ] 已複製原始專案到工作資料夾 `my-serverless-app`
- [ ] 理解目前版本的安全問題（API Key 曝露在前端）

---

[下一範例：範例 1 - 建立 Serverless Function 與環境變數](範例1-建立ServerlessFunction.md)
