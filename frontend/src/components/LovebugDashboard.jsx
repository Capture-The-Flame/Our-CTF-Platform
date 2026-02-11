import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChallengeModal from './ChallengeModal';
import Notification from './Notification';
import './LovebugDashboard.css';

const API_BASE = process.env.REACT_APP_API_BASE;

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const POLL_MS = 7000;

const LovebugDashboard = ({ user, onLogout, onNavigate }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOnce = async () => {
      if (!mounted) return;
      await loadChallenges();
    };

    fetchOnce();

    const id = setInterval(() => {
      if (!selectedChallenge) {
        loadChallenges();
      }
    }, POLL_MS);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [selectedChallenge]);


  const loadChallenges = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/challenges/`, {
        withCredentials: true
      });
      setChallenges(response.data);
      setError(null); 
    } catch (error) {
      console.error('Failed to load challenges:', error);
      setError('Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  };


  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleCloseModal = () => {
    setSelectedChallenge(null);
  };

  const handleSubmitFlag = async (challengeId, flag) => {
    const csrftoken = getCookie('csrftoken');
    
    try {
      const response = await axios.post(
        `${API_BASE}/api/challenges/${challengeId}/submit/`,
        { flag },
        { 
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        setNotification({
          type: 'success',
          message: `Correct! You earned ${response.data.points} points!`
        });
        
        handleCloseModal();
        loadChallenges();
      }
    } catch (error) {
      console.error('Error submitting flag:', error);
      
      if (error.response?.data?.message) {
        setNotification({
          type: 'error',
          message: error.response.data.message
        });
      } else if (error.response?.data?.error) {
        setNotification({
          type: 'error',
          message: error.response.data.error
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to submit flag. Please try again.'
        });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
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
                {challenge.completed && (
                  <div className="completion-hearts">
                    ❤️❤️❤️
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFlag}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default LovebugDashboard;