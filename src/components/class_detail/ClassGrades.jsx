import React, { useState, useEffect } from "react";
import {
  Search, Download, Send, TrendingUp, Users,
  Award, MoreVertical, CheckCircle2, AlertCircle
} from "lucide-react";
import { getCourseAssignments } from "../../api/assignments";
import { getCourseStudents } from "../../api/courses";

const ClassGrades = ({ courseId }) => {
  const [grades, setGrades] = useState([]);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (!courseId) return;
    getCourseAssignments(courseId)
      .then(res => {
        const assignments = res.data.results || res.data || [];
        const rows = assignments.flatMap(a =>
          (a.submissions || []).map(s => ({
            id: s.id,
            name: `${s.student_first_name || ''} ${s.student_last_name || ''}`.trim() || s.student_email || 'Student',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.student_email || 'S')}&background=2563eb&color=fff`,
            quiz: s.score ?? 0,
            midterm: s.score ?? 0,
            average: s.score >= 90 ? 'A' : s.score >= 80 ? 'B' : s.score >= 70 ? 'C' : s.score != null ? 'D' : '—',
            status: s.status || 'pending',
          }))
        );
        setGrades(rows);
      })
      .catch(() => {});

    getCourseStudents(courseId)
      .then(res => {
        const students = res.data.results || res.data || [];
        setStudentCount(students.length);
      })
      .catch(() => {});
  }, [courseId]);

  const handleGradeChange = (id, field, value) => {
    setGrades(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const gradedRows = grades.filter(g => typeof g.quiz === 'number');
  const classAvg = gradedRows.length > 0
    ? (gradedRows.reduce((sum, g) => sum + g.quiz, 0) / gradedRows.length).toFixed(1)
    : null;

  const topPerformer = gradedRows.length > 0
    ? gradedRows.reduce((best, g) => g.quiz > best.quiz ? g : best, gradedRows[0])
    : null;

  return (
    <div className="tab-content grades-dashboard">
      <div className="grades-stats-grid">
        <div className="stat-card-mini">
          <div className="stat-icon-wrap bg-blue-100 text-blue-600">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <h4 className="stat-value">{studentCount} Student{studentCount !== 1 ? 's' : ''}</h4>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-wrap bg-green-100 text-green-600">
            <TrendingUp size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Class Average</span>
            <h4 className="stat-value">{classAvg != null ? `${classAvg}%` : '—'}</h4>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-wrap bg-purple-100 text-purple-600">
            <Award size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Top Performer</span>
            <h4 className="stat-value">{topPerformer ? topPerformer.name : '—'}</h4>
          </div>
        </div>
      </div>

      <div className="grades-main-card">
        <div className="card-header-actions">
          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search student..." className="grade-search-input" />
          </div>
          <div className="flex gap-3">
            <button className="btn-grade-secondary"><Download size={18} /> Export CSV</button>
            <button className="btn-grade-primary"><Send size={18} /> Send All Marks</button>
          </div>
        </div>

        <div className="grades-table-container">
          {grades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <Award size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p>No graded submissions yet.</p>
            </div>
          ) : (
            <table className="premium-grading-table">
              <thead>
                <tr>
                  <th className="w-10"><input type="checkbox" className="custom-checkbox" /></th>
                  <th>Student Name</th>
                  <th>Quiz 1 (max 20)</th>
                  <th>Midterm (max 100)</th>
                  <th>Overall</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(student => (
                  <tr key={student.id}>
                    <td><input type="checkbox" className="custom-checkbox" /></td>
                    <td>
                      <div className="student-cell">
                        <img src={student.avatar} alt={student.name} className="grade-avatar" />
                        <div className="student-name-wrap">
                          <span className="student-name-txt">{student.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="grade-input"
                        value={student.quiz}
                        onChange={(e) => handleGradeChange(student.id, 'quiz', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="grade-input"
                        value={student.midterm}
                        onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                      />
                    </td>
                    <td>
                      <span className={`grade-badge ${student.average === 'A' ? 'grade-a' : student.average === 'B' ? 'grade-b' : 'grade-c'}`}>
                        {student.average}
                      </span>
                    </td>
                    <td>
                      <div className="status-cell">
                        {student.status === 'sent' && <span className="status-sent"><CheckCircle2 size={14} /> Sent</span>}
                        {student.status === 'pending' && <span className="status-pending"><AlertCircle size={14} /> Pending</span>}
                        {student.status === 'draft' && <span className="status-draft">Draft</span>}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="btn-send-single" title="Send to Student"><Send size={14} /></button>
                        <button className="btn-more-grade"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassGrades;
