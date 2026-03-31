function greet(name: string): void {
  const el = document.getElementById("msg");
  if (el) {
    el.textContent = `Hello, ${name}（來自 TypeScript → tsc → JS）`;
  }
}

greet("Student");
