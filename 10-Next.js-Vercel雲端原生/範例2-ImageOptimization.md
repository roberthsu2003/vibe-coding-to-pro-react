# 範例 2：Image Optimization — `<Image>` 元件

## 目標

學會使用 Next.js 的 **`<Image>`** 元件，讓 Vercel 自動處理圖片優化：
1. 自動轉換為 **WebP** 格式（檔案大小縮小 30%～80%）
2. 根據裝置螢幕尺寸輸出合適大小（響應式圖片）
3. **Lazy Loading**（滾動到可見區域才載入）
4. 防止 **CLS**（累積版面偏移，Cumulative Layout Shift）

---

## 背景知識：為什麼普通 `<img>` 不夠好？

學生常犯的錯誤：直接把手機拍的 5MB 照片放上網頁。

使用普通 `<img>` 的問題：
- 瀏覽器下載原始檔案（5MB），即使螢幕只有 400px 寬
- 使用者等待網路傳輸，網頁載入緩慢
- 圖片未設定尺寸 → 載入瞬間頁面跳動（CLS 問題）
- 沒有 Lazy Loading → 使用者還沒看到的圖片也佔用頻寬

Next.js 的 `<Image>` 元件搭配 Vercel，在圖片送到用戶端之前，自動完成以下工作：

```
原始圖片 (5MB PNG)
    ↓
Vercel Image Optimization
    ↓
WebP 格式 + 適合螢幕的尺寸 (200KB)
    ↓
用戶端接收
```

---

## 步驟 1：直接體驗兩者差異

本範例使用獨立頁面，避免覆蓋其他範例共用的首頁。請建立 `src/app/image-demo/page.tsx`，並在裡面並排比較 `<img>` 和 `<Image>`：

```typescript
// src/app/image-demo/page.tsx
import Image from 'next/image';

export default function ImageDemoPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8">圖片優化比較</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* ❌ 普通 HTML img 標籤 */}
        <div>
          <h2 className="font-semibold mb-2">❌ 普通 img 標籤</h2>
          {/* 問題：沒有自動優化，不知道圖片尺寸，可能造成 CLS */}
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
            alt="風景照"
            className="w-full rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            無 Lazy Load、無格式轉換、無尺寸優化
          </p>
        </div>

        {/* ✅ Next.js Image 元件 */}
        <div>
          <h2 className="font-semibold mb-2">✅ Next.js Image 元件</h2>
          <div className="relative w-full aspect-video">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
              alt="風景照"
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            自動 WebP、Lazy Load、響應式尺寸
          </p>
        </div>
      </div>
    </main>
  );
}
```

> **⚠️ 注意：外部圖片需要設定 remotePatterns（步驟 3 會說明）**  
> 直接執行時，外部圖片會報錯：`Invalid src prop`。請先完成步驟 3 的設定。

---

## 步驟 2：使用本機圖片（最簡單的起點）

先從最簡單的情況開始：使用放在 `public/` 目錄下的圖片。

1. 把任一張圖片複製到 `public/avatar.jpg`（可從網路下載任意 jpg）

2. 在頁面中使用：

```typescript
// src/app/image-demo/page.tsx
import Image from 'next/image';

export default function ImageDemoPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">我的個人頁面</h1>

      {/* 本機圖片：src 使用 /public 目錄下的相對路徑 */}
      <Image
        src="/avatar.jpg"      // 對應 public/avatar.jpg
        alt="大頭照"
        width={200}            // 必填：告訴瀏覽器保留這個空間（防止 CLS）
        height={200}           // 必填：同上
        className="rounded-full"
        priority               // 首屏圖片加上 priority，避免 LCP 警告
      />
    </main>
  );
}
```

### 重要屬性說明

