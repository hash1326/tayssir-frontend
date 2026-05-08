import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, LayoutDashboard, Calendar, Settings, BookOpen,
  Users as UsersIcon, Bell, MessageSquare, Search,
  Plus, Trash2, Download, BookMarked, FileText,
  Lock, Eye, X, Upload, CheckCircle, Filter, Moon, Sun
} from "lucide-react";
import "../../styles/teacher_pages/teacher_library.css";
import "../../styles/teacher_pages/teacher_dashboard.css";
import { getDocuments, createDocument, deleteDocument } from "../../api/library";

const TeacherLibrary = () => {
  const navigate = useNavigate();

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);
  const currentUserName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.email || 'You';

  // ── Upload Modal state ──
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "", visibility: "public", description: "", file: null
  });

  // ── Search / Filter ──
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // ── Library items ──
  const [items, setItems] = useState([]);

  React.useEffect(() => {
    getDocuments()
      .then(res => {
        const list = res.data.results || res.data || [];
        setItems(list.map(d => ({
          id: d.id,
          title: d.title,
          description: d.description || '',
          visibility: d.visibility || 'public',
          owner: d.uploaded_by ? `${d.uploaded_by.first_name || ''} ${d.uploaded_by.last_name || ''}`.trim() || d.uploaded_by.email : '—',
          ownerId: d.uploaded_by?.id,
          uploadedAt: d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
          fileUrl: d.file || '',
          sizeBytes: d.size_bytes || 0,
        })));
      })
      .catch(() => {});
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

  React.useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem('platform-dark-mode') === 'true');
    };
    window.addEventListener('theme-changed', handleThemeChange);

    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('platform-dark-mode', isDarkMode);
    
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, [isDarkMode]);

  const handleDelete = async (id, ownerId) => {
    if (ownerId !== currentUser.id) return;
    if (window.confirm("Are you sure you want to delete this resource from the library?")) {
      try {
        await deleteDocument(id);
        setItems(prev => prev.filter(i => i.id !== id));
      } catch (_) {}
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newItem.file) return;
    try {
      const fd = new FormData();
      fd.append('title', newItem.title);
      fd.append('description', newItem.description);
      fd.append('visibility', newItem.visibility);
      fd.append('file', newItem.file);
      const { data: d } = await createDocument(fd);
      const entry = {
        id: d.id,
        title: d.title,
        description: d.description || '',
        visibility: d.visibility || 'public',
        owner: currentUserName,
        ownerId: currentUser.id,
        uploadedAt: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileUrl: d.file || '',
        sizeBytes: d.size_bytes || 0,
      };
      setItems(prev => [entry, ...prev]);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUpload(false);
        setNewItem({ title: "", visibility: "public", description: "", file: null });
      }, 1800);
    } catch (_) {}
  };

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = activeFilter === "all" ||
                        (activeFilter === "mine" && item.ownerId === currentUser.id) ||
                        item.visibility === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}><img src="/src/assets/logo2.png" alt="Tayssir" style={{ width: '38px', height: '38px', objectFit: 'contain' }} /></div>
          <div className="brand-text"><h3>Tayssir Panel</h3><p>Teacher Portal</p></div>
        </div>

        <p className="nav-section-title">Main Menu</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-dashboard'); }}>
            <LayoutDashboard size={20}/><span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-profile'); }}>
            <User size={20}/><span>My Profile</span>
          </a>
        </nav>

        <p className="nav-section-title">Class Management</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-classes'); }}>
            <BookOpen size={20}/><span>Classes</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-students'); }}>
            <UsersIcon size={20}/><span>Students</span>
          </a>
        </nav>

        <p className="nav-section-title">Resources</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
            <BookMarked size={20}/><span>Library</span>
          </a>
        </nav>

        <p className="nav-section-title">Teaching</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-schedule'); }}>
            <Calendar size={20}/><span>Schedule</span>
          </a>
        </nav>

        <div className="sidebar-bottom"><a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}><Settings size={20} /><span>Settings</span></a><button className="nav-item" onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px', color: 'inherit' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sign Out</span></button></div>
      </aside>

      {/* Main Content */}
      <main className="main-content dashboard-bg">
        <header className="dash-header">
          <div className="header-greeting">
            <h1>Teacher Library</h1>
            <p>Browse, share, and manage your teaching resources</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20}/><span className="badge-dot red"></span></button>
            <button className="icon-btn" onClick={() => { const newVal = !isDarkMode; setIsDarkMode(newVal); localStorage.setItem('platform-dark-mode', newVal); window.dispatchEvent(new Event('theme-changed')); }} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')}>
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              </div>
              <div className="online-indicator"></div>
            </div>
          </div>
        </header>

        <div className="library-container">

          {/* Toolbar */}
          <div className="library-toolbar">
            <div className="search-box lib-search">
              <Search size={18} className="search-icon"/>
              <input
                type="text"
                placeholder="Search books, exercises, subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lib-toolbar-right">
              <div className="filter-pills">
                {[
                  { key: "all",      label: "All" },
                  { key: "mine",     label: "My Uploads" },
                  { key: "public",   label: "Public" },
                  { key: "teachers", label: "Teachers Only" },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`filter-pill ${activeFilter === f.key ? "pill-active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button className="btn-upload-lib" onClick={() => setShowUpload(true)}>
                <Upload size={17}/> Upload Resource
              </button>
            </div>
          </div>

          {/* Ownership Note */}
          <div className="ownership-note">
            <Lock size={15}/>
            <span>You can only delete resources that <strong>you uploaded</strong>. Other teachers' resources are read-only for you.</span>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="lib-grid">
              {filtered.map(item => {
                const isOwner = item.ownerId === currentUser.id;
                const visLabel = item.visibility === 'public' ? 'Public' : item.visibility === 'teachers' ? 'Teachers Only' : 'Course';
                const sizeLabel = item.sizeBytes > 0 ? `${(item.sizeBytes / 1024 / 1024).toFixed(1)} MB` : '—';
                return (
                  <div key={item.id} className={`lib-card ${isOwner ? "lib-card-mine" : ""}`}>
                    <div className="lib-banner lib-banner-blue" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #3b82f620, #6366f110)' }}>
                      <FileText size={48} color="#3b82f6" opacity={0.6} />
                      {isOwner && (
                        <span className="owner-tag">
                          <CheckCircle size={12}/> My Upload
                        </span>
                      )}
                    </div>

                    <div className="lib-body">
                      <div className="lib-type-row">
                        <span className="lib-type-badge type-book">
                          <BookMarked size={12}/> {visLabel}
                        </span>
                      </div>

                      <h3 className="lib-title">{item.title}</h3>
                      {item.description && <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 8px', lineHeight: 1.4 }}>{item.description}</p>}

                      <div className="lib-meta">
                        <div className="lib-meta-row">
                          <User size={13}/>
                          <span>{item.owner}</span>
                        </div>
                        <div className="lib-meta-row">
                          <Download size={13}/>
                          <span>{sizeLabel}</span>
                        </div>
                        <div className="lib-meta-row">
                          <Calendar size={13}/>
                          <span>{item.uploadedAt}</span>
                        </div>
                      </div>

                      <div className="lib-actions">
                        {item.fileUrl && (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-lib-view" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Eye size={15}/> View
                          </a>
                        )}
                        {item.fileUrl && (
                          <a href={item.fileUrl} download className="btn-lib-download" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Download size={15}/> Download
                          </a>
                        )}
                        {isOwner ? (
                          <button
                            className="btn-lib-delete"
                            onClick={() => handleDelete(item.id, item.ownerId)}
                            title="Delete this resource"
                          >
                            <Trash2 size={15}/>
                          </button>
                        ) : (
                          <button className="btn-lib-locked" title="Only the owner can delete" disabled>
                            <Lock size={15}/>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="lib-empty">
              <BookMarked size={48} className="lib-empty-icon"/>
              <h3>No resources found</h3>
              <p>Try adjusting your search or filter, or upload a new resource.</p>
              <button className="btn-upload-lib mt-2" onClick={() => setShowUpload(true)}>
                <Upload size={16}/> Upload Your First Resource
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div className="modal-backdrop" onClick={() => setShowUpload(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <div>
                <h2>Upload Resource</h2>
                <p>Add a new book or exercise to the shared library</p>
              </div>
              <button className="modal-close" onClick={() => setShowUpload(false)}><X size={20}/></button>
            </div>

            {uploadSuccess ? (
              <div className="modal-success">
                <CheckCircle size={52} color="#10b981"/>
                <h3>Resource Uploaded!</h3>
                <p>Your resource is now available in the library.</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="modal-form">

                <div className="modal-input-group">
                  <label>Resource Title</label>
                  <input
                    type="text" required placeholder="e.g. Algebra Chapter 5"
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>

                <div className="modal-row">
                  <div className="modal-input-group">
                    <label>Visibility</label>
                    <select
                      value={newItem.visibility}
                      onChange={e => setNewItem({...newItem, visibility: e.target.value})}
                    >
                      <option value="public">🌍 Public</option>
                      <option value="teachers">🔐 Teachers Only</option>
                      <option value="course">📚 Course Only</option>
                    </select>
                  </div>
                </div>

                <div className="modal-input-group">
                  <label>Description (optional)</label>
                  <textarea
                    rows={3} placeholder="Brief description of this resource..."
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    style={{padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#f8fafc", fontFamily: "inherit", fontSize: "0.95rem", resize: "vertical", outline: "none"}}
                  />
                </div>

                <div className="file-drop-zone">
                  <Upload size={28} color="#94a3b8"/>
                  <p>Drag & drop a file here, or <span className="pick-file">browse</span></p>
                  <span>PDF, DOCX, PPT — Max 20MB</span>
                  <input
                    type="file" accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="file-input-hidden"
                    onChange={e => setNewItem({...newItem, file: e.target.files[0]})}
                  />
                </div>

                <div className="upload-owner-note">
                  <Lock size={14}/> This resource will be uploaded as <strong>{currentUserName}</strong>. Only you can delete it.
                </div>

                <div className="modal-footer">
                  <button type="button" className="modal-btn-cancel" onClick={() => setShowUpload(false)}>Cancel</button>
                  <button type="submit" className="modal-btn-save">
                    <Upload size={16}/> Upload Resource
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLibrary;



