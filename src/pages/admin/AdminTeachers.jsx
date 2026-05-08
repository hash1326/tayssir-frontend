import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import {
  Users, XCircle, Clock, CheckCircle2, FileText,
  Check, X, RotateCcw, Search,
} from 'lucide-react';
import { listApplications, reviewApplication } from '../../api/teacher_applications';
import '../../styles/teacher_pages/dashboard.css';

const STATUS_MAP = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const AdminTeachers = () => {
  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState('Pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await listApplications();
      const list = data.results || data;
      setApplications(list);
    } catch (err) {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await reviewApplication(id, newStatus.toLowerCase());
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus.toLowerCase() } : a))
      );
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.detail || 'unknown error'));
    }
  };

  const items = applications.map((a) => {
    const fullName = a.user_name || a.user_email;
    const initials = (fullName || '?')
      .split(' ').filter(Boolean).slice(0, 2)
      .map((p) => p[0]).join('').toUpperCase() || '?';
    return {
      id: a.id,
      name: fullName,
      email: a.user_email,
      initials,
      subject: a.specialization || 'N/A',
      exp: a.teaching_experience || 'N/A',
      applied: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recently',
      status: STATUS_MAP[a.status] || 'Pending',
    };
  });

  const pendingList = items.filter((t) => t.status === 'Pending');
  const approvedList = items.filter((t) => t.status === 'Approved');
  const rejectedList = items.filter((t) => t.status === 'Rejected');

  const displayedList = items
    .filter((t) => t.status === activeSection)
    .filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
      || t.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalActive = approvedList.length;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />

        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">Teacher Management</h1>
            <p className="admin-page-sub">Review, approve, or suspend teacher applications.</p>
          </div>

          <div className="admin-widgets-grid">
            <StatWidget title="Pending Requests" value={pendingList.length} icon={<Clock size={24} />} color="#f97316" />
            <StatWidget title="Accepted" value={approvedList.length} icon={<CheckCircle2 size={24} />} color="#10b981" />
            <StatWidget title="Rejected" value={rejectedList.length} icon={<XCircle size={24} />} color="#ef4444" />
            <StatWidget title="Total Active" value={totalActive} icon={<Users size={24} />} color="#3b82f6" />
          </div>

          <div className="admin-pill-menu">
            <button className={`admin-pill-btn ${activeSection === 'Pending' ? 'active' : ''}`} onClick={() => setActiveSection('Pending')}>
              Pending Requests ({pendingList.length})
            </button>
            <button className={`admin-pill-btn ${activeSection === 'Approved' ? 'active' : ''}`} onClick={() => setActiveSection('Approved')}>
              Approved Teachers ({approvedList.length})
            </button>
            <button className={`admin-pill-btn ${activeSection === 'Rejected' ? 'active' : ''}`} onClick={() => setActiveSection('Rejected')}>
              Rejected ({rejectedList.length})
            </button>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search by Teacher Name or Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Contact Info</th>
                  <th>Experience</th>
                  <th>Date Logged</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Loading…</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#ef4444' }}>{error}</td></tr>
                ) : displayedList.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No teachers found within the {activeSection} bucket.</td></tr>
                ) : (
                  displayedList.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar" style={{ background: '#e0e7ff', color: '#4f46e5' }}>{t.initials}</div>
                          <div className="admin-user-info">
                            <div className="name">{t.name}</div>
                            <div className="sub">{t.subject}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{t.email}</td>
                      <td><span className="admin-badge gray">{t.exp}</span></td>
                      <td style={{ color: '#64748b' }}>{t.applied}</td>
                      <td>
                        <div className="admin-action-gap">
                          {activeSection === 'Pending' && (
                            <>
                              <button className="admin-action-btn" title="View"><FileText size={16} /></button>
                              <button className="admin-action-btn" title="Approve" onClick={() => updateStatus(t.id, 'Approved')}><Check size={16} color="#10b981" /></button>
                              <button className="admin-action-btn" title="Reject" onClick={() => updateStatus(t.id, 'Rejected')}><X size={16} color="#ef4444" /></button>
                            </>
                          )}
                          {activeSection === 'Approved' && (
                            <button className="admin-action-btn" title="Suspend" onClick={() => updateStatus(t.id, 'Rejected')} style={{ borderColor: '#fee2e2', color: '#ef4444' }}>
                              <XCircle size={14} style={{ marginRight: '6px' }} /> Suspend
                            </button>
                          )}
                          {activeSection === 'Rejected' && (
                            <button className="admin-action-btn" title="Re-evaluate" onClick={() => updateStatus(t.id, 'Approved')} style={{ borderColor: '#f1f5f9', color: '#f97316' }}>
                              <RotateCcw size={14} style={{ marginRight: '6px' }} /> Re-evaluate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatWidget = ({ title, value, icon, color }) => (
  <div className="admin-stat-widget">
    <div className="stat-widget-glow" style={{ background: color }}></div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div className="stat-widget-iconbox" style={{ background: `${color}15`, color }}>{icon}</div>
    </div>
    <div className="stat-widget-value">{value}</div>
    <div className="stat-widget-title" style={{ marginBottom: 0 }}>{title}</div>
  </div>
);

export default AdminTeachers;
