
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/players";

function AddPlayer({ onPlayerAdded }) {
  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!playerId.trim() || !name.trim() || score === "") {
      setError("Please fill in all fields.");
      return;
    }

    const numericScore = Number(score);

    if (!Number.isSafeInteger(numericScore) || numericScore < 0) {
      setError("Score must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      await axios.post(API_URL, {
        player_id: playerId.trim(),
        name: name.trim(),
        score: numericScore,
      });

      setPlayerId("");
      setName("");
      setScore("");
      setMessage("Player added successfully!");

      await onPlayerAdded();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not add player. Check your backend connection."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel" id="players">
      <div className="panel-heading">
        <div>
          <h2>Add New Player</h2>
          <p>Register a competitor in GameRank</p>
        </div>
      </div>

      <form className="player-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="playerId">Player ID</label>
          <input
            id="playerId"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="e.g. P005"
            maxLength={30}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="playerName">Player Name</label>
          <input
            id="playerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arjun"
            maxLength={100}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="playerScore">Game Score</label>
          <input
            id="playerScore"
            type="number"
            min="0"
            step="1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 850"
            required
          />
        </div>

        <button className="refresh-btn" type="submit" disabled={saving}>
          {saving ? "Adding..." : "+ Add Player"}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default AddPlayer;
