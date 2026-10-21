
function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">G</span>
        <span>GameRank</span>
      </div>

      <div className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#leaderboard">Leaderboard</a>
        <a href="#players">Players</a>
        <a href="#algorithm">Heap Sort</a>
      </div>

      <div className="nav-status">
        <span className="status-dot"></span>
        System Online
      </div>
    </nav>
  );
}

export default Navbar;
