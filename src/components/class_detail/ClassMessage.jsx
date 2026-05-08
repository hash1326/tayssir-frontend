import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Plus } from "lucide-react";
import { getForumThreads, getReplies, createReply, createThread } from "../../api/forum";

const authorName = (a) =>
  a ? (`${a.first_name || ''} ${a.last_name || ''}`.trim() || a.email || 'User') : 'User';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const colorFor = (str) => COLORS[(str || '').length % COLORS.length];
const initials = (name) => (name || '?').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

const ClassMessage = ({ courseId }) => {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyInput, setReplyInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const chatEndRef = useRef(null);

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);

  useEffect(() => {
    if (!courseId) return;
    getForumThreads({ course: courseId })
      .then(res => {
        const list = res.data.results || res.data || [];
        setThreads(list);
        if (list.length > 0) setActiveThreadId(list[0].id);
      })
      .catch(() => {});
  }, [courseId]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    if (!activeThreadId) { setReplies([]); return; }
    getReplies(activeThreadId)
      .then(res => setReplies(res.data.results || res.data || []))
      .catch(() => {});
  }, [activeThreadId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const handleSend = async () => {
    if (!replyInput.trim() || !activeThreadId || sending) return;
    setSending(true);
    try {
      const { data } = await createReply(activeThreadId, replyInput.trim());
      setReplies(prev => [...prev, data]);
      setReplyInput('');
    } catch (_) {}
    setSending(false);
  };

  const handleCreateThread = async () => {
    if (!newTitle.trim() || !courseId) return;
    try {
      const { data } = await createThread({ course: courseId, title: newTitle.trim(), body: '' });
      setThreads(prev => [data, ...prev]);
      setActiveThreadId(data.id);
      setNewTitle('');
      setShowNew(false);
    } catch (_) {}
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 280, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Messages</h3>
          {showNew ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateThread(); if (e.key === 'Escape') setShowNew(false); }}
                placeholder="Thread title…"
                style={{ flex: 1, padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}
              />
              <button onClick={handleCreateThread} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Post</button>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>×</button>
            </div>
          ) : (
            <button
              onClick={() => setShowNew(true)}
              style={{ width: '100%', background: 'none', border: '1px dashed #cbd5e1', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#64748b', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> New Thread
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {threads.length === 0 && (
            <p style={{ color: '#94a3b8', padding: '20px 16px', fontSize: 13 }}>No threads yet.</p>
          )}
          {threads.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveThreadId(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
                cursor: 'pointer', borderBottom: '1px solid #e2e8f0',
                borderLeft: activeThreadId === t.id ? '3px solid #3b82f6' : '3px solid transparent',
                background: activeThreadId === t.id ? '#fff' : 'transparent',
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: colorFor(t.title) + '22', color: colorFor(t.title), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                {initials(authorName(t.author))}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{authorName(t.author)} · {t.created_at?.slice(0, 10)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      {activeThread ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: colorFor(activeThread.title) + '22', color: colorFor(activeThread.title), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
              {initials(authorName(activeThread.author))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{activeThread.title}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>by {authorName(activeThread.author)}</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f8fafc' }}>
            {activeThread.body && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{authorName(activeThread.author)}</div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14, color: '#0f172a' }}>{activeThread.body}</div>
              </div>
            )}
            {replies.map(r => {
              const isMe = r.author?.id === currentUser.id || r.author?.email === currentUser.email;
              return (
                <div key={r.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  {!isMe && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{authorName(r.author)}</div>}
                  <div style={{ background: isMe ? '#3b82f6' : '#fff', border: isMe ? 'none' : '1px solid #e2e8f0', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14, color: isMe ? '#fff' : '#0f172a', boxShadow: isMe ? '0 2px 8px rgba(59,130,246,0.3)' : 'none' }}>
                    {r.body}
                  </div>
                </div>
              );
            })}
            {replies.length === 0 && !activeThread.body && (
              <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 14 }}>No messages yet. Start the conversation!</p>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#fff', display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              value={replyInput}
              onChange={e => setReplyInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Write a message…"
              style={{ flex: 1, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 24, padding: '10px 18px', fontSize: 14, outline: 'none', color: '#0f172a' }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !replyInput.trim()}
              style={{ background: '#3b82f6', color: 'white', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: (!replyInput.trim() || sending) ? 0.5 : 1 }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>💬</div>
          <p style={{ color: '#64748b', fontSize: 15 }}>Select a thread or create a new one</p>
        </div>
      )}
    </div>
  );
};

export default ClassMessage;
