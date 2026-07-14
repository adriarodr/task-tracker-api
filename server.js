require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.ORIGIN_URL,
  optionsSuccessStatus: 200,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
};
app.use(cors(corsOptions));

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/health`);
});
