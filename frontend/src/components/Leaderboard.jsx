
function Leaderboard({ players, loading }) {
  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  if (loading) {
    return <div className="panel">Loading players...</div>;
  }

  return (
    <section className="panel" id="leaderboard">
      <div className="panel-heading">
        <div>
          <h2>Global Leaderboard</h2>
          <p>Players ranked by highest score</p>
        </div>
        <span className="live-badge">LIVE DATA</span>
      </div>

      {sortedPlayers.length === 0 ? (
        <p>No players found. Add players to get started.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Player ID</th>
                <th>Score</th>
              </tr>
            </thead>

            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.id}>
                  <td>
                    <span className={`rank rank-${index + 1}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="player-name">{player.name}</td>
                  <td className="player-id">{player.player_id}</td>
                  <td className="score">
                    {player.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Leaderboard;
