import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LovebugDashboard.css';

const API_BASE = process.env.REACT_APP_API_BASE;

const LovebugDashboard = ({ user, onLogout, onNavigate }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/challenges/`, {
        withCredentials: true
      });
      setChallenges(response.data);
    } catch (error) {
      console.error('Failed to load challenges:', error);
      setError('Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = (challenge) => {
    console.log('Challenge clicked:', challenge);
    alert(`Challenge: ${challenge.title}\n\nThis would open a modal to submit the flag.\n\nFor now, this is just a placeholder.`);
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

  if (loading) {
    return (
      <div className="lovebug-dashboard">
        <div className="container">
          <BinaryHeart />
          <div className="menu-section">
            <h1 className="title">Caught the Lovebug</h1>
            <p>Loading challenges...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lovebug-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h1>Caught the Lovebug</h1>
        </div>
        
        <nav className="nav-links">
          <button onClick={() => onNavigate('scoreboard')} className="nav-link-button">
            Scoreboard
          </button>
          <button onClick={onLogout} className="nav-link-button">
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="user-info">
          <p>Welcome, {user.email}!</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Go to <a href={`${API_BASE}/admin`} target="_blank" rel="noopener noreferrer">Django Admin</a> to add challenges.</p>
          </div>
        )}

        {challenges.length === 0 && !error ? (
          <div className="no-challenges">
            <BinaryHeart />
            <h2>No Challenges Yet!</h2>
            <p>Ask your admin to add some challenges in the Django admin panel.</p>
            <a href={`${API_BASE}/admin`} target="_blank" rel="noopener noreferrer" className="admin-link">
              Go to Admin Panel
            </a>
          </div>
        ) : (
          <div className="challenges-grid">
            {challenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className={`challenge-card ${challenge.completed ? 'completed' : ''}`}
                onClick={() => handleChallengeClick(challenge)}
              >
                <h3 className="challenge-title">{challenge.title}</h3>
                <p className="challenge-points">{challenge.points}</p>
                <p className="challenge-category">{challenge.category}</p>
                <p className="challenge-description">{challenge.description}</p>
                {challenge.completed && (
                  <div className="completion-hearts">
                    ❤️ ❤️ ❤️
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LovebugDashboard;