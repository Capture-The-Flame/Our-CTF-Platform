import React from 'react';
import './CTFLogin.css';

import CTF_Logo from "../assets/CTF_Logo.png";

const API_BASE = process.env.REACT_APP_API_BASE || "";

const CTFLogin = () => {

const handleGoogleLogin = () => {
  window.location.href = `${API_BASE}/accounts/google/login/`;
};

  const LoginLogo = () => {
    return (
      <div className="logo-wrapper">
        <img src={CTF_Logo} alt="CTF Logo" className="ctf-image" />
      </div>
    );
  };


  return (
    <div className="ctf-login">
      <div className="ctf-container">
        <LoginLogo />

        <div className="menu-section">
          <h1 className="title">Ignite the Flame</h1>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt=""
            />
            <span className="google-text">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTFLogin;