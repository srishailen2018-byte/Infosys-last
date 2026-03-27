import React, { useState } from 'react';

const SimulationView = ({ onRunBatch, onRunSingle, isStreaming, onToggleStream }) => {
  const [scenario, setScenario] = useState('Mixed (Normal + Fraud)');
  const [batchSize, setBatchSize] = useState(50);
  const [fraudRatio, setFraudRatio] = useState(15);
  const [maxAmount, setMaxAmount] = useState(10000);
  const [rules, setRules] = useState({ geo: true, velocity: true });

  // Single Transaction State
  const [singleTxn, setSingleTxn] = useState({
    amount: '',
    merchant: 'Amazon',
    category: 'Shopping',
    location: 'New York, US',
    isNight: false,
    locationRisk: false,
    merchantRisk: false,
    velocityRisk: false
  });

  const handleRunBatch = () => {
    onRunBatch({ scenario, batchSize, fraudRatio, maxAmount, rules });
  };

  const handleRunSingle = (e) => {
    e.preventDefault();
    onRunSingle(singleTxn);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Transaction Simulation Engine</h2>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Generate synthetic transactions to test anomaly detection rules and fraud scenarios</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Batch Simulation */}
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#10b981' }}>⚡</span> Batch Simulation
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Scenario</p>
              <select 
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white' }}
              >
                <option>Mixed (Normal + Fraud)</option>
                <option>Normal Traffic Only</option>
                <option>High Velocity Attack</option>
                <option>Geo-Location Anomaly</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Transactions per batch</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{batchSize}</p>
              </div>
              <input type="range" min="10" max="500" value={batchSize} onChange={(e) => setBatchSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
            </div>

            <button onClick={handleRunBatch} style={{ width: '100%', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Run Batch Simulation
            </button>
          </div>
        </div>

        {/* Single Transaction Generation */}
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#3b82f6' }}>📝</span> Single Transaction Generation
          </h3>

          <form onSubmit={handleRunSingle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Amount ($)</p>
                <input 
                  type="number" required
                  value={singleTxn.amount}
                  onChange={(e) => setSingleTxn({...singleTxn, amount: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Category</p>
                <select 
                  value={singleTxn.category}
                  onChange={(e) => setSingleTxn({...singleTxn, category: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option>Shopping</option>
                  <option>Entertainment</option>
                  <option>Food & Dining</option>
                  <option>Travel</option>
                  <option>Health</option>
                  <option>Transfer</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Merchant</p>
                <select 
                  value={singleTxn.merchant}
                  onChange={(e) => setSingleTxn({...singleTxn, merchant: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option>Amazon</option>
                  <option>Apple Store</option>
                  <option>Netflix</option>
                  <option>Starbucks</option>
                  <option>Uber</option>
                  <option>Unknown Vendor</option>
                </select>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Location</p>
                <select 
                  value={singleTxn.location}
                  onChange={(e) => setSingleTxn({...singleTxn, location: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option>New York, US</option>
                  <option>London, UK</option>
                  <option>Dubai, AE</option>
                  <option>Paris, FR</option>
                  <option>Singapore, SG</option>
                  <option>Moscow, RU</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={singleTxn.isNight} 
                  onChange={(e) => setSingleTxn({...singleTxn, isNight: e.target.checked})}
                  style={{ accentColor: '#3b82f6' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Night</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={singleTxn.locationRisk} 
                  onChange={(e) => setSingleTxn({...singleTxn, locationRisk: e.target.checked})}
                  style={{ accentColor: '#3b82f6' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Location Risk</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={singleTxn.merchantRisk} 
                  onChange={(e) => setSingleTxn({...singleTxn, merchantRisk: e.target.checked})}
                  style={{ accentColor: '#3b82f6' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Merchant Risk</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={singleTxn.velocityRisk} 
                  onChange={(e) => setSingleTxn({...singleTxn, velocityRisk: e.target.checked})}
                  style={{ accentColor: '#3b82f6' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Velocity Risk</p>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Generate Single Transaction
            </button>
          </form>
        </div>
      </div>

      {/* Real-Time API Stream */}
      <div style={{ marginTop: '2rem', backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: isStreaming ? '2px solid #00f3ff' : '1px solid #334155', boxShadow: isStreaming ? '0 0 20px rgba(0, 243, 255, 0.2)' : 'none', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#00f3ff' }}>🌐</span> Real-Time API Stream
              {isStreaming && <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(0, 243, 255, 0.2)', color: '#00f3ff', padding: '0.25rem 0.6rem', borderRadius: '1rem', animation: 'pulse 2s infinite' }}>LIVE</span>}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
              {isStreaming 
                ? 'Streaming live randomized transactions to the API endpoint...' 
                : 'Automate the simulation by starting a real-time data feed.'}
            </p>
          </div>
          <button 
            onClick={onToggleStream}
            style={{ 
              padding: '0.75rem 2rem', 
              backgroundColor: isStreaming ? '#ef4444' : '#00f3ff', 
              color: isStreaming ? 'white' : '#000', 
              border: 'none', 
              borderRadius: '0.75rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isStreaming ? '0 0 15px rgba(239, 68, 68, 0.3)' : '0 0 15px rgba(0, 243, 255, 0.3)'
            }}
          >
            {isStreaming ? 'Stop API Stream' : 'Start API Stream'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationView;
