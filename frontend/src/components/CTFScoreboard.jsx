import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CTFScoreboard.css';

const API_BASE = process.env.REACT_APP_API_BASE;

const CTFScoreboard = ({ onBack, user }) => {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadScoreboard();
  }, []);

  const loadScoreboard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/scoreboard/`, {
        withCredentials: true
      });
      setScoreboard(response.data);
    } catch (error) {
      console.error('Failed to load scoreboard:', error);
      setError('Failed to load scoreboard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ctf-scoreboard">
      <header className="scoreboard-header">
        <div className="sb-logo">
          <h1>Into the Flame</h1>
        </div>
        <nav>
          <button onClick={onBack} className="nav-button">
            ← Back to Challenges
          </button>
        </nav>
      </header>

      <main className="scoreboard-content">
        <div className="scoreboard-title-section">
          <h2 className="page-title">Scoreboard</h2>
          <p className="subtitle">Top Hackers by Points</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {scoreboard.length === 0 && !error ? (
          <div className="no-scores">
            <h3>Loading...</h3>
          </div>
        ) : (
          <div className="scoreboard-table-container">
            <table className="scoreboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Points</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {scoreboard.map((player) => (
                  <tr
                    key={player.rank}
                    className={`scoreboard-row ${user && user.username === player.username ? 'current-user' : ''} ${player.rank <= 3 ? 'top-three' : ''}`}
                  >
                    <td className="rank-cell">#{player.rank}</td>
                    <td className="username-cell">
                      {player.username}
                      {user && user.username === player.username && (
                        <span className="you-badge">(You)</span>
                      )}
                    </td>
                    <td className="points-cell">{player.points}</td>
                    <td className="challenges-cell">{player.challenges_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CTFScoreboard;