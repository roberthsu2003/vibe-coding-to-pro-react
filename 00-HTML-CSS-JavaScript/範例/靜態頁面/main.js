(function () {
  var count = 0;
  var valueEl = document.getElementById("value");
  var btn = document.getElementById("increment");

  function render() {
    if (valueEl) valueEl.textContent = String(count);
  }

  if (btn) {
    btn.addEventListener("click", function () {
      count += 1;
      render();
    });
  }

  render();
})();
