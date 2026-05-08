import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus, FileQuestion, Clock, BarChart3, MoreVertical,
  Search, CheckCircle2, AlertCircle, Edit2, Loader
} from "lucide-react";
import { getCourseQuizzes, deleteQuiz } from "../../api/quizzes";
import "../../styles/teacher_classes/teacher_class_detail.css";

const fmtDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const ClassQuiz = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState("active");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    getCourseQuizzes(classId)
      .then(res => setAssignments(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  const now = new Date();

  const filtered = assignments.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    const isPast = a.due_date && new Date(a.due_date) < now;
    const isDraft = !a.is_published;
    if (activeTab === "active") return !isPast && !isDraft;
    if (activeTab === "past")   return isPast && !isDraft;
    if (activeTab === "drafts") return isDraft;
    return true;
  });

  const totalAssignments = assignments.length;
  const totalSubmissions = assignments.reduce((n, a) => n + (a.submission_count || 0), 0);
  const avgCompletion = totalAssignments > 0
    ? Math.round((totalSubmissions / totalAssignments) * 10) / 10
    : null;

  return (
    <div className="tab-content quiz-tab">
      <div className="tab-header flex-between mb-4">
        <div>
          <h2>Quizzes &amp; Assessments</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage tests, assignments, and evaluate student performance
          </p>
        </div>
        <button
          className="btn-primary-sm"
          style={{ padding: "10px 20px" }}
          onClick={() => navigate(classId ? `/create-quiz/${classId}` : "/create-quiz")}
        >
          <Plus size={18} /> Create New Quiz
        </button>
      </div>

      <div className="quiz-stats-grid">
        <div className="quiz-stat-card">
          <div className="qs-icon bg-blue-light text-blue">
            <FileQuestion size={24} />
          </div>
          <div className="qs-info">
            <span className="qs-label">Total Quizzes</span>
            <span className="qs-value">{totalAssignments}</span>
          </div>
        </div>
        <div className="quiz-stat-card">
          <div className="qs-icon bg-green-light text-green">
            <CheckCircle2 size={24} />
          </div>
          <div className="qs-info">
            <span className="qs-label">Total Submissions</span>
            <span className="qs-value">{totalSubmissions}</span>
          </div>
        </div>
        <div className="quiz-stat-card">
          <div className="qs-icon bg-orange-light text-orange">
            <BarChart3 size={24} />
          </div>
          <div className="qs-info">
            <span className="qs-label">Avg. Submissions</span>
            <span className="qs-value">{avgCompletion != null ? avgCompletion : '—'}</span>
          </div>
        </div>
      </div>

      <div className="quiz-controls mt-6 mb-4">
        <div className="quiz-tabs">
          <button className={`qt-btn ${activeTab === "active" ? "active" : ""}`} onClick={() => setActiveTab("active")}>
            Active &amp; Upcoming
          </button>
          <button className={`qt-btn ${activeTab === "past" ? "active" : ""}`} onClick={() => setActiveTab("past")}>
            Past Quizzes
          </button>
          <button className={`qt-btn ${activeTab === "drafts" ? "active" : ""}`} onClick={() => setActiveTab("drafts")}>
            Drafts
          </button>
        </div>
        <div className="search-box quiz-search">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", padding: "40px 0" }}>
          <Loader size={18} className="spin" /> Loading quizzes…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
          <FileQuestion size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontWeight: 600, color: "#475569" }}>No quizzes yet</p>
          <p style={{ fontSize: 13 }}>
            {activeTab === "active" ? 'Click "Create New Quiz" to add your first quiz.' : `No ${activeTab} quizzes.`}
          </p>
        </div>
      ) : (
        <div className="quiz-list">
          {filtered.map(a => {
            const isPast = a.due_date && new Date(a.due_date) < now;
            return (
              <div key={a.id} className="quiz-card">
                <div className="qc-left">
                  <div className="qc-icon-wrap" style={a.status === "draft" ? { background: "#f1f5f9", color: "#64748b" } : {}}>
                    <FileQuestion size={24} className={a.status !== "draft" ? "text-blue" : ""} />
                  </div>
                  <div className="qc-details">
                    <h4>{a.title}</h4>
                    <div className="qc-meta" style={a.status === "draft" ? { color: "#94a3b8" } : {}}>
                      {a.time_limit_minutes && <span><Clock size={14} /> {a.time_limit_minutes} Mins</span>}
                      {a.due_date && (
                        <span>
                          <AlertCircle size={14} />
                          {isPast ? `Due: ${fmtDate(a.due_date)}` : `Due: ${fmtDate(a.due_date)}`}
                        </span>
                      )}
                      {a.question_count != null && <span><CheckCircle2 size={14} /> {a.question_count} Questions</span>}
                    </div>
                  </div>
                </div>
                <div className="qc-right">
                  <span className={`qc-status ${!a.is_published ? "draft-status" : isPast ? "past-status" : "active-status"}`}>
                    {!a.is_published ? "Draft" : isPast ? "Past" : "Active"}
                  </span>
                  <div className="qc-actions">
                    <button
                      className="btn-outline-sm"
                      onClick={() => navigate(`/create-quiz/${classId}?edit=${a.id}`)}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    {a.submission_count != null && (
                      <button className="btn-outline-sm">
                        Submissions ({a.submission_count})
                      </button>
                    )}
                    <button className="icon-btn"><MoreVertical size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassQuiz;
