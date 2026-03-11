# 範例 2：常用 npm 指令

## 目標

掌握開發時最常用的 npm 指令。

---

## 步驟 1：安裝依賴

```bash
npm install
```

**說明**：根據 `package.json` 下載所有依賴到 `node_modules/`。

**何時使用**：剛 clone 專案、或新增套件後。

---

## 步驟 2：執行腳本

```bash
npm run dev
npm run build
npm run preview
```

**說明**：執行 `package.json` 中 `scripts` 裡定義的指令。

| 指令 | 常見用途 |
|------|----------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 建置生產版本 |
| `npm run preview` | 預覽建置結果 |

---

## 步驟 3：查看已安裝的套件

```bash
npm list
```

**說明**：列出專案中安裝的套件及其版本。

---

## 完成

這些指令在開發過程中會經常使用。

[下一範例：範例 3 - 安裝套件](範例3-安裝套件.md)
