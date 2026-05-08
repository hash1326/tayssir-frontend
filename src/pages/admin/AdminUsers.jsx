import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { Users as UsersIcon, GraduationCap, Search, CheckCircle2, ShieldAlert, XOctagon } from 'lucide-react';
import { getAdminUsers, banUser } from '../../api/admin';
import '../../styles/teacher_pages/dashboard.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('student');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getAdminUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBanToggle = async (id) => {
    try {
      const res = await banUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: res.data.is_active } : u))
      );
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const toRow = (u) => ({
    id: u.id,
    type: u.role,
    name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
    email: u.email,
    initials: `${(u.first_name || ' ')[0]}${(u.last_name || ' ')[0]}`.toUpperCase(),
    joined: new Date(u.date_joined).toLocaleDateString(),
    isActive: u.is_active,
  });

  const displayedList = users
    .filter((u) => u.role === activeSection)
    .filter((u) => {
      const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      return name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    })
    .map(toRow);

  const studentsCount = users.filter((u) => u.role === 'student').length;
  const teachersCount = users.filter((u) => u.role === 'teacher').length;
  const bannedCount = users.filter((u) => !u.is_active).length;
  const activeCount = users.filter((u) => u.is_active).length;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />
        
        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">User Management</h1>
            <p className="admin-page-sub">Comprehensive overview and access control for all students and teachers.</p>
          </div>

          <div className="admin-widgets-grid">
            <StatWidget title="Total Students" value={studentsCount} icon={<UsersIcon size={24} />} defaultColor="#3b82f6" />
            <StatWidget title="Total Teachers" value={teachersCount} icon={<GraduationCap size={24} />} defaultColor="#8b5cf6" />
            <StatWidget title="Active Accounts" value={activeCount} icon={<CheckCircle2 size={24} />} defaultColor="#10b981" />
            <StatWidget title="Banned Users" value={bannedCount} icon={<ShieldAlert size={24} />} defaultColor="#ef4444" />
          </div>

          <div className="admin-pill-menu">
            <button className={`admin-pill-btn ${activeSection === 'student' ? 'active' : ''}`} onClick={() => setActiveSection('student')}>
              Students ({studentsCount})
            </button>
            <button className={`admin-pill-btn ${activeSection === 'teacher' ? 'active' : ''}`} onClick={() => setActiveSection('teacher')}>
              Teachers ({teachersCount})
            </button>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeSection} list via name or email...`} 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{activeSection === 'student' ? 'Student' : 'Teacher'} Profile</th>
                  <th>Primary Contact</th>
                  <th>Date Joined</th>
                  <th>System Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Loading…</td></tr>
                )}
                {!loading && displayedList.map(u => (
                  <tr key={u.id} style={{ opacity: !u.isActive ? 0.7 : 1 }}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar" style={{ background: !u.isActive ? '#fee2e2' : '#e0e7ff', color: !u.isActive ? '#ef4444' : '#4f46e5' }}>
                          {u.initials}
                        </div>
                        <div className="admin-user-info">
                          <div className="name" style={{ fontSize: '14px' }}>{u.name}</div>
                          <div className="sub">{u.type.toUpperCase()} ACCOUNT</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{u.email}</td>
                    <td style={{ color: '#64748b' }}>{u.joined}</td>
                    <td>
                      <span className={`admin-badge ${u.isActive ? 'success' : 'danger'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-gap">
                        {!u.isActive ? (
                          <button className="admin-action-btn" title="Restore User" onClick={() => handleBanToggle(u.id)}>
                            <CheckCircle2 size={16} color="#10b981" />
                          </button>
                        ) : (
                          <button className="admin-action-btn" title="Ban User" onClick={() => handleBanToggle(u.id)}>
                            <XOctagon size={16} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && displayedList.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatWidget = ({ title, value, icon, defaultColor }) => (
  <div className="admin-stat-widget">
    <div className="stat-widget-glow" style={{ background: defaultColor }}></div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div className="stat-widget-iconbox" style={{ background: `${defaultColor}15`, color: defaultColor }}>{icon}</div>
    </div>
    <div className="stat-widget-value">{value}</div>
    <div className="stat-widget-title" style={{ marginBottom: 0 }}>{title}</div>
  </div>
);

export default AdminUsers;
