import React, { useState } from 'react';
import { feedbackAPI } from '../services/api';

const FeedbackForm = ({ onFeedbackAdded }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: 5
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!formData.comments.trim()) newErrors.comments = 'Comments are required';
    if (!formData.rating) newErrors.rating = 'Please select a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await feedbackAPI.create(formData);
      setFormData({ studentName: '', courseCode: '', comments: '', rating: 5 });
      setErrors({});
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      if (onFeedbackAdded) onFeedbackAdded();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Share Your Feedback</h2>
      <p className="form-description">
        Your input helps us improve the learning experience for everyone
      </p>

      {submitSuccess && (
        <div className="success-message">
          ✅ Thank you! Your feedback has been submitted successfully.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.studentName ? 'error' : ''}`}>
          <label>👤 Student Name *</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.studentName && <span className="error-message">{errors.studentName}</span>}
        </div>

        <div className={`form-group ${errors.courseCode ? 'error' : ''}`}>
          <label>📚 Course Code *</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="e.g., CS101, MATH202"
            disabled={isSubmitting}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.courseCode && <span className="error-message">{errors.courseCode}</span>}
        </div>

        <div className={`form-group ${errors.comments ? 'error' : ''}`}>
          <label>
            💬 Comments * 
            <span className="char-count">({formData.comments.length}/500)</span>
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Share your thoughts about the course content, teaching style, materials, etc."
            disabled={isSubmitting}
            maxLength="500"
          />
          {errors.comments && <span className="error-message">{errors.comments}</span>}
          {formData.comments.length >= 450 && (
            <div className="char-warning">
              {500 - formData.comments.length} characters remaining
            </div>
          )}
        </div>

        <div className={`form-group ${errors.rating ? 'error' : ''}`}>
          <label>⭐ Rating *</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="5">5 ★★★★★ - Excellent</option>
            <option value="4">4 ★★★★ - Very Good</option>
            <option value="3">3 ★★★ - Good</option>
            <option value="2">2 ★★ - Fair</option>
            <option value="1">1 ★ - Poor</option>
          </select>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
          <div className="rating-preview">
            Selected: {'★'.repeat(formData.rating) + '☆'.repeat(5 - formData.rating)} ({formData.rating}/5)
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            '🚀 Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;