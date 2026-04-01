# 範例：認識 Node、npm 與最小專案

## 目的

在終端機確認 Node／npm 已安裝，並用一個**最小**的 `package.json` 練習執行腳本與對照指令差異。

## 事前準備

- 已安裝 [Node.js](https://nodejs.org/)（建議 **LTS**：長期支援、較穩定；安裝後會一併取得 **npm**）。

---

## 步驟一：檢查版本

```bash
node -v
npm -v
```

應看到類似 `v20.x.x` 與 `10.x.x`。

---

## 步驟二：進入範例目錄

範例在 [範例/最小專案](./範例/最小專案/)（路徑請依你的電腦調整）：

```bash
cd 路徑/00-Node.js與npm/範例/最小專案
```

---

## 步驟三：執行（三種方式擇一即可）

此範例未安裝第三方套件，**不必**先執行 `npm install`。

| 方式 | 指令 | 說明 |
|------|------|------|
| npm 捷徑 | `npm start` | 等同 `npm run start`，執行 `scripts.start` |
| npm 自訂腳本 | `npm run hello` | 自訂名稱必須加 `run`，執行 `scripts.hello` |
| 繞過 npm | `node index.js` | 直接請 Node 執行檔案，不依賴 `scripts` |

預期終端機印出：`Hello from Node.js`（內容見 `index.js`）。

---

## 步驟四：對照 `package.json`

打開同目錄的 `package.json`，已含 **`"type": "module"`**（與本講義 **React + Vite** 專案相同，採 **ES Module**），`scripts` 如下：

```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "hello": "node index.js"
  }
}
```

### npm 與 `scripts` 怎麼對起來？

| 你想做的事 | 怎麼做 | 記住一句話 |
|------------|--------|------------|
| 執行 **`start`** | `npm start`（或 `npm run start`） | `start`、`test` 等少數名稱有**約定捷徑**，可省略 `run`。 |
| 執行 **`hello`** | **`npm run hello`** | 自訂名稱一律 **`npm run 名稱`**。 |
| 在終端打 **`npm hello`** | **不行** | `hello` 不是 npm 內建指令；不會自動對到 `scripts.hello`。 |
| 裝套件 | `npm install` … | 這是 npm **內建功能**，與執行 `scripts` 無關。 |

其他常見自訂腳本（如 `build`、`dev`）也是 **`npm run build`、`npm run dev`**。

### 其他欄位（本範例若日後擴充）

- **`name` / `version`**：發佈套件時會用到；教學專案常加 **`"private": true`** 避免誤發佈。

---

## 延伸

- **接著深入 `package.json` 與依賴** → [範例 2：認識 package.json](範例2-認識package.json.md)
- **要實際安裝 TypeScript 並練習 `tsc`** → [00 - HTML／CSS／Node／TypeScript](../00-HTML-CSS-Node-TypeScript/README.md)

---

[回到本章 README](README.md)
