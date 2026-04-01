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

預期終端機會印出 `Hello from Node.js`（內容見 `index.js`）。

## 步驟四：對照 `package.json`

打開 `package.json`，注意：

- **`scripts`**：`npm start` 其實是 `npm run start` 的簡寫（僅 `start` 有這個捷徑）。
- **`name` / `version`**：之後若發佈套件會用到；教學專案通常設 `"private": true` 避免誤發佈。

## 若之後要裝套件

在同一目錄執行（舉例）：

```bash
npm install typescript --save-dev
```

會出現 `node_modules/` 與更新後的 `package.json`／`package-lock.json`。本範例刻意保持最小，請在下一章 [00 - HTML／CSS／Node／TypeScript](../00-HTML-CSS-Node-TypeScript/README.md) 再實際安裝 TypeScript。

---

[回到本章 README](README.md)
