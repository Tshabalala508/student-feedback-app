const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5002;
app.use(cors());
app.use(express.json());
let feedbacks = [];
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.get('/api/feedback', (req, res) => res.json({ message: 'Success', data: feedbacks }));
app.post('/api/feedback', (req, res) => {
  const feedback = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  feedbacks.unshift(feedback);
  res.json({ message: 'Success', data: feedback });
});
app.delete('/api/feedback/:id', (req, res) => {
  feedbacks = feedbacks.filter(f => f.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});
app.listen(PORT, () => console.log('🚀 Server on port ' + PORT));
