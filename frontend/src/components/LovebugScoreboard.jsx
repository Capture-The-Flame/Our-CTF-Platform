import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LovebugScoreboard.css';

const API_BASE = process.env.REACT_APP_API_BASE;

const LovebugScoreboard = ({ onBack, user }) => {
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

  const BinaryHeart = () => {
    const heartLines = [
            '***********                  ***********',
          '*****************            *****************',
        '*********************        *********************',
        '***********************      ***********************',
        '************************    ************************',
        '*************************  *************************',
        '**************************************************',
         '************************************************',
           '********************************************',
              '****************************************',
                '**********************************',
                  '******************************',
                      '************************',
                        '********************',
                          '**************',
                            '**********',
                              '******',
                                '**',
    ];

    return (
      <div className="binary-heart-small">
        {heartLines.map((line, index) => (
          <div key={index} className="heart-line">
            {line}
          </div>
        ))}
      </div>
    );
  };

  const getRankEmoji = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="lovebug-scoreboard">
        <div className="scoreboard-container">
          <BinaryHeart />
          <div className="scoreboard-section">
            <h1 className="scoreboard-title">Scoreboard</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lovebug-scoreboard">
      <header className="scoreboard-header">
        <div className="logo">
          <h1>Caught the Lovebug</h1>
        </div>
        <nav className="nav-links">
          <button onClick={onBack} className="nav-button">
            ← Back to Challenges
          </button>
        </nav>
      </header>

      <main className="scoreboard-content">
        <div className="scoreboard-title-section">
          <h2 className="page-title">🏆 Scoreboard 🏆</h2>
          <p className="subtitle">Top Hackers by Points</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {scoreboard.length === 0 && !error ? (
          <div className="no-scores">
            <BinaryHeart />
            <h3>No scores yet!</h3>
            <p>Be the first to complete a challenge!</p>
          </div>
        ) : (
          <div className="scoreboard-table-container">
            <table className="scoreboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Email</th>
                  <th>Challenges</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {scoreboard.map((player) => (
                  <tr 
                    key={player.rank}
                    className={`scoreboard-row ${user && user.email === player.email ? 'current-user' : ''} ${player.rank <= 3 ? 'top-three' : ''}`}
                  >
                    <td className="rank-cell">
                      <span className="rank-emoji">{getRankEmoji(player.rank)}</span>
                      <span className="rank-number">#{player.rank}</span>
                    </td>
                    <td className="username-cell">
                      {player.username}
                      {user && user.email === player.email && (
                        <span className="you-badge"> (You)</span>
                      )}
                    </td>
                    <td className="email-cell">{player.email}</td>
                    <td className="challenges-cell">
                      <span className="challenges-count">{player.challenges_completed}</span>
                    </td>
                    <td className="points-cell">
                      <span className="points-value">{player.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Your stats if logged in */}
        {user && (
          <div className="your-stats">
            <h3>Your Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Your Rank</div>
                <div className="stat-value">
                  {scoreboard.find(p => p.email === user.email)?.rank || 'Unranked'}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Points</div>
                <div className="stat-value">
                  {scoreboard.find(p => p.email === user.email)?.points || 0}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Challenges Completed</div>
                <div className="stat-value">
                  {scoreboard.find(p => p.email === user.email)?.challenges_completed || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LovebugScoreboard;