import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Users, Clock, BookOpen, Play,
  CheckCircle, Shield, Globe, Download, Repeat, Award,
  ChevronDown, ChevronRight
} from 'lucide-react';
import * as coursesApi from '../../api/courses';
import CoursesNav from './CoursesNav';
import '../../styles/tailwind.css';

/* ── Stars ───────────────────────────────────────────────── */
const Stars = ({ rating, size = 'sm' }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span
        key={i}
        className={`leading-none ${size === 'lg' ? 'text-base' : 'text-sm'} ${
          i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300'
        }`}
      >★</span>
    ))}
  </div>
);

/* ── Toast ───────────────────────────────────────────────── */
const Toast = ({ message, show }) => (
  <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500 text-white text-sm font-semibold shadow-2xl z-50 transition-all duration-500 whitespace-nowrap ${
    show ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
  }`}>
    <CheckCircle size={16} /> {message}
  </div>
);

/* ── Enroll Card (sticky sidebar) ────────────────────────── */
const EnrollCard = ({ course, onEnroll, enrolled }) => {
  const isFree = course.is_free || course.price === 0;
  const totalLessons = course.lesson_count || (course.modules || []).reduce((s, m) => s + m.lessons, 0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-100 sticky top-20">
      {/* Thumbnail with play overlay */}
      <div className="relative aspect-video overflow-hidden">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <button className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
            <Play size={22} className="text-blue-600 ml-1" fill="#2563eb" stroke="none" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className={`text-3xl font-extrabold mb-1 ${isFree ? 'text-emerald-500' : 'text-slate-900'}`}>
          {isFree ? 'Free' : `${course.price.toLocaleString()} DA`}
        </div>
        {!isFree && (
          <p className="text-sm text-slate-400 line-through mb-4">
            {Math.round(course.price * 1.3).toLocaleString()} DA
          </p>
        )}

        {/* Enroll button */}
        <button
          onClick={onEnroll}
          disabled={enrolled}
          className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 shadow-lg mb-2 ${
            enrolled
              ? 'bg-emerald-500 cursor-not-allowed'
              : isFree
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-400/40 hover:-translate-y-0.5 shadow-emerald-500/25'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/40 hover:-translate-y-0.5 shadow-blue-500/25'
          }`}
        >
          {enrolled ? '✅ Enrolled!' : isFree ? '🎓 Enroll for Free' : 'Enroll Now'}
        </button>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-5">
          <Shield size={12} /> 30-day money-back guarantee
        </p>

        {/* Includes */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">This course includes:</h4>
          {[
            [`${course.duration} on-demand video`, Clock],
            [`${totalLessons} lessons`, BookOpen],
            ['Full lifetime access', Repeat],
            ['Certificate of completion', Award],
            ['Downloadable resources', Download],
          ].map(([text, Icon]) => (
            <div key={text} className="flex items-center gap-2.5 py-1.5 text-sm text-slate-600">
              <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Curriculum module row ───────────────────────────────── */
const ModuleRow = ({ module, index }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm font-extrabold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{module.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{module.lessons} lessons</p>
          </div>
        </div>
        {open ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 space-y-2">
          {Array.from({ length: module.lessons }).map((_, li) => (
            <div key={li} className="flex items-center gap-2.5 text-sm text-slate-500 py-1.5">
              <Play size={12} className="text-blue-400 flex-shrink-0" />
              <span>Lesson {li + 1} — {module.title.split(' ').slice(0, 3).join(' ')} Part {li + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Detail Page ────────────────────────────────────── */
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolled, setEnrolled]   = useState(false);
  const [toast, setToast]         = useState({ show: false, message: '' });
  const [course, setCourse]       = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [courseError, setCourseError]     = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadingCourse(true);
    coursesApi.getCourse(courseId)
      .then((res) => {
        const c = res.data;
        setCourse({
          id: c.id,
          slug: c.slug,
          title: c.title,
          description: c.description || c.short_description || '',
          category: c.category?.name || '',
          level: c.level || 'Beginner',
          is_free: c.is_free ?? true,
          price: c.is_free ? 0 : parseFloat(c.price || 0),
          image: c.thumbnail || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
          rating: 4.5,
          reviews: 0,
          students: c.enrollment_count || 0,
          duration: c.duration_hours ? `${c.duration_hours}h` : 'N/A',
          instructor: c.teacher ? `${c.teacher.first_name || ''} ${c.teacher.last_name || ''}`.trim() || c.teacher.email : 'Instructor',
          instructorBio: '',
          modules: [],
          tags: [],
          is_enrolled: c.is_enrolled || false,
          lesson_count: c.lesson_count || 0,
        });
        setEnrolled(c.is_enrolled || false);
      })
      .catch(() => setCourseError(true))
      .finally(() => setLoadingCourse(false));
  }, [courseId]);

  if (loadingCourse) return (
    <div className="mp-root min-h-screen flex items-center justify-center">
      <span className="text-slate-400 text-lg">Loading course…</span>
    </div>
  );

  if (courseError || !course) return (
    <div className="mp-root min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">😕</span>
      <h2 className="text-2xl font-bold text-slate-800">Course not found</h2>
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Courses
      </button>
    </div>
  );

  const isFree       = course.is_free || course.price === 0;
  const totalLessons = course.lesson_count || course.modules.reduce((s, m) => s + m.lessons, 0);

  const handleEnroll = async () => {
    try {
      await coursesApi.enrollCourse(course.slug);
      setEnrolled(true);
      setToast({ show: true, message: isFree ? '🎉 You are now enrolled for free!' : '✅ Enrollment successful!' });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Enrollment failed.';
      setToast({ show: true, message: `❌ ${msg}` });
    }
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  const TABS = ['overview', 'curriculum', 'instructor'];

  return (
    <div className="mp-root min-h-screen bg-slate-50">
      <CoursesNav />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-5" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Left */}
          <div>
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center gap-2 text-sm text-white/60 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full mb-5 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Courses
            </button>

            <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-3">{course.category}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              {course.title}
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-6">{course.description}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Stars rating={course.rating} size="lg" />
                <span className="font-bold text-amber-400">{course.rating}</span>
                <span>({course.reviews.toLocaleString()} reviews)</span>
              </div>
              <span className="flex items-center gap-1.5"><Users size={14} />{course.students.toLocaleString()} students</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />{course.duration}</span>
              <span className="flex items-center gap-1.5"><BookOpen size={14} />{totalLessons} lessons</span>
              <span className="flex items-center gap-1.5"><Award size={14} />{course.level}</span>
              <span className="flex items-center gap-1.5"><Globe size={14} />Arabic / French</span>
            </div>

            {/* Tags */}
            {(course.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {course.tags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/80">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-white/40 mt-4">
              By <strong className="text-white/75">{course.instructor}</strong>
            </p>
          </div>

          {/* Enroll Card (desktop hero position) */}
          <div className="hidden lg:block">
            <EnrollCard course={course} onEnroll={handleEnroll} enrolled={enrolled} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-400 border-transparent hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Page body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1fr_380px] gap-12 items-start">

        {/* ── Tab Content ── */}
        <div className="animate-fadeUp">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">About This Course</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {course.description} This comprehensive course is designed to take you from foundational concepts
                  to advanced real-world applications. Through hands-on projects, quizzes, and guided exercises,
                  you'll gain practical experience you can immediately apply in professional environments.
                </p>
              </div>

              {(course.modules || []).length > 0 && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-4">What You'll Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.modules.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-700">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">Requirements</h2>
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                  <li>Basic computer literacy</li>
                  <li>A computer with internet access</li>
                  <li>Enthusiasm and willingness to learn</li>
                  {course.level === 'Intermediate' && <li>Familiarity with a programming language is a plus</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Curriculum */}
          {activeTab === 'curriculum' && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Course Curriculum</h2>
              <p className="text-sm text-slate-400 mb-6">
                {(course.modules || []).length} sections · {totalLessons} lessons · {course.duration} total
              </p>
              <div className="space-y-3">
                {(course.modules || []).length === 0 ? (
                  <p className="text-sm text-slate-400">Curriculum details will be added soon.</p>
                ) : course.modules.map((mod, idx) => (
                  <ModuleRow key={idx} module={mod} index={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Instructor */}
          {activeTab === 'instructor' && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">Meet Your Instructor</h2>
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <img
                  src={`https://ui-avatars.com/api/?name=${course.instructor.replace(' ','+')}&background=2563eb&color=fff&size=96`}
                  alt={course.instructor}
                  className="w-20 h-20 rounded-full border-4 border-blue-500 flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1">{course.instructor}</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-3">{course.category} Expert</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {course.rating} Avg. Rating</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {course.students.toLocaleString()} Students</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {course.modules.length} Modules</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* Mobile enroll card */}
          <div className="lg:hidden">
            <EnrollCard course={course} onEnroll={handleEnroll} enrolled={enrolled} />
          </div>

          {/* Course info card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="font-extrabold text-slate-900 text-sm">Course Info</h3>
            </div>
            <div className="px-5 divide-y divide-slate-100">
              {[
                ['Category', course.category],
                ['Level', course.level],
                ['Duration', course.duration],
                ['Lessons', `${totalLessons} lessons`],
                ['Language', 'Arabic / French'],
                ['Certificate', 'Yes'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-3 text-sm">
                  <span className="text-slate-400 font-medium">{k}</span>
                  <span className="text-slate-900 font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} />
    </div>
  );
};

export default CourseDetailPage;
