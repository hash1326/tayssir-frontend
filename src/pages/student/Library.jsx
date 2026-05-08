import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import Topbar from '../../components/StudentDashboard/Topbar';
import { getDocuments } from '../../api/library';
import {
  Search, Filter, BookOpen, FileText, Video, File,
  Star, StarOff, Download, ExternalLink, Clock,
  ChevronDown, Grid3X3, List, BookMarked, Zap,
  GraduationCap, FlaskConical, Globe, Music,
  X, SortAsc, Eye, Heart, Tag
} from 'lucide-react';
import '../../styles/teacher_pages/teacher_shared.css';
import '../../styles/teacher_pages/dashboard.css';
import '../../styles/student_library.css';

const adaptDocument = (doc) => ({
  id: doc.id,
  title: doc.title,
  type: 'Document',
  subject: doc.course_title || 'General',
  teacher: doc.uploaded_by_name || 'Instructor',
  date: doc.created_at ? doc.created_at.slice(0, 10) : '',
  thumbnail: null,
  tags: [],
  duration: null,
  size: null,
  views: 0,
  rating: 0,
  isFavorite: false,
  fileUrl: doc.file,
});

const TYPES   = ['All', 'Document'];
const SUBJECTS = ['All Subjects'];
const SORTS   = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'A → Z',        value: 'az' },
];

