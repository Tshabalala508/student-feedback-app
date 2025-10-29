const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Simple in-memory storage
let feedbacks = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple backend server is running!',
    timestamp: new Date().toISOString()
  });
});

// Get all feedback
app.get('/api/feedback', (req, res) => {
  res.json({ 
    message: 'Success', 
    data: feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// Submit feedback
app.post('/api/feedback', (req, res) => {
  const { studentName, courseCode, comments, rating } = req.body;
  
  if (!studentName || !courseCode || !comments || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newFeedback = {
    id: Date.now(),
    studentName: studentName.trim(),
    courseCode: courseCode.trim(),
    comments: comments.trim(),
    rating: parseInt(rating),
    createdAt: new Date().toISOString()
  };
  
  feedbacks.unshift(newFeedback);
  res.json({ message: 'Feedback submitted successfully', data: newFeedback });
});

// Delete feedback
app.delete('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = feedbacks.length;
  feedbacks = feedbacks.filter(f => f.id !== id);
  
  if (feedbacks.length === initialLength) {
    return res.status(404).json({ error: 'Feedback not found' });
  }
  
  res.json({ message: 'Feedback deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 SIMPLE BACKEND SERVER STARTED!');
  console.log('✅ Server running on http://localhost:5001');
  console.log('✅ Health check: http://localhost:5001/api/health');
  console.log('✅ Frontend can now connect!');
});
