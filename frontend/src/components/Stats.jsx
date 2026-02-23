import { useState } from "react";
import { api } from "../api/api";

export default function Stats() {
  const [stats, setStats] = useState([]);

  const loadStats = async () => {
    const res = await api.get("/products/stats/all");
    setStats(res.data);
  };

  return (
    <div>
      <h2>Order Statistics</h2>

      <button onClick={loadStats}>Load Stats</button>

      <ul>
        {stats.map((s, i) => (
          <li key={i}>
            {s.status} : {s.count}
          </li>
        ))}
      </ul>
    </div>
  );
}