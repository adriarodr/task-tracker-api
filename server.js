require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

connectDB();

app.get('/api', (req, res) => {
  res.send('Welcome to Task Tracker API!');
});

// Route to comfirm that the API is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Task Tracker API is running',
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api`);
});
