const fs = require('fs').promises;
const path = require('path');

class JSONDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/feedback.json');
    this.init();
  }

  async init() {
    try {
      await this.ensureDataFile();
      console.log('✅ JSON Database connected successfully');
      console.log('📁 Database file:', this.dbPath);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
    }
  }

  async ensureDataFile() {
    try {
      await fs.access(this.dbPath);
    } catch {
      const dataDir = path.dirname(this.dbPath);
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
      }
      await fs.writeFile(this.dbPath, JSON.stringify([]));
      console.log('📄 Created new database file');
    }
  }

  async readData() {
    try {
      const data = await fs.readFile(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return [];
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing to database:', error);
      throw error;
    }
  }

  async getAllFeedback() {
    const data = await this.readData();
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async createFeedback(feedback) {
    const data = await this.readData();
    const newFeedback = {
      id: Date.now(),
      ...feedback,
      createdAt: new Date().toISOString()
    };
    data.unshift(newFeedback);
    await this.writeData(data);
    return newFeedback;
  }

  async deleteFeedback(id) {
    const data = await this.readData();
    const initialLength = data.length;
    const newData = data.filter(item => item.id !== id);
    
    if (newData.length === initialLength) {
      return false; // Not found
    }
    
    await this.writeData(newData);
    return true;
  }

  async getStats() {
    const data = await this.readData();
    const total = data.length;
    const averageRating = total > 0 
      ? (data.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(2)
      : 0;
    
    const courseCounts = data.reduce((acc, item) => {
      acc[item.courseCode] = (acc[item.courseCode] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      averageRating,
      courseCounts,
      totalCourses: Object.keys(courseCounts).length
    };
  }
}

// Create and export database instance
const database = new JSONDatabase();
module.exports = database;
