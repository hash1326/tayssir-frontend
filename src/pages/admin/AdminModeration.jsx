import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { Search, Clock, AlertTriangle, CheckCircle2, Flag, ShieldCheck, Trash2 } from 'lucide-react';
import '../../styles/teacher_pages/dashboard.css';

const INITIAL_REPORTS = [];

const AdminModeration = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('Pending');

  const handleAdvanceStatus = (id) => {
    setReports(reports.map(r => {
      if (r.id === id) {
        if (r.status === 'Pending') return { ...r, status: 'Investigating' };
        if (r.status === 'Investigating') return { ...r, status: 'Resolved' };
      }
      return r;
    }));
  };

  const handleDelete = (id) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const displayedReports = reports
    .filter(r => r.user.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase()))
    .filter(r => r.status === activeSection);

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const investigatingCount = reports.filter(r => r.status === 'Investigating').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />
        
        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">Content Moderation Center</h1>
            <p className="admin-page-sub">Isolate platform abuse, investigate course claims, and manage student reports.</p>
          </div>

          <div className="admin-widgets-grid">
            <StatWidget title="Pending Review" value={pendingCount} icon={<Clock size={24} />} defaultColor="#ef4444" trend="High Priority" />
            <StatWidget title="Investigating" value={investigatingCount} icon={<AlertTriangle size={24} />} defaultColor="#f97316" trend="Active Operations" />
            <StatWidget title="Resolved Claims" value={resolvedCount} icon={<CheckCircle2 size={24} />} defaultColor="#10b981" trend="Archived successfully" />
            <StatWidget title="Total Tickets Logged" value={reports.length} icon={<Flag size={24} />} defaultColor="#3b82f6" trend="Since platform start" />
          </div>

          <div className="admin-pill-menu">
            <button className={`admin-pill-btn ${activeSection === 'Pending' ? 'active' : ''}`} onClick={() => setActiveSection('Pending')}>
              Pending ({pendingCount})
            </button>
            <button className={`admin-pill-btn ${activeSection === 'Investigating' ? 'active' : ''}`} onClick={() => setActiveSection('Investigating')}>
              Investigating ({investigatingCount})
            </button>
            <button className={`admin-pill-btn ${activeSection === 'Resolved' ? 'active' : ''}`} onClick={() => setActiveSection('Resolved')}>
              Resolved ({resolvedCount})
            </button>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <Search size={16} color="#94a3b8" />
                <input type="text" placeholder="Search logs via Target Email or Reason..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Violation Vector</th>
                  <th>Target Suspect</th>
                  <th>Violation Logic</th>
                  <th>Timestamp</th>
                  <th>Operation Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar" style={{ background: '#fef2f2', color: '#ef4444' }}>
                          <Flag size={18} />
                        </div>
                        <div className="admin-user-info">
                          <div className="name">{report.type}</div>
                          <div className="sub">Report ID: {report.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{report.user}</td>
                    <td style={{ color: '#64748b' }}>{report.reason}</td>
                    <td style={{ color: '#64748b' }}>{report.date}</td>
                    <td>
                      <span className={`admin-badge ${report.status === 'Resolved' ? 'success' : report.status === 'Investigating' ? 'warning' : 'danger'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-gap">
                        {report.status !== 'Resolved' && (
                          <button className="admin-action-btn" title="Escalate Ticket Status" onClick={() => handleAdvanceStatus(report.id)}>
                            <ShieldCheck size={16} color="#10b981" />
                          </button>
                        )}
                        <button className="admin-action-btn" title="Discard Ticket" onClick={() => handleDelete(report.id)}>
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedReports.length === 0 && (
                   <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No {activeSection.toLowerCase()} moderation logs found.</td></tr>
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

export default AdminModeration;
