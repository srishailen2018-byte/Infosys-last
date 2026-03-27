import React, { useState } from 'react';
import { Line, Pie, Radar, Bar } from 'react-chartjs-2';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
} from 'chart.js';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
);

const DashboardView = ({ transactions = [], stats = null, highContrast = false }) => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);

  const handleMapClick = (coords) => {
    if (zoom === 1) {
      setZoom(3);
      setCenter(coords);
    } else {
      setZoom(1);
      setCenter([0, 0]);
    }
  };

  // --- Calculate Dynamic Stats ---
  // Use backend stats if available for the summary cards, otherwise fall back to prop calculations
  const totalCount = stats ? stats.total : transactions.length;
  const fraudCountTotal = stats ? stats.fraudCount : transactions.filter(t => t.status === 'flagged' || t.status === 'blocked').length;
  const blockedCountTotal = stats ? stats.blockedCount : transactions.filter(t => t.status === 'blocked').length;

  const summaryStats = [
    { label: 'TOTAL TRANSACTIONS', value: totalCount.toLocaleString(), delta: '+Live', icon: '📈', color: '#10b981' },
    { label: 'FRAUD DETECTED', value: Math.floor(fraudCountTotal).toString(), delta: 'Detected', icon: '🛡️', color: '#ef4444' },
    { label: 'BLOCKED', value: Math.floor(blockedCountTotal).toString(), delta: 'Stopped', icon: '🚫', color: '#3b82f6' }
  ];

  // Local calculations for charts (based on the provided transactions list, which is usually the last 100)
  const fraudCountLocal = transactions.filter(t => t.status === 'flagged' || t.status === 'blocked').length;
  const blockedCountLocal = transactions.filter(t => t.status === 'blocked').length;
  const approvedCountLocal = transactions.filter(t => t.status === 'approved').length;


  // --- Dynamic Pie Chart (Status Distribution) ---
  const pieData = {
    labels: ['Approved', 'Flagged', 'Blocked'],
    datasets: [{
      data: [approvedCountLocal, fraudCountLocal - blockedCountLocal, blockedCountLocal],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };

  // --- Dynamic Bar Chart (Fraud by Merchant) ---
  const merchantFraud = {};
  transactions.filter(t => t.status !== 'approved').forEach(t => {
    merchantFraud[t.merchant] = (merchantFraud[t.merchant] || 0) + 1;
  });
  
  const barLabels = Object.keys(merchantFraud).slice(0, 5);
  const barValues = barLabels.map(label => merchantFraud[label]);

  const barData = {
    labels: barLabels.length > 0 ? barLabels : ['No Data'],
    datasets: [{
      label: 'Fraud Attempts',
      data: barValues.length > 0 ? barValues : [0],
      backgroundColor: '#f59e0b',
      borderRadius: 5
    }]
  };

  // --- Dynamic Line Chart (Volume by Time) ---
  const hourlyData = new Array(12).fill(0);
  const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  
  transactions.forEach(t => {
    const hour = parseInt(t.time.split(':')[0]);
    const index = Math.floor(hour / 2);
    hourlyData[index]++;
  });

  const lineData = {
    labels: hours,
    datasets: [{
      label: 'Volume',
      data: hourlyData,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // --- Radar Chart (Risk Factors) ---
  // Using averages from live data for risk metrics
  const totalCountLocal = transactions.length;
  const avgRisk = totalCountLocal > 0 ? transactions.reduce((acc, t) => acc + (t.risk || 0), 0) / totalCountLocal : 0;
  
  const radarData = {
    labels: ['Avg Risk', 'Max Risk', 'Fraud %', 'Blocked %', 'Alerts'],
    datasets: [{
      label: 'Live Risk Metrics',
      data: [
        avgRisk, 
        totalCountLocal > 0 ? Math.max(...transactions.map(t => t.risk || 0)) : 0,
        totalCountLocal > 0 ? (fraudCountLocal / totalCountLocal) * 100 : 0,
        totalCountLocal > 0 ? (blockedCountLocal / totalCountLocal) * 100 : 0,
        fraudCountLocal
      ],
      fill: true,
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#10b981',
      pointBackgroundColor: '#10b981',
    }]
  };

  // --- Map Markers ---
  const mapMarkers = transactions.slice(0, 10).map((t, i) => {
    // Better coordinate mapping to avoid sea markers
    const locationCoords = {
      'New York, US': [-74.006, 40.7128],
      'London, UK': [-0.1278, 51.5074],
      'Dubai, AE': [55.2708, 25.2048],
      'Paris, FR': [2.3522, 48.8566],
      'Singapore, SG': [103.8198, 1.3521],
      'Moscow, RU': [37.6173, 55.7558],
      'Mumbai, IN': [72.8777, 19.076],
      'Tokyo, JP': [139.6917, 35.6895],
      'Sydney, AU': [151.2093, -33.8688],
      'Berlin, DE': [13.405, 52.52],
      'Toronto, CA': [-79.3832, 43.6532],
      'Lagos, NG': [3.3792, 6.5244]
    };

    const seed = t.location.length;
    const defaultCoords = [((seed * 137) % 360) - 180, ((seed * 223) % 120) - 60];
    
    return {
      name: t.location,
      coordinates: locationCoords[t.location] || defaultCoords,
      status: t.status
    };
  });

  // --- AI Insights Logic ---
  const lastFraud = transactions.find(t => t.status !== 'approved');
  const aiInsight = lastFraud ? {
    message: `ALERT: Suspicious activity at ${lastFraud.merchant}. Transaction of ${lastFraud.amount} flagged due to ${lastFraud.risk}% risk score.`,
    reason: lastFraud.risk > 80 ? "Critical risk: Multiple anomaly triggers including location and time mismatch." : "Moderate risk: Unusual transaction volume for this merchant.",
    time: lastFraud.time
  } : {
    message: "System monitoring active. No critical threats detected in the last batch.",
    reason: "Current traffic patterns match normal user behavior models.",
    time: "Live"
  };

  const panelBg = highContrast ? 'black' : 'rgba(30, 41, 59, 0.7)';
  const panelBorder = highContrast ? '2px solid white' : '1px solid rgba(51, 65, 85, 0.5)';

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Fraud Monitoring Dashboard</h2>
        <p style={{ color: highContrast ? 'white' : '#94a3b8' }}>Real-time overview of transaction activity and threat detection</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {summaryStats.map(stat => (
          <div key={stat.label} className="stat-card jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: highContrast ? 'white' : '#94a3b8', letterSpacing: '0.05em' }}>{stat.label}</p>
              <span className="icon-glow" style={{ fontSize: '1.25rem', color: stat.color }}>{stat.icon}</span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{stat.value}</h3>
            <p style={{ fontSize: '0.875rem', color: stat.color }}>{stat.delta}</p>
          </div>
        ))}
      </div>

      {/* NEW: Live Map and AI Insights Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="chart-container jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Live Global Transaction Map</h3>
          <div style={{ height: '300px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', overflow: 'hidden', cursor: 'zoom-in' }}>
            <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 140 }}>
              <ZoomableGroup zoom={zoom} center={center}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        fill={highContrast ? "#333" : "#1e293b"} 
                        stroke={highContrast ? "#fff" : "#334155"} 
                        onClick={() => handleMapClick([0, 0])} // Click background to zoom out
                      />
                    ))
                  }
                </Geographies>
                {mapMarkers.map(({ name, coordinates, status }) => (
                  <Marker key={name} coordinates={coordinates} onClick={() => handleMapClick(coordinates)}>
                    <circle r={4} fill={status === 'approved' ? "#10b981" : "#ef4444"} stroke="#fff" strokeWidth={1} style={{ cursor: 'pointer' }} />
                    <circle r={10} fill={status === 'approved' ? "#10b981" : "#ef4444"} opacity={0.4} className="fraud-glow" style={{ cursor: 'pointer' }} />
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>

        <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>AI Security Insights</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 2 }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.75rem', borderLeft: `4px solid ${lastFraud ? '#ef4444' : '#10b981'}` }}>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Latest Intelligence • {aiInsight.time}</p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'white' }}>{aiInsight.message}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 243, 255, 0.05)', borderRadius: '0.75rem', border: '1px dashed rgba(0, 243, 255, 0.3)' }}>
              <p style={{ fontSize: '0.75rem', color: '#00f3ff', marginBottom: '0.5rem' }}>AI ANALYSIS</p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>{aiInsight.reason}</p>
            </div>
            <button className="glow-button jiggle-hover" style={{ marginTop: 'auto', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
              Generate Full Report
            </button>
          </div>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>System Risk Radar</h3>
          <div style={{ height: '300px' }}>
             <Radar data={radarData} options={{ maintainAspectRatio: false, scales: { r: { grid: { color: highContrast ? '#fff' : 'rgba(51, 65, 85, 0.5)' }, angleLines: { color: highContrast ? '#fff' : 'rgba(51, 65, 85, 0.5)' }, pointLabels: { color: highContrast ? '#fff' : '#94a3b8' }, ticks: { display: false } } } }} />
          </div>
        </div>
        <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Activity Volume (24h)</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: highContrast ? '#fff' : '#64748b' } }, y: { grid: { color: highContrast ? '#fff' : 'rgba(51, 65, 85, 0.5)' }, ticks: { color: highContrast ? '#fff' : '#64748b' } } } }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Status Distribution</h3>
          <div style={{ height: '250px' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: highContrast ? '#fff' : '#94a3b8' } } } }} />
          </div>
        </div>
        <div className="chart-container chart-glow jiggle-card" style={{ backgroundColor: panelBg, backdropFilter: highContrast ? 'none' : 'blur(8px)', padding: '1.5rem', borderRadius: '1rem', border: panelBorder }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Top Fraud Merchants</h3>
          <div style={{ height: '250px' }}>
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: highContrast ? '#fff' : '#64748b' } }, y: { grid: { color: highContrast ? '#fff' : 'rgba(51, 65, 85, 0.5)' }, ticks: { color: highContrast ? '#fff' : '#64748b' } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
