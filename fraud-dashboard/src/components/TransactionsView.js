import React, { useState } from 'react';

const TransactionsView = ({ transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  const displayTransactions = transactions.length > 0 ? transactions : [
    { 
      id: 'TXN-001', 
      time: '08:23', 
      merchant: 'ElectroMart Online', 
      amount: '$2,340', 
      location: 'New York, US', 
      risk: 82, 
      status: 'flagged',
      reason: 'Unusual high amount for this merchant',
      sender: { name: 'John Doe', account: '...1234', bank: 'Chase', mobile: '1234567890', location: 'NY' },
      receiver: { name: 'ElectroMart', account: '...5678', bank: 'Wells Fargo', mobile: '0987654321', location: 'CA' },
      ip: '192.168.1.1',
      type: 'UPI'
    },
    // ... rest of fallbacks would ideally have similar details
  ];

  const filteredTransactions = displayTransactions.filter(txn => 
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>All Transactions</h2>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search ID, merchant, location..." 
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
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>ID</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>TIME</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>MERCHANT</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>AMOUNT</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>LOCATION</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>RISK</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, i) => (
              <tr 
                key={i} 
                onClick={() => setSelectedTxn(txn)}
                style={{ 
                  borderBottom: '1px solid #1e293b', 
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{txn.id}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{txn.time}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{txn.merchant}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>{txn.amount}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{txn.location}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: txn.risk > 70 ? '#ef4444' : txn.risk > 30 ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{txn.risk}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.625rem', 
                    borderRadius: '1rem',
                    backgroundColor: txn.status === 'flagged' ? 'rgba(245, 158, 11, 0.1)' : txn.status === 'blocked' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: txn.status === 'flagged' ? '#f59e0b' : txn.status === 'blocked' ? '#ef4444' : '#10b981',
                    textTransform: 'capitalize'
                  }}>{txn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            No transactions found matching your search.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTxn && (
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
        }} onClick={() => setSelectedTxn(null)}>
          <div 
            className="detail-modal jiggle-card"
            style={{
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.05), transparent)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '2rem',
            padding: '3rem',
            width: '100%',
            maxWidth: '1100px',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: 'white',
            boxShadow: '0 0 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.15)',
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
                background: rgba(56, 189, 248, 0.2);
                border-radius: 10px;
              }
            `}</style>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    📄
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em' }}>Transaction Details</h3>
                </div>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem', marginLeft: '3.5rem' }}>Detailed audit of transaction <span style={{ color: '#38bdf8', fontWeight: '600' }}>{selectedTxn.id}</span></p>
              </div>
              <button 
                onClick={() => setSelectedTxn(null)}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
              {/* General Info */}
              <SectionBox title="General Information" icon="ℹ️" color="#38bdf8">
                <DetailRow label="TXN ID" value={selectedTxn.id} />
                <DetailRow label="Timestamp" value={selectedTxn.time} />
                <DetailRow label="Method" value={selectedTxn.type || 'N/A'} />
                <DetailRow label="Total Amount" value={selectedTxn.amount} highlight />
                <DetailRow label="Process Status" value={selectedTxn.status} status />
                <DetailRow label="Risk Probability" value={`${selectedTxn.risk}%`} risk />
                <DetailRow label="Flag Reason" value={selectedTxn.reason || 'None detected'} wrap />
              </SectionBox>

              {/* Sender Details */}
              <SectionBox title="Sender Profile" icon="👤" color="#10b981">
                <DetailRow label="Full Name" value={selectedTxn.sender?.name || 'N/A'} />
                <DetailRow label="Account Number" value={selectedTxn.sender?.account || 'N/A'} />
                <DetailRow label="Banking Entity" value={selectedTxn.sender?.bank || 'N/A'} />
                <DetailRow label="Contact Mobile" value={selectedTxn.sender?.mobile || 'N/A'} />
                <DetailRow label="Origin Location" value={selectedTxn.sender?.location || 'N/A'} />
              </SectionBox>

              {/* Receiver Details */}
              <SectionBox title="Recipient Information" icon="🏦" color="#6366f1">
                <DetailRow label="Legal Name" value={selectedTxn.receiver?.name || 'N/A'} />
                <DetailRow label="Target Account" value={selectedTxn.receiver?.account || 'N/A'} />
                <DetailRow label="Destination Bank" value={selectedTxn.receiver?.bank || 'N/A'} />
                <DetailRow label="Recipient Contact" value={selectedTxn.receiver?.mobile || 'N/A'} />
                <DetailRow label="Target Location" value={selectedTxn.receiver?.location || 'N/A'} />
              </SectionBox>

              {/* Network Details */}
              <SectionBox title="Network Metadata" icon="🌐" color="#f43f5e">
                <DetailRow label="Source IP" value={selectedTxn.ip || 'N/A'} />
                <DetailRow label="Merchant ID" value={selectedTxn.merchant} />
                <DetailRow label="Geographic Point" value={selectedTxn.location} />
                <DetailRow label="Network Node" value="Primary Gateway" />
              </SectionBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionBox = ({ title, icon, color, children }) => (
  <div style={{ 
    backgroundColor: 'rgba(30, 41, 59, 0.4)', 
    padding: '2rem', 
    borderRadius: '1.5rem', 
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
      <span style={{ color: color, fontSize: '1.2rem' }}>{icon}</span>
      <h4 style={{ color: color, fontSize: '1.15rem', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {children}
    </div>
  </div>
);

const DetailRow = ({ label, value, highlight, status, risk, wrap }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: wrap ? 'flex-start' : 'center', 
    fontSize: '0.95rem',
    gap: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    paddingBottom: '0.5rem'
  }}>
    <span style={{ color: '#64748b', flexShrink: 0, fontWeight: '500' }}>{label}</span>
    <span style={{ 
      fontWeight: highlight || status || risk ? '700' : '500',
      textAlign: 'right',
      color: risk ? (parseInt(value) > 70 ? '#ef4444' : parseInt(value) > 30 ? '#f59e0b' : '#10b981') : 
             status ? (value === 'flagged' ? '#f59e0b' : value === 'blocked' ? '#ef4444' : '#10b981') : '#f8fafc',
      textTransform: status ? 'uppercase' : 'none',
      fontSize: highlight ? '1.25rem' : '0.95rem',
      wordBreak: wrap ? 'break-word' : 'normal',
      letterSpacing: status ? '0.05em' : 'normal'
    }}>{value}</span>
  </div>
);

export default TransactionsView;
