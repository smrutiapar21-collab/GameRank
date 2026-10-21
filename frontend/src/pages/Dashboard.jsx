import PlayerTable from "../components/PlayerTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Leaderboard from "../components/Leaderboard";

const API_URL = "http://localhost:5000/api/players";
const HEAP_SORT_URL = "http://localhost:5000/api/players/heap-sort";
function Dashboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPlayers() {
    try {
      const response = await axios.get(HEAP_SORT_URL);
      setPlayers(response.data);
      setError("");
    } catch (err) {
      setError(
        "Could not load sorted players. Check the backend and C++ executable."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  const totalPlayers = players.length;
  const totalScore = players.reduce(
    (sum, player) => sum + player.score,
    0
  );
  const highestScore = players.reduce(
    (highest, player) => Math.max(highest, player.score),
    0
  );

  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard" id="dashboard">
        <section className="welcome">
          <div>
            <p className="eyebrow">GAMING ANALYTICS PLATFORM</p>
            <h1>Leaderboard Dashboard</h1>
            <p className="subtitle">
              Track players, compare scores, and explore Heap Sort.
            </p>
          </div>

          <button className="refresh-btn" onClick={fetchPlayers}>
            ↻ Refresh Data
          </button>
        </section>

        {error && <div className="error-message">{error}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <p>Total Players</p>
            <h2>{totalPlayers}</h2>
            <span>Registered competitors</span>
          </div>

          <div className="stat-card">
            <p>Combined Score</p>
            <h2>{totalScore.toLocaleString()}</h2>
            <span>Across all players</span>
          </div>

          <div className="stat-card">
            <p>Highest Score</p>
            <h2>{highestScore.toLocaleString()}</h2>
            <span>Top individual score</span>
          </div>

          <div className="stat-card">
            <p>Algorithm</p>
            <h2>O(n log n)</h2>
            <span>Heap Sort time complexity</span>
          </div>
        </section>

        <Leaderboard players={players} loading={loading} />
        <PlayerTable onPlayerAdded={fetchPlayers} />
        <section className="panel info-panel" id="algorithm">
          <div>
            <p className="eyebrow">CORE ALGORITHM</p>
            <h2>Powered by Heap Sort</h2>
            <p>
              GameRank uses a binary heap to organize player scores
              efficiently. The next development step will integrate
              your C++ implementation into the leaderboard.
            </p>
          </div>

          <div className="complexity">
            <span>Time Complexity</span>
            <strong>O(n log n)</strong>
            <span>Auxiliary Space</span>
            <strong>O(log n)</strong>
          </div>
        </section>

        <footer>
          GameRank © 2026 · Built with React, Node.js, PostgreSQL & C++
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
