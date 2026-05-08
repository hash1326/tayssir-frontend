import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, GraduationCap, Menu, X } from 'lucide-react';

const CoursesNav = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Courses', path: '/courses' },
    { label: 'My Learning',  path: '/student-dashboard' },
    { label: 'Teach',        path: '/teacher-dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              Tays<span className="text-blue-600">sir</span>
            </span>
          </button>

          {/* Desktop Search */}
          {setSearch && (
            <div className="hidden sm:flex relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses…"
                value={search || ''}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          )}

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map(l => (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === l.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}

            {/* Avatar */}
            <div className="ml-2 w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer hover:scale-105 transition-transform">
              <img
                src="https://ui-avatars.com/api/?name=Student&background=2563eb&color=fff"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile search */}
        {setSearch && (
          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses…"
                value={search || ''}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 border-t border-slate-100 pt-3">
            {navLinks.map(l => (
              <button
                key={l.path}
                onClick={() => { navigate(l.path); setMenuOpen(false); }}
                className="text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default CoursesNav;
