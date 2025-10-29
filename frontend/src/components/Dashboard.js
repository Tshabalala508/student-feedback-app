import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    courseCounts: {},
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await feedbackAPI.getAll();
        const feedback = response.data.data;
        
        const totalFeedback = feedback.length;
        const averageRating = totalFeedback > 0 
          ? (feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback).toFixed(1)
          : 0;
        
        const courseCounts = feedback.reduce((acc, item) => {
          acc[item.courseCode] = (acc[item.courseCode] || 0) + 1;
          return acc;
        }, {});

        // Get top 3 courses by feedback count
        const sortedCourses = Object.entries(courseCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([course, count]) => ({ course, count }));

        setStats({
          totalFeedback,
          averageRating,
          courseCounts,
          totalCourses: Object.keys(courseCounts).length
        });
        setTopCourses(sortedCourses);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getRatingSummary = () => {
    const rating = parseFloat(stats.averageRating);
    if (rating >= 4) return { text: 'Excellent! 🎉', color: '#28a745', emoji: '⭐' };
    if (rating >= 3) return { text: 'Good! 👍', color: '#ffc107', emoji: '🙂' };
    if (rating >= 2) return { text: 'Average', color: '#fd7e14', emoji: '😐' };
    return { text: 'Needs Improvement', color: '#dc3545', emoji: '📈' };
  };

  const ratingSummary = getRatingSummary();

  if (loading) return <div className="loading">Loading dashboard insights...</div>;

  return (
    <div className="dashboard">
      <h2>📊 Feedback Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <h3>Total Feedback</h3>
          <p className="stat-number">{stats.totalFeedback}</p>
          <p className="stat-description">Submissions received</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3>Average Rating</h3>
          <p className="stat-number" style={{ color: ratingSummary.color }}>
            {stats.averageRating}/5
          </p>
          <p className="stat-description" style={{ color: ratingSummary.color }}>
            {ratingSummary.emoji} {ratingSummary.text}
          </p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <h3>Courses Reviewed</h3>
          <p className="stat-number">{stats.totalCourses}</p>
          <p className="stat-description">Unique courses</p>
        </div>
      </div>

      {stats.totalFeedback > 0 && (
        <div className="insights-grid">
          {topCourses.length > 0 && (
            <div className="insight-card">
              <h3>🏆 Most Reviewed Courses</h3>
              <div className="course-ranking">
                {topCourses.map((item, index) => (
                  <div key={item.course} className="rank-item">
                    <span className="rank-number">{index + 1}</span>
                    <span className="course-name">{item.course}</span>
                    <span className="feedback-count">{item.count} reviews</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="insight-card">
            <h3>📈 Rating Distribution</h3>
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.totalFeedback > 0 ? 
                  (stats.courseCounts[rating] || 0) : 0;
                const percentage = stats.totalFeedback > 0 ? 
                  (count / stats.totalFeedback * 100).toFixed(0) : 0;
                
                return (
                  <div key={rating} className="rating-row">
                    <span className="rating-stars-small">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                    <div className="rating-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: rating >= 4 ? '#28a745' : rating >= 3 ? '#ffc107' : '#dc3545'
                        }}
                      ></div>
                    </div>
                    <span className="rating-count">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {stats.totalFeedback === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Feedback Yet</h3>
          <p>Start collecting valuable insights by submitting the first feedback!</p>
          <div className="empty-actions">
            <span className="tip">💡 Tip: Share the feedback link with students to get started</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;