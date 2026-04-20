# 範例 1：建立 Serverless Function 與環境變數

## 目標

在這個範例中，我們要做兩件事：
1. 建立 `api/` 資料夾，並在其中建立 Serverless Function `api/gemini.ts`
2. 建立 `.env.local` 檔案，把 API Key 安全地存放在伺服器端

完成後，前端的 Key 曝露問題將被根本解決！

---

## 背景知識：Vercel 的「約定優於設定」

Vercel 有一個非常方便的設計規則：

> **只要你在專案根目錄建立 `api/` 資料夾，  
> 裡面的每一個 `.ts`、`.js` 檔案，都會自動成為一個 Serverless Function！**

| 檔案路徑 | 對應的 URL 端點 |
|---|---|
| `api/gemini.ts` | `/api/gemini` |
| `api/hello.ts` | `/api/hello` |
| `api/user/profile.ts` | `/api/user/profile` |

不需要任何額外設定，Vercel 會自動幫你處理所有事情。

---

## 步驟 1：建立 `api/` 資料夾

在你的 `my-serverless-app` 專案**根目錄**下，建立 `api` 資料夾：

```bash
mkdir api
```

目錄結構現在應為：

```
my-serverless-app/
├── api/              ← 🆕 新增此資料夾
├── src/
├── package.json
└── vite.config.ts
```

---

## 步驟 2：建立 `api/gemini.ts` Serverless Function

在 `api/` 資料夾中，建立 `gemini.ts` 檔案，內容如下：

```typescript
// api/gemini.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel Serverless Function - Gemini API 代理
 *
 * 🔐 安全原則：
 * - 前端只需呼叫 /api/gemini，完全不需要知道 GEMINI_API_KEY
 * - API Key 儲存在 Vercel 的環境變數中，只有這個函式可以讀取
 * - 函式接收前端傳來的 prompt，轉發給 Gemini API，再將結果回傳給前端
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ① 只允許 POST 方法（防止不當呼叫）
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ② 讀取伺服器端環境變數（前端完全無法存取！）
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "伺服器未設定 GEMINI_API_KEY" });
  }

  // ③ 取得前端傳來的 prompt
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "缺少 prompt 參數" });
  }

  try {
    // ④ 在伺服器端安全地呼叫 Gemini API（Key 不會外洩）
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // ← Key 只在這裡使用，不會傳到前端
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      return res.status(geminiRes.status).json({ error: errData });
    }

    const data = await geminiRes.json();

    // ⑤ 取出 Gemini 回覆的文字內容並回傳給前端
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "AI 沒有回傳內容。";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("[Gemini API Error]", err);
    return res.status(500).json({ error: "呼叫 Gemini API 時發生錯誤" });
  }
}
```

### 程式碼說明

| 步驟 | 說明 |
|---|---|
| ① `req.method !== "POST"` | 只接受 POST 請求，防止 GET 或其他方式的誤觸 |
| ② `process.env.GEMINI_API_KEY` | 讀取伺服器端環境變數，**前端完全無法讀到這個值** |
| ③ `req.body.prompt` | 接收前端傳來的問題文字 |
| ④ `fetch(...)` | 在伺服器端呼叫 Gemini API，Key 不會送到前端 |
| ⑤ 回傳 `{ text }` | 只將 AI 的回答文字回傳給前端 |

---

## 步驟 3：安裝 `@vercel/node` 型別套件

`@vercel/node` 提供了 `VercelRequest` 和 `VercelResponse` 的 TypeScript 型別定義，  
讓你在撰寫 Serverless Function 時有型別提示與檢查。

```bash
npm install -D @vercel/node
```

> **💡 為什麼用 `-D`？**  
> `@vercel/node` 只是 TypeScript 型別定義，在實際部署到 Vercel 時，  
> Vercel 的執行環境已經內建，不需要打包進去。因此放在 `devDependencies` 即可。

---

## 步驟 4：更新 `package.json` — 移除前端的 `@google/genai`

因為我們已經把 Gemini API 的呼叫移到 Serverless Function（伺服器端），  
前端的 React 程式碼不再需要 `@google/genai` 了。

打開 `package.json`，對照以下修改：

```json
// package.json（修改前）
{
  "dependencies": {
    "@google/genai": "^1.29.0",   ← 刪除這行
    "react": "^19.0.0",
    ...
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.2",
    ...
  }
}
```

```json
// package.json（修改後）
{
  "dependencies": {
    "react": "^19.0.0",
    ...
    // 已移除 @google/genai
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vercel/node": "^5.7.2",   ← 新增這行
    "typescript": "~5.8.2",
    ...
  }
}
```

修改完後，重新安裝依賴：

```bash
npm install
```

---

## 步驟 5：建立 `.env.local` 檔案（存放本機用的 API Key）

在專案**根目錄**建立 `.env.local` 檔案：

```bash
# 建立 .env.local 檔案（直接在編輯器新增或用指令）
touch .env.local
```

在 `.env.local` 中填入你的 Gemini API Key：

```bash
# .env.local
GEMINI_API_KEY="貼上你的 Gemini API Key"
```

