import React, { useState } from 'react';

const AuditLogsView = ({ auditLogs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = auditLogs.filter(log => 
    log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>System Audit Logs</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Track user actions and system events</p>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search audits..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '0.625rem 1rem 0.625rem 2.5rem', 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155', 
              borderRadius: '0.5rem', 
              color: 'white',
              width: '300px',
              outline: 'none'
            }} 
          />
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', overflow: 'hidden' }} className="jiggle-table">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>TIMESTAMP</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>USER</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>ACTION</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, i) => (
              <tr 
                key={i} 
                onClick={() => setSelectedLog(log)}
                style={{ 
                  borderBottom: '1px solid #1e293b',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{log.timestamp}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'white' }}>{log.user_email}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.625rem', 
                    borderRadius: '0.5rem',
                    backgroundColor: getActionColor(log.action).bg,
                    color: getActionColor(log.action).text,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>{log.action}</span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            No audit logs found.
          </div>
        )}
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(12px)',
          padding: '1.5rem'
        }} onClick={() => setSelectedLog(null)}>
          <div 
            className="detail-modal jiggle-card"
            style={{
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.05), transparent)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '2rem',
            padding: '3rem',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: 'white',
            boxShadow: '0 0 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.15)',
            position: 'relative',
            animation: 'modalEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={e => e.stopPropagation()}>
            <style>{`
              @keyframes modalEntrance {
                from { transform: scale(0.95) translateY(30px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
              }
              .detail-modal::-webkit-scrollbar {
                width: 6px;
              }
              .detail-modal::-webkit-scrollbar-track {
                background: transparent;
              }
              .detail-modal::-webkit-scrollbar-thumb {
                background: rgba(245, 158, 11, 0.2);
                border-radius: 10px;
              }
            `}</style>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    📋
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em' }}>Audit Record</h3>
                </div>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem', marginLeft: '3.5rem' }}>Detailed system event trace</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                style={{ 
                  background: 'rgba(30, 41, 59, 0.5)', 
                  border: '1px solid rgba(51, 65, 85, 0.5)', 
                  color: '#94a3b8', 
                  fontSize: '1.2rem', 
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#ef4444'; 
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)'; 
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >✕</button>
            </div>

            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <AuditDetailRow label="Event Timestamp" value={selectedLog.timestamp} />
                <AuditDetailRow label="System User" value={selectedLog.user_email} />
                <AuditDetailRow label="Action Type" value={selectedLog.action} actionType />
                <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem' }}>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Activity Details</p>
                  <p style={{ 
                    color: '#f8fafc', 
                    fontSize: '1rem', 
                    lineHeight: '1.6', 
                    margin: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    {selectedLog.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuditDetailRow = ({ label, value, actionType }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>{label}</span>
    {actionType ? (
      <span style={{ 
        padding: '0.25rem 0.75rem', 
        borderRadius: '0.5rem',
        backgroundColor: getActionColor(value).bg,
        color: getActionColor(value).text,
        fontSize: '0.85rem',
        fontWeight: '700',
        textTransform: 'uppercase'
      }}>{value}</span>
    ) : (
      <span style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: '600' }}>{value}</span>
    )}
  </div>
);

const getActionColor = (action) => {
  switch (action) {
    case 'LOGIN': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
    case 'LOGIN_FAILED': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
    case 'SIGNUP': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' };
    case 'USER_CREATED': return { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6' };
    case 'FRAUD_CHECK': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
    default: return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8' };
  }
};

export default AuditLogsView;