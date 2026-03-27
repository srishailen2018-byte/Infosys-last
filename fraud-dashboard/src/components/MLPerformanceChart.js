import React from 'react';
import { Line, Pie, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
);

const MLPerformanceChart = () => {
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Precision',
        data: [92, 93, 91, 94, 95, 94],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Recall',
        data: [88, 89, 91, 90, 92, 93],
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.5)',
        tension: 0.4,
      },
      {
        label: 'F1 Score',
        data: [90, 91, 91, 92, 93, 93.5],
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Model Confidence', 'Error Rate'],
    datasets: [{
      data: [94.5, 5.5],
      backgroundColor: ['#10b981', '#334155'],
      borderWidth: 0,
      cutout: '80%'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ca3af' },
      },
    },
    scales: {
      y: {
        min: 80,
        max: 100,
        ticks: { color: '#9ca3af', callback: (value) => value + '%' },
        grid: { color: '#374151' },
      },
      x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
      <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', height: '400px', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#d1d5db' }}>Performance Over Time</h3>
        <Line options={options} data={lineData} />
      </div>

      <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#d1d5db' }}>Overall Model Health</h3>
        <div style={{ position: 'relative', width: '200px', height: '200px', marginTop: '2rem' }}>
          <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>94.5%</p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>F1 Score</p>
          </div>
        </div>
        <div style={{ marginTop: '2.5rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Training Loss</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>0.042</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Validation Accuracy</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>96.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPerformanceChart;
