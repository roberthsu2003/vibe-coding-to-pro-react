# 範例 2：建立 Vite 專案

## 目標

使用 Vite 建立一個 React + TypeScript 專案。

---

## 步驟 1：開啟終端機

切換到你想建立專案的資料夾，例如：

```bash
cd ~/Documents
```

---

## 步驟 2：執行建立指令

```bash
npm create vite@latest my-react-app -- --template react-ts
```

**說明**：

- `npm create vite@latest`：使用 Vite 建立工具
- `my-react-app`：專案資料夾名稱（可自行修改）
- `--template react-ts`：使用 React + TypeScript 模板

---

## 步驟 3：進入專案資料夾

```bash
cd my-react-app
```

---

## 步驟 4：安裝依賴套件

```bash
npm install
```

**說明**：會根據 `package.json` 下載 React、Vite、TypeScript 等套件到 `node_modules/`。

---

## 完成

專案已建立完成，接下來可學習 [範例 3：認識專案結構](範例3-認識專案結構.md)。
