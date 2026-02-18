import React, { useState, useEffect } from 'react';
import CTFLogin from './components/CTFLogin';
import CTFDashboard from './components/CTFDashboard';
import CTFScoreboard from './components/CTFScoreboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const username = localStorage.getItem('ctf_username');
      if (username) {
        setUser({ authenticated: true, username });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('ctf_username');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view) => setCurrentView(view);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontFamily: 'monospace',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
        color: '#f4f4f4', fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return <CTFLogin onLoginSuccess={handleLoginSuccess} />;

  if (currentView === 'scoreboard') {
    return <CTFScoreboard user={user} onBack={() => handleNavigate('dashboard')} />;
  }

  return <CTFDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
}

export default App;