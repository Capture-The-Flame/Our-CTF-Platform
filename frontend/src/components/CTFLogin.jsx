import React, { useState } from 'react';
import './CTFLogin.css';
import CTF_Logo from "../assets/CTF_Logo.png";

const CTFLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setLoading(true);
    setError('');
    try {
      localStorage.setItem('ctf_username', username.trim());
      onLoginSuccess({ authenticated: true, username: username.trim() });
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const LoginLogo = () => (
    <div className="logo-wrapper">
      <img src={CTF_Logo} alt="CTF Logo" className="ctf-image" />
    </div>
  );

  return (
    <div className="ctf-login">
      <div className="ctf-container">
        <LoginLogo />
        <div className="menu-section">
          <h1 className="title">Ignite the Flame</h1>
          <form onSubmit={handleLogin} className="menu-options">
            <input
              type="text"
              className="username-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="menu-item" disabled={loading}>
              {loading ? 'Logging in...' : 'Enter CTF'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CTFLogin;