import React from 'react';

const ModelDetails = ({ stats }) => {
  return (
    <div className="jiggle-card" style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#d1d5db' }}>Model Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Algorithm</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Random Forest Classifier</p>
        </div>
        <div>
          <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Dataset Size</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{stats ? stats.total.toLocaleString() : '50,000'} rows</p>
        </div>
        <div>
          <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Fraud Distribution</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{stats ? ((stats.fraudCount / stats.total) * 100).toFixed(1) : '1.2'}%</p>
        </div>
        <div>
          <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Feature Count</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>6 features</p>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
