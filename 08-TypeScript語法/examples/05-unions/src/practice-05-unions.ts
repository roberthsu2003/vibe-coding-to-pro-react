/**
 * 範例 5｜網頁版：聯合型別、字面量、可區辨聯合、switch 窄化
 * 與 tsx-cli 不同：以「載入狀態控制台」模擬 API 狀態機。
 */

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; items: string[] }
  | { status: "error"; message: string };

let state: LoadState = { status: "idle" };

function describe(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "尚未請求資料。";
    case "loading":
      return "載入中…";
    case "success":
      return `已載入 ${state.items.length} 筆：${state.items.join("、")}`;
    case "error":
      return `錯誤：${state.message}`;
  }
}

function renderMessage(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "按下方按鈕模擬請求。";
    case "loading":
      return "請稍候，正在向伺服器索取資料…";
    case "success": {
      const list = state.items.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
      return `取得資料：<ul>${list}</ul>`;
    }
    case "error":
      return `<strong>${escapeHtml(state.message)}</strong>`;
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pillClass(s: LoadState): string {
  return `status-pill ${s.status}`;
}

function pillLabel(s: LoadState): string {
  if (s.status === "idle") return "idle";
  if (s.status === "loading") return "loading";
  if (s.status === "success") return "success";
  return "error";
}

function mount(): void {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  function draw(): void {
    if (!root) return;
    root.innerHTML = `
      <div class="console-frame">
        <div class="bar"><span class="dot" aria-hidden="true"></span> 範例 5 · 聯合型別</div>
        <div class="body">
          <p class="${pillClass(state)}">${pillLabel(state)}</p>
          <div class="message">${renderMessage(state)}</div>
          <p class="hint" style="margin-top:1rem;color:#6b728d;font-size:0.8rem;">
            ${describe(state)}
          </p>
          <div class="controls">
            <button type="button" data-action="idle">重設 idle</button>
            <button type="button" data-action="loading">開始 loading</button>
            <button type="button" data-action="success">成功 success</button>
            <button type="button" data-action="error">失敗 error</button>
          </div>
        </div>
      </div>
      <p class="hint">
        型別為 <code>LoadState</code> 的<strong>可區辨聯合</strong>：<code>switch (state.status)</code> 內可安全存取
        <code>items</code> 或 <code>message</code>。此畫面與 tsx-cli 的 <code>console.log</code> 示範目的相同，呈現方式不同。
      </p>
    `;

    root.querySelectorAll<HTMLButtonElement>("button[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        if (action === "idle") state = { status: "idle" };
        else if (action === "loading") state = { status: "loading" };
        else if (action === "success")
          state = { status: "success", items: ["筆記本", "咖啡", "程式碼"] };
        else if (action === "error") state = { status: "error", message: "網路逾時（示範）" };
        draw();
      });
    });
  }

  draw();
}

mount();
