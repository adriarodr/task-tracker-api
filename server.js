const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

connectDB();

// Confirm that the API is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Task Tracker API is running',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Tasks routes
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/health`);
});
