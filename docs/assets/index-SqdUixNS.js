(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();document.querySelector("#app").innerHTML=`
  <main class="wrap">
    <h1>靜態網頁已建置</h1>
    <p>此頁由 Vite 建置到 repo 根目錄的 <code>docs/</code>，供 GitHub Pages 使用。</p>
    <p class="hint">本機開發請在 <code>docs-site/app</code> 執行 <code>npm run dev</code>。</p>
  </main>
`;
