import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createQuiz, getQuiz, updateQuiz } from "../../api/quizzes";
import {
  ArrowLeft, FileQuestion, Clock, Calendar, Tag, Type,
  Plus, Trash2, CheckCircle2, AlignLeft, ToggleLeft,
  Settings, Eye, Save, Send, BookOpen, Hash, Lock, Globe,
  ChevronDown, ChevronUp, GripVertical, AlertCircle, Moon, Sun, Bell
} from "lucide-react";
import "../../styles/teacher_pages/teacher_shared.css";
import "../../styles/teacher_pages/teacher_dashboard.css";
import "../../styles/teacher_classes/create_quiz.css";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

  React.useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem('platform-dark-mode') === 'true');
    };
    window.addEventListener('theme-changed', handleThemeChange);

    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('platform-dark-mode', isDarkMode);
    
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('platform-dark-mode', newVal);
    window.dispatchEvent(new Event('theme-changed'));
  };

  /* ── Form State ── */
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [allowRetake, setAllowRetake] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [description, setDescription] = useState("");

  /* ── Questions State ── */
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "mcq",
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      marks: 1,
      expanded: true,
    },
  ]);

  const addQuestion = (type = "mcq") => {
    const newQ = {
      id: Date.now(),
      type,
      text: "",
      options: type === "mcq" ? ["", "", "", ""] : [],
      correctIndex: 0,
      marks: 1,
      expanded: true,
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const toggleExpand = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, expanded: !q.expanded } : q))
    );
  };

  const updateQuestion = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const opts = [...q.options];
        opts[index] = value;
        return { ...q, options: opts };
      })
    );
  };

  const addOption = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (qId, index) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const opts = q.options.filter((_, i) => i !== index);
        return { ...q, options: opts, correctIndex: 0 };
      })
    );
  };

  const totalQMarks = questions.reduce((s, q) => s + Number(q.marks || 0), 0);

  // Load quiz data when editing
  useEffect(() => {
    if (!editId) return;
    getQuiz(editId).then(res => {
      const q = res.data;
      setTitle(q.title || "");
      setSubject(q.subject || "");
      setDuration(q.time_limit_minutes || "");
      setDueDate(q.due_date ? q.due_date.slice(0, 16) : "");
      setPassingScore(q.passing_score || "");
      setVisibility(q.visibility || "private");
      setAllowRetake(q.allow_retake || false);
      setShuffleQuestions(q.shuffle_questions || false);
      setShowResults(q.show_results !== false);
      setDescription(q.description || "");
      if (q.questions?.length) {
        setQuestions(q.questions.map((qq, i) => ({
          id: qq.id || i + 1,
          type: qq.type,
          text: qq.text,
          options: qq.options?.map(o => o.text) || (qq.type === "short" ? [qq.expected_answer] : []),
          correctIndex: qq.correct_index,
          marks: qq.marks,
          expanded: false,
        })));
      }
    }).catch(() => {});
  }, [editId]);

  const handleSave = async (publish = false) => {
    if (!classId) return;
    setSaving(true);
    setSaveError("");
    const payload = {
      title,
      subject,
      description,
      duration: duration ? Number(duration) : null,
      due_date: dueDate || null,
      passing_score: passingScore ? Number(passingScore) : 60,
      visibility,
      allow_retake: allowRetake,
      shuffle_questions: shuffleQuestions,
      show_results: showResults,
      is_published: publish,
      questions: questions.map((q, i) => ({
        type: q.type,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        marks: Number(q.marks) || 1,
        order: i,
      })),
    };
    try {
      if (editId) {
        await updateQuiz(editId, payload);
      } else {
        await createQuiz(classId, payload);
      }
      navigate(classId ? `/teacher-class/${classId}` : "/teacher-classes");
    } catch (err) {
      setSaveError(err.response?.data?.detail || "Failed to save quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div
          className="sidebar-brand cursor-pointer"
          onClick={() =>
            navigate(classId ? `/teacher-class/${classId}` : "/teacher-classes")
          }
        >
          <ArrowLeft size={20} className="back-icon" />
          <div className="brand-text">
            <h3>Back to Class</h3>
          </div>
        </div>

        {/* Quiz Info Summary */}
        <div className="cq-sidebar-info">
          <div className="cq-sidebar-icon">
            <FileQuestion size={24} color="white" />
          </div>
          <h4>{title || "New Quiz"}</h4>
          <p>{questions.length} Question{questions.length !== 1 ? "s" : ""}</p>
        </div>

        <p className="nav-section-title">Quiz Details</p>
        <div className="cq-sidebar-stats">
          <div className="cq-stat-row">
            <Clock size={16} />
            <span>{duration ? `${duration} min` : "Duration not set"}</span>
          </div>
          <div className="cq-stat-row">
            <Calendar size={16} />
            <span>{dueDate || "No due date"}</span>
          </div>
          <div className="cq-stat-row">
            <Hash size={16} />
            <span>{totalQMarks} Total Marks</span>
          </div>
          <div className="cq-stat-row">
            {visibility === "public" ? <Globe size={16} /> : <Lock size={16} />}
            <span style={{ textTransform: "capitalize" }}>{visibility}</span>
          </div>
        </div>



        <div className="sidebar-bottom"><a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}><Settings size={20} /><span>Settings</span></a><button className="nav-item" onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px', color: 'inherit' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sign Out</span></button></div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content dashboard-bg">
        {/* Header */}
        <header className="dash-header">
          <div className="header-greeting">
            <h1>Create New Quiz</h1>
            <p>Build a comprehensive assessment for your students</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20}/><span className="badge-dot red"></span></button>
            <button className="icon-btn" onClick={toggleDarkMode} title={isDarkMode ? 'Light mode' : 'Dark mode'} style={{ marginRight: '15px' }}>
               {isDarkMode ? <Sun size={20}/> : <Moon size={20} />}
            </button>
            <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')} style={{ marginRight: '15px' }}>
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              </div>
              <div className="online-indicator"></div>
            </div>
            <button className="cq-btn-outline" onClick={() => handleSave(false)} disabled={saving}>
              <Save size={16} /> {saving ? "Saving…" : "Save Draft"}
            </button>
            <button className="cq-btn-primary" onClick={() => handleSave(true)} disabled={saving}>
              <Send size={16} /> {saving ? "Saving…" : "Publish Quiz"}
            </button>
          </div>
        </header>

        {saveError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8, padding: "10px 20px", color: "#dc2626", fontSize: 13, margin: "0 0 16px 0" }}>
            {saveError}
          </div>
        )}
        <div className="cq-main-body">

          {/* ── Section 1: Quiz Information ── */}
          <section id="cq-info" className="cq-section">
            <div className="cq-section-header">
              <div className="cq-section-icon bg-blue-subtle">
                <BookOpen size={20} className="text-blue" />
              </div>
              <div>
                <h2>Quiz Information</h2>
                <p>Set the basic details and metadata for your assessment</p>
              </div>
            </div>

            <div className="cq-form-grid">
              {/* Title */}
              <div className="cq-field full-width">
                <label>
                  <Type size={15} /> Assessment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chapter 5 Midterm Algebra Test"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="cq-input"
                />
              </div>

              {/* Description */}
              <div className="cq-field full-width">
                <label>
                  <AlignLeft size={15} /> Description / Instructions
                </label>
                <textarea
                  placeholder="Provide instructions or context for the quiz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="cq-textarea"
                  rows={3}
                />
              </div>

              {/* Subject */}
              <div className="cq-field">
                <label>
                  <Tag size={15} /> Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="cq-input"
                />
              </div>

              {/* Duration */}
              <div className="cq-field">
                <label>
                  <Clock size={15} /> Duration (Minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 45"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="cq-input"
                />
              </div>

              {/* Due Date */}
              <div className="cq-field">
                <label>
                  <Calendar size={15} /> Due Date
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="cq-input"
                />
              </div>

              {/* Passing Score */}
              <div className="cq-field">
                <label>
                  <CheckCircle2 size={15} /> Passing Score (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 60"
                  min="0"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  className="cq-input"
                />
              </div>

              {/* Visibility */}
              <div className="cq-field">
                <label>
                  <Globe size={15} /> Visibility
                </label>
                <div className="cq-visibility-toggle">
                  <button
                    className={`vis-btn ${visibility === "private" ? "active" : ""}`}
                    onClick={() => setVisibility("private")}
                  >
                    <Lock size={14} /> Private
                  </button>
                  <button
                    className={`vis-btn ${visibility === "public" ? "active" : ""}`}
                    onClick={() => setVisibility("public")}
                  >
                    <Globe size={14} /> Public
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 2: Questions Builder ── */}
          <section id="cq-builder" className="cq-section">
            <div className="cq-section-header">
              <div className="cq-section-icon bg-purple-subtle">
                <FileQuestion size={20} className="text-purple" />
              </div>
              <div style={{ flex: 1 }}>
                <h2>Questions Builder</h2>
                <p>{questions.length} question{questions.length !== 1 ? "s" : ""} · {totalQMarks} marks total</p>
              </div>
              <div className="cq-add-btns">
                <button className="cq-add-q-btn" onClick={() => addQuestion("mcq")}>
                  <Plus size={15} /> Multiple Choice
                </button>
                <button className="cq-add-q-btn secondary" onClick={() => addQuestion("short")}>
                  <Plus size={15} /> Short Answer
                </button>
                <button className="cq-add-q-btn secondary" onClick={() => addQuestion("tf")}>
                  <Plus size={15} /> True / False
                </button>
              </div>
            </div>

            {questions.length === 0 && (
              <div className="cq-empty-questions">
                <AlertCircle size={36} />
                <p>No questions yet. Add your first question above.</p>
              </div>
            )}

            <div className="cq-questions-list">
              {questions.map((q, qi) => (
                <div key={q.id} className="cq-question-card">
                  {/* Question Header */}
                  <div className="cq-q-header">
                    <div className="cq-q-left">
                      <GripVertical size={18} className="drag-handle" />
                      <span className="q-num">Q{qi + 1}</span>
                      <span className={`q-type-badge ${q.type}`}>
                        {q.type === "mcq" ? "Multiple Choice" : q.type === "short" ? "Short Answer" : "True / False"}
                      </span>
                    </div>
                    <div className="cq-q-right">
                      <div className="q-marks-input">
                        <input
                          type="number"
                          min="1"
                          value={q.marks}
                          onChange={(e) => updateQuestion(q.id, "marks", e.target.value)}
                        />
                        <span>pts</span>
                      </div>
                      <button className="cq-icon-btn" onClick={() => toggleExpand(q.id)}>
                        {q.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button className="cq-icon-btn danger" onClick={() => removeQuestion(q.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Question Body */}
                  {q.expanded && (
                    <div className="cq-q-body">
                      <div className="cq-field full-width">
                        <label>Question Text</label>
                        <textarea
                          className="cq-textarea"
                          placeholder="Type your question here..."
                          rows={2}
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                        />
                      </div>

                      {/* MCQ Options */}
                      {q.type === "mcq" && (
                        <div className="cq-options">
                          <label>Answer Options</label>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="cq-option-row">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctIndex === oi}
                                onChange={() => updateQuestion(q.id, "correctIndex", oi)}
                                className="cq-radio"
                                title="Mark as correct"
                              />
                              <input
                                type="text"
                                className={`cq-input option-input ${q.correctIndex === oi ? "correct-option" : ""}`}
                                placeholder={`Option ${oi + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(q.id, oi, e.target.value)}
                              />
                              {q.options.length > 2 && (
                                <button className="cq-icon-btn danger" onClick={() => removeOption(q.id, oi)}>
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                          {q.options.length < 6 && (
                            <button className="cq-add-option-btn" onClick={() => addOption(q.id)}>
                              <Plus size={14} /> Add Option
                            </button>
                          )}
                          <p className="cq-hint">
                            <CheckCircle2 size={13} /> Select the radio button next to the correct answer
                          </p>
                        </div>
                      )}

                      {/* True / False */}
                      {q.type === "tf" && (
                        <div className="cq-options">
                          <label>Correct Answer</label>
                          <div className="tf-buttons">
                            <button
                              className={`tf-btn ${q.correctIndex === 0 ? "active-tf" : ""}`}
                              onClick={() => updateQuestion(q.id, "correctIndex", 0)}
                            >
                              ✓ True
                            </button>
                            <button
                              className={`tf-btn ${q.correctIndex === 1 ? "active-tf" : ""}`}
                              onClick={() => updateQuestion(q.id, "correctIndex", 1)}
                            >
                              ✗ False
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Short Answer */}
                      {q.type === "short" && (
                        <div className="cq-options">
                          <label>Expected Answer (for reference)</label>
                          <input
                            type="text"
                            className="cq-input"
                            placeholder="Type the expected answer..."
                            value={q.options[0] || ""}
                            onChange={(e) => updateOption(q.id, 0, e.target.value)}
                          />
                          <p className="cq-hint">
                            <AlertCircle size={13} /> Short answer will be manually reviewed
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Question Footer */}
            <div className="cq-add-bar">
              <button className="cq-add-full-btn" onClick={() => addQuestion("mcq")}>
                <Plus size={18} /> Add Another Question
              </button>
            </div>
          </section>

          {/* ── Section 3: Advanced Settings ── */}
          <section id="cq-settings" className="cq-section">
            <div className="cq-section-header">
              <div className="cq-section-icon bg-purple-subtle">
                <Settings size={20} className="text-purple" />
              </div>
              <div>
                <h2>Advanced Settings</h2>
                <p>Configure student retakes, question shuffling, and results viewing</p>
              </div>
            </div>

            <div className="cq-form-grid">
              <div className="cq-settings-card">
                <div className="cqs-info">
                  <h4>Allow Retake</h4>
                  <p>Students can retake the quiz after their first attempt.</p>
                </div>
                <div
                  className={`cq-toggle ${allowRetake ? "on" : ""}`}
                  onClick={() => setAllowRetake((v) => !v)}
                />
              </div>

              <div className="cq-settings-card">
                <div className="cqs-info">
                  <h4>Shuffle Questions</h4>
                  <p>Randomly order questions for each student to prevent cheating.</p>
                </div>
                <div
                  className={`cq-toggle ${shuffleQuestions ? "on" : ""}`}
                  onClick={() => setShuffleQuestions((v) => !v)}
                />
              </div>

              <div className="cq-settings-card">
                <div className="cqs-info">
                  <h4>Show Results Directly</h4>
                  <p>Display scores and correct answers immediately after submission.</p>
                </div>
                <div
                  className={`cq-toggle ${showResults ? "on" : ""}`}
                  onClick={() => setShowResults((v) => !v)}
                />
              </div>
            </div>
          </section>

          {/* ── Section 4: Preview Summary ── */}
          <section id="cq-summary" className="cq-section cq-summary-section">
            <div className="cq-section-header">
              <div className="cq-section-icon bg-orange-subtle">
                <Eye size={20} className="text-orange" />
              </div>
              <div>
                <h2>Quiz Summary</h2>
                <p>Review before publishing</p>
              </div>
            </div>

            <div className="cq-summary-grid">
              <div className="cq-summary-item">
                <span className="s-label">Title</span>
                <span className="s-value">{title || <em className="s-placeholder">Not set</em>}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Subject</span>
                <span className="s-value">{subject || <em className="s-placeholder">Not set</em>}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Duration</span>
                <span className="s-value">{duration ? `${duration} minutes` : <em className="s-placeholder">Not set</em>}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Due Date</span>
                <span className="s-value">{dueDate ? new Date(dueDate).toLocaleString() : <em className="s-placeholder">Not set</em>}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Questions</span>
                <span className="s-value">{questions.length}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Total Marks</span>
                <span className="s-value">{totalQMarks}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Passing Score</span>
                <span className="s-value">{passingScore ? `${passingScore}%` : <em className="s-placeholder">Not set</em>}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Visibility</span>
                <span className="s-value" style={{ textTransform: "capitalize" }}>{visibility}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Allow Retake</span>
                <span className={`s-badge ${allowRetake ? "badge-yes" : "badge-no"}`}>{allowRetake ? "Yes" : "No"}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Shuffle Questions</span>
                <span className={`s-badge ${shuffleQuestions ? "badge-yes" : "badge-no"}`}>{shuffleQuestions ? "Yes" : "No"}</span>
              </div>
              <div className="cq-summary-item">
                <span className="s-label">Show Results</span>
                <span className={`s-badge ${showResults ? "badge-yes" : "badge-no"}`}>{showResults ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="cq-publish-row">
              <button className="cq-btn-outline large" onClick={() => handleSave(false)}>
                <Save size={18} /> Save as Draft
              </button>
              <button className="cq-btn-primary large" onClick={() => handleSave(true)}>
                <Send size={18} /> Publish Quiz Now
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;


