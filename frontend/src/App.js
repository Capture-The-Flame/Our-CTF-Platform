import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LovebugLogin from './components/LovebugLogin';
import LovebugDashboard from './components/LovebugDashboard';
import LovebugScoreboard from './components/LovebugScoreboard';

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/me/`, {
        withCredentials: true
      });
      
      if (response.data.authenticated) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/api/logout/`, {}, {
        withCredentials: true
      });
      setUser(null);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

 
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'monospace',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
        color: '#d946a6',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LovebugLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'scoreboard') {
    return (
      <LovebugScoreboard 
        user={user}
        onBack={() => handleNavigate('dashboard')}
      />
    );
  }

  return (
    <LovebugDashboard 
      user={user}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
}

export default App;