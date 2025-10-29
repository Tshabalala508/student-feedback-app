import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  create: (feedback) => api.post('/feedback', feedback),
  delete: (id) => api.delete('/feedback/' + id),
  health: () => api.get('/health'),
};

export default api;
