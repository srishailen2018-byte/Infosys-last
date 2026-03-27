import React from 'react';

const MLModelStatus = ({ stats }) => {
  const precision = stats ? (stats.precision * 100).toFixed(1) : '95.0';
  const recall = stats ? (stats.recall * 100).toFixed(1) : '94.0';
  const f1 = stats ? (stats.f1 * 100).toFixed(1) : '94.5';

  const metrics = [
    { label: 'Precision', value: `${precision}%`, description: 'Correctly identified fraud out of all flagged', color: '#34d399' },
    { label: 'Recall', value: `${recall}%`, description: 'Fraud cases correctly identified out of all actual fraud', color: '#60a5fa' },
    { label: 'F1 Score', value: `${f1}%`, description: 'Harmonic mean of precision and recall', color: '#fbbf24' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
      {metrics.map((metric, index) => (
        <div key={index} className="jiggle-card" style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: metric.color, marginRight: '0.5rem' }}></span>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#d1d5db' }}>{metric.label}</h3>
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{metric.value}</p>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#374151', borderRadius: '2px', marginBottom: '0.5rem' }}>
            <div style={{ width: metric.value, height: '100%', backgroundColor: metric.color, borderRadius: '2px' }}></div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{metric.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MLModelStatus;
