import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, TrendingUp, Award, Sparkles, Shield, Code, Wifi,
  Database, Brain, Calculator, Zap, Clock, Users, Play,
  Star, BookOpen, CheckCircle, Flame, Filter
} from 'lucide-react';
import * as coursesApi from '../../api/courses';
import * as paymentsApi from '../../api/payments';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import '../../styles/courses_pro.css';
import '../../styles/teacher_pages/teacher_shared.css';

// Map backend course → UI shape used by CourseCard
const adaptCourse = (c) => ({
  id: c.id,
  slug: c.slug,
  title: c.title,
  instructor: c.teacher_name || 'Tayssir Instructor',
  image: c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
  price: parseFloat(c.price) || 0,
  level: c.level
    ? c.level.charAt(0).toUpperCase() + c.level.slice(1)
    : 'Beginner',
  duration: c.duration_hours ? `${c.duration_hours}h` : '—',
  students: c.enrollment_count || c.active_enrollment_count || 0,
  rating: parseFloat(c.rating) || 0,
  reviews: c.review_count || 0,
  category: c.category_name || 'General',
});

/* ── Constants ───────────────────────────────────────────── */
const PRICE_FILTERS = [
  { key: 'All',  label: 'All Prices' },
  { key: 'Free', label: 'Free' },
  { key: 'Paid', label: 'Paid' },
];
const LEVEL_FILTERS = [
  { key: 'All Levels',   label: 'All Levels' },
  { key: 'Beginner',     label: 'Beginner' },
  { key: 'Intermediate', label: 'Intermediate' },
  { key: 'Advanced',     label: 'Advanced' },
];
const SORT_OPTIONS = [
  { key: 'popular',  label: 'Most Popular' },
  { key: 'rating',   label: 'Highest Rated' },
  { key: 'newest',   label: 'Newest' },
  { key: 'price-lo', label: 'Price: Low to High' },
  { key: 'price-hi', label: 'Price: High to Low' },
];
const CAT_ICONS = {
  'All':          BookOpen,
  'Cybersecurity':Shield,
  'Programming':  Code,
  'Networking':   Wifi,
  'Databases':    Database,
  'AI & ML':      Brain,
  'Mathematics':  Calculator,
  'Electronics':  Zap,
};
const CAT_COLORS = {
  'Cybersecurity': '#ef4444',
  'Programming':   '#2563eb',
  'Networking':    '#8b5cf6',
  'Databases':     '#f59e0b',
  'AI & ML':       '#06b6d4',
  'Mathematics':   '#10b981',
  'Electronics':   '#f97316',
};
const CATEGORY_EMOJIS = {
  'Mathematics': '📐', 'Physics': '⚛️', 'Computer Science': '💻', 'Chemistry': '🧪',
  'Biology': '🔬', 'Electronics': '⚡', 'Language': '🌐', 'History': '📜',
};
const HERO_CARD_COLORS = ['#06b6d4', '#ef4444', '#2563eb', '#8b5cf6', '#10b981'];
const TRUST_ITEMS = [
  { icon: CheckCircle, text: 'Certificate of Completion' },
  { icon: Users,        text: '50K+ Active Students' },
  { icon: Star,         text: '4.8 Average Rating' },
  { icon: Sparkles,     text: 'Arabic & French Content' },
  { icon: Zap,          text: 'Lifetime Access' },
];

