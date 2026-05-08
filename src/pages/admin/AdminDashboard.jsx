import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { Users, GraduationCap, BookOpen, DollarSign, Bell, Activity } from 'lucide-react';
import { getDashboard } from '../../api/admin';
import '../../styles/teacher_pages/dashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const fmtNumber = (n) => (n || 0).toLocaleString();

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />

        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <p className="admin-page-sub">Here's what's happening on your platform today.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div className="admin-widgets-grid">
            <StatWidget
              title="Total Users"
              value={loading ? '…' : fmtNumber(data?.users?.total)}
              icon={<Users size={24} />}
              defaultColor="#3b82f6"
              trend={`${data?.users?.students || 0} students · ${data?.users?.teachers || 0} teachers`}
            />
            <StatWidget
              title="Approved Teachers"
              value={loading ? '…' : fmtNumber(data?.users?.teachers_approved)}
              icon={<GraduationCap size={24} />}
              defaultColor="#8b5cf6"
              trend={`${data?.users?.teachers || 0} total signups`}
            />
            <StatWidget
              title="Published Courses"
              value={loading ? '…' : fmtNumber(data?.courses?.published)}
              icon={<BookOpen size={24} />}
              defaultColor="#ec4899"
              trend={`${data?.courses?.draft || 0} draft · ${data?.courses?.archived || 0} archived`}
            />
            <StatWidget
              title="Total Revenue"
              value={loading ? '…' : `${fmtNumber(parseFloat(data?.revenue_estimate || 0))} DA`}
              icon={<DollarSign size={24} />}
              defaultColor="#10b981"
              trend={`${data?.enrollments?.active || 0} active enrollments`}
            />
          </div>

          <div className="admin-2col-layout">
            <div className="admin-widget-panel">
              <div className="admin-widget-header">
                <h3 className="admin-widget-title">
                  <Bell size={20} className="icon-sub" />
                  Platform Stats
                </h3>
                <span className="admin-badge-notice">Live</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <StatRow label="Active enrollments" value={data?.enrollments?.active || 0} />
                <StatRow label="Completed enrollments" value={data?.enrollments?.completed || 0} />
                <StatRow label="Cancelled enrollments" value={data?.enrollments?.cancelled || 0} />
                <StatRow label="Admins" value={data?.users?.admins || 0} />
              </div>
            </div>

            <div className="admin-widget-panel">
              <div className="admin-widget-header">
                <h3 className="admin-widget-title">
                  <Activity size={20} className="icon-sub" />
                  Recent Signups
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {(data?.recent_users || []).length === 0 && !loading && (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No recent signups.</p>
                )}
                {(data?.recent_users || []).map((u) => (
                  <ActivityItem
                    key={u.id}
                    icon={<Users size={16} />}
                    color={u.role === 'teacher' ? '#8b5cf6' : '#3b82f6'}
                    title={`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email}
                    time={`${u.role} · ${new Date(u.date_joined).toLocaleDateString()}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>{label}</span>
    <span style={{ color: '#1e293b', fontSize: '16px', fontWeight: 700 }}>{value.toLocaleString()}</span>
  </div>
);

const StatWidget = ({ title, value, icon, defaultColor, trend }) => (
  <div className="admin-stat-widget">
    <div className="stat-widget-glow" style={{ background: defaultColor }}></div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div className="stat-widget-iconbox" style={{ background: `${defaultColor}15`, color: defaultColor }}>
        {icon}
      </div>
    </div>
    <div className="stat-widget-value">{value}</div>
    <div className="stat-widget-title">{title}</div>
    <div className="stat-widget-trend">{trend}</div>
  </div>
);

const ActivityItem = ({ icon, color, title, time }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }} className="admin-page-title">{title}</div>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }} className="admin-page-sub">{time}</div>
    </div>
  </div>
);

export default AdminDashboard;
