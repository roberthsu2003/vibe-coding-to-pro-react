import "./style.css";

/**
 * 將 console.log 同步顯示在 index.html 的 #console-output。
 * 使用動態 import，確保攔截先於練習檔執行。
 */
const output = document.querySelector<HTMLPreElement>("#console-output");
const originalLog = console.log.bind(console);

console.log = (...args: unknown[]) => {
  originalLog(...args);
  if (!output) return;
  const line = args
    .map((a) => {
      if (typeof a === "string") return a;
      if (typeof a === "bigint") return `${a}n`;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(" ");
  output.textContent += `${line}\n`;
};

void import("./practice-02-functions");
