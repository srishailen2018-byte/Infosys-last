import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MLModelStatus from './MLModelStatus';
import ModelDetails from './ModelDetails';
import MLPerformanceChart from './MLPerformanceChart';
import DashboardView from './DashboardView';
import SimulationView from './SimulationView';
import DetectionView from './DetectionView';
import TransactionsView from './TransactionsView';
import AuditLogsView from './AuditLogsView';
import SettingsView from './SettingsView';
import Chatbot from './Chatbot';
import axios from 'axios';

const Dashboard = ({ userEmail, userRole, onLogout }) => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [mailCount, setMailCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [backendStats, setBackendStats] = useState(null);
  const [highContrast, setHighContrast] = useState(false);

  const API_URL = "http://localhost:5000";

  // Fetch data from MySQL via Backend on mount and periodic refresh
  const fetchData = async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/stats`);
      setBackendStats(statsRes.data);

      const txnRes = await axios.get(`${API_URL}/transactions`);
      setTransactions(txnRes.data);

      // Only fetch audit logs for Admins
      const currentRole = userRole || localStorage.getItem('userRole');
      const currentEmail = userEmail || localStorage.getItem('userEmail');
      const isAdmin = currentRole?.toLowerCase() === 'admin' || 
                      ['fg@gmail.com', 'srishailen2018_bai27@mepcoeng.ac.in', 'srill@gmail.com'].includes(currentEmail?.toLowerCase());

      if (isAdmin) {
        const auditRes = await axios.get(`${API_URL}/auditLogs`);
        setAuditLogs(auditRes.data);
      }
      
      // NOTE: Alerts are now only triggered by user actions (Run Batch / Run Single)
      // to avoid re-alerting on old database records.
    } catch (err) {
      console.error("Error fetching from MySQL backend:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const handleRunBatch = async (params) => {
    try {
      const res = await axios.post(`${API_URL}/mlBatchCheck`, { ...params, userEmail });
      const newTxns = res.data;
      
      // Trigger alerts for any fraud in this batch
      const newAlerts = newTxns.filter(t => t.status !== 'approved');
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
        setMailCount(prev => prev + newAlerts.length);
      }

      // Refresh data
      setTimeout(() => {
        fetchData();
        setActiveSection('Transactions');
      }, 500);
    } catch (err) {
      console.error("Batch Simulation Error:", err);
    }
  };

  const handleRunSingle = async (data, isStream = false) => {
    try {
      // Connect to REAL ML Backend API which saves to MySQL
      const payload = {
        amount: parseFloat(data.amount),
        is_night: data.isNight ? 1 : 0,
        location: data.location,
        merchant: data.merchant,
        location_risk: data.locationRisk ? 1 : 0, 
        merchant_risk: data.merchantRisk ? 1 : 0,
        velocity_flag: data.velocityRisk ? 1 : 0,
        userEmail: userEmail
      };

      const res = await axios.post(`${API_URL}/mlFraudCheck`, payload);
      const newTxn = res.data;

      // Trigger alert if fraud
      if (newTxn.status !== 'approved') {
        setAlerts(prev => [newTxn, ...prev].slice(0, 20));
        setMailCount(prev => prev + 1);
      }
      
      // Wait a bit for DB to commit
      setTimeout(() => {
        fetchData();
        if (!isStream) setActiveSection('Transactions');
      }, 500);
    } catch (err) {
      console.error("ML API Error:", err);
    }
  };

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  // Real-Time Streaming Interval
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        const merchants = ['Amazon', 'Apple Store', 'Netflix', 'Starbucks', 'Uber', 'Unknown Vendor'];
        const locations = ['New York, US', 'London, UK', 'Dubai, AE', 'Paris, FR', 'Singapore, SG', 'Moscow, RU'];
        
        const randomTxn = {
          amount: Math.floor(Math.random() * 15000) + 50,
          merchant: merchants[Math.floor(Math.random() * merchants.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          isNight: Math.random() > 0.7,
          locationRisk: Math.random() > 0.85,
          merchantRisk: Math.random() > 0.9,
          velocityRisk: Math.random() > 0.8
        };
        
        handleRunSingle(randomTxn, true);
      }, 5000); // New random transaction every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isStreaming, userEmail]);

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleClearMails = () => {
    setMailCount(0);
  };

  const renderContent = () => {
    const currentRole = userRole || localStorage.getItem('userRole');
    const currentEmail = userEmail || localStorage.getItem('userEmail');
    const isAdmin = currentRole?.toLowerCase() === 'admin' || 
                    ['fg@gmail.com', 'srishailen2018_bai27@mepcoeng.ac.in', 'srill@gmail.com'].includes(currentEmail?.toLowerCase());

    switch (activeSection) {
      case 'Dashboard':
        return <DashboardView transactions={transactions} alerts={alerts} onClearAlerts={handleClearAlerts} stats={backendStats} highContrast={highContrast} />;
      case 'Simulation':
        return <SimulationView onRunBatch={handleRunBatch} onRunSingle={handleRunSingle} isStreaming={isStreaming} onToggleStream={handleToggleStream} highContrast={highContrast} />;
      case 'Detection':
        return <DetectionView highContrast={highContrast} />;
      case 'Analytics':
        return (
          <div style={{ padding: '2rem' }}>
            <MLModelStatus stats={backendStats} highContrast={highContrast} />
            <ModelDetails stats={backendStats} highContrast={highContrast} />
            <MLPerformanceChart highContrast={highContrast} />
          </div>
        );
      case 'Transactions':
        return <TransactionsView transactions={transactions} />;
      case 'Audit Logs':
        // Double check role even for rendering
        return isAdmin ? 
          <AuditLogsView auditLogs={auditLogs} /> : 
          <DashboardView transactions={transactions} alerts={alerts} onClearAlerts={handleClearAlerts} stats={backendStats} highContrast={highContrast} />;
      case 'Settings':
        // Pass userEmail for Admin management and check role
        return isAdmin ? 
          <SettingsView highContrast={highContrast} userEmail={userEmail} /> : 
          <DashboardView transactions={transactions} alerts={alerts} onClearAlerts={handleClearAlerts} stats={backendStats} highContrast={highContrast} />;
      default:
        return <DashboardView transactions={transactions} alerts={alerts} onClearAlerts={handleClearAlerts} stats={backendStats} highContrast={highContrast} />;
    }
  };

  const bgGradient = highContrast 
    ? 'black' 
    : 'radial-gradient(circle at top left, #2d0b3a, #0f172a 70%)';

  return (
    <div style={{ display: 'flex', height: '100vh', background: bgGradient, color: 'white', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} userEmail={userEmail} userRole={userRole} onLogout={onLogout} highContrast={highContrast} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        <Header 
          activeSection={activeSection} 
          alerts={alerts} 
          onClearAlerts={handleClearAlerts} 
          mailCount={mailCount} 
          onClearMails={handleClearMails} 
          highContrast={highContrast} 
          setHighContrast={setHighContrast} 
          onLogout={onLogout}
        />
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem', position: 'relative' }}>
          {renderContent()}
        </div>
        <Chatbot highContrast={highContrast} onTriggerSimulation={handleRunBatch} />
      </main>
    </div>
  );
};

export default Dashboard;
