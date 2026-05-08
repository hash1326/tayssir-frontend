import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Video, Mic, MicOff, VideoOff, MonitorUp,
  MessageSquare, Users, PhoneOff, Maximize, Minimize,
  Plus, Calendar, Clock, Play, X, Loader
} from "lucide-react";
import { Room, RoomEvent, ParticipantEvent, Track } from "livekit-client";
import {
  getCourseLiveSessions,
  createLiveSession,
  joinLiveSession,
  endLiveSession,
  leaveLiveSession,
} from "../../api/live";

/* ── helpers ─────────────────────────────────────────────── */
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const STATUS_BADGE = {
  scheduled: { label: "Scheduled", bg: "#eff6ff", color: "#2563eb" },
  live:      { label: "🔴 Live",    bg: "#fef2f2", color: "#dc2626" },
  ended:     { label: "Ended",     bg: "#f1f5f9", color: "#64748b" },
  cancelled: { label: "Cancelled", bg: "#fef2f2", color: "#9ca3af" },
};

/* ── Local video tile ─────────────────────────────────────── */
const LocalVideo = ({ track, label, muted }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !track) return;
    track.attach(ref.current);
    return () => { try { track.detach(ref.current); } catch (_) {} };
  }, [track]);
  return (
    <div style={{ position: "relative", background: "#0f172a", borderRadius: 8, overflow: "hidden" }}>
      <video ref={ref} autoPlay muted={muted} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {label && (
        <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: 4 }}>
          {label}
        </span>
      )}
    </div>
  );
};

