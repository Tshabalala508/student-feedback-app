import React, { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import { feedbackAPI } from './services/api';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [connectionError, setConnectionError] = useState('');

  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      const response = await feedbackAPI.health();
      console.log('Backend connection successful:', response.data);
      setBackendStatus('connected');
      setConnectionError('');
    } catch (error) {
      console.error('Backend connection failed:', error.message);
      setBackendStatus('disconnected');
      setConnectionError(error.message);
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const handleFeedbackAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusClass = () => {
    switch (backendStatus) {
      case 'connected': return 'status-connected';
      case 'disconnected': return 'status-disconnected';
      case 'checking': return 'status-checking';
      default: return '';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Feedback Portal</h1>
        
        <div className={`connection-status ${getStatusClass()}`}>
          <strong>Backend Status:</strong> {backendStatus.toUpperCase()}
          {backendStatus === 'disconnected' && (
            <button 
              onClick={checkBackendConnection}
              style={{
                marginLeft: '1rem',
                padding: '0.4rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              Retry Connection
            </button>
          )}
        </div>

        <nav>
          <button 
            className={activeTab === 'form' ? 'active' : ''}
            onClick={() => setActiveTab('form')}
          >
            Submit Feedback
          </button>
          <button 
            className={activeTab === 'view' ? 'active' : ''}
            onClick={() => setActiveTab('view')}
          >
            View Feedback
          </button>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main className="App-main">
        {backendStatus === 'disconnected' && (
          <div className="error">
            <h3>Connection Issue Detected</h3>
            <p><strong>Problem:</strong> {connectionError || 'Cannot reach backend server'}</p>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <p><strong>Quick Fix:</strong></p>
              <ol>
                <li>Ensure backend is running on port 5001</li>
                <li>Check firewall settings</li>
                <li>Refresh the page after backend starts</li>
              </ol>
            </div>
          </div>
        )}
        
        {activeTab === 'form' && (
          <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
        )}
        {activeTab === 'view' && (
          <FeedbackList refresh={refreshKey} />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Student Feedback System</h3>
            <p>A sophisticated platform for students to share constructive feedback about their learning experiences and help improve educational quality.</p>
            <div className="social-links">
              <a href="#" className="social-link">Education</a>
              <a href="#" className="social-link">University</a>
              <a href="#" className="social-link">Learning</a>
              <a href="#" className="social-link">Support</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Access</h3>
            <ul className="footer-links">
              <li><a href="#feedback">Submit Feedback</a></li>
              <li><a href="#reviews">View Feedback</a></li>
              <li><a href="#dashboard">Analytics</a></li>
              <li><a href="#courses">Course Catalog</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Support</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Academic</h3>
            <ul className="footer-links">
              <li><a href="#faculty">Faculty Portal</a></li>
              <li><a href="#research">Research</a></li>
              <li><a href="#library">Digital Library</a></li>
              <li><a href="#calendar">Academic Calendar</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Student Feedback System. Crafted with care for academic excellence.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;