const database = require('../config/database');

class Feedback {
  static async getAll() {
    try {
      return await database.getAllFeedback();
    } catch (error) {
      console.error('Error in Feedback.getAll:', error);
      throw error;
    }
  }

  static async create(feedbackData) {
    try {
      // Validate required fields
      const { studentName, courseCode, comments, rating } = feedbackData;
      
      if (!studentName || !studentName.trim()) {
        throw new Error('Student name is required');
      }
      if (!courseCode || !courseCode.trim()) {
        throw new Error('Course code is required');
      }
      if (!comments || !comments.trim()) {
        throw new Error('Comments are required');
      }
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const feedback = {
        studentName: studentName.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        comments: comments.trim(),
        rating: parseInt(rating)
      };

      return await database.createFeedback(feedback);
    } catch (error) {
      console.error('Error in Feedback.create:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await database.deleteFeedback(id);
    } catch (error) {
      console.error('Error in Feedback.delete:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      return await database.getStats();
    } catch (error) {
      console.error('Error in Feedback.getStats:', error);
      throw error;
    }
  }

  static async getDatabaseInfo() {
    try {
      const stats = await database.getStats();
      return {
        type: 'JSON File Database',
        path: database.dbPath,
        totalEntries: stats.total,
        ...stats
      };
    } catch (error) {
      console.error('Error in Feedback.getDatabaseInfo:', error);
      throw error;
    }
  }
}

module.exports = Feedback;