/* ── Remote video tile ────────────────────────────────────── */
const RemoteVideo = ({ participant }) => {
  const videoRef = useRef(null);
  const [videoTrack, setVideoTrack] = useState(null);

  useEffect(() => {
    const update = () => {
      const pub = participant.getTrackPublication(Track.Source.Camera);
      setVideoTrack(pub?.isSubscribed ? pub.track : null);
    };
    update();
    participant.on(ParticipantEvent.TrackSubscribed, update);
    participant.on(ParticipantEvent.TrackUnsubscribed, update);
    return () => {
      participant.off(ParticipantEvent.TrackSubscribed, update);
      participant.off(ParticipantEvent.TrackUnsubscribed, update);
    };
  }, [participant]);

  useEffect(() => {
    if (!videoRef.current || !videoTrack) return;
    videoTrack.attach(videoRef.current);
    return () => { try { videoTrack.detach(videoRef.current); } catch (_) {} };
  }, [videoTrack]);

  const initials = (participant.identity || "?")[0].toUpperCase();

  return (
    <div style={{ position: "relative", background: "#1e293b", borderRadius: 8, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {videoTrack
        ? <video ref={videoRef} autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#94a3b8" }}>{initials}</div>
      }
      <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.55)", padding: "2px 8px", borderRadius: 4 }}>
        {participant.identity}
      </span>
    </div>
  );
};

/* ── Main component ───────────────────────────────────────── */
const ClassLive = ({ courseId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newSession, setNewSession] = useState({ title: "", scheduled_at: "", duration_minutes: 60, description: "" });

  // Active call state
  const [room, setRoom] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [joining, setJoining] = useState(null);
  const [joinError, setJoinError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const localVideoRef = useRef(null);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);

  const openChatWs = (courseId) => {
    const token = localStorage.getItem('access_token');
    const wsBase = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws';
    const ws = new WebSocket(`${wsBase}/chat/${courseId}/?token=${token}`);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setChatMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        username: data.username,
        message: data.message,
        isMe: data.user_id === String(currentUser.id),
      }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };
    wsRef.current = ws;
  };

  const sendChatMessage = () => {
    if (!chatInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: chatInput.trim() }));
    setChatInput('');
  };

  /* fetch sessions */
  const fetchSessions = useCallback(() => {
    if (!courseId) return;
    setLoading(true);
    getCourseLiveSessions(courseId)
      .then(res => setSessions(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  /* elapsed timer during call */
  useEffect(() => {
    if (!room) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [room]);

  const fmtElapsed = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  /* Create session */
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    if (!newSession.title.trim() || !newSession.scheduled_at) {
      setCreateError("Title and date are required.");
      return;
    }
    setCreating(true);
    try {
      await createLiveSession(courseId, {
        title: newSession.title,
        scheduled_at: new Date(newSession.scheduled_at).toISOString(),
        duration_minutes: Number(newSession.duration_minutes) || 60,
        description: newSession.description,
      });
      setShowCreate(false);
      setNewSession({ title: "", scheduled_at: "", duration_minutes: 60, description: "" });
      fetchSessions();
    } catch (err) {
      setCreateError(err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join(" ") || "Failed to create session.");
    } finally {
      setCreating(false);
    }
  };

  /* Join / start */
  const handleJoin = async (session) => {
    setJoining(session.id);
    setJoinError("");
    try {
      const { data } = await joinLiveSession(session.id);
      const { server_url, token } = data;

      const lkRoom = new Room({ adaptiveStream: true, dynacast: true });

      lkRoom.on(RoomEvent.ParticipantConnected, () =>
        setRemoteParticipants([...lkRoom.remoteParticipants.values()])
      );
      lkRoom.on(RoomEvent.ParticipantDisconnected, () =>
        setRemoteParticipants([...lkRoom.remoteParticipants.values()])
      );
      lkRoom.on(RoomEvent.TrackSubscribed, () =>
        setRemoteParticipants([...lkRoom.remoteParticipants.values()])
      );
      lkRoom.on(RoomEvent.TrackUnsubscribed, () =>
        setRemoteParticipants([...lkRoom.remoteParticipants.values()])
      );
      lkRoom.on(RoomEvent.Disconnected, () => {
        setRoom(null);
        setActiveSession(null);
        setRemoteParticipants([]);
        setLocalVideoTrack(null);
        fetchSessions();
      });

      await lkRoom.connect(server_url, token);
      await lkRoom.localParticipant.enableCameraAndMicrophone();

      const camPub = lkRoom.localParticipant.getTrackPublication(Track.Source.Camera);
      setLocalVideoTrack(camPub?.track ?? null);

      setRoom(lkRoom);
      setActiveSession(session);
      setRemoteParticipants([...lkRoom.remoteParticipants.values()]);
      setChatMessages([]);
      openChatWs(courseId);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Failed to join. Is LiveKit running?";
      setJoinError(msg);
    } finally {
      setJoining(null);
    }
  };

  /* Mic / Cam toggles */
  const toggleMic = async () => {
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn(v => !v);
  };

  const toggleCam = async () => {
    if (!room) return;
    await room.localParticipant.setCameraEnabled(!camOn);
    const camPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
    setLocalVideoTrack(camPub?.track ?? null);
    setCamOn(v => !v);
  };

  const closeChat = () => {
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    setChatMessages([]);
  };

  /* End call */
  const handleEndCall = async () => {
    if (room) room.disconnect();
    if (activeSession) { try { await endLiveSession(activeSession.id); } catch (_) {} }
    closeChat();
    setRoom(null); setActiveSession(null); setRemoteParticipants([]); setLocalVideoTrack(null);
    fetchSessions();
  };

  /* Leave (not end) */
  const handleLeaveCall = async () => {
    if (room) room.disconnect();
    if (activeSession) { try { await leaveLiveSession(activeSession.id); } catch (_) {} }
    closeChat();
    setRoom(null); setActiveSession(null); setRemoteParticipants([]); setLocalVideoTrack(null);
    fetchSessions();
  };

  /* ── ACTIVE CALL VIEW ─────────────────────────────────── */
  if (room && activeSession) {
    return (
      <div className={`active-meeting-container${isFullscreen ? " fullscreen-mode" : ""}`}>
        <div className="meeting-header">
          <div className="meet-info">
            <span className="live-dot-indicator" />
            <h2>{activeSession.title}</h2>
            <span className="meet-time">{fmtElapsed(elapsed)}</span>
          </div>
          <button className="btn-header-action" onClick={() => setIsFullscreen(v => !v)}>
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>

        <div className="meeting-body">
          {/* Main / local video */}
          <div className="main-video-view">
            {camOn && localVideoTrack
              ? <LocalVideo track={localVideoTrack} label="You (Teacher)" muted />
              : (
                <div className="webcam-off-state">
                  <div className="avatar-circle lrg">T</div>
                  <span style={{ color: "#94a3b8", marginTop: 8, fontSize: 13 }}>Camera off</span>
                </div>
              )
            }
          </div>

          {/* Remote participants grid */}
          {remoteParticipants.length > 0 && (
            <div className="students-grid">
              {remoteParticipants.slice(0, 3).map(p => (
                <RemoteVideo key={p.sid} participant={p} />
              ))}
              {remoteParticipants.length > 3 && (
                <div className="student-cam overlay">+{remoteParticipants.length - 3}</div>
              )}
            </div>
          )}

          {/* Real chat */}
          {isChatOpen && (
            <div className="meeting-chat-panel">
              <div className="chat-header"><h3>In-Call Chat</h3></div>
              <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {chatMessages.length === 0
                  ? <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 20 }}>No messages yet</p>
                  : chatMessages.map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.isMe ? 'flex-end' : 'flex-start' }}>
                      {!m.isMe && <span style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{m.username}</span>}
                      <div style={{ background: m.isMe ? '#3b82f6' : '#1e293b', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 13, maxWidth: '85%' }}>{m.message}</div>
                    </div>
                  ))
                }
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid #334155', display: 'flex', gap: 8 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
                  placeholder="Type a message…"
                  style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
                />
                <button onClick={sendChatMessage} style={{ background: '#3b82f6', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>→</button>
              </div>
            </div>
          )}
        </div>

        <div className="meeting-controls-bar">
          <div className="ctrl-group left">
            <div className="ctrl-item" onClick={toggleMic}>
              <button className={`meet-btn${!micOn ? " danger" : ""}`}>
                {micOn ? <Mic size={22} /> : <MicOff size={22} />}
              </button>
              <span>{micOn ? "Mute" : "Unmute"}</span>
            </div>
            <div className="ctrl-item" onClick={toggleCam}>
              <button className={`meet-btn${!camOn ? " danger" : ""}`}>
                {camOn ? <Video size={22} /> : <VideoOff size={22} />}
              </button>
              <span>{camOn ? "Stop Video" : "Start Video"}</span>
            </div>
          </div>

          <div className="ctrl-group center">
            <div className="ctrl-item">
              <button className="meet-btn"><Users size={22} /></button>
              <span>Participants ({remoteParticipants.length + 1})</span>
            </div>
            <div className="ctrl-item" onClick={() => setIsChatOpen(v => !v)}>
              <button className={`meet-btn${isChatOpen ? " active" : ""}`}><MessageSquare size={22} /></button>
              <span>Chat</span>
            </div>
          </div>

          <div className="ctrl-group right">
            <button className="end-call-btn" onClick={handleEndCall}>
              <PhoneOff size={18} /> End Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── SESSION LIST VIEW ────────────────────────────────── */
  return (
    <div className="tab-content live-tab-wrapper">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text-main,#0f172a)" }}>Live Sessions</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-light,#64748b)" }}>Schedule and start live classes for your students.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >
          <Plus size={16} /> Schedule Session
        </button>
      </div>

      {joinError && (
        <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8, padding: "10px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
          {joinError}
        </div>
      )}

      {/* Sessions */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", padding: "40px 0" }}>
          <Loader size={18} className="spin" /> Loading sessions…
        </div>
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
          <Calendar size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontWeight: 600, color: "#475569" }}>No sessions yet</p>
          <p style={{ fontSize: 13 }}>Click "Schedule Session" to create your first live class.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sessions.map(s => {
            const badge = STATUS_BADGE[s.status] || STATUS_BADGE.scheduled;
            const isJoining = joining === s.id;
            const canJoin = s.status !== "ended" && s.status !== "cancelled";
            return (
              <div key={s.id} style={{ background: "var(--bg-card,#fff)", border: "1px solid var(--border-color,#e2e8f0)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-main,#0f172a)" }}>{s.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: badge.bg, color: badge.color }}>{badge.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-light,#64748b)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> {fmtDate(s.scheduled_at)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {s.duration_minutes} min</span>
                  </div>
                  {s.description && <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>{s.description}</p>}
                </div>
                {canJoin && (
                  <button
                    onClick={() => handleJoin(s)}
                    disabled={isJoining}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: s.status === "live" ? "#ef4444" : "#3b82f6",
                      color: "#fff", border: "none", borderRadius: 10,
                      padding: "9px 20px", fontWeight: 700, fontSize: 14,
                      cursor: isJoining ? "not-allowed" : "pointer", opacity: isJoining ? 0.7 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isJoining ? <Loader size={15} className="spin" /> : <Play size={15} fill="#fff" />}
                    {s.status === "live" ? "Join Live" : "Start Session"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create session modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, width: 440, maxWidth: "90vw", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Schedule Live Session</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>

            {createError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Session Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 3 — Introduction"
                  value={newSession.title}
                  onChange={e => setNewSession(p => ({ ...p, title: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newSession.scheduled_at}
                  onChange={e => setNewSession(p => ({ ...p, scheduled_at: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="300"
                  value={newSession.duration_minutes}
                  onChange={e => setNewSession(p => ({ ...p, duration_minutes: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="What will you cover in this session?"
                  value={newSession.description}
                  onChange={e => setNewSession(p => ({ ...p, description: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding: "10px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ padding: "10px 24px", border: "none", borderRadius: 8, background: "#3b82f6", color: "#fff", fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.7 : 1 }}>
                  {creating ? "Scheduling…" : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassLive;
