import React, { useState, useEffect } from "react";
import {
  Users, Mail, MoreVertical, Search, Filter,
  MessageSquare, Trash2, Award, TrendingUp, Calendar,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { getCourseStudents } from "../../api/courses";

const ClassStudents = ({ courseId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    getCourseStudents(courseId)
      .then(res => setStudents((res.data.results || res.data || []).map(s => {
        const u = s.student || s;
        const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || '—';
        const email = u.email || '—';
        return {
          id: s.id,
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
          joinDate: (s.enrolled_at || u.date_joined || '').slice(0, 10),
          grade: '—',
          progress: Math.round(s.progress_percent || 0),
          status: s.status || 'active',
          lastActive: '—',
        };
      })))
      .catch(() => {});
  }, [courseId]);

  const removeStudent = (id) => {
    if (window.confirm("Are you sure you want to remove this student from the class?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tab-content student-roster-wrapper">
      
      {/* ── Header & KPI Cards ── */}
      <div className="roster-header">
        <div>
          <h2>Class Roster</h2>
          <p>Manage the students enrolled in this classroom</p>
        </div>
        <button className="btn-add-student">
          <Users size={16} /> Invite Students
        </button>
      </div>

      <div className="roster-kpis">
        <div className="kpi-card">
          <div className="kpi-icon bg-blue-subtle text-blue"><Users size={20} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Total Students</span>
            <span className="kpi-value">{students.length}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-green-subtle text-green"><TrendingUp size={20} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Avg. Progress</span>
            <span className="kpi-value">
              {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / (students.length || 1))}%
            </span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-purple-subtle text-purple"><Award size={20} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Top Grade</span>
            <span className="kpi-value">A+</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="roster-toolbar">
        <div className="roster-search">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="roster-filters">
          <button className="roster-filter-btn">
            <Filter size={15} /> Filter
          </button>
        </div>
      </div>

      {/* ── Student Data Table ── */}
      <div className="roster-table-container">
        <table className="roster-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Enrolled</th>
              <th>Progress</th>
              <th>Current Grade</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="roster-student-cell">
                      <img src={student.avatar} alt={student.name} className="roster-avatar" />
                      <div>
                        <p className="roster-name">{student.name}</p>
                        <p className="roster-email">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="roster-date">
                      <Calendar size={14} /> {student.joinDate}
                    </div>
                  </td>
                  <td>
                    <div className="roster-progress-wrap">
                      <div className="roster-progress-bar">
                        <div 
                          className={`roster-progress-fill ${student.progress > 80 ? 'good' : student.progress > 50 ? 'avg' : 'poor'}`} 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="roster-progress-text">{student.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`roster-grade grade-${student.grade.replace('+', 'plus')}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td>
                    {student.status === 'active' ? (
                      <span className="roster-status active">
                        <CheckCircle2 size={13} /> Active
                      </span>
                    ) : (
                      <span className="roster-status at-risk">
                        <AlertCircle size={13} /> At Risk
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="roster-actions">
                      <button className="roster-action-btn" title="Message Student">
                        <MessageSquare size={16} />
                      </button>
                      <button className="roster-action-btn danger" title="Remove Student" onClick={() => removeStudent(student.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="roster-empty">
                  <div className="roster-empty-state">
                    <Users size={40} className="text-slate-300" />
                    <h4>No students found</h4>
                    <p>Try adjusting your search criteria or invite more students.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassStudents;
