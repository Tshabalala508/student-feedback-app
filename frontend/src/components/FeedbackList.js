import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';

const FeedbackList = ({ refresh }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await feedbackAPI.getAll();
      setFeedback(response.data.data);
    } catch (err) {
      setError(`Failed to load feedback: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback entry?')) {
      try {
        setDeletingId(id);
        await feedbackAPI.delete(id);
        await fetchFeedback(); // Refresh the list
        alert('✅ Feedback deleted successfully!');
      } catch (err) {
        alert('❌ Error deleting feedback: ' + (err.response?.data?.error || err.message));
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#28a745'; // Green for high ratings
    if (rating >= 3) return '#ffc107'; // Yellow for medium ratings
    return '#dc3545'; // Red for low ratings
  };

  if (loading) return <div className="loading">Loading feedback...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="feedback-list">
      <h2>All Feedback Entries</h2>
      <p className="feedback-count">Total: {feedback.length} feedback entries</p>
      
      {feedback.length === 0 ? (
        <div className="no-feedback">
          <p>No feedback submitted yet.</p>
          <p className="hint">Be the first to submit feedback using the "Submit Feedback" tab!</p>
        </div>
      ) : (
        <div className="feedback-grid">
          {feedback.map(item => (
            <div key={item.id} className="feedback-card">
              <div className="feedback-header">
                <div className="course-info">
                  <h3>{item.courseCode}</h3>
                  <span 
                    className="rating-badge"
                    style={{ backgroundColor: getRatingColor(item.rating) }}
                  >
                    {item.rating}/5
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className={`delete-btn ${deletingId === item.id ? 'deleting' : ''}`}
                  title="Delete this feedback"
                >
                  {deletingId === item.id ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </div>

              <div className="rating-stars">
                {getRatingStars(item.rating)}
                <span className="rating-text">({item.rating} out of 5)</span>
              </div>

              <div className="comments-section">
                <p className="comments-label">Comments:</p>
                <p className="comments">"{item.comments}"</p>
              </div>

              <div className="feedback-footer">
                <span className="student-info">
                  <strong>By:</strong> {item.studentName}
                </span>
                <span className="date-info">
                  <strong>Submitted:</strong> {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;