# 範例 1：建立 Serverless Function 與環境變數

## 目標

在這個範例中，我們要做兩件事：
1. 建立 `api/` 資料夾，並在其中建立 Serverless Function `api/gemini.ts`
2. 建立 `.env` 檔案，把 API Key 安全地存放在伺服器端

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

## 步驟 5：建立 `.env` 檔案（存放本機用的 API Key）

在專案**根目錄**建立 `.env` 檔案：

```bash
# 建立 .env 檔案（直接在編輯器新增或用指令）
touch .env
```

在 `.env` 中填入你的 Gemini API Key：

```bash
# .env
GEMINI_API_KEY="貼上你的 Gemini API Key"
```

> **🔑 如何取得 Gemini API Key？**  
> 前往 [Google AI Studio](https://aistudio.google.com/apikey) → 點選「Create API Key」→ 複製即可。

---

## 步驟 6：確認 `.gitignore` 已保護 `.env`

打開 `.gitignore`，確認有以下內容（缺少的話請手動加入）：

```
node_modules/
dist/
.env*
!.env.example
.vercel
```

> ⚠️ **這一步非常重要！**  
> `.env` 裡面有你的 API Key，絕對不能上傳到 GitHub。  
> `!.env.example` 是例外規則，允許 `.env.example` 上傳（因為它沒有真實 Key）。

---

## ✅ 本步驟完成確認

完成後，你的目錄結構應該是這樣：

```
my-serverless-app/
├── api/
│   └── gemini.ts     ← ✅ 新增
├── src/
│   └── App.tsx        （下一步驟才修改）
├── .env               ← ✅ 新增（含真實 Key，不上傳 Git）
├── .env.example       ← 範本檔案（上傳 Git）
├── .gitignore         ← ✅ 確認保護 .env
├── package.json       ← ✅ 已移除 @google/genai，加入 @vercel/node
└── vite.config.ts     （下一步驟才修改）
```

- [ ] `api/gemini.ts` 已建立，內容正確
- [ ] `@vercel/node` 已安裝（在 `devDependencies`）
- [ ] `@google/genai` 已從 `dependencies` 移除
- [ ] `.env` 已建立，填入真實的 API Key
- [ ] `.gitignore` 已確認保護 `.env`

---

[上一範例：範例 0 - 認識 Vercel CLI](範例0-認識VercelCLI.md) | [下一範例：範例 2 - 修改前端呼叫方式](範例2-修改前端呼叫方式.md)