/* ── Stars ───────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <div className="mp-stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`mp-star ${i <= Math.round(rating) ? 'filled' : 'empty'}`}>★</span>
    ))}
  </div>
);

/* ── Course Card ─────────────────────────────────────────── */
const CourseCard = ({ course, onClick, onEnroll, enrolling }) => {
  const isFree = course.price === 0;
  const isHot  = course.students >= 8000;
  return (
    <div className="mp-card" onClick={() => onClick && onClick(course)}>
      {/* Thumbnail */}
      <div className="mp-card-thumb">
        <img src={course.image} alt={course.title} loading="lazy" />
        <div className="mp-card-thumb-overlay" />
        <div className="mp-card-play">
          <div className="mp-card-play-btn"><Play size={20} fill="currentColor" /></div>
        </div>
        <div className="mp-card-badges">
          <span className={`mp-badge ${isFree ? 'mp-badge-free' : 'mp-badge-paid'}`}>
            {isFree ? '🎓 Free' : `${course.price.toLocaleString()} DA`}
          </span>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 4 }}>
            {isHot && <span className="mp-badge mp-badge-hot">🔥 Hot</span>}
            <span className="mp-badge mp-badge-level">{course.level}</span>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="mp-card-body">
        <p className="mp-card-category">{course.category}</p>
        <h3 className="mp-card-title">{course.title}</h3>
        <p className="mp-card-instructor">By <strong>{course.instructor}</strong></p>
        <div className="mp-card-rating-row">
          <Stars rating={course.rating} />
          <span className="mp-rating-val">{course.rating}</span>
          <span className="mp-rating-count">({course.reviews.toLocaleString()})</span>
        </div>
        <div className="mp-card-meta">
          <span className="mp-card-meta-item"><Clock size={12} />{course.duration}</span>
          <span className="mp-card-meta-item"><Users size={12} />{course.students.toLocaleString()} students</span>
        </div>
      </div>
      {/* Footer */}
      <div className="mp-card-footer">
        <div>
          {isFree
            ? <span className="mp-card-price-free">Free</span>
            : <span className="mp-card-price-paid">{course.price.toLocaleString()}<span className="mp-card-price-currency"> DA</span></span>
          }
        </div>
        <button
          className="mp-enroll-btn"
          disabled={enrolling}
          onClick={e => { e.stopPropagation(); onEnroll ? onEnroll(course) : onClick && onClick(course); }}
        >
          {enrolling ? '...' : (isFree ? 'Enroll Free' : 'Enroll Now')}
        </button>
      </div>
    </div>
  );
};

/* ── Skeleton Card ───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="mp-skeleton">
    <div className="mp-skeleton-thumb" />
    <div className="mp-skeleton-body">
      <div className="mp-skeleton-line" style={{ height: 10, width: '40%' }} />
      <div className="mp-skeleton-line" style={{ height: 14, width: '85%' }} />
      <div className="mp-skeleton-line" style={{ height: 10, width: '55%' }} />
      <div className="mp-skeleton-line" style={{ height: 10, width: '70%' }} />
      <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8 }}>
        <div className="mp-skeleton-line" style={{ height: 20, width: '30%' }} />
        <div className="mp-skeleton-line" style={{ height: 34, width: '38%', borderRadius: 100 }} />
      </div>
    </div>
  </div>
);

/* ── Toast ───────────────────────────────────────────────── */
const Toast = ({ message, show }) => (
  <div className={`mp-toast ${show ? 'show' : ''}`}>
    <CheckCircle size={16} /> {message}
  </div>
);