/* ── Type Config ─────────────────────────────────────────── */
const TYPE_CONFIG = {
  Course:   { icon: GraduationCap, color: '#6366f1', bg: 'rgba(99,102,241,0.15)',  label: 'Course'   },
  PDF:      { icon: FileText,      color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   label: 'PDF'      },
  Video:    { icon: Video,         color: '#10b981', bg: 'rgba(16,185,129,0.15)',  label: 'Video'    },
  Document: { icon: File,          color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Document' },
};

const SUBJECT_ICONS = {
  Mathematics: FlaskConical, Physics: Zap, Chemistry: FlaskConical,
  'Computer Science': Globe, Biology: BookOpen,
};

/* ── Skeleton Card ───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="lib2-card lib2-skeleton">
    <div className="lib2-card-thumb lib2-skel-block" />
    <div className="lib2-card-body">
      <div className="lib2-skel-line lib2-skel-short" />
      <div className="lib2-skel-line" style={{ width: '70%' }} />
      <div className="lib2-skel-line" style={{ width: '50%' }} />
    </div>
  </div>
);

/* ── Resource Card ───────────────────────────────────────── */
const ResourceCard = ({ resource, onFavorite, viewMode }) => {
  const cfg = TYPE_CONFIG[resource.type];
  const TypeIcon = cfg.icon;
  const SubjectIcon = SUBJECT_ICONS[resource.subject] || BookOpen;
  const dateStr = new Date(resource.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const stars = Math.round(resource.rating);

  if (viewMode === 'list') {
    return (
      <div className="lib2-list-card">
        <div className="lib2-list-thumb">
          {resource.thumbnail ? (
            <img src={resource.thumbnail} alt={resource.title} className="lib2-list-thumb-img" />
          ) : (
            <div className="lib2-list-thumb-icon" style={{ background: cfg.bg }}>
              <TypeIcon size={24} color={cfg.color} />
            </div>
          )}
          <div className="lib2-list-type-badge" style={{ background: cfg.bg, color: cfg.color }}>
            {resource.type}
          </div>
        </div>
        <div className="lib2-list-info">
          <div className="lib2-list-top">
            <h3 className="lib2-list-title">{resource.title}</h3>
            <button
              className={`lib2-fav-btn ${resource.isFavorite ? 'active' : ''}`}
              onClick={e => { e.stopPropagation(); onFavorite(resource.id); }}
            >
              <Heart size={16} fill={resource.isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="lib2-list-meta">
            <span className="lib2-meta-pill" style={{ background: cfg.bg, color: cfg.color }}>{resource.subject}</span>
            <span className="lib2-meta-sep">·</span>
            <span className="lib2-meta-teacher">{resource.teacher}</span>
          </div>
        </div>
        <div className="lib2-list-actions">
          <div className="lib2-rating">
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= stars ? '#fbbf24' : '#e2e8f0' }}>★</span>
            ))}
          </div>
          <button className="lib2-open-btn" style={{ padding: '8px 16px', width: 'auto' }}>
            <ExternalLink size={14} /> Open
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lib2-card">
      <div className="lib2-card-thumb">
        {resource.thumbnail ? (
          <img src={resource.thumbnail} alt={resource.title} className="lib2-card-thumb-img" />
        ) : (
          <div className="lib2-card-thumb-icon" style={{ background: cfg.bg }}>
            <TypeIcon size={48} color={cfg.color} />
          </div>
        )}
        <div className="lib2-card-type-badge" style={{ background: cfg.bg, color: cfg.color }}>
          <TypeIcon size={12} /> {resource.type}
        </div>
        <button
          className={`lib2-fav-btn lib2-fav-float ${resource.isFavorite ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); onFavorite(resource.id); }}
        >
          <Heart size={16} fill={resource.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="lib2-card-body">
        <div className="lib2-card-subject" style={{ color: cfg.color, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
          <SubjectIcon size={14} /> {resource.subject}
        </div>
        <h3 className="lib2-card-title">{resource.title}</h3>
        <p className="lib2-card-teacher">By {resource.teacher}</p>

        <div className="lib2-card-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          {resource.tags.slice(0, 2).map(t => (
            <span key={t} className="lib2-tag">#{t}</span>
          ))}
        </div>

        <div className="lib2-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div className="lib2-rating">
            <span style={{ color: '#fbbf24' }}>★</span>
            <span className="lib2-rating-num">{resource.rating}</span>
          </div>
          <div className="lib2-views" style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={14} /> {resource.views}
          </div>
        </div>

        <div className="lib2-card-actions" style={{ marginTop: '4px' }}>
          <button className="lib2-open-btn">
            <ExternalLink size={16} /> {resource.type === 'Course' ? 'Start Course' : 'View Material'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Stats Row ───────────────────────────────────────────── */
const StatsBar = ({ resources }) => {
  const stats = TYPES.slice(1).map(t => ({
    type: t,
    count: resources.filter(r => r.type === t).length,
    cfg: TYPE_CONFIG[t],
  }));

  return (
    <div className="lib2-stats-bar">
      {stats.map(({ type, count, cfg }) => {
        const Icon = cfg.icon;
        return (
          <div key={type} className="lib2-stat-item" style={{ '--accent': cfg.color, '--accent-bg': cfg.bg }}>
            <div className="lib2-stat-icon"><Icon size={20} /></div>
            <div className="lib2-stat-info">
              <span className="lib2-stat-num">{count}</span>
              <span className="lib2-stat-lbl">{type}s</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Library = () => {
  const [resources, setResources]   = useState([]);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [sort, setSort]             = useState('newest');
  const [viewMode, setViewMode]     = useState('grid');
  const [isLoading, setIsLoading]   = useState(true);
  const [sortOpen, setSortOpen]     = useState(false);
  const [activeTab, setActiveTab]   = useState('all');

  useEffect(() => {
    getDocuments()
      .then(res => setResources((res.data.results || res.data || []).map(adaptDocument)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const toggleFavorite = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const filtered = useMemo(() => {
    let list = [...resources];
    if (activeTab === 'favorites') list = list.filter(r => r.isFavorite);
    if (activeTab === 'recent')    list = list.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    if (typeFilter !== 'All') list = list.filter(r => r.type === typeFilter);
    if (subjectFilter !== 'All Subjects') list = list.filter(r => r.subject === subjectFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.teacher.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'newest': list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'oldest': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'views':  list.sort((a, b) => b.views - a.views); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'az':     list.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return list;
  }, [resources, search, typeFilter, subjectFilter, sort, activeTab]);

  const currentSortLabel = SORTS.find(s => s.value === sort)?.label;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content dashboard-bg">
        <Topbar />
        <div className="lib2-page">
          <div className="lib2-hero">
            <div className="lib2-hero-left">
              <div className="lib2-hero-icon-wrap">
                <BookOpen size={32} color="white" />
              </div>
              <div>
                <h1 className="lib2-hero-title">Student Library</h1>
                <p className="lib2-hero-sub">Empower your learning with curated resources</p>
              </div>
            </div>
            <div className="lib2-search-wrap">
              <Search size={20} className="lib2-search-icon" />
              <input
                className="lib2-search-input"
                type="text"
                placeholder="Search anything..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="lib2-search-clear" onClick={() => setSearch('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <StatsBar resources={resources} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="lib2-filter-bar">
              <div className="lib2-tabs">
                {[
                  { key: 'all',       label: 'All Materials' },
                  { key: 'favorites', label: 'Favorites' },
                  { key: 'recent',    label: 'Recently Added' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    className={`lib2-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="lib2-filter-right">
                <div className="lib2-view-toggle">
                  <button
                    className={`lib2-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    className={`lib2-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="lib2-filter-bar">
              <div className="lib2-type-filters">
                {TYPES.map(type => (
                  <button
                    key={type}
                    className={`lib2-type-btn ${typeFilter === type ? 'active' : ''}`}
                    onClick={() => setTypeFilter(type)}
                    style={typeFilter === type ? { color: TYPE_CONFIG[type]?.color, borderColor: TYPE_CONFIG[type]?.color } : {}}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="lib2-filter-right">
                <select
                  className="lib2-subject-select"
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="lib2-sort-wrap">
                  <button className="lib2-sort-btn" onClick={() => setSortOpen(!sortOpen)}>
                    <SortAsc size={16} />
                    <span>{currentSortLabel}</span>
                    <ChevronDown size={14} style={{ transform: sortOpen ? 'rotate(180deg)' : '' }} />
                  </button>
                  {sortOpen && (
                    <div className="lib2-sort-dropdown">
                      {SORTS.map(s => (
                        <button
                          key={s.value}
                          className={`lib2-sort-option ${sort === s.value ? 'active' : ''}`}
                          onClick={() => { setSort(s.value); setSortOpen(false); }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lib2-results-info">
            {isLoading ? 'Loading...' : `${filtered.length} resources found`}
          </div>

          {isLoading ? (
            <div className={viewMode === 'grid' ? 'lib2-grid' : 'lib2-list'}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="lib2-empty">
              <BookOpen size={48} />
              <h3>No resources found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'lib2-grid' : 'lib2-list'}>
              {filtered.map(r => (
                <ResourceCard key={r.id} resource={r} onFavorite={toggleFavorite} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Library;
