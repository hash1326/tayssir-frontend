import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import '../../styles/notifications.css';

const TYPE_CONFIG = {
  system:     { emoji: '⚙️', bg: '#f1f5f9', accent: '#64748b' },
  payment:    { emoji: '💳', bg: '#f0fdf4', accent: '#16a34a' },
  enrollment: { emoji: '🎓', bg: '#eff6ff', accent: '#2563eb' },
  course:     { emoji: '📚', bg: '#faf5ff', accent: '#7c3aed' },
  assignment: { emoji: '📝', bg: '#fff7ed', accent: '#ea580c' },
  message:    { emoji: '💬', bg: '#f0fdfa', accent: '#0d9488' },
  alert:      { emoji: '⚠️', bg: '#fef2f2', accent: '#dc2626' },
  success:    { emoji: '✅', bg: '#f0fdf4', accent: '#16a34a' },
  live:       { emoji: '📡', bg: '#fff1f2', accent: '#f43f5e' },
  quiz:       { emoji: '📊', bg: '#fff7ed', accent: '#ea580c' },
  grade:      { emoji: '🏆', bg: '#faf5ff', accent: '#7c3aed' },
  reminder:   { emoji: '🔔', bg: '#eff6ff', accent: '#2563eb' },
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

const NotificationDropdown = ({ notifications = [], onMarkRead, onMarkAllRead, unreadCount = 0 }) => {
  const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.system;

  return (
    <div className="nd-panel">
      {/* Header */}
      <div className="nd-header">
        <div className="nd-header-left">
          <div className="nd-bell-icon">
            <Bell size={14} strokeWidth={2.5} />
          </div>
          <span className="nd-title">Notifications</span>
          {unreadCount > 0 && (
            <span className="nd-count-badge">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="nd-mark-all" onClick={onMarkAllRead}>
            <CheckCheck size={13} strokeWidth={2.5} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="nd-list">
        {notifications.length === 0 ? (
          <div className="nd-empty">
            <div className="nd-empty-icon">
              <Bell size={28} strokeWidth={1.5} />
            </div>
            <p>You're all caught up!</p>
            <span>No notifications right now</span>
          </div>
        ) : (
          notifications.map(n => {
            const type = n.notification_type || n.type || 'system';
            const cfg = getConfig(type);
            const isUnread = n.is_read === false || n.unread === true;
            const timestamp = n.created_at ? timeAgo(n.created_at) : (n.time || '');
            const body = n.message || n.body || '';

            return (
              <div
                key={n.id}
                className={`nd-item${isUnread ? ' nd-unread' : ''}`}
                onClick={() => onMarkRead?.(n.id)}
              >
                <div className="nd-icon-box" style={{ background: cfg.bg }}>
                  {cfg.emoji}
                </div>
                <div className="nd-body">
                  <div className="nd-item-top">
                    <p className="nd-item-title">{n.title}</p>
                    <span className="nd-item-time">{timestamp}</span>
                  </div>
                  {body && <p className="nd-item-msg">{body}</p>}
                </div>
                {isUnread && (
                  <div className="nd-unread-dot" style={{ background: cfg.accent }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="nd-footer">
          <button className="nd-view-all">View all notifications →</button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
