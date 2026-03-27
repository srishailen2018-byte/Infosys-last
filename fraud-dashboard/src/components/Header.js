import React, { useState } from 'react';

const Header = ({ activeSection, alerts = [], onClearAlerts, mailCount = 0, onClearMails, highContrast, setHighContrast, onLogout }) => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const activeAlerts = alerts.filter(a => a.status === 'flagged' || a.status === 'blocked');

  const titles = {
    Dashboard: {
      title: 'Fraud Monitoring Dashboard',
      subtitle: 'Real-time overview of transaction activity and threat detection'
    },
    Simulation: {
      title: 'Transaction Simulation Engine',
      subtitle: 'Generate synthetic transactions to test anomaly detection rules and fraud scenarios'
    },
    Detection: {
      title: 'Anomaly Detection & Alerts',
      subtitle: 'Configure detection rules, review alerts, and manage fraud prevention strategies'
    },
    Analytics: {
      title: 'ML Analytics & API Gateway',
      subtitle: 'Machine learning model performance, training analytics, and API endpoint monitoring'
    },
    Transactions: {
      title: 'All Transactions',
      subtitle: 'Detailed log of all system transactions and simulation results'
    },
    'Audit Logs': {
      title: 'System Audit Logs',
      subtitle: 'Comprehensive trail of user actions and automated security events'
    },
    Settings: {
      title: 'System Settings',
      subtitle: 'Configure global system parameters and user permissions'
    }
  };

  const current = titles[activeSection] || titles.Dashboard;

  return (
    <header style={{ 
      padding: '1.5rem 2rem', 
      borderBottom: highContrast ? '2px solid white' : '1px solid rgba(30, 41, 59, 0.5)',
      backgroundColor: highContrast ? 'black' : 'transparent',
      backdropFilter: highContrast ? 'none' : 'blur(10px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10 // Lowered zIndex to allow modal to overlay correctly
    }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>{current.title}</h2>
        <p style={{ color: highContrast ? 'white' : '#94a3b8', fontSize: '0.875rem' }}>{current.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* High Contrast Toggle */}
        <button 
          onClick={() => setHighContrast(!highContrast)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: highContrast ? 'white' : '#1e293b',
            color: highContrast ? 'black' : 'white',
            border: highContrast ? 'none' : '1px solid #334155',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '0.5rem'
          }}
        >
          {highContrast ? 'Standard Mode' : 'High Contrast'}
        </button>

        {/* Mail Icon */}
        <div 
          onClick={() => setShowMailModal(!showMailModal)}
          style={{ 
            position: 'relative', 
            cursor: 'pointer', 
            padding: '10px', 
            backgroundColor: highContrast ? 'black' : 'rgba(30, 41, 59, 0.7)', 
            borderRadius: '12px',
            border: mailCount > 0 ? '2px solid #3b82f6' : (highContrast ? '2px solid white' : '1px solid rgba(51, 65, 85, 0.5)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#334155'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.7)'}
        >
          <span style={{ fontSize: '1.5rem' }}>✉️</span>
          {mailCount > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}>
              {mailCount}
            </span>
          )}
        </div>

        {/* Alert Icon with Badge */}
        <div 
          onClick={() => setShowAlertModal(!showAlertModal)}
          style={{ 
            position: 'relative', 
            cursor: 'pointer', 
            padding: '10px', 
            backgroundColor: highContrast ? 'black' : 'rgba(30, 41, 59, 0.7)', 
            borderRadius: '12px',
            border: activeAlerts.length > 0 ? '2px solid #ef4444' : (highContrast ? '2px solid white' : '1px solid rgba(51, 65, 85, 0.5)'),
            animation: activeAlerts.length > 0 ? 'pulse 2s infinite' : 'none'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🔔</span>
          {activeAlerts.length > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
            }}>
              {activeAlerts.length}
            </span>
          )}
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            marginLeft: '0.5rem'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>

      {/* Alert Dropdown/Modal */}
      {showAlertModal && (
        <div style={{ 
          position: 'absolute', 
          top: '5.5rem', 
          right: '2rem', 
          width: '350px', 
          backgroundColor: highContrast ? 'black' : 'rgba(30, 41, 59, 0.95)', 
          backdropFilter: highContrast ? 'none' : 'blur(20px)',
          borderRadius: '1rem', 
          border: highContrast ? '2px solid white' : '1px solid rgba(0, 243, 255, 0.3)', 
          zIndex: 9999, 
          boxShadow: highContrast ? 'none' : '0 0 30px rgba(0, 243, 255, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.7)',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '1rem', borderBottom: `1px solid ${highContrast ? 'white' : 'rgba(51, 65, 85, 0.5)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Live Alerts</h3>
            <button onClick={onClearAlerts} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.75rem', cursor: 'pointer' }}>Clear All</button>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {activeAlerts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>No new alerts</p>
            ) : (
              activeAlerts.map(alert => (
                <div key={alert.id} className="chart-container chart-glow" style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: highContrast ? 'black' : 'rgba(15, 23, 42, 0.4)', border: highContrast ? '1px solid white' : 'none', marginBottom: '0.5rem', borderLeft: `${highContrast ? '1px' : '4px'} solid ${alert.status === 'blocked' ? '#ef4444' : '#f59e0b'}`, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', position: 'relative', zIndex: 2 }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{alert.merchant}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{alert.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>{alert.amount}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{alert.status.toUpperCase()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mail Dropdown/Modal */}
      {showMailModal && (
        <div style={{ 
          position: 'absolute', 
          top: '5.5rem', 
          right: '6rem', 
          width: '350px', 
          backgroundColor: highContrast ? 'black' : 'rgba(30, 41, 59, 0.95)', 
          backdropFilter: highContrast ? 'none' : 'blur(20px)',
          borderRadius: '1rem', 
          border: highContrast ? '2px solid white' : '1px solid rgba(59, 130, 246, 0.3)', 
          zIndex: 9999, 
          boxShadow: highContrast ? 'none' : '0 0 30px rgba(59, 130, 246, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.7)',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '1rem', borderBottom: `1px solid ${highContrast ? 'white' : 'rgba(51, 65, 85, 0.5)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Email Alerts</h3>
            <button onClick={onClearMails} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Clear All</button>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {mailCount === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>No new emails</p>
            ) : (
              activeAlerts.map(alert => (
                <div key={`mail-${alert.id}`} className="chart-container chart-glow" style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: highContrast ? 'black' : 'rgba(15, 23, 42, 0.4)', border: highContrast ? '1px solid white' : 'none', marginBottom: '0.5rem', borderLeft: `${highContrast ? '1px' : '4px'} solid #3b82f6`, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#3b82f6' }}>Fraud Shield Alert</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sent to your registered email</p>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'white', lineHeight: '1.4' }}>
                    Suspicious transaction of <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{alert.amount}</span> at <span style={{ fontWeight: 'bold' }}>{alert.merchant}</span> was detected and {alert.status}.
                  </div>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'right' }}>{alert.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); border-color: #ef4444; }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
