import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { Search, Book, Download, CheckCircle, Clock, CheckCircle2, Trash2, CopyX } from 'lucide-react';
import { getDocuments, deleteDocument } from '../../api/library';
import '../../styles/teacher_pages/dashboard.css';

const AdminLibrary = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    getDocuments()
      .then(res => setBooks((res.data.results || res.data || []).map(d => {
        const uploaderName = d.uploaded_by
          ? `${d.uploaded_by.first_name || ''} ${d.uploaded_by.last_name || ''}`.trim() || d.uploaded_by.email || 'Unknown'
          : 'Unknown';
        return {
          id: d.id,
          name: d.title,
          author: uploaderName,
          uploader: uploaderName,
          downloads: 0,
          size: d.size_bytes > 0 ? `${(d.size_bytes / 1024 / 1024).toFixed(1)} MB` : '—',
          status: 'Approved',
          fileUrl: d.file,
        };
      })))
      .catch(() => {});
  }, []);

  const handleApprove = (id) => {
    setBooks(books.map(b => b.id === id ? { ...b, status: 'Approved' } : b));
  };

  const handleDelete = (id) => {
    deleteDocument(id).catch(() => {});
    setBooks(books.filter(b => b.id !== id));
  };

  const displayedBooks = books
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    .filter(b => filterStatus === 'All' ? true : b.status === filterStatus);

  const totalDownloads = books.reduce((acc, curr) => acc + curr.downloads, 0);
  const pendingCount = books.filter(b => b.status === 'Pending').length;
  const approvedCount = books.filter(b => b.status === 'Approved').length;

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />
        
        <div className="content">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="admin-page-title">Digital Library Management</h1>
            <p className="admin-page-sub">Audit global library uploads to ensure content quality and proper verification.</p>
          </div>

          <div className="admin-widgets-grid">
            <StatWidget title="Total Books" value={books.length} icon={<Book size={24} />} defaultColor="#3b82f6" trend="Across all categories" />
            <StatWidget title="Total Downloads" value={totalDownloads} icon={<Download size={24} />} defaultColor="#10b981" trend="Lifetime platform hits" />
            <StatWidget title="Approved Matrix" value={approvedCount} icon={<CheckCircle size={24} />} defaultColor="#f97316" trend="Verificated materials" />
            <StatWidget title="Pending Review" value={pendingCount} icon={<Clock size={24} />} defaultColor="#ef4444" trend="Requiring active approval" />
          </div>

          <div className="admin-table-container">
            <div className="admin-table-toolbar">
              <div className="admin-table-search">
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search Library by Title or Author..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Verification Status</option>
                  <option value="Approved">Verified (Approved)</option>
                  <option value="Pending">Unverified (Pending)</option>
                </select>
              </div>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Manuscript Data</th>
                  <th>Primary Author</th>
                  <th>System Uploader</th>
                  <th>Net Downloads</th>
                  <th>Verification Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar" style={{ background: '#f97316', color: 'white' }}>
                          <Book size={18} />
                        </div>
                        <div className="admin-user-info">
                          <div className="name" style={{ fontSize: '14px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.name}</div>
                          <div className="sub">File payload: {book.size}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{book.author}</td>
                    <td style={{ color: '#64748b' }}>{book.uploader}</td>
                    <td>
                      <span className="admin-badge gray"><Download size={12} style={{ marginRight: '4px' }}/> {book.downloads}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${book.status === 'Approved' ? 'success' : 'warning'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-gap">
                        {book.status === 'Pending' && (
                           <button className="admin-action-btn" title="Validate & Approve" onClick={() => handleApprove(book.id)}>
                             <CheckCircle2 size={16} color="#10b981" />
                           </button>
                        )}
                        <button className="admin-action-btn" title="Terminate File" onClick={() => handleDelete(book.id)}>
                          <CopyX size={16} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedBooks.length === 0 && (
                   <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No artifacts located within current search filter bounds.</td></tr>
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

export default AdminLibrary;
