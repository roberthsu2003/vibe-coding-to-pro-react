# 範例 1：Tailwind Play CDN 入門

## 目標

用**一個** `index.html`，透過 [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn) 在瀏覽器裡直接試 utility class，不必安裝 Node 或打包工具。

> **注意**：CDN 適合學習與快速原型；正式產品多半會用建置工具（例如 Vite）與 Tailwind 的完整設定，見官方文件與本講義後續章節。

## 步驟 1：建立 `index.html`

在 `<head>` 內加入 Play CDN 的 `<script>`（官方建議放在 `head`）。下方示範一個含標題、卡片式區塊與簡單 Flex 排版的頁面。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tailwind CDN 試作</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-slate-100 text-slate-900">
    <header class="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
      <h1 class="text-2xl font-bold tracking-tight">Tailwind 入門</h1>
      <p class="mt-1 text-sm text-slate-600">Utility class 直接寫在 HTML 上。</p>
    </header>

    <main class="mx-auto max-w-2xl px-4 py-8">
      <section
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
      >
        <h2 class="text-lg font-semibold text-slate-800">小卡片</h2>
        <p class="mt-2 text-slate-600">
          <code class="rounded bg-slate-100 px-1 py-0.5 text-sm">p-6</code>
          表示 padding、
          <code class="rounded bg-slate-100 px-1 py-0.5 text-sm">rounded-xl</code>
          表示圓角。
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800"
            >標籤 A</span
          >
          <span class="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-800"
            >標籤 B</span
          >
        </div>
      </section>
    </main>
  </body>
</html>
```

## 步驟 2：對照幾個概念（不深講）

| 你在 HTML 上看到的 | 大致在做什麼 |
|-------------------|-------------|
| `p-6`、`px-4`、`py-8` | 內距（padding），數字對應設計系統的刻度 |
| `text-2xl`、`font-bold` | 字級與字重 |
| `bg-slate-100`、`text-slate-600` | 背景與文字顏色（slate 為內建色票之一） |
| `flex`、`gap-2`、`flex-wrap` | Flexbox：橫向排列、間距、換行 |
| `max-w-2xl`、`mx-auto` | 最大寬度與水平置中 |
| `rounded-xl`、`shadow-md`、`border` | 圓角、陰影、邊框 |

完整列表以 [Tailwind 官方文件](https://tailwindcss.com/docs) 為準；初學時可先「改幾個 class 看畫面變化」，再查文件名稱。

## 步驟 3：在瀏覽器開啟

雙擊或用瀏覽器開啟 `index.html`。修改 class 後重新整理即可。

## 小結

- Tailwind 把樣式拆成大量**可組合的 utility**，寫在標籤的 `class` 裡。
- Play CDN 讓你在**沒有 Node** 的情況下先體驗語法；下一章 [00 - HTML + CSS + JavaScript](../00-HTML-CSS-JavaScript/README.md) 回到純三件套與 **ES Module** 的 JavaScript。
