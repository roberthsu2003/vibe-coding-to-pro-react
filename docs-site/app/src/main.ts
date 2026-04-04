import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="wrap">
    <h1>靜態網頁已建置</h1>
    <p>此頁由 Vite 建置到 repo 根目錄的 <code>docs/</code>，供 GitHub Pages 使用。</p>
    <p class="hint">本機開發請在 <code>docs-site/app</code> 執行 <code>npm run dev</code>。</p>
  </main>
`;
