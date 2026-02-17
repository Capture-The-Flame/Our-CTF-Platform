import React from 'react';
import './CTFLogin.css';

import CTF_Logo from "../assets/CTF_Logo.png";

const API_BASE = process.env.REACT_APP_API_BASE;

const CTFLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/accounts/google/login/`;
  };

  const LoginLogo = () => {
    // const logo = CTF_Logo;
    const logo = ['LOGO GOES HERE'];

    return (
      <div className="ctf-ascii">
        {logo.map((line, index) => (
          <div key={index} className="ctf-line">
            {line}
          </div>
        ))}
      </div>
      // <div>
      //   // <img src={logo} alt="Our Logo : )" classname="ctf-image"/>
      // // </div>
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