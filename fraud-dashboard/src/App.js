import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  // Check for existing session on load
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    if (savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
      setUserRole(savedRole || 'Analyst');
    }
  }, []);

  const handleLoginSuccess = (email, role) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard userEmail={userEmail} userRole={userRole} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