> **🔑 如何取得 Gemini API Key？**  
> 前往 [Google AI Studio](https://aistudio.google.com/apikey) → 點選「Create API Key」→ 複製即可。

---

## 步驟 6：確認 `.gitignore` 已保護 `.env.local`

打開 `.gitignore`，確認有以下內容（缺少的話請手動加入）：

```
node_modules/
dist/
.env*
!.env.example
.vercel
```

> ⚠️ **這一步非常重要！**  
> `.env.local` 等檔案裡面有你的真實 API Key，絕對不能上傳到 GitHub。  
> `!.env.example` 是例外規則，允許 `.env.example` 上傳（因為它沒有真實 Key）。

---

---

## 進階：測試 Serverless Function

在測試這支 Serverless API 前，我們必須先啟動 Vercel 開發用伺服器。

### 測試步驟 A：啟動 Vercel 開發伺服器

請在專案的終端機執行以下指令：

```bash
vercel dev --listen 3001
```

<details open>
<summary>💡 `vercel dev` 是做什麼的？為什麼用 3001 port？</summary>

- **它是什麼**：你的本機電腦預設並不理解什麼是 Serverless Function。`vercel dev` 的作用就是在你電腦上**模擬建立一個 Vercel 雲端環境**，它會動態編譯並執行 `api/gemini.ts`，讓它變成一支可以接參數的真實 API。
- **為什麼指定 `--listen 3001` port？**：預設情況下，`vercel dev` 和很多前端框架（像是 React/Vite）都喜歡占用預設的 `3000` port。為了把「未來的前端 Vite 伺服器」跟現在這台「Vercel 後端模擬器」區分開來，我們手動把它跑在無人使用的 `3001` port 上，以避免未來的衝突。
</details>

### 👉 第一次執行的互動式問答與「預期中的紅字錯誤」

如果你是**第一次**在這個資料夾執行 `vercel dev`，CLI 會互動式地問你一些問題，請按照以下方式回答：

```text
? Set up and develop "~/你的專案路徑"? [Y/n] → 輸入 Y (或直接按 Enter)
? Which scope do you want to deploy to? → 選擇你的 Vercel 帳號
? Link to existing project? [y/N] → 輸入 N (我們要建立新專案)
? What's your project's name? → 直接按 Enter 使用預設名稱
? In which directory is your code located? → 直接按 Enter (預設為 ./)
```
回答完畢後，它會建立一個 `.vercel` 隱藏資料夾將專案綁定到你的帳號。

> 🚨 **重要：請忽略畫面上的 Vite 紅字錯誤！**
> 
> 啟動過程中，你的終端機**一定會噴出像這樣的紅字錯誤**：
> `Failed to resolve import "@google/genai" from "src/App.tsx"`
> 
> **這是完全正常且預期中的！**
> 因為我們在剛剛的步驟 4 移除了 `@google/genai` 套件，但我們**還沒有修改前端 `App.tsx`** 的程式碼（這是下個範例的工作）。Vite 前端啟動失敗完全不會影響我們 Vercel 後端 API 的獨立運作。

當終端機最下方顯示 `Ready! Available at http://localhost:3001` 時，代表後端 API 啟動成功。請讓它保持運作放著不管它，**開啟另一個新的終端機視窗** 來進行後續測試。

---

### 測試步驟 B：發送測試請求

#### 方法 1：使用 curl（指令列測試）

在第二個終端機視窗執行：

```bash
curl -X POST http://localhost:3001/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt":"TypeScript 是什麼？"}'

# 預期回應：
# {"text":"TypeScript 是 JavaScript 的超集，添加靜態型別檢查..."}
```

#### 方法 2：使用 Thunder Client 或 Postman（圖形化介面測試）

1. 開啟 Thunder Client（VS Code 延伸） 或 Postman
2. 建立新的 POST 請求
3. URL：`http://localhost:3001/api/gemini`（本機）或 `https://你的域名.vercel.app/api/gemini`（上線後）
4. Headers：`Content-Type: application/json`
5. Body：
   ```json
   {
     "prompt": "TypeScript 是什麼？"
   }
   ```
6. 點擊 Send，檢查回應

---

### 測試步驟 C：檢查驗證結果

| 項目 | 檢查方式 |
|---|---|
| 成功呼叫 | HTTP 狀態碼應為 200 ✓ |
| 有回應內容 | 回應中應有 `text` 欄位 ✓ |
| 沒有洩漏 Key | 整個請求過程中看不到 API Key ✓ |
| 錯誤處理 | 傳送無效的 prompt 時，應回傳 400 錯誤 ✓ |
| 驗證方法 | 使用 GET 方法時，應回傳 405 Method Not Allowed ✓ |

---

## ✅ 本步驟完成確認

完成後，你的目錄結構應該是這樣：

```
my-serverless-app/
├── api/
│   └── gemini.ts     ← ✅ 新增
├── src/
│   └── App.tsx        （下一步驟才修改）
├── .env.local         ← ✅ 新增（含真實 Key，不上傳 Git）
├── .env.example       ← 範本檔案（上傳 Git）
├── .gitignore         ← ✅ 確認保護 .env.local
├── package.json       ← ✅ 已移除 @google/genai，加入 @vercel/node
└── vite.config.ts     （下一步驟才修改）
```

- [ ] `api/gemini.ts` 已建立，內容正確
- [ ] `@vercel/node` 已安裝（在 `devDependencies`）
- [ ] `@google/genai` 已從 `dependencies` 移除
- [ ] `.env.local` 已建立，填入真實的 API Key
- [ ] `.gitignore` 已確認保護 `.env.local`
- [ ] （可選）已用 curl 或 Postman 測試函數，確認能成功呼叫 Gemini API

---

[上一範例：範例 0 - 認識 Vercel CLI](範例0-認識VercelCLI.md) | [下一範例：範例 2 - 修改前端呼叫方式](範例2-修改前端呼叫方式.md)
