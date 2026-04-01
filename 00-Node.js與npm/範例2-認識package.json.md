# 範例 2：認識 package.json

## 目標

了解 `package.json` 的結構與各欄位意義。

---

## 步驟 1：開啟 package.json

在專案根目錄找到 `package.json`，用編輯器開啟。

---

## 步驟 2：認識基本欄位

```json
{
  "name": "my-react-app",
  "version": "0.0.0",
  "private": true
}
```

| 欄位 | 說明 |
|------|------|
| **name** | 專案名稱 |
| **version** | 版本號 |
| **private** | `true` 表示不發布到 npm |

---

## 步驟 3：認識 scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

- 用 `npm run dev` 執行 `"dev"` 對應的指令
- 用 `npm run build` 執行 `"build"` 對應的指令

---

## 步驟 4：認識 dependencies 與 devDependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "~5.6.3",
    "vite": "^5.4.11"
  }
}
```

| 欄位 | 說明 |
|------|------|
| **dependencies** | 執行時需要的套件，會打包進最終程式 |
| **devDependencies** | 開發時需要的套件，不會打包進生產版本 |

---

## 完成

理解 `package.json` 後，可進行 [範例 3：常用 npm 指令](範例3-常用npm指令.md)。