| 屬性 | 必填 | 說明 |
|------|------|------|
| `src` | ✅ | 圖片路徑（本機用 `/public` 相對路徑，外部用完整 URL） |
| `alt` | ✅ | 無障礙描述文字，SEO 必備 |
| `width` / `height` | ✅ | 告訴瀏覽器預留空間，防止 CLS |
| `priority` | ❌ | 首屏可見的圖片加上，避免 Lazy Load 延遲 |
| `fill` | ❌ | 充滿父容器（父容器需 `position: relative`，見步驟 4） |
| `sizes` | ❌ | 告訴瀏覽器在各螢幕尺寸下的顯示寬度，讓 Next.js 決定下載哪種解析度 |

---

## 步驟 3：設定 `remotePatterns`（允許外部圖片）

Next.js 預設**不允許**來自外部網域的圖片，你必須明確列出允許的網域。  
這是一個安全機制：防止攻擊者傳入任意 URL 濫用 Vercel 的圖片優化服務。

打開 `next.config.ts`，加入 `remotePatterns`：

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 允許 Unsplash 的圖片
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // 允許 Vercel Blob（範例 4 會用到）
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
```

> **💡 安全原則**  
> 只加入你確定會使用的網域。Vercel Blob 的 hostname 用萬用字元 `*` 是因為每個 Blob store 的 subdomain 不同。

修改 `next.config.ts` 後，重新啟動 `npm run dev` 讓設定生效。

---

## 步驟 4：使用 `fill` 模式（彈性容器尺寸）

當圖片容器的尺寸由 CSS 決定（而非固定 `width`/`height`）時，使用 `fill` 屬性：

```typescript
// src/app/image-demo/page.tsx
import Image from 'next/image';

export default function ImageDemoPage() {
  return (
    <main className="p-8">
      {/* Banner 圖片：寬度固定 100%，高度由 aspect-ratio 決定 */}
      <div className="relative w-full aspect-video">
        {/* 父容器必須有 position: relative */}
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
          alt="山景 Banner"
          fill                              // 充滿父容器
          className="object-cover"          // 圖片填滿且不變形
          sizes="100vw"                     // 告訴瀏覽器：這張圖永遠是視窗寬度
          priority                          // Banner 通常在首屏，加 priority
        />
      </div>

      {/* 卡片列表：每張卡 50% 寬 */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {['photo-1', 'photo-2'].map((id) => (
          <div key={id} className="relative aspect-square">
            <Image
              src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&id=${id}`}
              alt={`圖片 ${id}`}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
              // 解讀：螢幕小於 768px 時圖片是 100vw，否則是 50vw
            />
          </div>
        ))}
      </div>
    </main>
  );
}
```

### `sizes` 屬性的重要性

`sizes` 告訴 Next.js「這張圖在不同螢幕下的實際顯示寬度」，讓 Next.js 決定下載哪個解析度版本：

```
sizes="(max-width: 768px) 100vw, 50vw"
       ───────────────────  ─────
       手機（< 768px）：     桌機：
       下載 400px 版本       下載 800px 版本（假設螢幕 1600px）
```

不設定 `sizes` 時，Next.js 假設圖片是 `100vw`，會下載不必要的大圖。

---

## 步驟 5：在瀏覽器開發工具中驗證優化效果

1. 打開 `http://localhost:3000/image-demo`
2. 開啟 Chrome DevTools → Network → 篩選 `Img`
3. 點擊圖片的請求，查看 **Response Headers**：

```
content-type: image/webp     ← 自動轉換為 WebP
cache-control: public, max-age=315360000, immutable  ← 快取一年
```

4. 比較原始圖片大小（Unsplash 原圖約 500KB+）與 Next.js 優化後的大小（通常 <100KB）

---

## ✅ 本步驟完成確認

- [ ] 本機圖片（`public/avatar.jpg`）可使用 `<Image>` 正常顯示
- [ ] `next.config.ts` 已設定 `remotePatterns` 允許外部網域
- [ ] 外部圖片可使用 `fill` 模式顯示，父容器有 `position: relative`
- [ ] 在 Network 面板確認圖片以 `image/webp` 格式傳輸

---

[上一範例：範例 1 - Route Handlers 與 Serverless Functions](範例1-RouteHandlers與Serverless.md) | [下一範例：範例 3 - Edge Runtime](範例3-EdgeRuntime.md)
