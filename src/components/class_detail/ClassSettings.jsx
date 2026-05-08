import React, { useState } from "react";
import {
  Settings, BookOpen, Tag, GraduationCap, Calendar, AlignLeft,
  Globe, Lock, DollarSign, Video, FileQuestion, Award,
  MessageSquare, CheckCircle2, BookMarked, Zap,
  Link, Copy, RefreshCw, Trash2, AlertTriangle,
  Bell, Eye, Users, Shield, Save, ToggleLeft, Info
} from "lucide-react";
import "../../styles/teacher_classes/teacher_class_detail.css";

/* ── Reusable Toggle ── */
const Toggle = ({ value, onChange }) => (
  <div
    className={`cs-toggle ${value ? "on" : ""}`}
    onClick={() => onChange(!value)}
    role="switch"
    aria-checked={value}
  />
);

/* ── Reusable Section Card ── */
const SettingsSection = ({ icon, iconBg, iconColor, title, subtitle, children }) => (
  <div className="cs-section">
    <div className="cs-section-header">
      <div className={`cs-section-icon ${iconBg}`}>
        {React.cloneElement(icon, { size: 20, className: iconColor })}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
    <div className="cs-section-body">{children}</div>
  </div>
);

const ClassSettings = ({ classData = {} }) => {
  const cls = {
    title: "Advanced Algebra 101",
    subject: "Mathematics",
    level: "High School",
    academicYear: "2025-2026",
    description: "A comprehensive course covering advanced algebraic concepts for high school students.",
    code: "ALG101-X",
    isPaid: false,
    price: "",
    ...classData,
  };

  /* ── State ── */
  const [title, setTitle] = useState(cls.title);
  const [subject, setSubject] = useState(cls.subject);
  const [level, setLevel] = useState(cls.level);
  const [academicYear, setAcademicYear] = useState(cls.academicYear);
  const [description, setDescription] = useState(cls.description);

  const [features, setFeatures] = useState({
    liveVideo: true,
    quizzes: true,
    grades: true,
    messages: true,
    exercises: false,
    library: false,
  });

  const [isPaid, setIsPaid] = useState(cls.isPaid);
  const [price, setPrice] = useState(cls.price);
  const [visibility, setVisibility] = useState("private");

  const [notifications, setNotifications] = useState({
    newStudent: true,
    submissionAlert: true,
    gradePublish: false,
    sessionReminder: true,
  });

  const [enrollmentOpen, setEnrollmentOpen] = useState(true);
  const [showStudentList, setShowStudentList] = useState(true);
  const [classCode] = useState(cls.code);

  const [saved, setSaved] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const featuresMeta = {
    liveVideo:  { label: "Live Video Sessions", icon: <Video size={18} />,        color: "text-purple" },
    quizzes:    { label: "Quizzes & Assessments", icon: <FileQuestion size={18} />, color: "text-blue" },
    grades:     { label: "Gradebook",             icon: <Award size={18} />,        color: "text-orange" },
    messages:   { label: "Message Board",          icon: <MessageSquare size={18} />, color: "text-green" },
    exercises:  { label: "Exercises",              icon: <BookMarked size={18} />,   color: "text-indigo" },
    library:    { label: "Resource Library",       icon: <BookOpen size={18} />,     color: "text-rose" },
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(classCode).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="tab-content cs-wrapper">
      {/* Page Header */}
      <div className="cs-page-header">
        <div className="cs-page-title">
          <div className="cs-page-icon">
            <Settings size={22} color="white" />
          </div>
          <div>
            <h2>Class Settings</h2>
            <p>Configure every detail of your classroom environment</p>
          </div>
        </div>
        <button className={`cs-save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="cs-grid">

        {/* ── LEFT COLUMN ── */}
        <div className="cs-col">

          {/* 1. General Information */}
          <SettingsSection
            icon={<BookOpen />}
            iconBg="bg-blue-subtle"
            iconColor="text-blue"
            title="General Information"
            subtitle="Basic details about this classroom"
          >
            <div className="cs-field full">
              <label><BookOpen size={14} /> Classroom Name</label>
              <input className="cs-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Advanced Algebra 101" />
            </div>

            <div className="cs-row">
              <div className="cs-field">
                <label><Tag size={14} /> Subject</label>
                <input className="cs-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
              </div>
              <div className="cs-field">
                <label><GraduationCap size={14} /> Level</label>
                <input className="cs-input" value={level} onChange={e => setLevel(e.target.value)} placeholder="e.g. High School" />
              </div>
            </div>

            <div className="cs-field half">
              <label><Calendar size={14} /> Academic Year</label>
              <input className="cs-input" value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="e.g. 2025–2026" />
            </div>

            <div className="cs-field full">
              <label><AlignLeft size={14} /> Description</label>
              <textarea className="cs-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What will students learn in this class?" />
            </div>
          </SettingsSection>

          {/* 2. Active Features */}
          <SettingsSection
            icon={<Zap />}
            iconBg="bg-purple-subtle"
            iconColor="text-purple"
            title="Active Features"
            subtitle="Enable or disable classroom modules"
          >
            <div className="cs-features-grid">
              {Object.entries(features).map(([key, val]) => {
                const meta = featuresMeta[key];
                return (
                  <div key={key} className={`cs-feature-card ${val ? "active" : ""}`}>
                    <div className={`cs-feature-icon ${meta.color}`}>{meta.icon}</div>
                    <span className="cs-feature-label">{meta.label}</span>
                    <Toggle value={val} onChange={v => setFeatures(f => ({ ...f, [key]: v }))} />
                  </div>
                );
              })}
            </div>
          </SettingsSection>

          {/* 3. Notifications */}
          <SettingsSection
            icon={<Bell />}
            iconBg="bg-orange-subtle"
            iconColor="text-orange"
            title="Notification Preferences"
            subtitle="Choose what alerts you receive for this class"
          >
            <div className="cs-toggle-list">
              {[
                { key: "newStudent",       label: "New student joins",         sub: "Alert when a student enrolls" },
                { key: "submissionAlert",  label: "Quiz / Assignment submitted", sub: "Alert on new submissions" },
                { key: "gradePublish",     label: "Grade published",            sub: "Alert when grades are released" },
                { key: "sessionReminder",  label: "Session reminders",          sub: "1 hour before live sessions" },
              ].map(({ key, label, sub }) => (
                <div key={key} className="cs-toggle-row">
                  <div className="cs-toggle-info">
                    <span className="cs-toggle-label">{label}</span>
                    <span className="cs-toggle-sub">{sub}</span>
                  </div>
                  <Toggle
                    value={notifications[key]}
                    onChange={v => setNotifications(n => ({ ...n, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </SettingsSection>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="cs-col">

          {/* 4. Class Code & Enrollment */}
          <SettingsSection
            icon={<Link />}
            iconBg="bg-green-subtle"
            iconColor="text-green"
            title="Enrollment & Access"
            subtitle="Manage how students join this class"
          >
            {/* Code display */}
            <div className="cs-code-box">
              <div className="cs-code-label">
                <Shield size={14} /> Class Code
              </div>
              <div className="cs-code-display">
                <span className="cs-code-text">{classCode}</span>
                <div className="cs-code-actions">
                  <button className="cs-code-btn" onClick={copyCode} title="Copy Code">
                    {codeCopied ? <CheckCircle2 size={15} className="text-green" /> : <Copy size={15} />}
                  </button>
                  <button className="cs-code-btn" title="Regenerate Code">
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>
              {codeCopied && <p className="cs-copy-hint">Copied to clipboard!</p>}
            </div>

            {/* Enrollment open */}
            <div className="cs-toggle-row">
              <div className="cs-toggle-info">
                <span className="cs-toggle-label">Open Enrollment</span>
                <span className="cs-toggle-sub">Allow new students to join via code</span>
              </div>
              <Toggle value={enrollmentOpen} onChange={setEnrollmentOpen} />
            </div>

            <div className="cs-toggle-row">
              <div className="cs-toggle-info">
                <span className="cs-toggle-label">Show Student List</span>
                <span className="cs-toggle-sub">Students can see class roster</span>
              </div>
              <Toggle value={showStudentList} onChange={setShowStudentList} />
            </div>

            {/* Visibility */}
            <div className="cs-field full" style={{ marginTop: "20px" }}>
              <label><Eye size={14} /> Class Visibility</label>
              <div className="cs-visibility-toggle">
                <button
                  className={`cs-vis-btn ${visibility === "private" ? "active" : ""}`}
                  onClick={() => setVisibility("private")}
                >
                  <Lock size={14} /> Private
                </button>
                <button
                  className={`cs-vis-btn ${visibility === "public" ? "active" : ""}`}
                  onClick={() => setVisibility("public")}
                >
                  <Globe size={14} /> Public
                </button>
              </div>
            </div>
          </SettingsSection>

          {/* 5. Pricing */}
          <SettingsSection
            icon={<DollarSign />}
            iconBg="bg-emerald-subtle"
            iconColor="text-emerald"
            title="Pricing & Access Type"
            subtitle="Set whether this class is free or paid"
          >
            <div className="cs-visibility-toggle" style={{ marginBottom: "16px" }}>
              <button
                className={`cs-vis-btn ${!isPaid ? "active" : ""}`}
                onClick={() => setIsPaid(false)}
              >
                Free
              </button>
              <button
                className={`cs-vis-btn ${isPaid ? "active" : ""}`}
                onClick={() => setIsPaid(true)}
              >
                <DollarSign size={14} /> Paid
              </button>
            </div>

            {isPaid && (
              <div className="cs-field full cs-slide-down">
                <label><DollarSign size={14} /> Price (DA)</label>
                <div className="cs-price-input">
                  <DollarSign size={16} className="cs-price-icon" />
                  <input
                    type="number"
                    className="cs-input"
                    placeholder="0.00"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
              </div>
            )}

            {!isPaid && (
              <div className="cs-info-banner">
                <Info size={15} />
                <span>Students can enroll at no cost. Switch to <strong>Paid</strong> to set a price.</span>
              </div>
            )}
          </SettingsSection>

          {/* 6. Danger Zone */}
          <div className="cs-section cs-danger-section">
            <div className="cs-section-header">
              <div className="cs-section-icon bg-red-subtle">
                <AlertTriangle size={20} className="text-red" />
              </div>
              <div>
                <h3 style={{ color: "#dc2626" }}>Danger Zone</h3>
                <p>Irreversible actions — proceed with caution</p>
              </div>
            </div>
            <div className="cs-section-body">
              <div className="cs-danger-row">
                <div>
                  <p className="cs-danger-label">Archive Class</p>
                  <p className="cs-danger-sub">No new content or enrollments. History preserved.</p>
                </div>
                <button className="cs-danger-btn outline">Archive</button>
              </div>
              <div className="cs-danger-divider" />
              <div className="cs-danger-row">
                <div>
                  <p className="cs-danger-label">Delete Class</p>
                  <p className="cs-danger-sub">Permanently delete all content, grades, and data.</p>
                </div>
                <button className="cs-danger-btn solid">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="cs-bottom-bar">
        <p className="cs-bottom-hint">
          <Info size={14} /> Changes are saved per-session. Connect to a backend to persist across reloads.
        </p>
        <button className={`cs-save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
};

export default ClassSettings;
