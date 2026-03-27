import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DetectionView = () => {
  const [rules, setRules] = useState([
    { id: 1, name: 'High Amount Threshold', type: 'rule-based', desc: 'Flag transactions exceeding configurable amount threshold per account tier', triggers: 142, active: true },
    { id: 2, name: 'Velocity Check', type: 'rule-based', desc: 'Detect multiple transactions within a short time window from the same account', triggers: 89, active: true },
    { id: 3, name: 'Geo-Location Anomaly', type: 'rule-based', desc: 'Flag transactions from unusual or high-risk geographic locations', triggers: 67, active: true },
    { id: 4, name: 'Account Behavior Model', type: 'ml-based', desc: 'ML model analyzing deviation from normal account spending patterns', triggers: 203, active: true },
    { id: 5, name: 'Merchant Blacklist', type: 'rule-based', desc: 'Block transactions from known fraudulent or suspicious merchant IDs', triggers: 31, active: true },
    { id: 6, name: 'Neural Network Classifier', type: 'ml-based', desc: 'Deep learning model for multi-factor threat probability scoring', triggers: 512, active: false }
  ]);

  const toggleRule = (id) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const chartData = {
    labels: ['Card Not Present', 'Account Takeover', 'Identity Theft', 'Wire Fraud', 'Phishing', 'Chargeback'],
    datasets: [
      {
        label: 'Fraud Count',
        data: [45, 38, 32, 28, 22, 15],
        backgroundColor: '#ef4444',
        borderRadius: 4,
        barThickness: 20
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } },
      y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Anomaly Detection & Alerts</h2>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Configure detection rules, review alerts, and manage fraud prevention strategies</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Detection Rules</h3>
            <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 'bold' }}>
              {rules.filter(r => r.active).length} / {rules.length} Active
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rules.map((rule) => (
              <div key={rule.id} style={{ padding: '1.25rem', backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b', opacity: rule.active ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <p style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>{rule.name}</p>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', backgroundColor: '#1e293b', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>{rule.type}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{rule.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>{rule.triggers}</p>
                      <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>Triggers (30d)</p>
                    </div>
                    {/* Toggle Switch */}
                    <div 
                      onClick={() => toggleRule(rule.id)}
                      style={{ 
                        width: '44px', 
                        height: '24px', 
                        backgroundColor: rule.active ? '#10b981' : '#334155', 
                        borderRadius: '12px', 
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{ 
                        width: '18px', 
                        height: '18px', 
                        backgroundColor: 'white', 
                        borderRadius: '50%', 
                        position: 'absolute', 
                        top: '3px', 
                        left: rule.active ? '23px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Fraud by Category (30d)</h3>
          <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionView;
