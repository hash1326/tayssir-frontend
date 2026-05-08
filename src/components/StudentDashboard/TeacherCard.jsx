import React from 'react';
import { Star, StarHalf, MessageSquare, BookOpen, Award, Clock } from 'lucide-react';

const SUBJECT_COLORS = {
  'Mathematics':     { bg: '#eff6ff', accent: '#3b82f6', badge: '#dbeafe', text: '#1d4ed8' },
  'Physics':         { bg: '#f0fdf4', accent: '#22c55e', badge: '#dcfce7', text: '#15803d' },
  'Computer Science':{ bg: '#faf5ff', accent: '#a855f7', badge: '#f3e8ff', text: '#7e22ce' },
  'Chemistry':       { bg: '#fff7ed', accent: '#f97316', badge: '#ffedd5', text: '#c2410c' },
  'Literature':      { bg: '#fdf2f8', accent: '#ec4899', badge: '#fce7f3', text: '#be185d' },
  'History':         { bg: '#fffbeb', accent: '#f59e0b', badge: '#fef3c7', text: '#b45309' },
};

const TeacherCard = ({ name, subject, quote, rating, experience, students, avatar, avatarGradient }) => {
  const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS['Mathematics'];

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++)
      stars.push(<Star key={`f${i}`} size={13} fill="#fbbf24" color="#fbbf24" />);
    if (hasHalf)
      stars.push(<StarHalf key="h" size={13} fill="#fbbf24" color="#fbbf24" />);
    for (let i = 0; i < 5 - Math.ceil(rating); i++)
      stars.push(<Star key={`e${i}`} size={13} color="#e2e8f0" />);
    return stars;
  };

  return (
    <div className="tc2-card">
      {/* Top accent bar */}
      <div className="tc2-accent-bar" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}99)` }} />

      {/* Avatar */}
      <div className="tc2-avatar-wrap">
        {avatar ? (
          <img src={avatar} alt={name} className="tc2-avatar-img" />
        ) : (
          <div
            className="tc2-avatar-fallback"
            style={{ background: avatarGradient || `linear-gradient(135deg, ${colors.accent}, #1e293b)` }}
          >
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        <div className="tc2-online-dot" />
      </div>

      {/* Info */}
      <div className="tc2-body">
        <div className="tc2-name">{name}</div>

        <span className="tc2-subject-badge" style={{ background: colors.badge, color: colors.text }}>
          <BookOpen size={11} />
          {subject}
        </span>

        <p className="tc2-quote">"{quote}"</p>

        {/* Stats row */}
        <div className="tc2-stats">
          <div className="tc2-stat">
            <Clock size={13} color={colors.accent} />
            <span>{experience} yrs exp.</span>
          </div>
          <div className="tc2-stat-divider" />
          <div className="tc2-stat">
            <Award size={13} color={colors.accent} />
            <span>{students}+ students</span>
          </div>
        </div>

        {/* Rating */}
        <div className="tc2-rating-row">
          <div className="tc2-stars">{renderStars()}</div>
          <span className="tc2-rating-val">{rating.toFixed(1)}</span>
        </div>

        {/* Actions */}
        <div className="tc2-actions">
          <button className="tc2-btn tc2-btn-secondary">Profile</button>
          <button
            className="tc2-btn tc2-btn-primary"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)` }}
          >
            <MessageSquare size={13} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
