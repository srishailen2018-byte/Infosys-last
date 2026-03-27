import React from 'react';

const Sidebar = ({ activeSection, onNavigate, userEmail, userRole, onLogout, highContrast }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊', adminOnly: false },
    { name: 'Simulation', icon: '⚡', adminOnly: false },
    { name: 'Detection', icon: '🛡️', adminOnly: false },
    { name: 'Analytics', icon: '📈', adminOnly: false },
    { name: 'Transactions', icon: '💸', adminOnly: false },
    { name: 'Audit Logs', icon: '📋', adminOnly: true },
    { name: 'Settings', icon: '⚙️', adminOnly: true }
  ];

  const currentRole = userRole || localStorage.getItem('userRole');
  const normalizedRole = currentRole?.toLowerCase() || '';
  const normalizedEmail = userEmail?.toLowerCase() || '';

  // Explicit check for known Admin emails as a robust fallback
  const isAdminEmail = [
    'fg@gmail.com', 
    'srishailen2018_bai27@mepcoeng.ac.in', 
    'srill@gmail.com'
  ].includes(normalizedEmail);

  const isAdmin = normalizedRole === 'admin' || isAdminEmail;

  return (
    <aside style={{ 
      width: '260px', 
      backgroundColor: highContrast ? 'black' : 'transparent', 
      padding: '1.5rem', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: highContrast ? '2px solid white' : '1px solid #1e293b'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>F</div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>FraudShield</h1>
      </div>
      
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map(item => {
            const isRestricted = item.adminOnly && !isAdmin;
            
            return (
              <li key={item.name} style={{ marginBottom: '0.5rem' }}>
                <button 
                  onClick={() => !isRestricted && onNavigate(item.name)}
                  title={isRestricted ? 'Admin Access Required' : ''}
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    border: highContrast && activeSection === item.name ? '2px solid white' : 'none',
                    cursor: isRestricted ? 'not-allowed' : 'pointer',
                    color: isRestricted 
                      ? '#475569' 
                      : (activeSection === item.name ? '#10b981' : (highContrast ? 'white' : '#94a3b8')), 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem', 
                    borderRadius: '0.75rem', 
                    backgroundColor: activeSection === item.name ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    transition: 'all 0.2s',
                    fontSize: '0.95rem',
                    fontWeight: activeSection === item.name ? '600' : '400',
                    opacity: isRestricted ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="icon-glow" style={{ 
                      fontSize: '1.1rem',
                      filter: isRestricted ? 'grayscale(1) brightness(0.5)' : 'none'
                    }}>{item.icon}</span>
                    {item.name}
                  </div>
                  {isRestricted && <span style={{ fontSize: '0.8rem' }}>🔒</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: highContrast ? 'black' : '#1e293b', border: highContrast ? '1px solid white' : 'none', borderRadius: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: highContrast ? 'white' : '#64748b', marginBottom: '0.25rem' }}>Logged in as</p>
          <p style={{ fontSize: '0.875rem', color: 'white', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</p>
        </div>
        
        <button 
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: highContrast ? 'white' : 'rgba(239, 68, 68, 0.1)',
            color: highContrast ? 'black' : '#ef4444',
            border: highContrast ? 'none' : '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🚪</span> Logout
        </button>

        <div style={{ padding: '1rem', backgroundColor: highContrast ? 'black' : '#1e293b', border: highContrast ? '1px solid white' : 'none', borderRadius: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: highContrast ? 'white' : '#64748b', marginBottom: '0.25rem' }}>Model Status</p>
          <p style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Operational
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
