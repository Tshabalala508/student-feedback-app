const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.getAll();
    res.json({
      message: 'Feedback retrieved successfully',
      data: feedback,
      count: feedback.length
    });
  } catch (err) {
    console.error('Error getting feedback:', err);
    res.status(500).json({ 
      error: 'Failed to fetch feedback',
      message: err.message 
    });
  }
});

// POST new feedback
router.post('/', async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({
      message: 'Feedback submitted successfully!',
      data: feedback
    });
  } catch (err) {
    console.error('Error creating feedback:', err);
    res.status(400).json({ 
      error: 'Failed to submit feedback',
      message: err.message 
    });
  }
});

// DELETE feedback
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await Feedback.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ 
      message: 'Feedback deleted successfully',
      deletedId: id
    });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ 
      error: 'Failed to delete feedback',
      message: err.message 
    });
  }
});

// GET feedback statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Feedback.getStats();
    res.json({
      message: 'Statistics retrieved successfully',
      data: stats
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: err.message 
    });
  }
});

module.exports = router;
