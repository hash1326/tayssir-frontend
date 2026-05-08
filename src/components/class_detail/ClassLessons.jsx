import React, { useState, useEffect } from "react";
import { Play, Share2, Plus, Video, FileText, BookOpen, Send } from "lucide-react";
import { getCourseLessons } from "../../api/lessons";

const ClassLessons = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    getCourseLessons(courseId)
      .then(res => setLessons(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  return (
    <div className="lessons-dashboard-layout">
      <div className="lessons-feed">
        <div className="lessons-header">
          <h2>Hi, Welcome Teacher</h2>
          <p>Here are your shared lessons and resources for this class.</p>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8', padding: '20px 0' }}>Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p style={{ color: '#94a3b8', padding: '20px 0' }}>No lessons found for this class.</p>
        ) : (
          <div className="topics-list">
            {lessons.map(lesson => (
              <div key={lesson.id} className="topic-block">
                <div className="topic-badge">{lesson.title}</div>
                <div className="topic-content">
                  <button className="topic-share-btn" title="Share Topic">
                    <Share2 size={18} />
                  </button>
                  <div className="materials-row">
                    {lesson.video_url && (
                      <div className="material-card video">
                        <div className="play-overlay">
                          <div className="play-btn">
                            <Play size={24} fill="white" color="white" />
                          </div>
                        </div>
                        <div className="material-info-hover"><span>Video Lesson</span></div>
                      </div>
                    )}
                    {lesson.content && (
                      <div className="material-card doc">
                        <div className="material-info-hover"><span>Lesson Notes</span></div>
                      </div>
                    )}
                    <div className="material-card add-new-material">
                      <Plus size={28} className="add-icon" />
                      <span>Add Item</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lessons-action-panel">
        <div className="action-panel-inner">
          <h3>Create Material</h3>
          <div className="action-input-group">
            <input type="text" placeholder="Lesson Title..." className="lesson-title-input" />
          </div>
          <div className="action-buttons-list">
            <button className="action-btn">
              <span className="icon-wrap bg-blue-subtle"><Video size={16} className="text-blue"/></span>
              Add recorded video
            </button>
            <button className="action-btn">
              <span className="icon-wrap bg-purple-subtle"><FileText size={16} className="text-purple"/></span>
              Add Exercise
            </button>
            <button className="action-btn">
              <span className="icon-wrap bg-orange-subtle"><BookOpen size={16} className="text-orange"/></span>
              Add Summary
            </button>
          </div>
          <div className="notes-group">
            <label>Notes</label>
            <textarea placeholder="Write instructions or notes for your students here..." className="notes-textarea"></textarea>
          </div>
          <button className="btn-send-material">
            Send to Class <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassLessons;
