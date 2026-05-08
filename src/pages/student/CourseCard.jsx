import React from 'react';
import { Star, Users, Clock, BookOpen } from 'lucide-react';

/* Star rating display */
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`text-sm leading-none ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}>
        ★
      </span>
    ))}
  </div>
);

/* Loading skeleton */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
    <div className="aspect-video bg-shimmer" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 w-1/3 rounded-full bg-shimmer" />
      <div className="h-4 w-4/5 rounded-full bg-shimmer" />
      <div className="h-3 w-1/2 rounded-full bg-shimmer" />
      <div className="h-3 w-3/4 rounded-full bg-shimmer" />
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div className="h-5 w-1/4 rounded-full bg-shimmer" />
        <div className="h-8 w-1/3 rounded-full bg-shimmer" />
      </div>
    </div>
  </div>
);

/* Course card */
const CourseCard = ({ course, onClick, loading }) => {
  if (loading) return <SkeletonCard />;

  const isFree = course.price === 0;

  return (
    <div
      onClick={() => onClick && onClick(course)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-transparent transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20 ${
          isFree ? 'bg-emerald-500/90 text-white' : 'bg-blue-600/90 text-white'
        }`}>
          {isFree ? '🎓 Free' : `${course.price.toLocaleString()} DA`}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-sm">
          {course.level}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1.5">
          {course.category}
        </p>
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          By <span className="text-slate-600 font-semibold">{course.instructor}</span>
        </p>

        {/* Rating row */}
        <div className="flex items-center gap-2 mb-1 mt-auto">
          <Stars rating={course.rating} />
          <span className="text-xs font-bold text-amber-500">{course.rating}</span>
          <span className="text-xs text-slate-400">({course.reviews.toLocaleString()})</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {course.students.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
        <span className={`text-lg font-extrabold ${isFree ? 'text-emerald-500' : 'text-slate-900'}`}>
          {isFree ? 'Free' : `${course.price.toLocaleString()} DA`}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onClick && onClick(course); }}
          className="px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
