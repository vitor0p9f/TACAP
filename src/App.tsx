import { useState } from "react";

export default function App() {
    const [count, setCount] = useState<number>(0);

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h1>Electron ⚡ + Vite ⚡ + React ⚛ + TS ✅</h1>
            <p>Este é o seu componente App.tsx</p>

            <button onClick={() => setCount((c) => c + 1)}>
                Cliquei {count} vezes
            </button>
        </div>
    );
}
