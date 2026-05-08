import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { Search, BookOpen, DollarSign, Users, Star, Archive, ArchiveRestore, Loader } from 'lucide-react';
import { getCourses, updateCourse } from '../../api/courses';
import '../../styles/teacher_pages/dashboard.css';

const adaptCourse = (c) => ({
  id: c.id,
  slug: c.slug,
  name: c.title,
  date: new Date(c.created_at).toLocaleDateString(),
  teacher: c.teacher_name || '—',
  price: c.is_free ? 'Free' : `${parseFloat(c.price || 0).toLocaleString()} DA`,
  isFree: c.is_free,
  enrolled: c.enrollment_count || 0,
  rating: c.rating || 0,
  revenue: c.is_free ? 0 : parseFloat(c.price || 0) * (c.enrollment_count || 0),
  status: c.status === 'published' ? 'Active' : c.status === 'draft' ? 'Draft' : 'Archived',
  rawStatus: c.status,
});

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    getCourses()
      .then(res => {
        const raw = res.data.results || res.data || [];
        setCourses(raw.map(adaptCourse));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleArchive = async (slug, rawStatus) => {
    const newStatus = rawStatus === 'archived' ? 'published' : 'archived';
    try {
      await updateCourse(slug, { status: newStatus });
      setCourses(prev => prev.map(c =>
        c.slug === slug
          ? { ...c, status: newStatus === 'published' ? 'Active' : 'Archived', rawStatus: newStatus }
          : c
      ));
    } catch (_) {}
  };

  const displayedCourses = courses
    .filter(c => {
      const q = search.toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q);
    })
    .filter(c => filterStatus === 'All' || c.status === filterStatus);

  const totalRevenue = courses
    .filter(c => !c.isFree && c.status === 'Active')
    .reduce((acc, c) => acc + c.revenue, 0);
  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolled, 0);
  const ratedCourses = courses.filter(c => c.rating > 0);
  const avgRating = ratedCourses.length > 0
    ? (ratedCourses.reduce((acc, c) => acc + c.rating, 0) / ratedCourses.length).toFixed(1)
    : '—';

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />

        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">Course Management</h1>
            <p className="admin-page-sub">Monitor course enrollments, revenue generation, and teacher performance.</p>
          </div>

          <div className="admin-widgets-grid">
            <StatWidget title="Total Courses" value={courses.length} icon={<BookOpen size={24} />} defaultColor="#3b82f6" trend={`${courses.filter(c => !c.isFree).length} paid, ${courses.filter(c => c.isFree).length} free`} />
            <StatWidget title="Total Revenue" value={`${totalRevenue.toLocaleString()} DA`} icon={<DollarSign size={24} />} defaultColor="#10b981" trend="All active courses" />
            <StatWidget title="Total Enrollments" value={totalEnrollments} icon={<Users size={24} />} defaultColor="#ef4444" trend="Across all courses" />
            <StatWidget title="Avg Rating" value={avgRating} icon={<Star size={24} fill="currentColor" />} defaultColor="#f97316" trend="Global course feedback" />
          </div>

          <div className="admin-table-container">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search by Course Name or Teacher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', padding: '40px 0', justifyContent: 'center' }}>
                <Loader size={18} className="spin" /> Loading courses…
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course Information</th>
                    <th>Teacher</th>
                    <th>Price</th>
                    <th>Enrollments</th>
                    <th>Rating</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCourses.map(course => (
                    <tr key={course.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar" style={{ background: '#a855f7', color: 'white', fontSize: '18px' }}>
                            <BookOpen size={18} />
                          </div>
                          <div className="admin-user-info">
                            <div className="name" style={{ fontSize: '14px' }}>{course.name}</div>
                            <div className="sub">Created: {course.date} • {course.status}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{course.teacher}</td>
                      <td>
                        {course.isFree
                          ? <span className="admin-badge success">Free</span>
                          : <span style={{ fontWeight: 800, color: '#1e293b' }}>{course.price}</span>
                        }
                      </td>
                      <td>
                        <span className="admin-badge gray"><Users size={12} style={{ marginRight: '4px' }}/> {course.enrolled}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#1e293b' }}>
                          <Star size={14} fill={course.rating > 0 ? "#f59e0b" : "none"} color="#f59e0b" />
                          {course.rating > 0 ? course.rating : '—'}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: course.revenue === 0 ? '#94a3b8' : '#10b981', fontWeight: 800 }}>
                          {course.revenue.toLocaleString()} DA
                        </span>
                      </td>
                      <td>
                        <div className="admin-action-gap">
                          {course.rawStatus === 'archived' ? (
                            <button className="admin-action-btn" title="Restore Course" onClick={() => handleToggleArchive(course.slug, course.rawStatus)}>
                              <ArchiveRestore size={16} color="#10b981" />
                            </button>
                          ) : (
                            <button className="admin-action-btn" title="Archive Course" onClick={() => handleToggleArchive(course.slug, course.rawStatus)}>
                              <Archive size={16} color="#ef4444" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedCourses.length === 0 && !loading && (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No courses found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
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

export default AdminCourses;
