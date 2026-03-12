import { useState } from "react";
import type { Route } from "./+types/home";
import Example1JSX from "../examples/Example1JSX";
import Example2Props from "../examples/Example2Props";
import Example3State from "../examples/Example3State";
import Example4UseEffect from "../examples/Example4UseEffect";
import Example5Events from "../examples/Example5Events";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React 核心概念 - 互動範例" },
    {
      name: "description",
      content: "選擇範例，透過手動操作理解每個 React 概念",
    },
  ];
}

const EXAMPLES = [
  { id: 1, name: "JSX 基礎", component: Example1JSX },
  { id: 2, name: "Props", component: Example2Props },
  { id: 3, name: "State", component: Example3State },
  { id: 4, name: "useEffect", component: Example4UseEffect },
  { id: 5, name: "事件處理", component: Example5Events },
] as const;

export default function Home() {
  const [current, setCurrent] = useState(1);
  const CurrentExample =
    EXAMPLES.find((e) => e.id === current)?.component ?? Example1JSX;

  return (
    <main className="app">
      <header className="app-header">
        <h1>React 核心概念 - 互動範例</h1>
        <p>選擇範例，透過手動操作理解每個概念（延續 05 章節）</p>
      </header>

      <nav className="example-nav">
        {EXAMPLES.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            className={current === id ? "active" : ""}
            onClick={() => setCurrent(id)}
          >
            {id}. {name}
          </button>
        ))}
      </nav>

      <div className="example-content">
        <CurrentExample />
      </div>
    </main>
  );
}
