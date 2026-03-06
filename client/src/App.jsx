import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState("Checking backend...");

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch("/api/health");
        if (!response.ok) {
          throw new Error("Backend returned a non-OK response");
        }

        const data = await response.json();
        setHealth(`API status: ${data.status}`);
      } catch (_error) {
        setHealth("API status: unreachable");
      }
    }

    checkHealth();
  }, []);

  return (
    <main className="app">
      <div className="card">
        <h1>MediConnect</h1>
        <p>React + Express setup is ready.</p>
        <p className="status">{health}</p>
      </div>
    </main>
  );
}

export default App;
