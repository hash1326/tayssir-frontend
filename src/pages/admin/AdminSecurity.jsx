import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { Search, XCircle, AlertTriangle, CheckCircle2, Shield, ShieldOff } from 'lucide-react';
import '../../styles/teacher_pages/dashboard.css';

const INITIAL_LOGS = [];

const AdminSecurity = () => {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('login'); 

  const handleBlockIP = (id) => {
    setLogs(logs.map(l => l.id === id ? { ...l, status: 'Blocked' } : l));
  };

  const handleUnblockIP = (id) => {
    setLogs(logs.map(l => l.id === id ? { ...l, status: 'Success' } : l));
  };

  const displayedLogs = logs
    .filter(l => l.type === activeTab)
    .filter(l => l.user.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search));

  const failedCount = logs.filter(l => l.status === 'Failed').length;
  const blockedCount = logs.filter(l => l.status === 'Blocked').length;
  const successCount = logs.filter(l => l.status === 'Success').length;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />
        
        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">Security & Audit Logs</h1>
            <p className="admin-page-sub">Monitor active threats, failed authentication vectors, and manage IP blocks.</p>
          </div>

          <div className="admin-widgets-grid">
            <StatWidget title="Failed Logins" value={failedCount} icon={<XCircle size={24} />} defaultColor="#ef4444" trend="Recorded dynamically" />
            <StatWidget title="Active Threats" value={failedCount + blockedCount} icon={<AlertTriangle size={24} />} defaultColor="#f97316" trend="Under investigation" />
            <StatWidget title="Successful Logins" value={successCount} icon={<CheckCircle2 size={24} />} defaultColor="#10b981" trend="Last 24 hours" />
            <StatWidget title="Blocked IPs" value={blockedCount} icon={<Shield size={24} />} defaultColor="#3b82f6" trend="Total firewall blocks" />
          </div>

          <div className="admin-pill-menu">
            <button className={`admin-pill-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
              Login Attempts
            </button>
            <button className={`admin-pill-btn ${activeTab === 'event' ? 'active' : ''}`} onClick={() => setActiveTab('event')}>
              Security Events
            </button>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <Search size={16} color="#94a3b8" />
                <input type="text" placeholder="Trace by User or IP Address..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User / System Origin</th>
                  <th>Firewall Status</th>
                  <th>IP Address Trace</th>
                  <th>Attempts</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedLogs.map(log => (
                  <tr key={log.id}>
                     <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar" style={{ background: '#334155', color: 'white' }}>
                          <Shield size={16} />
                        </div>
                        <div className="admin-user-info">
                          <div className="name">{log.user}</div>
                          <div className="sub">AUTHENTICATION ID: {log.id}</div>
                        </div>
                      </div>
                     </td>
                     <td>
                        <span className={`admin-badge ${log.status === 'Failed' ? 'danger' : log.status === 'Blocked' ? 'gray' : 'success'}`}>
                          {log.status}
                        </span>
                     </td>
                     <td style={{ color: '#64748b', fontFamily: 'monospace' }}>{log.ip}</td>
                     <td><span style={{ fontWeight: 800 }}>{log.attempts}</span> <span style={{ color: '#94a3b8', fontSize: '11px' }}>strikes</span></td>
                     <td style={{ color: '#64748b' }}>{log.timestamp}</td>
                     <td>
                       <div className="admin-action-gap">
                         {log.status !== 'Blocked' ? (
                           <button className="admin-action-btn" title="Initiate IP Block" onClick={() => handleBlockIP(log.id)}>
                             <ShieldOff size={16} color="#ef4444" />
                           </button>
                         ) : (
                           <button className="admin-action-btn" title="Lift IP Ban" onClick={() => handleUnblockIP(log.id)}>
                             <CheckCircle2 size={16} color="#10b981" />
                           </button>
                         )}
                       </div>
                     </td>
                  </tr>
                ))}
                {displayedLogs.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No security anomalies found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatWidget = ({ title, value, icon, defaultColor, trend }) => (
  <div className="admin-stat-widget">
    <div className="stat-widget-glow" style={{ background: defaultColor }}></div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', margin: '0 0 20px 0' }}>
      <div className="stat-widget-iconbox" style={{ background: `${defaultColor}15`, color: defaultColor }}>{icon}</div>
    </div>
    <div className="stat-widget-value">{value}</div>
    <div className="stat-widget-title">{title}</div>
    <div className="stat-widget-trend">{trend}</div>
  </div>
);

export default AdminSecurity;
