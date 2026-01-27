import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LovebugLogin.css';

const API_BASE = process.env.REACT_APP_API_BASE;
axios.defaults.withCredentials = true;

const LovebugLogin = ({ onScoreboard }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/me/`);
      
      if (response.data.authenticated) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login clicked. API_BASE =", API_BASE);
    const url = `${API_BASE}/accounts/google/login/`;
    console.log("Redirecting to:", url);
    window.location.assign(url);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/api/logout/`);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
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
      <div className="binary-heart">
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
      <div className="lovebug-login">
        <div className="container">
          <BinaryHeart />
          <div className="menu-section">
            <h1 className="title">Caught the Lovebug</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lovebug-login">
      <div className="container">
        <BinaryHeart />

        <div className="menu-section">
          <h1 className="title">Caught the Lovebug</h1>
          
          {user ? (
            <div className="user-section">
              <p>Welcome, {user.email}!</p>
              <div className="menu-options">
                <button 
                  className="menu-item" 
                  onClick={onScoreboard}
                  aria-label="View Scoreboard"
                >
                  Scoreboard
                </button>
                <button 
                  className="menu-item" 
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="menu-options">
              <button 
                className="menu-item" 
                onClick={handleGoogleLogin}
                aria-label="Login"
              >
                Login
              </button>
              <button 
                className="menu-item" 
                onClick={handleGoogleLogin}
                aria-label="Register"
              >
                Register
              </button>
              <button 
                className="menu-item" 
                onClick={onScoreboard}
                aria-label="View Scoreboard"
              >
                Scoreboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LovebugLogin;