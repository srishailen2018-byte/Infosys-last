import React, { useState } from 'react';
import axios from 'axios';

const SettingsView = ({ highContrast, userEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Analyst');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Real-time states for toggles and ranges
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    ipWhitelisting: false,
    sessionTimeout: true
  });

  const [modelThresholds, setModelThresholds] = useState({
    fraudSensitivity: 75,
    alertThreshold: 40
  });

  const toggleSecurity = (key) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateThreshold = (key, val) => {
    setModelThresholds(prev => ({ ...prev, [key]: parseInt(val) }));
  };

  const handleMaintenance = (action) => {
    setMessage({ type: 'success', text: `${action} initiated successfully.` });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('http://localhost:5000/signup', {
        email,
        password,
        role,
        adminEmail: userEmail
      });
      setMessage({ type: 'success', text: `Successfully created ${role} account for ${email}` });
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>System Settings</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* User Management */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '2rem', 
          borderRadius: '1.5rem', 
          border: '1px solid #334155',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👤</span> User Management
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Create new Analyst or Admin accounts for the system.</p>
          
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@company.com"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155', 
                  borderRadius: '0.75rem', 
                  color: 'white' 
                }} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155', 
                  borderRadius: '0.75rem', 
                  color: 'white' 
                }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155', 
                  borderRadius: '0.75rem', 
                  color: 'white' 
                }}
              >
                <option value="Analyst">Analyst</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {message.text && (
              <div style={{ 
                padding: '0.75rem', 
                borderRadius: '0.75rem', 
                fontSize: '0.875rem',
                backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: message.type === 'success' ? '#10b981' : '#ef4444',
                border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
              }}>
                {message.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              style={{ 
                padding: '0.75rem', 
                backgroundColor: '#38bdf8', 
                color: '#0f172a', 
                border: 'none', 
                borderRadius: '0.75rem', 
                fontWeight: 'bold', 
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Creating...' : 'Create User Account'}
            </button>
          </form>
        </div>

        {/* Security Configuration */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '2rem', 
          borderRadius: '1.5rem', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔒</span> Security Configuration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SettingToggle 
              label="Two-Factor Authentication" 
              description="Require a secondary verification code for all admin logins."
              enabled={securitySettings.twoFactor}
              onToggle={() => toggleSecurity('twoFactor')}
            />
            <SettingToggle 
              label="IP Whitelisting" 
              description="Restrict system access to known corporate IP addresses."
              enabled={securitySettings.ipWhitelisting}
              onToggle={() => toggleSecurity('ipWhitelisting')}
            />
            <SettingToggle 
              label="Session Timeout" 
              description="Automatically log out inactive users after 30 minutes."
              enabled={securitySettings.sessionTimeout}
              onToggle={() => toggleSecurity('sessionTimeout')}
            />
          </div>
        </div>

        {/* Model Thresholds */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '2rem', 
          borderRadius: '1.5rem', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🤖</span> Model Thresholds
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <RangeSetting 
              label="Fraud Sensitivity" 
              value={modelThresholds.fraudSensitivity} 
              description="Adjust the confidence level required to block a transaction."
              onChange={(v) => updateThreshold('fraudSensitivity', v)}
            />
            <RangeSetting 
              label="Alert Threshold" 
              value={modelThresholds.alertThreshold} 
              description="Minimum risk score required to trigger an email notification."
              onChange={(v) => updateThreshold('alertThreshold', v)}
            />
          </div>
        </div>

        {/* Maintenance */}
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '2rem', 
          borderRadius: '1.5rem', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span> Maintenance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => handleMaintenance('System Cache Clear')} style={maintenanceButtonStyle}>Clear System Cache</button>
            <button onClick={() => handleMaintenance('Audit Log Export')} style={maintenanceButtonStyle}>Export Audit Logs (CSV)</button>
            <button onClick={() => handleMaintenance('Factory Reset')} style={{...maintenanceButtonStyle, color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)'}}>Database Factory Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ label, description, enabled, onToggle }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', color: 'white' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{description}</p>
    </div>
    <div 
      onClick={onToggle}
      style={{ 
        width: '44px', 
        height: '24px', 
        backgroundColor: enabled ? '#10b981' : '#334155', 
        borderRadius: '12px', 
        position: 'relative', 
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ 
        width: '18px', 
        height: '18px', 
        backgroundColor: 'white', 
        borderRadius: '50%', 
        position: 'absolute', 
        top: '3px', 
        left: enabled ? '23px' : '3px',
        transition: 'all 0.2s'
      }} />
    </div>
  </div>
);

const RangeSetting = ({ label, value, description, onChange }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', color: 'white' }}>{label}</p>
      <span style={{ color: '#10b981', fontWeight: 'bold' }}>{value}%</span>
    </div>
    <input 
      type="range" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }} 
    />
    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{description}</p>
  </div>
);

const maintenanceButtonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  border: '1px solid #334155',
  borderRadius: '0.75rem',
  color: '#94a3b8',
  textAlign: 'left',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

export default SettingsView;
