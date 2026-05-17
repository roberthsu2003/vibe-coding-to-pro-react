# Vercel 簡介：現代化前端與 Serverless 部署平台

[**Vercel 資訊圖表**](./images/vercel簡介.png)

[Vercel](https://vercel.com/) 是一個專為前端開發者打造的雲端部署平台，提供直覺的開發者體驗（Developer Experience, DX），讓您能輕鬆將網站與應用程式部署到全球節點上。

---

## 為什麼選擇 Vercel？

Vercel 不只是靜態網頁託管，它更內建了強大的後端能力，是一種輕量級的 **BaaS（後端即服務）** 解決方案。對初學者與個人開發者，Vercel 提供慷慨的 **Hobby（免費）方案**，涵蓋以下核心功能：

---

## 免費核心功能一覽

### 1. Serverless Functions（無伺服器函式）

在專案的 `api/` 資料夾撰寫後端程式碼（Node.js、Python 等），Vercel 自動將其轉為獨立 API 節點。

| 項目 | 說明 |
|------|------|
| 支援語言 | Node.js 24、Python 3.13/3.14、Bun、Rust |
| 預設逾時 | 300 秒 |
| 免費優勢 | 無需租主機、不用維護伺服器 |

---

### 2. Fluid Compute（流體運算）

Vercel 目前主推的運算模式，取代舊有的 Edge Runtime。

- **跨請求重複使用函式實例**，大幅降低冷啟動延遲
- 支援完整 **Node.js** 環境（相較 Edge Functions 相容性更佳）
- 部署在距離使用者最近的伺服器節點執行
- 與 Serverless Functions 相同價格，但效能更好

> **注意**：舊文件常提到「Edge Runtime」，但 Vercel 官方現在建議改用 Fluid Compute，Edge Functions 有相容性限制，不再是首選。

---

### 3. Vercel Storage（儲存方案）

透過 Vercel Marketplace，可一鍵整合多種儲存服務：

| 服務 | 用途 | 免費額度 |
|------|------|----------|
| **Vercel Blob** | 物件儲存（圖片、靜態檔案），支援公開與私有 | 有 |
| **Upstash Redis** | 高頻存取快取、計數器、API 限流 | 有 |
| **Neon Postgres** | 全功能關聯式資料庫 | 有 |

---

### 4. Image Optimization（圖片最佳化）

搭配 Next.js 使用時，Vercel 在雲端自動處理圖片：

- 自動壓縮、轉換為 WebP 格式並快取
- Hobby 方案每月免費提供 **1,000 張**來源圖片最佳化
- 節省頻寬、提升頁面載入速度

---

### 5. 自動化 CI/CD 與 Vercel CLI

**GitHub 自動部署**

只要將 GitHub 儲存庫授權給 Vercel，每次 `git push` 後 Vercel 會自動：

1. 安裝套件
2. 打包專案
3. 發佈到全球節點

**Vercel CLI**

```bash
# 安裝
npm install -g vercel

# 本機模擬雲端環境（含 Serverless Functions 與環境變數）
vercel dev

# 部署到預覽環境
vercel

# 部署到正式環境
vercel --prod
```

---

## 安全的環境變數管理

開發 AI 功能時，API Key（如 OpenAI 金鑰）必須妥善保護。Vercel 提供：

- **後台介面**：在 Vercel Dashboard 安全儲存金鑰
- **自動注入**：金鑰自動注入至 Serverless Functions，前端無法存取
- **CLI 指令**：透過 `vercel env pull` 同步到本機 `.env.local`

```bash
# 查看環境變數
vercel env ls

# 拉取到本機
vercel env pull .env.local
```

---

## 如何開始？

1. 前往 [Vercel 官網](https://vercel.com/)
2. 點擊右上角「**Sign Up**」
3. 使用 **GitHub 帳號直接登入**
4. 匯入 GitHub 儲存庫，即可立刻部署！

---

## 本課程使用到的 Vercel 功能

| 章節 | 功能 |
|------|------|
| `05-Serverless-Vercel後端/` | Serverless Functions、Vercel CLI |
| `07-Next.js/` | Image Optimization、環境變數 |
| `10-Next.js-Vercel生態系/` | Blob 儲存、Upstash Redis、Fluid Compute |
| `static-deploy-vercel/` | 靜態網站部署流程 |
