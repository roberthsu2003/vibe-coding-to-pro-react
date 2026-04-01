import { getCount, increment } from "./counter.js";

const valueEl = document.getElementById("value");
const btn = document.getElementById("increment");

function render() {
  if (valueEl) valueEl.textContent = String(getCount());
}

btn?.addEventListener("click", () => {
  increment();
  render();
});

render();
