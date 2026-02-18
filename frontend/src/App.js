import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CTFLogin from './components/CTFLogin';
import CTFDashboard from './components/CTFDashboard';
import CTFScoreboard from './components/CTFScoreboard';

axios.defaults.baseURL = "";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`/api/me/`, {
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
      await axios.post(`/api/logout/`, {}, {
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
        color: '#f4f4f4',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <CTFLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'scoreboard') {
    return (
      <CTFScoreboard 
        user={user}
        onBack={() => handleNavigate('dashboard')}
      />
    );
  }

  return (
    <CTFDashboard 
      user={user}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
}

export default App;