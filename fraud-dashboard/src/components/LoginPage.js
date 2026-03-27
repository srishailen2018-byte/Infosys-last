import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      onLoginSuccess(res.data.email, res.data.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const videoUrl = '/motion2Fast_Animate_the_uploaded_image_bringing_subtle_life_an_0.mp4';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      {/* Left Side: Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '2rem',
        zIndex: 50
      }}>
        <div className="login-card jiggle-card" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '3rem',
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="jiggle-effect" style={{ width: '64px', height: '64px', backgroundColor: '#00f3ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', boxShadow: '0 0 20px rgba(0, 243, 255, 0.3)' }}>
              🛡️
            </div>
            <h2 className="jiggle-effect" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
              Welcome Back
            </h2>
            <p className="jiggle-effect" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Enter your credentials to access FraudShield
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div className="jiggle-hover">
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8', marginBottom: '0.625rem' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{
                  width: '100%',
                  padding: '0.875rem 1.125rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            <div className="jiggle-hover">
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8', marginBottom: '0.625rem' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.875rem 1.125rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {error && (
              <div className="jiggle-effect" style={{
                padding: '0.875rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '0.75rem',
                color: '#f87171',
                fontSize: '0.875rem'
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glow-button jiggle-hover"
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#00f3ff',
                color: '#000',
                border: 'none',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                marginTop: '0.5rem',
                boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="jiggle-effect" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Only system administrators can create new analyst accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Background Video */}
      <div style={{
        flex: '0 0 50%',
        position: 'relative',
        backgroundColor: '#0f172a',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '2rem',
        overflow: 'hidden'
      }}>
        {/* The Video Element */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for Contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.2)), radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        {/* Glowing Frame for Video */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          bottom: '2rem',
          border: '2px solid #00f3ff',
          boxShadow: '0 0 20px rgba(0, 243, 255, 0.5), inset 0 0 20px rgba(0, 243, 255, 0.3)',
          borderRadius: '1rem',
          pointerEvents: 'none',
          opacity: 0.6,
          zIndex: 2
        }}></div>
      </div>
    </div>
  );
};

export default LoginPage;