/* ── Main Page ───────────────────────────────────────────── */
const CoursesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch]            = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [sortBy, setSortBy]           = useState('popular');
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState({ show: false, message: '' });
  const [COURSES, setCourses]         = useState([]);
  const [CATEGORIES, setCategories]   = useState(['All']);
  const [enrollingId, setEnrollingId] = useState(null);

  const heroFeatured = COURSES.slice(0, 3).map((c, i) => ({
    icon: CATEGORY_EMOJIS[c.category] || '📚',
    title: c.title,
    meta: c.instructor,
    rating: c.rating,
    color: HERO_CARD_COLORS[i % HERO_CARD_COLORS.length],
  }));

  // Fetch real courses + categories from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [coursesRes, catsRes] = await Promise.all([
          coursesApi.getCourses(),
          coursesApi.getCategories(),
        ]);
        if (!mounted) return;
        const courseList = (coursesRes.data.results || coursesRes.data || []).map(adaptCourse);
        const catList = catsRes.data.results || catsRes.data || [];
        setCourses(courseList);
        setCategories(['All', ...catList.map((c) => c.name)]);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const showToast = msg => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Enroll: free → instant; paid → redirect to Chargily
  const handleEnroll = async (course) => {
    if (enrollingId) return;
    setEnrollingId(course.id);
    try {
      const { data } = await paymentsApi.checkout(course.id);
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        showToast('Enrolled successfully!');
        navigate('/student-classrooms');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Enrollment failed.';
      showToast(msg);
    } finally {
      setEnrollingId(null);
    }
  };

  /* Filter + sort */
  const filtered = useMemo(() => {
    let result = COURSES.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchCat   = activeCategory === 'All' || c.category === activeCategory;
      const matchPrice = priceFilter === 'All' || (priceFilter === 'Free' ? c.price === 0 : c.price > 0);
      const matchLevel = levelFilter === 'All Levels' || c.level === levelFilter;
      return matchSearch && matchCat && matchPrice && matchLevel;
    });

    switch (sortBy) {
      case 'rating':   result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest':   result = [...result].sort((a, b) => b.id - a.id); break;
      case 'price-lo': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-hi': result = [...result].sort((a, b) => b.price - a.price); break;
      default:         result = [...result].sort((a, b) => b.students - a.students); break;
    }
    return result;
  }, [search, activeCategory, priceFilter, levelFilter, sortBy]);

  const topRated = COURSES.filter(c => c.rating >= 4.8);

  /* Course counts per category */
  const catCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(cat => {
      counts[cat] = cat === 'All' ? COURSES.length : COURSES.filter(c => c.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="mp-shell">
      <Sidebar />
      <div className="mp-content">
        {/* ── Top Nav ──────────────────────────── */}
        <nav className="mp-nav">
          <div className="mp-nav-inner" style={{ justifyContent: 'space-between' }}>
            <div className="mp-nav-search" style={{ marginLeft: 0 }}>
              <Search size={15} className="mp-nav-search-icon" />
              <input
                type="text"
                placeholder="Search courses, topics, instructors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="mp-nav-links">
              {[
                { label: 'Courses', path: '/courses' },
                { label: 'My Learning',  path: '/student-dashboard' },
              ].map(l => (
                <button
                  key={l.path}
                  className={`mp-nav-link ${location.pathname === l.path ? 'active' : ''}`}
                  onClick={() => navigate(l.path)}
                >
                  {l.label}
                </button>
              ))}
              <div className="mp-nav-avatar">
                <img
                  src="https://ui-avatars.com/api/?name=Student&background=2563eb&color=fff"
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────── */}
        <section className="mp-hero">
          <div className="mp-hero-blob1" />
          <div className="mp-hero-blob2" />
          <div className="mp-hero-grid" />
          <div className="mp-hero-inner">
            <motion.div 
              className="mp-hero-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mp-hero-badge">
                <div className="mp-hero-badge-dot" />
                Algeria's #1 Tech Learning Platform
              </div>
              <h1 className="mp-hero-title">
                Build{' '}
                <span className="mp-hero-title-gradient">Real-World Skills</span>
                <br />That Get You Hired
              </h1>
              <p className="mp-hero-sub">
                500+ expert-led courses in Cybersecurity, Programming, AI & Networking —
                taught in Arabic and French by top industry professionals.
              </p>
              <div className="mp-hero-search">
                <Search size={16} style={{ color: '#94a3b8', marginLeft: 12, flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="mp-hero-search-btn" onClick={() => {}}>
                  <Search size={14} /> Search
                </button>
              </div>
              <div className="mp-hero-stats">
                {[['50K+','Active Students'],['500+','Expert Courses'],['95%','Satisfaction Rate'],['120+','Instructors']].map(([v,l]) => (
                  <div key={l} className="mp-hero-stat">
                    <div className="mp-hero-stat-val">{v}</div>
                    <div className="mp-hero-stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="mp-hero-right"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {heroFeatured.map((f, i) => (
                <motion.div 
                  key={i} 
                  className="mp-hero-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="mp-hero-card-icon" style={{ background: `${f.color}25` }}>
                    {f.icon}
                  </div>
                  <div className="mp-hero-card-title">{f.title}</div>
                  <div className="mp-hero-card-meta">{f.meta}</div>
                  <div className="mp-hero-card-rating">
                    ⭐ {f.rating} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>rating</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Trust Bar ────────────────────────── */}
        <div className="mp-trust-bar">
          <div className="mp-trust-bar-inner">
            {TRUST_ITEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="mp-trust-item">
                <Icon size={15} className="mp-trust-item-icon" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Category Strip ───────────────────── */}
        <div className="mp-cats">
          <div className="mp-cats-inner">
            {CATEGORIES.map(cat => {
              const Icon = CAT_ICONS[cat];
              return (
                <button
                  key={cat}
                  className={`mp-cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {Icon && <Icon size={14} />}
                  {cat}
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: activeCategory === cat ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: activeCategory === cat ? '#fff' : '#64748b',
                    borderRadius: 100,
                    padding: '1px 6px',
                    marginLeft: 2,
                  }}>
                    {catCounts[cat]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Body ─────────────────────────────── */}
        <div className="mp-body">
          {/* Sidebar Filters */}
          <aside className="mp-filters">
            <div className="mp-filters-title">
              <Filter size={12} style={{ display:'inline', marginRight: 6, verticalAlign:'middle' }}/>
              Refine Results
            </div>

            <div className="mp-filter-section">
              <div className="mp-filter-section-title">Price</div>
              <div className="mp-filter-options">
                {PRICE_FILTERS.map(f => (
                  <button
                    key={f.key}
                    className={`mp-filter-opt ${priceFilter === f.key ? 'active' : ''}`}
                    onClick={() => setPriceFilter(f.key)}
                  >
                    {f.label}
                    <span className="mp-filter-opt-count">
                      {f.key === 'All' ? COURSES.length
                       : f.key === 'Free' ? COURSES.filter(c => c.price === 0).length
                       : COURSES.filter(c => c.price > 0).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mp-filter-divider" />

            <div className="mp-filter-section">
              <div className="mp-filter-section-title">Level</div>
              <div className="mp-filter-options">
                {LEVEL_FILTERS.map(f => (
                  <button
                    key={f.key}
                    className={`mp-filter-opt ${levelFilter === f.key ? 'active' : ''}`}
                    onClick={() => setLevelFilter(f.key)}
                  >
                    {f.label}
                    <span className="mp-filter-opt-count">
                      {f.key === 'All Levels' ? COURSES.length
                       : COURSES.filter(c => c.level === f.key).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mp-filter-divider" />

            <div className="mp-filter-section">
              <div className="mp-filter-section-title">Category</div>
              <div className="mp-filter-options">
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                  <button
                    key={cat}
                    className={`mp-filter-opt ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: activeCategory === cat ? '#2563eb' : (CAT_COLORS[cat] || '#94a3b8'),
                      flexShrink: 0,
                    }} />
                    {cat}
                    <span className="mp-filter-opt-count">{catCounts[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid Area */}
          <div className="mp-grid-area">
            <div className="mp-grid-header">
              <div>
                <h2 className="mp-grid-title">
                  {activeCategory === 'All' ? 'All ' : ''}
                  <span>{activeCategory === 'All' ? 'Courses' : activeCategory}</span>
                  {activeCategory !== 'All' ? ' Courses' : ''}
                </h2>
                <p className="mp-grid-count">
                  {loading ? 'Loading...' : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <select
                className="mp-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="mp-grid">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="mp-grid">
                <div className="mp-empty">
                  <div className="mp-empty-icon">🔍</div>
                  <h3 className="mp-empty-title">No courses found</h3>
                  <p className="mp-empty-sub">Try adjusting your search terms or filters.</p>
                </div>
              </div>
            ) : (
              <div className="mp-grid">
                {filtered.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/courses/course/${course.slug}`)}
                    onEnroll={handleEnroll}
                    enrolling={enrollingId === course.id}
                  />
                ))}
              </div>
            )}

            {/* Top Rated Section */}
            {!loading && !search && activeCategory === 'All' && priceFilter === 'All' && levelFilter === 'All Levels' && (
              <div className="mp-section">
                <div className="mp-section-header">
                  <div>
                    <h2 className="mp-section-title">
                      ⭐ <span>Top Rated</span> Picks
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
                      Highest-rated courses students love
                    </p>
                  </div>
                  <div className="mp-section-badge">
                    <Award size={13} />
                    Editor's Choice
                  </div>
                </div>
                <div className="mp-grid">
                  {topRated.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigate(`/courses/course/${course.slug}`)}
                      onEnroll={handleEnroll}
                      enrolling={enrollingId === course.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Trending Section */}
            {!loading && !search && activeCategory === 'All' && (
              <div className="mp-section">
                <div className="mp-section-header">
                  <div>
                    <h2 className="mp-section-title">
                      <Flame size={20} style={{ display:'inline', color:'#f97316', marginRight: 6, verticalAlign:'middle' }} />
                      <span>Trending</span> Right Now
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
                      Most enrolled courses this week
                    </p>
                  </div>
                  <div className="mp-section-badge" style={{ background:'#fff7ed', borderColor:'#fed7aa', color:'#c2410c' }}>
                    <TrendingUp size={13} />
                    Trending
                  </div>
                </div>
                <div className="mp-grid">
                  {[...COURSES].sort((a,b) => b.students - a.students).slice(0, 4).map(course => (
                    <CourseCard
                      key={`trend-${course.id}`}
                      course={course}
                      onClick={() => navigate(`/courses/course/${course.slug}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Toast show={toast.show} message={toast.message} />
      </div>
    </div>
  );
};

export default CoursesPage;
