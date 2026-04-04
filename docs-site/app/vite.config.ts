import { defineConfig } from "vite";

/**
 * GitHub Pages（專案網站）靜態部署用設定。
 *
 * - base：網站掛在「網域/儲存庫名稱/」底下時，必須與 GitHub 上的 **repository 名稱** 一致（前後加斜線）。
 *   範例：https://<使用者>.github.io/__2026_03_14_chihlee_gemini__/
 *   若你的 repo 名稱不同，請改成 /你的儲存庫名稱/
 * - build.outDir：建置結果輸出到 repo 根目錄的 docs/，供 Pages 選「從 /docs 資料夾發佈」。
 */
export default defineConfig({
  base: "/__2026_03_14_chihlee_gemini__/",
  build: {
    outDir: "../../docs",
    emptyOutDir: true,
  },
});
