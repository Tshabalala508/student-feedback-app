const express = require('express');
const cors = require('cors');
const path = require('path');

const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);

// Database health check
app.get('/api/health', async (req, res) => {
  try {
    const Feedback = require('./models/Feedback');
    const stats = await Feedback.getStats();
    
    res.json({
      status: 'OK',
      message: 'Backend server with database is running!',
      timestamp: new Date().toISOString(),
      database: {
        type: 'JSON File',
        status: 'Connected',
        totalFeedback: stats.total,
        averageRating: stats.averageRating
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Serve static files from data directory (for debugging)
app.use('/api/data', express.static(path.join(__dirname, 'data')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('🚀 BACKEND SERVER WITH DATABASE RUNNING!');
  console.log('✅ Port: http://localhost:' + PORT);
  console.log('✅ Health: http://localhost:' + PORT + '/api/health');
  console.log('✅ Database: JSON file storage');
  console.log('✅ Ready for data operations!');
});
