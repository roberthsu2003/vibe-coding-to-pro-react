# 範例 2：認識 vite.config

## 目標

了解 `vite.config.ts` 的用途與常見設定。

---

## 步驟 1：找到設定檔

在專案根目錄找到 `vite.config.ts`，用編輯器開啟。

---

## 步驟 2：基本結構

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**說明**：

- `defineConfig`：Vite 的設定函式
- `plugins: [react()]`：啟用 React 外掛，讓 Vite 能處理 JSX

---

## 步驟 3：常見設定（選讀）

| 設定 | 說明 |
|------|------|
| **plugins** | 外掛列表，如 React、Vue |
| **base** | 部署的基礎路徑，預設 `/` |
| **server.port** | 開發伺服器埠號，預設 5173 |

範例：修改埠號

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

---

## 完成

初學時通常不需改 vite.config，知道它的用途即可。

[下一範例：範例 3 - 開發與建置流程](範例3-開發與建置流程.md)
