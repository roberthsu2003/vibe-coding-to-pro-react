# 範例：認識 Node、npm 與最小專案

## 目的

在終端機中確認 Node／npm 已安裝，並用一個**最小**的 `package.json` 體驗 `npm run`。

## 事前準備

- 已安裝 [Node.js](https://nodejs.org/)（建議安裝 LTS（Long Term Support，長期支援）版本。**LTS 代表較穩定、官方長期維護的版本，適合大多數開發者使用。**安裝 Node.js 後會同時取得 `npm`。）

## 步驟一：檢查版本

在終端機執行：

```bash
node -v
npm -v
```

應看到類似 `v20.x.x` 與 `10.x.x` 的版本字串。

## 步驟二：開啟範例專案

範例檔案在 [範例/最小專案](./範例/最小專案/) 目錄。

在終端機進入該目錄（請依你的實際路徑調整）：

```bash
cd 路徑/00-Node.js與npm/範例/最小專案
```

## 步驟三：執行腳本

此範例**沒有**安裝第三方套件，因此不必執行 `npm install` 也能跑腳本：

```bash
npm start
```

或：

```bash
npm run hello
```

也可以**不經過 npm 腳本**，直接請 Node 執行檔案：

```bash
node index.js
```

預期終端機會印出 `Hello from Node.js`（內容見 `index.js`）。

## 步驟四：對照 `package.json` 與 npm 指令

打開 `範例/最小專案` 內的 `package.json`，`scripts` 大致如下：

```json
{
  "scripts": {
    "start": "node index.js",
    "hello": "node index.js"
  }
}
```

### 執行 `scripts` 的兩種寫法（重點）

| 類型 | 說明 |
|------|------|
| **約定捷徑** | 少數腳本名稱（常見如 **`start`、`test`**）可直接寫 **`npm start`、`npm test`**，效果等同 **`npm run start`、`npm run test`**。 |
| **其餘自訂名稱** | 在 `scripts` 裡自己取的名字（例如 **`hello`、`build`、`dev`**），一律使用 **`npm run 指令名`**。 |

> **補充**：`npm install` 等是 npm **內建功能**（安裝套件），不是透過 `scripts` 執行，與上表不同。

對照本範例：

| 你想做的事 | 可以怎麼寫 | 原因 |
|------------|------------|------|
| 執行 `hello` 這個自訂腳本 | `npm run hello` | `hello` 是在 `scripts` 裡定義的名稱，需透過 `npm run` 執行。 |
| 執行 `start` | `npm start` 或 `npm run start` | `start` 屬於 npm 約定好的捷徑之一，可直接寫 `npm start`（等同 `npm run start`）。 |
| 在終端機打 `npm hello` | **不行** | `hello` **不是** npm 內建子指令；npm 不會自動對應到 `scripts.hello`。 |

### 為什麼不能打 `npm hello`？

npm 內建只認得**固定幾類**常用指令（例如 `install`、`start`、`test`、`run`…），不會把你在 `scripts` 裡取的名字都變成頂層指令。因此：

- `start`、`test` 等有約定的，可用 **`npm start`、`npm test`** 這種簡寫。
- 其餘自訂名稱一律要加 **`run`**：

```bash
npm run hello
npm run build
npm run dev
```

### 簡單記法

- **`package.json` → `scripts` 裡自訂的名稱** → 用 **`npm run 指令名`**。
- **少數約定捷徑**（常見如 `start`、`test`）→ 可直接 **`npm start`、`npm test`**（仍可用 `npm run start` 等寫法）。

### 其他欄位

- **`name` / `version`**：之後若發佈套件會用到；教學專案通常設 `"private": true` 避免誤發佈。

## 若之後要裝套件

在同一目錄執行（舉例）：

```bash
# 安裝 TypeScript 套件到專案中，並加到開發用依賴（devDependencies）：
npm install typescript --save-dev
```

會出現 `node_modules/` 與更新後的 `package.json`／`package-lock.json`。本範例刻意保持最小，請在下一章 [00 - HTML／CSS／Node／TypeScript](../00-HTML-CSS-Node-TypeScript/README.md) 再實際安裝 TypeScript。

---

[回到本章 README](README.md)
