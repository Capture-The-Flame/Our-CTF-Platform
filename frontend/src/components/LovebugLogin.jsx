import React from 'react';
import './LovebugLogin.css';

const API_BASE = process.env.REACT_APP_API_BASE;

const LovebugLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/accounts/google/login/`;
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
        <div key={index} className="heart-line" style={{ '--line-index': index }}>
          {line}
        </div>
      ))}
    </div>
  );
};

  return (
    <div className="lovebug-login">
      <div className="lovebug-container">
        <BinaryHeart />
        <div className="menu-section">
          <h1 className="title">Caught the Lovebug</h1>
          <div className="menu-options">
            <button className="menu-item" onClick={handleGoogleLogin}>
              Login
            </button>
            <button className="menu-item" onClick={handleGoogleLogin}>
              Register
            </button>
            <button className="menu-item" onClick={() => window.location.href = '/scoreboard'}>
              Scoreboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LovebugLogin;